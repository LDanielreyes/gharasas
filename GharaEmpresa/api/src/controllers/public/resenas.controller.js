const prisma = require('../../config/database');
const { resenaSchema } = require('../../validators/resena.validator');

/**
 * POST /api/resenas — Crear reseña anónima (estado: Pendiente)
 */
async function create(req, res, next) {
  try {
    const data = resenaSchema.parse(req.body);

    // Verificar que el producto existe y está activo
    const producto = await prisma.producto.findFirst({
      where: { idProducto: data.idProducto, estadoRegistro: true },
    });
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    }


    // Verificar si esta IP ya dejó una reseña para este producto en los últimos 30 días
    const ipCliente = req.ip || req.connection.remoteAddress;
    const treintaDiasAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const resenaExistente = await prisma.resena.findFirst({
      where: {
        idProducto: data.idProducto,
        ipAutor: ipCliente,
        fechaResena: { gte: treintaDiasAtras }
      }
    });

    if (resenaExistente) {
      return res.status(429).json({ success: false, message: 'Ya has publicado una reseña para este producto recientemente. Intenta de nuevo más adelante.' });
    }

    const resena = await prisma.resena.create({
      data: {
        ...data,
        ipAutor: ipCliente,
        estadoModeracion: 'Pendiente', // Siempre pendiente de moderación
      },
    });


    res.status(201).json({
      success: true,
      message: 'Reseña enviada. Será revisada antes de publicarse.',
      data: { idResena: resena.idResena },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { create };
