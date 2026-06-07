const prisma = require('../../config/database');
const { pqrSchema } = require('../../validators/pqr.validator');
const { generarRadicado } = require('../../services/pqrService');
const { enviarConfirmacionPqr } = require('../../services/emailService');
const logger = require('../../config/logger');

/**
 * POST /api/pqr — Radicar PQR público
 */
async function create(req, res, next) {
  try {
    const data = pqrSchema.parse(req.body);

    const radicado = await generarRadicado();

    const pqr = await prisma.pqrContacto.create({
      data: {
        ...data,
        radicado,
      },
    });

    // Enviar email de confirmación al remitente
    await enviarConfirmacionPqr({
      email: data.emailRemitente,
      nombre: data.nombreRemitente,
      radicado,
      tipoSolicitud: data.tipoSolicitud,
      asunto: data.asunto,
    });

    logger.info(`PQR radicado: ${radicado}`, {
      tipo: data.tipoSolicitud,
      email: data.emailRemitente,
    });

    res.status(201).json({
      success: true,
      message: `Su solicitud ha sido radicada con el número ${radicado}. Recibirá confirmación por email.`,
      data: { radicado, idPqr: pqr.idPqr },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { create };
