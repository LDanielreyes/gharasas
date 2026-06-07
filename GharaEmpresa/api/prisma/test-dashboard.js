/**
 * test-dashboard.js — Prueba el getDashboardKpis directamente
 * Uso: node prisma/test-dashboard.js
 */
require('dotenv').config();
const { getDashboardKpis } = require('../src/services/analyticsService');

async function main() {
  console.log('🔄 Llamando getDashboardKpis()...');
  try {
    const result = await getDashboardKpis();
    console.log('✅ Resultado:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
  }
  process.exit(0);
}

main();
