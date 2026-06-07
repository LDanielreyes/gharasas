const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const { loginSchema } = require('../../validators/auth.validator');
const logger = require('../../config/logger');

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUsuario.findUnique({
      where: { email },
    });

    if (!admin) {
      logger.warn('Login fallido: email no encontrado', { email, ip: req.ip });
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas.',
      });
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!validPassword) {
      logger.warn('Login fallido: contraseña incorrecta', { email, ip: req.ip });
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas.',
      });
    }

    const payload = {
      idAdmin: admin.idAdmin,
      email: admin.email,
      rol: admin.rol,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    logger.info(`Login exitoso: ${email}`, { adminId: admin.idAdmin, ip: req.ip });

    res.json({
      success: true,
      data: {
        admin: {
          idAdmin: admin.idAdmin,
          nombre: admin.nombre,
          email: admin.email,
          rol: admin.rol,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 */
async function me(req, res, next) {
  try {
    const admin = await prisma.adminUsuario.findUnique({
      where: { idAdmin: req.admin.idAdmin },
      select: {
        idAdmin: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin no encontrado.' });
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requerido.',
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const payload = {
      idAdmin: decoded.idAdmin,
      email: decoded.email,
      rol: decoded.rol,
    };

    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token inválido o expirado.',
    });
  }
}

module.exports = { login, me, refresh };
