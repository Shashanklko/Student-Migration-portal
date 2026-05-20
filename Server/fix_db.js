const pool = require('./config/db');

async function fixDatabase() {
    console.log("Refactoring database for Enterprise Auth...");

    try {
        
        try {
            await pool.query(`ALTER TABLE schools DROP COLUMN password;`);
            console.log("✅ Removed password from schools table.");
        } catch (e) {
            console.log("⚠️ Password column already removed or doesn't exist.");
        }

        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'school', 'student') NOT NULL,
                referenceId VARCHAR(50) NULL
            );
        `);
        console.log("✅ 'users' table created successfully.");

        console.log("🎉 Database refactor complete!");
    } catch (error) {
        console.error("❌ Error refactoring database:", error.message);
    } finally {
        process.exit();
    }
}

fixDatabase();
