const prisma = require('../../config/database');
const logger = require('../../config/logger');
const path = require('path');
const fs = require('fs');

/**
 * GET /api/admin/promociones
 * Listar todas las promociones (admin)
 */
async function getAll(req, res, next) {
  try {
    const promociones = await prisma.promocion.findMany({
      include: {
        productos: {
          include: {
            producto: {
              select: { idProducto: true, modelo: true, marca: { select: { nombre: true } } },
            },
          },
        },
      },
      orderBy: [{ orden: 'asc' }, { fechaCreacion: 'desc' }],
    });

    res.json({ success: true, promociones });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/promociones
 * Crear promoción
 */
async function create(req, res, next) {
  try {
    const { titulo, descripcion, tipoDescuento, valorDescuento, linkDestino, colorFondo, fechaInicio, fechaFin, orden, productosIds } = req.body;

    const data = {
      titulo,
      descripcion: descripcion || null,
      tipoDescuento: tipoDescuento || 'BANNER',
      valorDescuento: valorDescuento ? parseFloat(valorDescuento) : null,
      linkDestino: linkDestino || null,
      colorFondo: colorFondo || null,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      orden: parseInt(orden) || 0,
      activa: true,
    };

    // Imagen de banner subida
    if (req.file) {
      data.imagenBanner = `/uploads/promociones/${req.file.savedFilename || req.file.filename}`;
    }

    const promocion = await prisma.promocion.create({ data });

    // Vincular productos si se proporcionaron
    if (productosIds) {
      const ids = typeof productosIds === 'string' ? JSON.parse(productosIds) : productosIds;
      if (Array.isArray(ids) && ids.length > 0) {
        await prisma.promocionProducto.createMany({
          data: ids.map((idProducto) => ({
            idPromocion: promocion.idPromocion,
            idProducto: parseInt(idProducto),
          })),
          skipDuplicates: true,
        });
      }
    }

    // Re-fetch con relaciones
    const result = await prisma.promocion.findUnique({
      where: { idPromocion: promocion.idPromocion },
      include: { productos: { include: { producto: { select: { idProducto: true, modelo: true, marca: { select: { nombre: true } } } } } } },
    });

    logger.info(`Promoción creada: ${titulo}`, { adminId: req.admin?.idAdmin });
    res.status(201).json({ success: true, promocion: result });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/promociones/:id
 * Actualizar promoción
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { titulo, descripcion, tipoDescuento, valorDescuento, linkDestino, colorFondo, fechaInicio, fechaFin, orden, activa, productosIds } = req.body;

    const data = {};
    if (titulo !== undefined) data.titulo = titulo;
    if (descripcion !== undefined) data.descripcion = descripcion || null;
    if (tipoDescuento !== undefined) data.tipoDescuento = tipoDescuento;
    if (valorDescuento !== undefined) data.valorDescuento = valorDescuento ? parseFloat(valorDescuento) : null;
    if (linkDestino !== undefined) data.linkDestino = linkDestino || null;
    if (colorFondo !== undefined) data.colorFondo = colorFondo || null;
    if (fechaInicio !== undefined) data.fechaInicio = new Date(fechaInicio);
    if (fechaFin !== undefined) data.fechaFin = new Date(fechaFin);
    if (orden !== undefined) data.orden = parseInt(orden);
    if (activa !== undefined) data.activa = activa === true || activa === 'true';

    if (req.file) {
      // Eliminar imagen anterior si existe
      const existing = await prisma.promocion.findUnique({ where: { idPromocion: parseInt(id) } });
      if (existing?.imagenBanner) {
        const oldPath = path.join(__dirname, '../../../', existing.imagenBanner);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.imagenBanner = `/uploads/promociones/${req.file.savedFilename || req.file.filename}`;
    }

    const promocion = await prisma.promocion.update({
      where: { idPromocion: parseInt(id) },
      data,
    });

    // Actualizar productos vinculados
    if (productosIds !== undefined) {
      const ids = typeof productosIds === 'string' ? JSON.parse(productosIds) : productosIds;
      // Borrar existentes y recrear
      await prisma.promocionProducto.deleteMany({ where: { idPromocion: parseInt(id) } });
      if (Array.isArray(ids) && ids.length > 0) {
        await prisma.promocionProducto.createMany({
          data: ids.map((idProducto) => ({
            idPromocion: parseInt(id),
            idProducto: parseInt(idProducto),
          })),
          skipDuplicates: true,
        });
      }
    }

    const result = await prisma.promocion.findUnique({
      where: { idPromocion: parseInt(id) },
      include: { productos: { include: { producto: { select: { idProducto: true, modelo: true, marca: { select: { nombre: true } } } } } } },
    });

    logger.info(`Promoción actualizada: ${id}`, { adminId: req.admin?.idAdmin });
    res.json({ success: true, promocion: result });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/promociones/:id/toggle
 */
async function toggleActive(req, res, next) {
  try {
    const { id } = req.params;
    const promo = await prisma.promocion.findUnique({ where: { idPromocion: parseInt(id) } });
    if (!promo) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });

    const updated = await prisma.promocion.update({
      where: { idPromocion: parseInt(id) },
      data: { activa: !promo.activa },
    });

    res.json({ success: true, promocion: updated });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/promociones/:id
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const promo = await prisma.promocion.findUnique({ where: { idPromocion: parseInt(id) } });

    if (promo?.imagenBanner) {
      const imgPath = path.join(__dirname, '../../../', promo.imagenBanner);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await prisma.promocion.delete({ where: { idPromocion: parseInt(id) } });

    logger.info(`Promoción eliminada: ${id}`, { adminId: req.admin?.idAdmin });
    res.json({ success: true, message: 'Promoción eliminada' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, create, update, toggleActive, remove };
