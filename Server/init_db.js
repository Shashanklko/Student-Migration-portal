const pool = require('./config/db');

async function initializeDatabase() {
    console.log("Initializing database tables in TiDB...");

    try {
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS schools (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                region VARCHAR(100),
                password VARCHAR(255) NOT NULL
            );
        `);
        console.log("✅ 'schools' table ready.");

        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                uniqueId VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                fatherName VARCHAR(255),
                motherName VARCHAR(255),
                dob DATE,
                gender ENUM('Male', 'Female', 'Other'),
                address TEXT,
                status ENUM('Active', 'Transferred', 'Passed') DEFAULT 'Active',
                currentSchoolId VARCHAR(50),
                currentClass VARCHAR(50),
                courseType VARCHAR(100) DEFAULT 'School',
                course VARCHAR(100) DEFAULT NULL,
                branch VARCHAR(100) DEFAULT NULL,
                rollNumber VARCHAR(100) DEFAULT NULL,
                admissionYear INT DEFAULT NULL,
                graduationYear INT DEFAULT NULL,
                email VARCHAR(255) DEFAULT NULL,
                phoneNumber VARCHAR(50) DEFAULT NULL,
                FOREIGN KEY (currentSchoolId) REFERENCES schools(id)
            );
        `);
        console.log("✅ 'students' table ready.");

        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS student_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                studentId VARCHAR(50) NOT NULL,
                schoolId VARCHAR(50) NOT NULL,
                joinedYear VARCHAR(20),
                leftYear VARCHAR(20),
                lastClass VARCHAR(50),
                lastCourse VARCHAR(100) DEFAULT NULL,
                lastBranch VARCHAR(100) DEFAULT NULL,
                FOREIGN KEY (studentId) REFERENCES students(uniqueId),
                FOREIGN KEY (schoolId) REFERENCES schools(id)
            );
        `);
        console.log("✅ 'student_history' table ready.");

        console.log("🎉 Database initialization completed successfully!");
    } catch (error) {
        console.error("❌ Error initializing database:", error.message);
    } finally {
        process.exit();
    }
}

initializeDatabase();
