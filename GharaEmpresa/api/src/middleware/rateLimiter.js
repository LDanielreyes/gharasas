const rateLimit = require('express-rate-limit');

// Rate limiter general para endpoints públicos
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                  // 100 requests por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
  },
});

// Rate limiter estricto para login (anti brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                    // 5 intentos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Intenta en 15 minutos.',
  },
});

// Rate limiter para formularios públicos (reseñas, PQR)
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,                   // 10 envíos por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Has enviado demasiados formularios. Intenta más tarde.',
  },
});

module.exports = { publicLimiter, loginLimiter, formLimiter };
