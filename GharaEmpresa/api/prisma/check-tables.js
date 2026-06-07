/**
 * check-tables.js — Verifica qué tablas existen en la BD de Clever Cloud
 * Uso: node prisma/check-tables.js
 */
const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const dbUrl = new URL(process.env.DATABASE_URL);
  const client = new Client({
    host:     dbUrl.hostname,
    port:     parseInt(dbUrl.port),
    database: dbUrl.pathname.replace('/', ''),
    user:     dbUrl.username,
    password: dbUrl.password,
    ssl:      { rejectUnauthorized: false },
  });

  await client.connect();

  const { rows } = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log('\n📋 Tablas en la base de datos:');
  if (rows.length === 0) {
    console.log('  ⚠️  No hay tablas — la BD está vacía, necesita migración completa.');
  } else {
    rows.forEach(r => console.log(`  ✅ ${r.table_name}`));
  }

  await client.end();
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
