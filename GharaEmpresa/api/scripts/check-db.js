const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  try {
    const p = await prisma.producto.count();
    console.log('Total Productos en DB:', p);
    const c = await prisma.cupon.count();
    console.log('Total Cupones en DB:', c);
  } catch(e) { console.error(e); }
  finally { prisma.$disconnect(); }
}
check();
