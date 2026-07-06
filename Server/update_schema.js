const pool = require('./config/db');

async function updateSchema() {
    console.log("Starting database schema updates for Eduvera...");

    // Helper function to run query and swallow duplicate column errors
    async function addColumn(tableName, columnName, columnDef) {
        try {
            await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`);
            console.log(`✅ Column '${columnName}' successfully added to table '${tableName}'.`);
        } catch (error) {
            // Error code for duplicate column in MySQL is 'ER_DUP_FIELDNAME' (or SQLState 42S21 / error code 1060)
            if (error.code === 'ER_DUP_FIELDNAME' || error.errno === 1060) {
                console.log(`⚠️ Column '${columnName}' already exists in table '${tableName}'.`);
            } else {
                console.error(`❌ Error adding column '${columnName}' to '${tableName}':`, error.stack);
                throw error;
            }
        }
    }

    try {
        // Add new columns to students table
        await addColumn('students', 'courseType', "VARCHAR(100) DEFAULT 'School'");
        await addColumn('students', 'course', "VARCHAR(100) DEFAULT NULL");
        await addColumn('students', 'branch', "VARCHAR(100) DEFAULT NULL");
        await addColumn('students', 'rollNumber', "VARCHAR(100) DEFAULT NULL");
        await addColumn('students', 'admissionYear', "INT DEFAULT NULL");
        await addColumn('students', 'graduationYear', "INT DEFAULT NULL");
        await addColumn('students', 'email', "VARCHAR(255) DEFAULT NULL");
        await addColumn('students', 'phoneNumber', "VARCHAR(50) DEFAULT NULL");

        // Add new columns to student_history table
        await addColumn('student_history', 'lastCourse', "VARCHAR(100) DEFAULT NULL");
        await addColumn('student_history', 'lastBranch', "VARCHAR(100) DEFAULT NULL");

        console.log("🎉 Database schema update successfully completed!");
    } catch (error) {
        console.error("❌ Schema update failed:", error.stack);
    } finally {
        process.exit();
    }
}

updateSchema();
