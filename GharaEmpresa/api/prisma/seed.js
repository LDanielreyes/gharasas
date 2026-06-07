const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample products...');
  
  // Create Marcas
  const midea = await prisma.marca.upsert({ where: { nombre: 'Midea' }, update: {}, create: { nombre: 'Midea' } });
  const carrier = await prisma.marca.upsert({ where: { nombre: 'Carrier' }, update: {}, create: { nombre: 'Carrier' } });
  
  // Create Products
  await prisma.producto.createMany({
    data: [
      {
        idMarca: midea.idMarca,
        modelo: 'Xtreme Save Inverter',
        tecnologia: 'Inverter',
        capacidadBtu: 12000,
        voltaje: '220V',
        refrigerante: 'R410A',
        seer: 17.0,
        tieneWifi: true,
        precioContado: 1450000,
        slug: 'midea-xtreme-save-12k',
      },
      {
        idMarca: carrier.idMarca,
        modelo: 'XPower Inverter',
        tecnologia: 'Inverter',
        capacidadBtu: 18000,
        voltaje: '220V',
        refrigerante: 'R410A',
        seer: 18.0,
        tieneWifi: false,
        precioContado: 2100000,
        slug: 'carrier-xpower-18k',
      },
      {
        idMarca: midea.idMarca,
        modelo: 'Cassette 360',
        tecnologia: 'On/Off',
        capacidadBtu: 36000,
        voltaje: '220V',
        refrigerante: 'R410A',
        seer: 13.0,
        tieneWifi: false,
        precioContado: 4500000,
        slug: 'midea-cassette-36k',
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
