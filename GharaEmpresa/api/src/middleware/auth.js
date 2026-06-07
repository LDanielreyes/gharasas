const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Middleware de autenticación JWT
 * Verifica el token Bearer en el header Authorization
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. Token no proporcionado.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // { idAdmin, email, rol }
    next();
  } catch (error) {
    logger.warn('Intento de acceso con token inválido', {
      ip: req.ip,
      path: req.originalUrl,
      error: error.message,
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor, renueva tu sesión.',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido.',
    });
  }
};

/**
 * Middleware de autorización por rol
 * Uso: authorize('SuperAdmin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.rol)) {
      logger.warn('Acceso denegado por rol insuficiente', {
        adminId: req.admin?.idAdmin,
        rolActual: req.admin?.rol,
        rolesRequeridos: roles,
        path: req.originalUrl,
      });
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción.',
      });
    }
    next();
  };
};

module.exports = { auth, authorize };
