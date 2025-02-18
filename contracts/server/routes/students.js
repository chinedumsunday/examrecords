// routes/students.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL database connection

router.get('/:walletAddress/role', async (req, res) => {
    const { walletAddress } = req.params;
    
    try {
      // Query the database for a student with the given wallet address
      const result = await db.query('SELECT * FROM students WHERE wallet_address = $1', [walletAddress]);
  
      if (result.rows.length > 0) {
        return res.json({ role: 'student' }); // If found, return 'student' role
      }
  
      return res.json({ role: 'unknown' }); // Return 'unknown' if no match is found
    } catch (error) {
      console.error('Error fetching student role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  module.exports = router;

router.get('/:walletAddress/results', async (req, res) => {
    const { walletAddress } = req.params;

    try {
        console.log(`Received request for wallet address: ${walletAddress}`);

        const studentQuery = 'SELECT * FROM students WHERE wallet_address = $1';
        const studentResult = await db.query(studentQuery, [walletAddress]);
        console.log("Database student query result:", studentResult.rows);

        if (studentResult.rows.length === 0) {
            console.warn("No student found for wallet address:", walletAddress);
            return res.status(404).json({ error: 'Student not found' });
        }

        const student = studentResult.rows[0];

        // Updated query to use batch_id directly from exams table
        const resultsQuery = `
            SELECT e.batch_id, c.course_code, c.course_name, r.score, r.ca_score, r.grade
            FROM results r
            JOIN exams e ON r.exam_id = e.id
            JOIN courses c ON e.course_id = c.id
            WHERE r.student_id = $1
              AND e.status != 'pending'  -- Exclude pending results
            ORDER BY e.batch_id, c.course_code;
        `;
        const results = await db.query(resultsQuery, [student.id]);
        console.log("Database results query result:", results.rows);

        const groupedResults = results.rows.reduce((acc, row) => {
            if (!acc[row.batch_id]) {
                acc[row.batch_id] = [];
            }
            acc[row.batch_id].push({
                course_code: row.course_code,
                course_name: row.course_name,
                score: row.score,
                ca_score: row.ca_score,
                grade: row.grade,
            });
            return acc;
        }, {});

        res.json({
            student_name: student.name,
            groupedResults,
        });
    } catch (error) {
        console.error('Error fetching student results:', error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

module.exports = router;
