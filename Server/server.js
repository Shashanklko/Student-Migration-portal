const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. AUTHENTICATION (LOGIN)
// ==========================================
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [id, password]);
        if (users.length > 0) {
            const user = users[0];
            let name = user.role === 'admin' ? 'Board Member' : 'School Admin';
            
            // If it's a school, fetch the actual school name for the UI
            if (user.role === 'school') {
                const [schools] = await pool.query('SELECT name FROM schools WHERE id = ?', [user.referenceId]);
                if (schools.length > 0) name = schools[0].name;
            }
            
            res.json({ id: user.referenceId, role: user.role, name: name });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 2. GET STUDENT BY ID (Public & Private)
// ==========================================
app.get('/api/student/:id', async (req, res) => {
    try {
        // Fetch core student info + current school name
        const [students] = await pool.query(`
            SELECT s.uniqueId, s.name, s.fatherName, s.motherName, s.dob, s.gender, s.address, s.status, s.currentSchoolId, s.currentClass as qualification, sch.name as currentSchoolName 
            FROM students s 
            LEFT JOIN schools sch ON s.currentSchoolId = sch.id 
            WHERE s.uniqueId = ?
        `, [req.params.id]);
        
        if (students.length === 0) return res.status(404).json({ error: 'Student not found' });
        
        const student = students[0];
        
        // Fetch full timeline history
        const [history] = await pool.query(`
            SELECT h.joinedYear, h.leftYear, h.lastClass, sch.name as schoolName 
            FROM student_history h 
            JOIN schools sch ON h.schoolId = sch.id 
            WHERE h.studentId = ?
            ORDER BY h.id ASC
        `, [req.params.id]);
        
        student.history = history;
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 3. GET CURRENT STUDENTS BY SCHOOL
// ==========================================
app.get('/api/schools/:id/students', async (req, res) => {
    try {
        const [students] = await pool.query('SELECT * FROM students WHERE currentSchoolId = ? ORDER BY name ASC', [req.params.id]);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 4. ADD FRESH STUDENT
// ==========================================
app.post('/api/student', async (req, res) => {
    const { name, fatherName, motherName, dob, gender, address, currentClass, schoolId } = req.body;
    try {
        // Generate base ID: RAHUL052010
        const firstName = name.split(' ')[0].toUpperCase();
        const dobParts = dob ? dob.split('-') : ['0000', '00']; 
        const year = dobParts[0]; 
        const month = dobParts[1];
        const baseId = `${firstName}${month}${year}`;

        // Check for existing base IDs to determine serial number
        const [rows] = await pool.query('SELECT uniqueId FROM students WHERE uniqueId LIKE ? ORDER BY uniqueId DESC', [`${baseId}%`]);
        
        let uniqueId = baseId;
        if (rows.length > 0) {
            let maxSerial = -1;
            for (let row of rows) {
                if (row.uniqueId === baseId) {
                    if (maxSerial < 0) maxSerial = 0;
                } else {
                    const suffix = row.uniqueId.replace(baseId, '');
                    if (!isNaN(suffix) && suffix !== '') {
                        const num = parseInt(suffix, 10);
                        if (num > maxSerial) maxSerial = num;
                    }
                }
            }
            if (maxSerial >= 0) {
                uniqueId = `${baseId}${maxSerial + 1}`;
            }
        }

        await pool.query(`
            INSERT INTO students (uniqueId, name, fatherName, motherName, dob, gender, address, status, currentSchoolId, currentClass)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?)
        `, [uniqueId, name, fatherName, motherName, dob, gender, address, schoolId, currentClass]);

        // Start their first timeline record
        await pool.query(`
            INSERT INTO student_history (studentId, schoolId, joinedYear, leftYear) 
            VALUES (?, ?, YEAR(CURDATE()), 'Present')
        `, [uniqueId, schoolId]);

        res.json({ message: 'Student added successfully', uniqueId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 5. EDIT STUDENT PROFILE
// ==========================================
app.put('/api/student/:id', async (req, res) => {
    const { fatherName, motherName, dob, gender, address, qualification } = req.body;
    try {
        await pool.query(`
            UPDATE students 
            SET fatherName=?, motherName=?, dob=?, gender=?, address=?, currentClass=? 
            WHERE uniqueId=?
        `, [fatherName, motherName, dob, gender, address, qualification, req.params.id]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 6. ISSUE TRANSFER CERTIFICATE (TC)
// ==========================================
app.post('/api/student/:id/transfer', async (req, res) => {
    const { lastClass } = req.body;
    try {
        // 1. Mark student as Transferred
        await pool.query("UPDATE students SET status = 'Transferred' WHERE uniqueId = ?", [req.params.id]);
        
        // 2. Close out their active timeline record with the year and the class they finished
        await pool.query(`
            UPDATE student_history 
            SET leftYear = YEAR(CURDATE()), lastClass = ? 
            WHERE studentId = ? AND leftYear = 'Present'
        `, [lastClass || 'Unknown', req.params.id]);
        
        res.json({ message: 'Transfer Certificate Issued' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 7. ENROLL EXISTING STUDENT
// ==========================================
app.post('/api/student/:id/enroll', async (req, res) => {
    const { schoolId } = req.body;
    try {
        // 1. Mark as Active and bind to new school
        await pool.query(`
            UPDATE students 
            SET status = 'Active', currentSchoolId = ? 
            WHERE uniqueId = ?
        `, [schoolId, req.params.id]);
        
        // 2. Start a new timeline record
        await pool.query(`
            INSERT INTO student_history (studentId, schoolId, joinedYear, leftYear) 
            VALUES (?, ?, YEAR(CURDATE()), 'Present')
        `, [req.params.id, schoolId]);
        
        res.json({ message: 'Student Enrolled Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 8. REGISTER NEW SCHOOL (Admin Only)
// ==========================================
app.post('/api/schools', async (req, res) => {
    const { schoolId, name, region, password } = req.body;
    try {
        // 1. Insert into schools
        await pool.query('INSERT INTO schools (id, name, region) VALUES (?, ?, ?)', [schoolId, name, region]);
        
        // 2. Insert into users table to grant login access
        await pool.query('INSERT INTO users (username, password, role, referenceId) VALUES (?, ?, ?, ?)', [schoolId, password, 'school', schoolId]);
        
        res.json({ message: 'School Registered Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 9. GET ALL SCHOOLS (Admin Only)
// ==========================================
app.get('/api/schools', async (req, res) => {
    try {
        const [schools] = await pool.query('SELECT id, name, region FROM schools ORDER BY name ASC');
        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 8. RESET SCHOOL PASSWORD (Admin Only)
// ==========================================
app.put('/api/schools/:id/password', async (req, res) => {
    const { password } = req.body;
    try {
        // Update password in users table
        await pool.query('UPDATE users SET password = ? WHERE referenceId = ? AND role = "school"', [password, req.params.id]);
        
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend in production
const path = require('path');
const staticPath = path.join(__dirname, '../Client/dist');
console.log('Static files path:', staticPath);
app.use(express.static(staticPath));

// Catch-all route to serve index.html for SPA (only for non-API routes)
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'API route not found' });
    } else if (req.path.startsWith('/assets')) {
        res.status(404).send('Asset not found');
    } else {
        res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
