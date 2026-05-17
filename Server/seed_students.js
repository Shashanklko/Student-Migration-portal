const pool = require('./config/db');

async function seedStudents() {
    try {
        await pool.query(`
            INSERT IGNORE INTO students (uniqueId, name, fatherName, motherName, dob, gender, address, status, currentSchoolId, currentClass)
            VALUES ('STU101245', 'Rahul Sharma', 'Raj Sharma', 'Sunita Sharma', '2010-05-14', 'Male', '123 Main St, New Delhi', 'Active', 'SCH002', 'Class 10')
        `);

        await pool.query(`
            INSERT IGNORE INTO student_history (studentId, schoolId, joinedYear, leftYear, lastClass)
            VALUES 
            ('STU101245', 'SCH001', '2021', '2024', 'Class 9'),
            ('STU101245', 'SCH002', '2024', 'Present', NULL)
        `);

        console.log("Students seeded!");
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit();
    }
}
seedStudents();
