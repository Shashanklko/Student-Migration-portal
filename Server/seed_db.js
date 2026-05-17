const pool = require('./config/db');

async function seedDatabase() {
    console.log("Seeding Database with Mock Schools and Users...");

    try {
        // Insert Schools
        await pool.query(`
            INSERT IGNORE INTO schools (id, name, region) VALUES 
            ('SCH001', 'ABC Public School', 'North Region'), 
            ('SCH002', 'XYZ Senior Secondary School', 'East Region')
        `);
        console.log("✅ Seeded Schools");

        // Insert Users (Passwords are plain text for now, we will hash them later)
        await pool.query(`
            INSERT IGNORE INTO users (username, password, role, referenceId) VALUES 
            ('SCH001', 'admin123', 'school', 'SCH001'), 
            ('SCH002', 'admin123', 'school', 'SCH002')
        `);
        console.log("✅ Seeded Users");

        console.log("🎉 Database Seeding Complete!");
    } catch (error) {
        console.error("❌ Error seeding database:", error.message);
    } finally {
        process.exit();
    }
}

seedDatabase();
