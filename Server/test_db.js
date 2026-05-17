const mysql = require('mysql2/promise');

async function test() {
    try {
        const conn = await mysql.createConnection({
            host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
            port: 4000,
            user: '2oKv1G92MSvW6yw.root',
            password: 'RmReWFNvTCy7Px6r',
            database: 'sys',
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            }
        });
        console.log("Connected!");
        await conn.end();
    } catch (e) {
        console.error("Connection Failed:", e.message);
    }
}
test();
