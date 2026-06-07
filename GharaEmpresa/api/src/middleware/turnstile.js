const logger = require('../config/logger');

/**
 * Middleware Cloudflare Turnstile
 * Verifica el token de Turnstile contra la API de Cloudflare
 * Usar en endpoints públicos POST (reseñas, PQR, preguntas)
 */
const verifyTurnstile = async (req, res, next) => {
  // En desarrollo, permitir bypass si no hay token
  if (process.env.NODE_ENV === 'development' && !req.body.turnstileToken) {
    return next();
  }

  const token = req.body.turnstileToken || req.body['cf-turnstile-response'];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Verificación anti-spam requerida.',
    });
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: req.ip,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      // Limpiar el token del body para que no llegue al controller
      delete req.body.turnstileToken;
      delete req.body['cf-turnstile-response'];
      next();
    } else {
      logger.warn('Turnstile verification failed', {
        ip: req.ip,
        errorCodes: data['error-codes'],
        path: req.originalUrl,
      });
      return res.status(400).json({
        success: false,
        message: 'Verificación anti-spam fallida. Intenta de nuevo.',
      });
    }
  } catch (error) {
    logger.error('Error verificando Turnstile', { error: error.message });
    // Fail-closed: no permitir bypass si el servicio no responde
    return res.status(503).json({
      success: false,
      message: 'Servicio de verificación no disponible. Intente más tarde.',
    });
  }
};

module.exports = { verifyTurnstile };
