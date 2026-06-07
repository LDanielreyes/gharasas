const logger = require('../config/logger');

/**
 * Global Error Handler
 * Captura todos los errores no controlados y los registra en Winston
 * Nunca expone stack traces al cliente en producción
 */
const errorHandler = (err, req, res, next) => {
  // Log completo del error
  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    body: req.method !== 'GET' ? '[REDACTED]' : undefined,
    adminId: req.admin?.idAdmin,
  });

  // Errores de Multer (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo es demasiado grande. Máximo 2MB.',
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Demasiados archivos. Máximo 10 por solicitud.',
    });
  }

  // Errores de validación Zod
  if (err.name === 'ZodError') {
    let issues = [];
    if (Array.isArray(err.errors)) issues = err.errors;
    else if (Array.isArray(err.issues)) issues = err.issues;
    else {
      try { issues = JSON.parse(err.message); } catch (e) {}
    }

    return res.status(400).json({
      success: false,
      message: 'Datos inválidos.',
      errors: (Array.isArray(issues) ? issues : []).map((e) => ({
        campo: e.path ? e.path.join('.') : 'desconocido',
        mensaje: e.message,
      })),
    });
  }

  // Errores de Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Ya existe un registro con esos datos.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Registro no encontrado.',
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor.'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler };
