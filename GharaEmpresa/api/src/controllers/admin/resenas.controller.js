const prisma = require('../../config/database');
const logger = require('../../config/logger');

/**
 * GET /api/admin/resenas — Listar con filtros de moderación
 */
async function getAll(req, res, next) {
  try {
    const { estado, page = 1, limit = 20 } = req.query;

    const where = {};
    if (estado && estado !== 'Todos') where.estadoModeracion = estado;

    const [resenas, total] = await Promise.all([
      prisma.resena.findMany({
        where,
        orderBy: { fechaResena: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: { producto: { select: { modelo: true } } },
      }),
      prisma.resena.count({ where }),
    ]);

    res.json({
      success: true,
      data: resenas,
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
 * PATCH /api/admin/resenas/:id/aprobar
 */
async function aprobar(req, res, next) {
  try {
    const resena = await prisma.resena.update({
      where: { idResena: parseInt(req.params.id) },
      data: { estadoModeracion: 'Aprobado' },
    });

    logger.info(`Reseña aprobada: ${resena.idResena}`, { adminId: req.admin?.idAdmin });
    res.json({ success: true, data: resena });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/resenas/:id/rechazar
 */
async function rechazar(req, res, next) {
  try {
    const resena = await prisma.resena.update({
      where: { idResena: parseInt(req.params.id) },
      data: { estadoModeracion: 'Rechazado' },
    });

    logger.info(`Reseña rechazada: ${resena.idResena}`, { adminId: req.admin?.idAdmin });
    res.json({ success: true, data: resena });
  } catch (error) {
    next(error);
  }
}


/**
 * DELETE /api/admin/resenas/:id
 */
async function eliminar(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    await prisma.resena.delete({ where: { idResena: id } });
    logger.info(`Reseña eliminada: ${id}`, { adminId: req.admin?.idAdmin });
    res.json({ success: true, message: 'Reseña eliminada correctamente' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    }
    next(error);
  }
}

module.exports = { getAll, aprobar, rechazar, eliminar };

