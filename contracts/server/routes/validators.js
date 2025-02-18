const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL database connection
const { approveResults } = require('/home/chinex/Records/contracts/scripts/contractInteraction'); // Smart contract interaction

// Route to fetch lecturers
router.get('/lecturers', async (req, res) => {
    try {
        const query = 'SELECT name, wallet_address FROM lecturers';
        const lecturers = await db.query(query);
        res.json({ lecturers: lecturers.rows });
    } catch (error) {
        console.error('Error fetching lecturers:', error.message);
        res.status(500).json({ error: 'Failed to fetch lecturers' });
    }
});

// Route to fetch exams for a lecturer
router.get('/lecturers/:walletAddress/exams', async (req, res) => {
    const { walletAddress } = req.params;
    try {
        const query = `
            SELECT e.id AS exam_id, e.batch_id, e.status, c.course_name
            FROM exams e
            JOIN courses c ON e.course_id = c.id
            JOIN lecturers l ON e.lecturer_id = l.id
            WHERE l.wallet_address = $1
            ORDER BY e.id;
        `;
        const exams = await db.query(query, [walletAddress]);
        res.json({ exams: exams.rows });
    } catch (error) {
        console.error('Error fetching exams:', error.message);
        res.status(500).json({ error: 'Failed to fetch exams' });
    }
});

// Route to view all results under a specific exam
router.get('/exams/:examId/results', async (req, res) => {
    const { examId } = req.params;
    console.log(`Fetching results for exam ID: ${examId}`);

    try {
        const resultsQuery = `
            SELECT r.id AS result_id, c.course_code, s.name AS student_name, r.score, r.ca_score, r.grade
            FROM results r
            JOIN exams e ON r.exam_id = e.id
            JOIN students s ON r.student_id = s.id
            JOIN courses c ON e.course_id = c.id
            WHERE e.id = $1;
        `;
        const results = await db.query(resultsQuery, [examId]);

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'No results found for this exam ID' });
        }

        res.json({ results: results.rows });
    } catch (error) {
        console.error('Error fetching exam results:', error.message);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});


// Route to approve an exam
router.post('/exams/:examId/approve', async (req, res) => {
    const { examId } = req.params;
    try {
        await approveResults(examId); // Approve on-chain
        await db.query('UPDATE exams SET status = $1 WHERE id = $2', ['Approved', examId]);
        res.json({ success: true, message: 'Exam approved successfully' });
    } catch (error) {
        console.error('Error approving exam:', error.message);
        res.status(500).json({ error: 'Failed to approve exam' });
    }
});

module.exports = router;
