const express = require('express');
const router = express.Router();
const ipfs = require('../ipfs');
const db = require('../db');

// Lecturer uploads exam results (CSV or JSON)
router.post('/upload', async (req, res) => {
    const { studentId, courseCode, examScore, caScore, lecturerWalletAddress, remarks, batchId } = req.body;

    if (!studentId || !courseCode || !examScore || !caScore || !lecturerWalletAddress || !remarks || !batchId ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Upload exam result data to IPFS
        const fileContent = JSON.stringify({ studentId, examScore, caScore, batchId });
        const ipfsHash = await ipfs.uploadToIPFS(fileContent);
        console.log('Uploaded to IPFS:', ipfsHash);

        // Save to database
        const studentResult = await db.query('SELECT id FROM students WHERE student_id = $1', [studentId]);
        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: `No student found with ID ${studentId}` });
        }
        const studentDbId = studentResult.rows[0].id;

        const examResult = await db.query('SELECT id FROM exams WHERE batch_id = $1', [batchId]);
        if (examResult.rows.length === 0) {
            return res.status(404).json({ error: `No exam found with batch ID ${batchId}` });
        }
        const examDbId = examResult.rows[0].id;

        await db.query(`
            INSERT INTO results (student_id, exam_id, score, ca_score, grade, remarks, ipfs_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [studentDbId, examDbId, examScore, caScore, 'A', remarks, ipfsHash]);

        // Send back the IPFS hash to the frontend
        res.json({ success: true, ipfsHash });
    } catch (error) {
        console.error('Error uploading result:', error);
        res.status(500).json({ error: 'Failed to upload result.' });
    }
});

// Fetch exams pending validation for a specific lecturer
router.get('/pending-exams', async (req, res) => {
    const { walletAddress } = req.query;
    console.log('Fetching pending exams for lecturer with wallet address:', walletAddress);
  
    if (!walletAddress) {
      console.error('No wallet address provided');
      return res.status(400).json({ error: 'Missing wallet address' });
    }
  
    try {
      const exams = await db.query(`
        SELECT 
          e.id AS examId,
          c.course_code AS courseCode,
          e.batch_id AS batchId,
          e.validator_countdown AS countdownTime,
          l.wallet_address AS lecturerWalletAddress,
          e.status AS validationStatus
        FROM exams e
        JOIN courses c ON e.course_id = c.id
        JOIN lecturers l ON e.lecturer_id = l.id
        WHERE e.status = 'Pending'
        AND l.wallet_address = $1
        ORDER BY e.id;
      `, [walletAddress]);
  
      console.log('Pending exams data:', exams.rows);
      res.json({ exams: exams.rows });
    } catch (error) {
      console.error('Error fetching pending exams:', error);
      res.status(500).json({ error: 'Failed to fetch pending exams' });
    }
  });
  
  // In your routes file, e.g., lecturerRoutes.js
router.get('/notes', async (req, res) => {
    const { walletAddress } = req.query;

    if (!walletAddress) {
        return res.status(400).json({ error: 'Missing wallet address' });
    }

    try {
        // Fetch unread notes from the database
        const notes = await db.query(`
            SELECT n.note, n.created_at 
            FROM notes n
            JOIN lecturers l ON n.lecturer_id = l.id
            WHERE l.wallet_address = $1 AND n.is_read = FALSE
        `, [walletAddress]);

        if (notes.rows.length > 0) {
            res.json({ notes: notes.rows });
        } else {
            res.json({ notes: [] });
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch unread notes' });
    }
});


module.exports = router;
