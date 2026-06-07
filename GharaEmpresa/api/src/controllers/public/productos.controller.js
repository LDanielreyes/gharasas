const prisma = require('../../config/database');
const { getOrSet, KEYS } = require('../../services/cacheService');

/**
 * GET /api/productos
 * Obtiene el listado de productos activos para el catálogo público con filtros.
 */
async function getAllPublic(req, res, next) {
  try {
    const { 
      busqueda, 
      categoria, 
      precioMin, 
      precioMax, 
      seer,
      pagina = 1, 
      limite = 12 
    } = req.query;

    const where = { estadoRegistro: true };

    // Filtro por término de búsqueda (modelo, tecnología, marca)
    if (busqueda) {
      where.OR = [
        { modelo: { contains: busqueda, mode: 'insensitive' } },
        { tecnologia: { contains: busqueda, mode: 'insensitive' } },
        { marca: { nombre: { contains: busqueda, mode: 'insensitive' } } }
      ];
    }

    // Filtro por categoría
    if (categoria && categoria !== 'Todos') {
      where.lineaSerie = categoria;
    }

    // Filtros de Precio
    if (precioMin || precioMax) {
      where.precioContado = {};
      if (precioMin) where.precioContado.gte = parseFloat(precioMin);
      if (precioMax) where.precioContado.lte = parseFloat(precioMax);
    }

    // Filtros de SEER
    if (seer) {
      // Si mandan múltiples checkboxes, puede ser array o string separado por comas
      const seerValues = Array.isArray(seer) ? seer : seer.split(',');
      const seerConditions = [];
      
      seerValues.forEach(val => {
        if (val === 'SEER 11-15') seerConditions.push({ seer: { gte: 11, lte: 15 } });
        if (val === 'SEER 16-19') seerConditions.push({ seer: { gte: 16, lte: 19 } });
        if (val === 'SEER 20+')   seerConditions.push({ seer: { gte: 20 } });
      });

      if (seerConditions.length > 0) {
        // Combinar condiciones de SEER con el resto usando AND
        where.AND = [{ OR: seerConditions }];
      }
    }

    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    const take = parseInt(limite);

    // Cache key includes all filter params so different filters get different cache entries
    const cacheKey = `${KEYS.CATALOGO}_${JSON.stringify({ where, skip, take })}`;
    
    const { productos, total } = await getOrSet(cacheKey, async () => {
      const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take,
        orderBy: { fechaCreacion: 'desc' },
        include: {
          marca: { select: { nombre: true } },
          imagenes: { 
            where: { esPrincipal: true },
            select: { rutaImagen: true } 
          }
        }
      }),
      prisma.producto.count({ where })
    ]);

      return { productos, total };
    }, 60); // Cache por 60 segundos — suficiente para reducir la carga en la BD

    // Formatear salida
    const data = productos.map(p => ({
      idProducto: p.idProducto,
      slug: p.slug,
      nombre: `${p.marca?.nombre} ${p.modelo}`,
      modelo: p.modelo,
      categoria: p.lineaSerie,
      tecnologia: p.tecnologia,
      capacidadBtu: p.capacidadBtu,
      seerValue: p.seer,
      precio: parseFloat(p.precioContado),
      imagenPrincipal: p.imagenes[0]?.rutaImagen || null,
      rating: 5 // Dato temporal visual, si deseas puedes agregarlo al schema luego
    }));

    res.json({
      success: true,
      data,
      pagination: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPages: Math.ceil(total / take)
      }
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/productos/:id
 * Obtiene los detalles completos de un producto especifico (galeria, resenas).
 */
async function getByIdPublic(req, res, next) {
  try {
    const idParam = req.params.id;
    const isNumeric = /^\d+$/.test(idParam);

    const where = isNumeric
      ? { idProducto: parseInt(idParam), estadoRegistro: true }
      : { slug: idParam, estadoRegistro: true };

    const producto = await prisma.producto.findFirst({
      where,
      include: {
        marca: true,
        imagenes: { orderBy: [{ esPrincipal: 'desc' }, { orden: 'asc' }] },
        detalles: true,
        resenas: {
          where: { estadoModeracion: 'Aprobado' },
          orderBy: { fechaResena: 'desc' },
          take: 20,
        },
        promociones: {
          where: {
            promocion: {
              activa: true,
              fechaInicio: { lte: new Date() },
              fechaFin: { gte: new Date() },
            }
          },
          include: {
            promocion: true
          }
        }
      }
    });

    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    // Calcular rating promedio
    const ratingPromedio = producto.resenas.length > 0
      ? producto.resenas.reduce((sum, r) => sum + r.calificacion, 0) / producto.resenas.length
      : null;

    // Distribucion de estrellas (1-5)
    const ratingDistrib = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: producto.resenas.filter(r => r.calificacion === stars).length,
    }));

    const data = {
      idProducto: producto.idProducto,
      slug: producto.slug,
      nombre: `${producto.marca?.nombre} ${producto.modelo}`,
      modelo: producto.modelo,
      marca: producto.marca?.nombre,
      categoria: producto.lineaSerie,
      tecnologia: producto.tecnologia,
      capacidadBtu: producto.capacidadBtu,
      seerValue: producto.seer,
      precio: parseFloat(producto.precioContado || 0),
      voltaje: producto.voltaje,
      refrigerante: producto.refrigerante,
      claseEnergetica: producto.claseEnergetica,
      tieneWifi: producto.tieneWifi,
      color: producto.color,
      estadoInventario: producto.estadoInventario,
      fichaTecnica: producto.fichaTecnica,
      metaTitulo: producto.metaTitulo,
      metaDescripcion: producto.metaDescripcion,
      imagenes: producto.imagenes,
      imagenPrincipal: producto.imagenes.find(i => i.esPrincipal)?.rutaImagen || producto.imagenes[0]?.rutaImagen || null,
      detalles: producto.detalles,
      resenas: producto.resenas,
      ratingPromedio,
      totalResenas: producto.resenas.length,
      ratingDistrib,
      promociones: producto.promociones,
    };

    // Registrar Vista en background — upsert atómico con raw SQL para evitar race condition
    const hoy = new Date(new Date().setHours(0, 0, 0, 0));
    prisma.$executeRaw`
      INSERT INTO vistas_producto (id_producto, fecha_vista, cantidad_vistas)
      VALUES (${producto.idProducto}, ${hoy}, 1)
      ON DUPLICATE KEY UPDATE cantidad_vistas = cantidad_vistas + 1
    `.catch(err => console.error('Error registrando vista:', err.message));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
module.exports = { getAll: getAllPublic, getById: getByIdPublic };
