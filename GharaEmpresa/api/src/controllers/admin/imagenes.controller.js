const prisma = require('../../config/database');
const { processAndSave, deleteFile } = require('../../services/imageService');
const { invalidateProductos } = require('../../services/cacheService');
const logger = require('../../config/logger');

/**
 * POST /api/admin/productos/:id/imagenes — Upload múltiple
 */
async function upload(req, res, next) {
  try {
    const { id } = req.params;
    const productoId = parseInt(id);

    // Verificar que el producto existe
    const producto = await prisma.producto.findUnique({
      where: { idProducto: productoId },
    });
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    }

    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'No se recibieron imágenes.' });
    }

    // Contar imágenes existentes para asignar orden
    const existingCount = await prisma.imagenProducto.count({
      where: { idProducto: productoId },
    });

    const imagenes = [];
    for (let i = 0; i < files.length; i++) {
      const rutaImagen = await processAndSave(files[i].buffer, productoId);

      const imagen = await prisma.imagenProducto.create({
        data: {
          idProducto: productoId,
          rutaImagen,
          esPrincipal: existingCount === 0 && i === 0, // Primera imagen = principal
          orden: existingCount + i,
        },
      });

      imagenes.push(imagen);
    }

    invalidateProductos();
    logger.info(`${imagenes.length} imágenes subidas para producto ${productoId}`, {
      adminId: req.admin.idAdmin,
    });

    res.status(201).json({ success: true, data: imagenes });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/imagenes/:id/orden
 */
async function updateOrden(req, res, next) {
  try {
    const { id } = req.params;
    const { orden, esPrincipal } = req.body;

    const imagen = await prisma.imagenProducto.findUnique({
      where: { idImagen: parseInt(id) },
    });
    if (!imagen) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada.' });
    }

    // Si se marca como principal, desmarcar las demás
    if (esPrincipal) {
      await prisma.imagenProducto.updateMany({
        where: { idProducto: imagen.idProducto, esPrincipal: true },
        data: { esPrincipal: false },
      });
    }

    const updated = await prisma.imagenProducto.update({
      where: { idImagen: parseInt(id) },
      data: {
        ...(orden !== undefined && { orden }),
        ...(esPrincipal !== undefined && { esPrincipal }),
      },
    });

    invalidateProductos();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/imagenes/:id
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const imagen = await prisma.imagenProducto.findUnique({
      where: { idImagen: parseInt(id) },
    });
    if (!imagen) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada.' });
    }

    // Eliminar archivo físico
    await deleteFile(imagen.rutaImagen);

    // Eliminar registro de BD
    await prisma.imagenProducto.delete({
      where: { idImagen: parseInt(id) },
    });

    invalidateProductos();
    logger.info(`Imagen eliminada: ${imagen.rutaImagen}`, { adminId: req.admin.idAdmin });

    res.json({ success: true, message: 'Imagen eliminada.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { upload, updateOrden, remove };
