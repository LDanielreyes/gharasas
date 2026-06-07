const prisma = require('../../config/database');
const { generarSlug } = require('../../utils/slugGenerator');
const { z } = require('zod');

const seoSchema = z.object({
  slug:            z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones').optional(),
  metaTitulo:      z.string().max(70).optional().nullable(),
  metaDescripcion: z.string().max(160).optional().nullable(),
});

/**
 * GET /api/admin/seo
 * Lista productos con sus campos SEO actuales
 */
async function getAll(req, res, next) {
  try {
    const { busqueda, pagina = 1, limite = 30 } = req.query;

    const where = {};
    if (busqueda) {
      where.OR = [
        { modelo:        { contains: busqueda, mode: 'insensitive' } },
        { marca: { nombre: { contains: busqueda, mode: 'insensitive' } } },
      ];
    }

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        orderBy: { fechaCreacion: 'desc' },
        skip: (parseInt(pagina) - 1) * parseInt(limite),
        take: parseInt(limite),
        select: {
          idProducto:     true,
          modelo:         true,
          tecnologia:     true,
          capacidadBtu:   true,
          estadoRegistro: true,
          slug:           true,
          metaTitulo:     true,
          metaDescripcion: true,
          marca: { select: { nombre: true } },
        },
      }),
      prisma.producto.count({ where }),
    ]);

    // Generar slug sugerido para productos sin slug
    const data = productos.map(p => ({
      ...p,
      slugSugerido: p.slug ?? generarSlug(p.marca.nombre, p.tecnologia, p.modelo, p.capacidadBtu),
    }));

    res.json({
      success: true,
      data,
      pagination: { total, pagina: parseInt(pagina), limite: parseInt(limite), totalPages: Math.ceil(total / parseInt(limite)) },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/seo/:id
 * Actualiza slug, metaTitulo, metaDescripcion de un producto
 */
async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    // Si no viene slug, auto-generar desde el producto
    let body = req.body;
    if (!body.slug) {
      const prod = await prisma.producto.findUnique({
        where: { idProducto: id },
        include: { marca: { select: { nombre: true } } },
      });
      if (!prod) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

      body.slug = generarSlug(prod.marca.nombre, prod.tecnologia, prod.modelo, prod.capacidadBtu);
    }

    // Validar
    const validated = seoSchema.parse(body);

    // Verificar unicidad del slug (excluyendo este mismo producto)
    if (validated.slug) {
      const existing = await prisma.producto.findUnique({ where: { slug: validated.slug } });
      if (existing && existing.idProducto !== id) {
        return res.status(409).json({ success: false, message: `El slug "${validated.slug}" ya está en uso por otro producto.` });
      }
    }

    const updated = await prisma.producto.update({
      where: { idProducto: id },
      data: validated,
      select: { idProducto: true, slug: true, metaTitulo: true, metaDescripcion: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    next(error);
  }
}

/**
 * POST /api/admin/seo/generar-masivo
 * Genera slugs para todos los productos que no tienen uno
 */
async function generarMasivo(req, res, next) {
  try {
    const { generarSlugsMasivo } = require('../../utils/slugGenerator');
    const count = await generarSlugsMasivo();
    res.json({ success: true, message: `${count} slugs generados exitosamente.` });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, update, generarMasivo };
