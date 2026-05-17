const pool = require('./config/db');
pool.query("INSERT IGNORE INTO users (username, password, role, referenceId) VALUES ('ADMIN', 'admin123', 'admin', 'ADMIN')")
  .then(() => { console.log('Admin injected!'); process.exit(); })
  .catch(e => { console.error(e); process.exit(); });
