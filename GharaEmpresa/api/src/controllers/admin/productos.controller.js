const prisma = require('../../config/database');
const { createProductoSchema, updateProductoSchema } = require('../../validators/producto.validator');
const { invalidateProductos } = require('../../services/cacheService');
const { saveRawFile, deleteFile } = require('../../services/fileService');
const logger = require('../../config/logger');

/**
 * GET /api/admin/productos — Todos (incluye inactivos)
 */
async function getAll(req, res, next) {
  try {
    const { page = 1, limit = 20, marca, tecnologia, estado } = req.query;

    const where = {};
    if (marca) where.idMarca = parseInt(marca);
    if (tecnologia) where.tecnologia = tecnologia;
    if (estado !== undefined) where.estadoRegistro = estado === 'true';

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: {
          marca: { select: { nombre: true } },
          imagenes: { orderBy: { orden: 'asc' } },
          _count: { select: { resenas: true, leads: true } },
        },
        orderBy: { fechaCreacion: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.producto.count({ where }),
    ]);

    res.json({
      success: true,
      data: productos,
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
 * POST /api/admin/productos
 */
async function create(req, res, next) {
  try {
    const data = createProductoSchema.parse(req.body);

    const marca = await prisma.marca.findUnique({ where: { idMarca: data.idMarca } });
    if (!marca) return res.status(404).json({ success: false, message: 'Marca no encontrada' });

    const { generarSlug } = require('../../utils/slugGenerator');
    const slug = generarSlug(marca.nombre, data.tecnologia, data.modelo, data.capacidadBtu);
    const metaTitulo = `${marca.nombre} ${data.modelo} ${data.capacidadBtu} BTU | Ghara`.substring(0, 70);
    const metaDescripcion = `Cotiza tu aire acondicionado ${marca.nombre} ${data.modelo} tipo ${data.tecnologia} con capacidad de ${data.capacidadBtu} BTU. Encuentra la mejor climatización con Ghara.`.substring(0, 160);

    const producto = await prisma.producto.create({
      data: {
        ...data,
        slug,
        metaTitulo,
        metaDescripcion
      },
      include: { marca: { select: { nombre: true } } },
    });

    invalidateProductos();
    logger.info(`Producto creado: ${producto.modelo}`, { adminId: req.admin.idAdmin });

    res.status(201).json({ success: true, data: producto });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/productos/:id
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const data = updateProductoSchema.parse(req.body);

    const producto = await prisma.producto.update({
      where: { idProducto: parseInt(id) },
      data,
      include: { marca: { select: { nombre: true } } },
    });

    invalidateProductos();
    logger.info(`Producto actualizado: ${producto.modelo}`, { adminId: req.admin.idAdmin });

    res.json({ success: true, data: producto });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/productos/:id/inactivar — Soft Delete
 */
async function inactivar(req, res, next) {
  try {
    const { id } = req.params;

    const producto = await prisma.producto.update({
      where: { idProducto: parseInt(id) },
      data: { estadoRegistro: false },
    });

    invalidateProductos();
    logger.info(`Producto inactivado (soft delete): ${producto.modelo}`, { adminId: req.admin.idAdmin });

    res.json({ success: true, message: 'Producto inactivado correctamente.' });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/productos/:id/activar — Reactivar
 */
async function activar(req, res, next) {
  try {
    const { id } = req.params;

    const producto = await prisma.producto.update({
      where: { idProducto: parseInt(id) },
      data: { estadoRegistro: true },
    });

    invalidateProductos();
    logger.info(`Producto reactivado: ${producto.modelo}`, { adminId: req.admin.idAdmin });

    res.json({ success: true, message: 'Producto activado correctamente.' });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/productos/:id/ficha
 */
async function uploadFichaTecnica(req, res, next) {
  try {
    const { id } = req.params;
    const productoId = parseInt(id);

    const producto = await prisma.producto.findUnique({ where: { idProducto: productoId } });
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se envió ninguna ficha técnica' });
    }

    if (producto.fichaTecnica) {
      await deleteFile(producto.fichaTecnica);
    }

    const fichaTecnica = await saveRawFile(req.file.buffer, req.file.originalname || 'ficha.pdf');

    const updatedProducto = await prisma.producto.update({
      where: { idProducto: productoId },
      data: { fichaTecnica },
      include: { marca: { select: { nombre: true } } },
    });

    invalidateProductos();
    logger.info(`Ficha técnica subida para producto ${productoId}`, { adminId: req.admin?.idAdmin });

    res.status(201).json({ success: true, data: updatedProducto });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/productos/:id/ficha
 */
async function removeFichaTecnica(req, res, next) {
  try {
    const { id } = req.params;
    const productoId = parseInt(id);

    const producto = await prisma.producto.findUnique({ where: { idProducto: productoId } });
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    if (producto.fichaTecnica) {
      await deleteFile(producto.fichaTecnica);
      const updatedProducto = await prisma.producto.update({
        where: { idProducto: productoId },
        data: { fichaTecnica: null },
        include: { marca: { select: { nombre: true } } },
      });
      invalidateProductos();
      logger.info(`Ficha técnica eliminada para producto ${productoId}`, { adminId: req.admin?.idAdmin });
      return res.json({ success: true, data: updatedProducto });
    }

    res.json({ success: true, message: 'No tenía ficha técnica' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, create, update, inactivar, activar, uploadFichaTecnica, removeFichaTecnica };
