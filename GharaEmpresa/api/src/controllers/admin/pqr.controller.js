const prisma = require('../../config/database');
const { calcularSemaforo } = require('../../services/pqrService');
const { enviarResolucionPqr } = require('../../services/emailService');
const { generateExcel, PQR_COLUMNS } = require('../../services/excelService');
const logger = require('../../config/logger');

/**
 * GET /api/admin/pqr — Con semáforo de vencimiento
 */
async function getAll(req, res, next) {
  try {
    const { estado, tipo, page = 1, limit = 20 } = req.query;

    const where = {};
    if (estado) where.estadoTicket = estado;
    if (tipo) where.tipoSolicitud = tipo;

    const [pqrs, total] = await Promise.all([
      prisma.pqrContacto.findMany({
        where,
        orderBy: { fechaRadicado: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.pqrContacto.count({ where }),
    ]);

    // Agregar semáforo a cada PQR abierto
    const pqrsConSemaforo = pqrs.map((pqr) => ({
      ...pqr,
      semaforo: pqr.estadoTicket === 'Abierto' || pqr.estadoTicket === 'En Proceso'
        ? calcularSemaforo(pqr.fechaRadicado)
        : null,
    }));

    res.json({
      success: true,
      data: pqrsConSemaforo,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/pqr/:id/responder
 */
async function responder(req, res, next) {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    if (!respuesta || respuesta.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'La respuesta debe tener al menos 10 caracteres.',
      });
    }

    const pqr = await prisma.pqrContacto.update({
      where: { idPqr: parseInt(id) },
      data: {
        respuestaEquipoGharasas: respuesta,
        estadoTicket: 'Resuelto',
        fechaResolucion: new Date(),
      },
    });

    // Enviar email de resolución al remitente
    await enviarResolucionPqr({
      email: pqr.emailRemitente,
      nombre: pqr.nombreRemitente,
      radicado: pqr.radicado,
      respuesta,
    });

    logger.info(`PQR respondido: ${pqr.radicado}`, { adminId: req.admin.idAdmin });

    res.json({ success: true, data: pqr });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/pqr/exportar — Excel
 */
async function exportar(req, res, next) {
  try {
    const pqrs = await prisma.pqrContacto.findMany({
      orderBy: { fechaRadicado: 'desc' },
    });

    const buffer = generateExcel(pqrs, 'PQR Gharasas', PQR_COLUMNS);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=PQR_Gharasas_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, responder, exportar };
