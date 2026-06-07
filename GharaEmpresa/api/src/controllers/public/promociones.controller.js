const prisma = require('../../config/database');
const { getOrSet, KEYS } = require('../../services/cacheService');
const { CACHE_TTL } = require('../../utils/constants');

/**
 * GET /api/promociones
 * Devuelve solo las promociones activas y dentro de rango de fechas
 */
async function getActivePromociones(req, res, next) {
  try {
    const now = new Date();
    const cacheKey = `${KEYS.CATALOGO}:promociones`;

    const result = await getOrSet(
      cacheKey,
      async () => {
        const promociones = await prisma.promocion.findMany({
          where: {
            activa: true,
            fechaInicio: { lte: now },
            fechaFin: { gte: now },
          },
          include: {
            productos: {
              include: {
                producto: {
                  select: {
                    idProducto: true,
                    modelo: true,
                    precioContado: true,
                    marca: { select: { nombre: true } },
                    imagenes: {
                      where: { esPrincipal: true },
                      select: { rutaImagen: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
          orderBy: [{ orden: 'asc' }, { fechaCreacion: 'desc' }],
        });

        return promociones.map((p) => ({
          id: p.idPromocion,
          titulo: p.titulo,
          descripcion: p.descripcion,
          tipoDescuento: p.tipoDescuento,
          valorDescuento: p.valorDescuento ? parseFloat(p.valorDescuento) : null,
          imagenBanner: p.imagenBanner,
          linkDestino: p.linkDestino,
          colorFondo: p.colorFondo,
          fechaFin: p.fechaFin,
          productos: p.productos.map((pp) => ({
            id: pp.producto.idProducto,
            modelo: pp.producto.modelo,
            marca: pp.producto.marca?.nombre,
            precio: parseFloat(pp.producto.precioContado),
            imagen: pp.producto.imagenes[0]?.rutaImagen || null,
          })),
        }));
      },
      CACHE_TTL.CATALOGO
    );

    res.json({ success: true, promociones: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { getActivePromociones };
