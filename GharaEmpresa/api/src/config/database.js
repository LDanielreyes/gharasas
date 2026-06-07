const { PrismaClient } = require('@prisma/client');

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    errorFormat: 'minimal',
  });
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  // En desarrollo, reusar la instancia para evitar conexiones excesivas durante hot-reload
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  prisma = global.__prisma;
}

/**
 * Verifica la conexion a la base de datos al arrancar.
 * Si falla, lo registra pero no mata el proceso — la API sigue respondiendo.
 */
async function checkConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const logger = require('./logger');
    logger.info('Conexion a la base de datos establecida correctamente.', { service: 'ghara-api' });
  } catch (err) {
    const logger = require('./logger');
    logger.error('No se pudo conectar a la base de datos al iniciar.', {
      service: 'ghara-api',
      error: err.message,
      hint: 'Verifica que el servidor MySQL en 195.250.27.205:3306 este activo y que tu IP este en la lista blanca del hosting.',
    });
    // No hacemos process.exit() — el servidor sigue corriendo
    // Las peticiones a DB fallaran individualmente con mensajes claros
  }
}

// Conectar al iniciar (sin bloquear el arranque del servidor)
checkConnection();

module.exports = prisma;
