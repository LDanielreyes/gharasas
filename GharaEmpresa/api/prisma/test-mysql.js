const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const c = await mysql.createConnection(process.env.DATABASE_URL);
    const [rows] = await c.execute('SELECT 1 AS ok');
    console.log('✅ CONECTADO a MySQL en cPanel:', rows[0].ok === 1 ? 'OK' : 'FAIL');
    await c.end();
  } catch (e) {
    console.log('❌ ERROR:', e.code || e.errno, '-', e.message);
  }
})();
