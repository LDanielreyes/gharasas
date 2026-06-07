const prisma = require('../config/database');
const { calcularDiasHabiles } = require('../utils/diasHabiles');

/**
 * Genera el próximo radicado PQR con formato PQR-YYYY-NNN
 */
async function generarRadicado() {
  const year = new Date().getFullYear();
  const prefix = `PQR-${year}-`;

  // Obtener el último radicado del año actual
  const ultimo = await prisma.pqrContacto.findFirst({
    where: { radicado: { startsWith: prefix } },
    orderBy: { idPqr: 'desc' },
    select: { radicado: true },
  });

  let consecutivo = 1;
  if (ultimo) {
    const parts = ultimo.radicado.split('-');
    consecutivo = parseInt(parts[2], 10) + 1;
  }

  return `${prefix}${String(consecutivo).padStart(3, '0')}`;
}

/**
 * Calcula el estado del semáforo de un PQR basado en días hábiles
 * @param {Date} fechaRadicado
 * @returns {{ color: string, diasTranscurridos: number, diasRestantes: number }}
 */
function calcularSemaforo(fechaRadicado) {
  const diasTranscurridos = calcularDiasHabiles(new Date(fechaRadicado), new Date());
  const diasRestantes = Math.max(0, 15 - diasTranscurridos);

  let color;
  if (diasTranscurridos < 10) {
    color = 'verde';     // 🟢 OK
  } else if (diasTranscurridos < 15) {
    color = 'amarillo';  // 🟡 Alerta
  } else {
    color = 'rojo';      // 🔴 Vencido
  }

  return { color, diasTranscurridos, diasRestantes };
}

module.exports = { generarRadicado, calcularSemaforo };
