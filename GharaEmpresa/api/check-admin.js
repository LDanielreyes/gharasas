const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.adminUsuario.findMany();
  console.log(users);
}
check().finally(() => prisma.$disconnect());
