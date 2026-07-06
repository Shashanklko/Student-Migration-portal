const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

// Ensure reset_requests table exists on startup
pool.query(`
    CREATE TABLE IF NOT EXISTS reset_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_id VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL
    )
`).then(async () => {
    console.log("✅ 'reset_requests' table ready.");
    
    // Migration 1: Ensure school details columns exist in schools table
    const columns = [
        { name: 'establishedYear', type: 'INT DEFAULT NULL' },
        { name: 'affiliation', type: 'VARCHAR(255) DEFAULT NULL' },
        { name: 'address', type: 'TEXT DEFAULT NULL' },
        { name: 'email', type: 'VARCHAR(255) DEFAULT NULL' },
        { name: 'phone', type: 'VARCHAR(50) DEFAULT NULL' },
        { name: 'principalName', type: 'VARCHAR(255) DEFAULT NULL' },
        { name: 'website', type: 'VARCHAR(255) DEFAULT NULL' }
    ];

    for (const col of columns) {
        try {
            await pool.query(`ALTER TABLE schools ADD COLUMN ${col.name} ${col.type}`);
            console.log(`✅ Column '${col.name}' added to schools table.`);
        } catch (err) {
            if (err.errno !== 1060 && !err.message.includes("Duplicate column name")) {
                console.error(`❌ Error adding column '${col.name}':`, err.message);
            }
        }
    }

    // Migration 2: Ensure student details columns exist in students table
    const studentCols = [
        { name: 'bloodGroup', type: 'VARCHAR(10) DEFAULT NULL' },
        { name: 'nationality', type: 'VARCHAR(100) DEFAULT NULL' },
        { name: 'casteCategory', type: 'VARCHAR(50) DEFAULT NULL' },
        { name: 'academicAchievements', type: 'TEXT DEFAULT NULL' },
        { name: 'extracurricularActivities', type: 'TEXT DEFAULT NULL' },
        { name: 'conduct', type: 'VARCHAR(100) DEFAULT NULL' },
        { name: 'reasonForLeaving', type: 'VARCHAR(255) DEFAULT NULL' },
        { name: 'aadhaarNumber', type: 'VARCHAR(20) DEFAULT NULL' },
        { name: 'abcId', type: 'VARCHAR(20) DEFAULT NULL' },
        { name: 'penNumber', type: 'VARCHAR(20) DEFAULT NULL' },
        { name: 'isDifferentlyAbled', type: 'VARCHAR(10) DEFAULT NULL' },
        { name: 'religion', type: 'VARCHAR(50) DEFAULT NULL' },
        { name: 'guardianIncomeCategory', type: 'VARCHAR(50) DEFAULT NULL' },
        { name: 'motherTongue', type: 'VARCHAR(100) DEFAULT NULL' },
        { name: 'tcNumber', type: 'VARCHAR(50) DEFAULT NULL' },
        { name: 'mcNumber', type: 'VARCHAR(50) DEFAULT NULL' },
        { name: 'dateOfLeaving', type: 'DATE DEFAULT NULL' },
        { name: 'height', type: 'INT DEFAULT NULL' },
        { name: 'weight', type: 'INT DEFAULT NULL' },
        { name: 'identificationMark', type: 'VARCHAR(255) DEFAULT NULL' }
    ];

    for (const col of studentCols) {
        try {
            await pool.query(`ALTER TABLE students ADD COLUMN ${col.name} ${col.type}`);
            console.log(`✅ Column '${col.name}' added to students table.`);
        } catch (err) {
            if (err.errno !== 1060 && !err.message.includes("Duplicate column name")) {
                console.error(`❌ Error adding column '${col.name}' to students table:`, err.message);
            }
        }
    }

    // Migration 3: Ensure student_marks table exists
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS student_marks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                studentId VARCHAR(50) NOT NULL,
                schoolId VARCHAR(50) NOT NULL,
                academicYear VARCHAR(20) NOT NULL,
                subjectName VARCHAR(100) NOT NULL,
                marksObtained INT NOT NULL,
                maxMarks INT DEFAULT 100,
                grade VARCHAR(10) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`ALTER TABLE student_marks MODIFY COLUMN marksObtained FLOAT NOT NULL`);
        await pool.query(`ALTER TABLE student_marks MODIFY COLUMN maxMarks FLOAT DEFAULT 100`);
        console.log("✅ 'student_marks' table ready and columns optimized for Grade Points (FLOAT).");
    } catch (err) {
        console.error("❌ Error creating/optimizing student_marks table:", err.message);
    }

}).catch(err => {
    console.error("❌ Error running database migrations on startup:", err.message);
});

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. AUTHENTICATION (LOGIN)
// ==========================================
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;
    try {
        let loginId = id.trim().toUpperCase();

        // Check for School Admin login (starts with A- prefix)
        if (loginId.startsWith("A-")) {
            const baseSchoolId = loginId.substring(2);
            const [schools] = await pool.query('SELECT * FROM schools WHERE id = ?', [baseSchoolId]);
            if (schools.length === 0) {
                return res.status(401).json({ error: 'Invalid Institution ID' });
            }
            if (password === 'SCHAdmin') {
                return res.json({ id: loginId, role: 'school-admin', name: `${schools[0].name} (Admin)`, schoolId: baseSchoolId });
            } else {
                return res.status(401).json({ error: 'Invalid Admin Password' });
            }
        }

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
            SELECT s.uniqueId, s.name, s.fatherName, s.motherName, s.dob, s.gender, s.address, s.status, s.currentSchoolId, s.currentClass as qualification, 
                   s.courseType, s.course, s.branch, s.rollNumber, s.admissionYear, s.graduationYear, s.email, s.phoneNumber,
                   s.bloodGroup, s.nationality, s.casteCategory, s.academicAchievements, s.extracurricularActivities, s.conduct, s.reasonForLeaving,
                   s.aadhaarNumber, s.abcId, s.penNumber, s.isDifferentlyAbled, s.religion, s.guardianIncomeCategory, s.motherTongue, s.tcNumber, s.mcNumber, s.dateOfLeaving, s.height, s.weight, s.identificationMark,
                   sch.name as currentSchoolName 
            FROM students s 
            LEFT JOIN schools sch ON s.currentSchoolId = sch.id 
            WHERE s.uniqueId = ?
        `, [req.params.id]);
        
        if (students.length === 0) return res.status(404).json({ error: 'Student not found' });
        
        const student = students[0];
        
        // Fetch full timeline history
        const [history] = await pool.query(`
            SELECT h.joinedYear, h.leftYear, h.lastClass, h.lastCourse, h.lastBranch, sch.name as schoolName 
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
        const [students] = await pool.query('SELECT *, currentClass as qualification FROM students WHERE currentSchoolId = ? ORDER BY name ASC', [req.params.id]);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 4. ADD FRESH STUDENT
// ==========================================
app.post('/api/student', async (req, res) => {
    const { 
        name, fatherName, motherName, dob, gender, address, currentClass, schoolId,
        courseType, course, branch, rollNumber, admissionYear, graduationYear, email, phoneNumber,
        bloodGroup, nationality, casteCategory,
        aadhaarNumber, abcId, penNumber, isDifferentlyAbled, religion, guardianIncomeCategory, motherTongue, height, weight, identificationMark
    } = req.body;
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
            INSERT INTO students (
                uniqueId, name, fatherName, motherName, dob, gender, address, status, currentSchoolId, currentClass, courseType, course, branch, rollNumber, admissionYear, graduationYear, email, phoneNumber, 
                bloodGroup, nationality, casteCategory,
                aadhaarNumber, abcId, penNumber, isDifferentlyAbled, religion, guardianIncomeCategory, motherTongue, height, weight, identificationMark
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            uniqueId, name, fatherName, motherName, dob, gender, address, schoolId, currentClass, courseType || 'School', course || null, branch || null, rollNumber || null, admissionYear || null, graduationYear || null, email || null, phoneNumber || null, 
            bloodGroup || null, nationality || null, casteCategory || null,
            aadhaarNumber || null, abcId || null, penNumber || null, isDifferentlyAbled || null, religion || null, guardianIncomeCategory || null, motherTongue || null, 
            height ? parseInt(height, 10) : null, weight ? parseInt(weight, 10) : null, identificationMark || null
        ]);

        // Start their first timeline record
        await pool.query(`
            INSERT INTO student_history (studentId, schoolId, joinedYear, leftYear, lastClass, lastCourse, lastBranch) 
            VALUES (?, ?, YEAR(CURDATE()), 'Present', ?, ?, ?)
        `, [uniqueId, schoolId, currentClass, course || null, branch || null]);

        res.json({ message: 'Student added successfully', uniqueId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 5. EDIT STUDENT PROFILE
// ==========================================
app.put('/api/student/:id', async (req, res) => {
    const { 
        fatherName, motherName, dob, gender, address, qualification,
        courseType, course, branch, rollNumber, admissionYear, graduationYear, email, phoneNumber,
        bloodGroup, nationality, casteCategory, academicAchievements, extracurricularActivities, conduct, reasonForLeaving,
        aadhaarNumber, abcId, penNumber, isDifferentlyAbled, religion, guardianIncomeCategory, motherTongue, tcNumber, mcNumber, dateOfLeaving, height, weight, identificationMark
    } = req.body;
    try {
        await pool.query(`
            UPDATE students 
            SET fatherName=?, motherName=?, dob=?, gender=?, address=?, currentClass=?, courseType=?, course=?, branch=?, rollNumber=?, admissionYear=?, graduationYear=?, email=?, phoneNumber=?,
                bloodGroup=?, nationality=?, casteCategory=?, academicAchievements=?, extracurricularActivities=?, conduct=?, reasonForLeaving=?,
                aadhaarNumber=?, abcId=?, penNumber=?, isDifferentlyAbled=?, religion=?, guardianIncomeCategory=?, motherTongue=?, tcNumber=?, mcNumber=?, dateOfLeaving=?, height=?, weight=?, identificationMark=?
            WHERE uniqueId=?
        `, [
            fatherName, motherName, dob, gender, address, qualification, courseType || 'School', course || null, branch || null, rollNumber || null, admissionYear || null, graduationYear || null, email || null, phoneNumber || null,
            bloodGroup || null, nationality || null, casteCategory || null, academicAchievements || null, extracurricularActivities || null, conduct || null, reasonForLeaving || null,
            aadhaarNumber || null, abcId || null, penNumber || null, isDifferentlyAbled || null, religion || null, guardianIncomeCategory || null, motherTongue || null, 
            tcNumber || null, mcNumber || null, dateOfLeaving || null, height ? parseInt(height, 10) : null, weight ? parseInt(weight, 10) : null, identificationMark || null,
            req.params.id
        ]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 6. ISSUE TRANSFER CERTIFICATE (TC)
// ==========================================
app.post('/api/student/:id/transfer', async (req, res) => {
    const { lastClass, conduct, reasonForLeaving } = req.body;
    try {
        // Fetch current course/branch details to log in history
        const [studentRows] = await pool.query("SELECT course, branch FROM students WHERE uniqueId = ?", [req.params.id]);
        const currentCourse = studentRows.length > 0 ? studentRows[0].course : null;
        const currentBranch = studentRows.length > 0 ? studentRows[0].branch : null;

        // 1. Mark student as Transferred and save conduct / reason
        await pool.query(`
            UPDATE students 
            SET status = 'Transferred', conduct = ?, reasonForLeaving = ? 
            WHERE uniqueId = ?
        `, [conduct || null, reasonForLeaving || null, req.params.id]);
        
        // 2. Close out their active timeline record with the year and the class they finished
        await pool.query(`
            UPDATE student_history 
            SET leftYear = YEAR(CURDATE()), lastClass = ?, lastCourse = ?, lastBranch = ? 
            WHERE studentId = ? AND leftYear = 'Present'
        `, [lastClass || 'Unknown', currentCourse, currentBranch, req.params.id]);
        
        res.json({ message: 'Transfer Certificate Issued' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 7. ENROLL EXISTING STUDENT
// ==========================================
app.post('/api/student/:id/enroll', async (req, res) => {
    const { 
        schoolId, currentClass, 
        courseType, course, branch, rollNumber, admissionYear, graduationYear
    } = req.body;
    try {
        // 1. Mark as Active and bind to new school, update class and higher ed details
        await pool.query(`
            UPDATE students 
            SET status = 'Active', currentSchoolId = ?, currentClass = ?, courseType = ?, course = ?, branch = ?, rollNumber = ?, admissionYear = ?, graduationYear = ? 
            WHERE uniqueId = ?
        `, [schoolId, currentClass, courseType || 'School', course || null, branch || null, rollNumber || null, admissionYear || null, graduationYear || null, req.params.id]);
        
        // 2. Start a new timeline record
        await pool.query(`
            INSERT INTO student_history (studentId, schoolId, joinedYear, leftYear, lastClass, lastCourse, lastBranch) 
            VALUES (?, ?, YEAR(CURDATE()), 'Present', ?, ?, ?)
        `, [req.params.id, schoolId, currentClass, course || null, branch || null]);
        
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
// 8. GET & UPDATE SCHOOL PROFILE (School Admin)
// ==========================================
app.get('/api/schools/:id', async (req, res) => {
    try {
        const [schools] = await pool.query('SELECT * FROM schools WHERE id = ?', [req.params.id]);
        if (schools.length === 0) {
            return res.status(404).json({ error: 'Institution not found' });
        }
        res.json(schools[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/schools/:id', async (req, res) => {
    const { name, region, establishedYear, affiliation, address, email, phone, principalName, website } = req.body;
    try {
        await pool.query(`
            UPDATE schools 
            SET name = ?, region = ?, establishedYear = ?, affiliation = ?, address = ?, email = ?, phone = ?, principalName = ?, website = ?
            WHERE id = ?
        `, [name, region, establishedYear || null, affiliation || null, address || null, email || null, phone || null, principalName || null, website || null, req.params.id]);
        res.json({ message: 'Institution profile updated successfully' });
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

// ==========================================
// 9. PASSWORD RESET REQUESTS (Public & Admin & School Admin)
// ==========================================
app.post('/api/reset-request', async (req, res) => {
    const { schoolId } = req.body;
    try {
        const sId = schoolId.trim().toUpperCase();
        // Verify school exists
        const [schools] = await pool.query('SELECT id FROM schools WHERE id = ?', [sId]);
        if (schools.length === 0) {
            return res.status(404).json({ error: 'No institution found with this ID' });
        }
        // Check if there is already a pending request
        const [existing] = await pool.query('SELECT id FROM reset_requests WHERE school_id = ? AND status = "Pending"', [sId]);
        if (existing.length > 0) {
            return res.json({ message: 'A reset request is already pending for this institution.' });
        }
        await pool.query('INSERT INTO reset_requests (school_id) VALUES (?)', [sId]);
        res.json({ message: 'Reset request successfully submitted to board admin.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/reset-requests', async (req, res) => {
    try {
        const [requests] = await pool.query(`
            SELECT r.id, r.school_id, r.status, r.created_at, s.name as schoolName 
            FROM reset_requests r
            JOIN schools s ON r.school_id = s.id
            ORDER BY r.created_at DESC
        `);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/reset-requests/:id/resolve', async (req, res) => {
    try {
        await pool.query('UPDATE reset_requests SET status = "Resolved", resolved_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.id]);
        res.json({ message: 'Request marked as resolved.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/school-admin/password/:schoolId', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT password FROM pool_db.users WHERE username = ? AND role = "school"', [req.params.schoolId]).catch(async () => {
            // fallback in case of db prefix name deviations
            return await pool.query('SELECT password FROM users WHERE username = ? AND role = "school"', [req.params.schoolId]);
        });
        const [schools] = await pool.query('SELECT name FROM schools WHERE id = ?', [req.params.schoolId]);
        if (users.length === 0 || schools.length === 0) {
            return res.status(404).json({ error: 'School not found' });
        }
        res.json({ password: users[0].password, name: schools[0].name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 10. STUDENT MARKS & ACADEMIC GRADES (School Operators)
// ==========================================
app.get('/api/student/:id/marks', async (req, res) => {
    try {
        const [marks] = await pool.query('SELECT * FROM student_marks WHERE studentId = ? ORDER BY academicYear DESC, id ASC', [req.params.id]);
        res.json(marks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/student/:id/marks', async (req, res) => {
    const { schoolId, academicYear, subjectName, marksObtained, maxMarks, grade } = req.body;
    try {
        await pool.query(`
            INSERT INTO student_marks (studentId, schoolId, academicYear, subjectName, marksObtained, maxMarks, grade)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [req.params.id, schoolId, academicYear, subjectName, marksObtained, maxMarks || 100, grade || null]);
        res.json({ message: 'Mark recorded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/student/:id/marks/:markId', async (req, res) => {
    try {
        await pool.query('DELETE FROM student_marks WHERE id = ? AND studentId = ?', [req.params.markId, req.params.id]);
        res.json({ message: 'Mark deleted successfully' });
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
