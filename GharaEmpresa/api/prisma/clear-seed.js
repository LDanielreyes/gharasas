/**
 * Script para limpiar datos de prueba (FAQs y marcas del seed).
 * El adminUsuario NO se borra — es el acceso al sistema.
 * Los datos reales (PQR, productos, reseñas) tampoco se tocan.
 * 
 * Ejecución: node prisma/clear-seed.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando datos de seed inventados...\n');

  // Borrar FAQs del seed (son genéricas e inventadas)
  const deletedFaqs = await prisma.preguntaFrecuente.deleteMany({});
  console.log(`✅ ${deletedFaqs.count} FAQs de prueba eliminadas`);

  // Las marcas las mantenemos — son marcas reales que vende Ghara
  console.log('ℹ️  Marcas conservadas (son reales): MIRAGE, HISENSE, MIDEA, PANASONIC, MABE');

  // El admin NO se borra
  console.log('ℹ️  Usuario admin conservado: admin@gharasas.com');

  console.log('\n✅ Base de datos lista para datos de producción reales.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
