const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const lecturerRoutes = require('./routes/lecturers');
const validatorRoutes = require('./routes/validators');
const studentRoutes = require('./routes/students'); 

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
}));

// Routes
app.use('/lecturers', lecturerRoutes);
app.use('/validators', validatorRoutes);
app.use('/students', studentRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
