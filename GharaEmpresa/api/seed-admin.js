const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('AdminGhara2026', 10);
  
  await prisma.adminUsuario.upsert({
    where: { email: 'admin@ghara.com' },
    update: { passwordHash: hash },
    create: {
      nombre: 'Administrador Local',
      email: 'admin@ghara.com',
      passwordHash: hash,
      rol: 'SuperAdmin'
    }
  });
  console.log('Usuario administrador actualizado/creado con contraseña nueva.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
