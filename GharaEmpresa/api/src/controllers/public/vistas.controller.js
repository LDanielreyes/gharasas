const prisma = require('../../config/database');

// Mapa en memoria para anti-flood de vistas (IP → { productoId → timestamp })
const vistaCache = new Map();
const VISTA_COOLDOWN_MS = 60 * 60 * 1000; // 1 hora

/**
 * POST /api/vistas/:id — UPSERT +1 vista con anti-flood por IP
 */
async function register(req, res, next) {
  try {
    const productoId = parseInt(req.params.id);
    if (isNaN(productoId) || productoId <= 0) {
      return res.status(400).json({ success: false, message: 'ID de producto inválido.' });
    }

    const ip = req.ip;

    // Anti-flood: máximo 1 vista por producto por hora por IP
    const cacheKey = `${ip}:${productoId}`;
    const lastView = vistaCache.get(cacheKey);

    if (lastView && Date.now() - lastView < VISTA_COOLDOWN_MS) {
      return res.json({ success: true, message: 'Vista ya registrada.' });
    }

    // UPSERT: incrementar o crear registro de vista (MySQL syntax)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.$executeRaw`
      INSERT INTO vistas_producto (id_producto, fecha_vista, cantidad_vistas)
      VALUES (${productoId}, CURRENT_DATE, 1)
      ON DUPLICATE KEY UPDATE cantidad_vistas = cantidad_vistas + 1
    `;

    // Actualizar caché anti-flood
    vistaCache.set(cacheKey, Date.now());

    // Limpiar entradas viejas del mapa periódicamente
    if (vistaCache.size > 10000) {
      const now = Date.now();
      for (const [key, time] of vistaCache) {
        if (now - time > VISTA_COOLDOWN_MS) {
          vistaCache.delete(key);
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { register };
