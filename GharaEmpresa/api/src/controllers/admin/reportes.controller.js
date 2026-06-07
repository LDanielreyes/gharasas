const prisma = require('../../config/database');

/**
 * GET /api/admin/reportes
 * Parámetros: tipo (ventas|leads|pqr|productos), desde, hasta, formato (json|excel)
 */
async function getReporte(req, res, next) {
  try {
    const { tipo = 'ventas', desde, hasta } = req.query;

    const fechaDesde = desde ? new Date(desde) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fechaHasta = hasta ? new Date(hasta)  : new Date();
    // Fin del día
    fechaHasta.setHours(23, 59, 59, 999);

    let data = [];
    let columnas = [];

    switch (tipo) {
      case 'ventas': {
        const ventas = await prisma.venta.findMany({
          where: {
            estadoRegistro: true,
            fechaVenta: { gte: fechaDesde, lte: fechaHasta },
          },
          include: {
            cliente: { select: { nombreCompleto: true, email: true } },
            detalles: {
              include: { producto: { select: { modelo: true, marca: { select: { nombre: true } } } } },
            },
          },
          orderBy: { fechaVenta: 'desc' },
        });

        columnas = ['ID', 'Fecha', 'Cliente', 'Canal', 'Total (COP)', 'Estado'];
        data = ventas.map(v => ({
          id: v.idVenta,
          fecha: new Date(v.fechaVenta).toLocaleDateString('es-CO'),
          cliente: v.cliente?.nombreCompleto || 'Anónimo',
          canal: v.canalCierre,
          total: parseFloat(v.total),
          estado: v.estadoVenta,
        }));
        break;
      }

      case 'leads': {
        const leads = await prisma.leadContacto.findMany({
          where: { fechaContacto: { gte: fechaDesde, lte: fechaHasta } },
          include: { producto: { select: { modelo: true, marca: { select: { nombre: true } } } } },
          orderBy: { fechaContacto: 'desc' },
        });

        columnas = ['ID', 'Fecha', 'Producto', 'Canal', 'UTM Source', 'UTM Campaña'];
        data = leads.map(l => ({
          id: l.idLead,
          fecha: new Date(l.fechaContacto).toLocaleDateString('es-CO'),
          producto: l.producto ? `${l.producto.marca.nombre} ${l.producto.modelo}` : 'General',
          canal: l.canalContacto,
          utmSource: l.utmSource || '—',
          utmCampaign: l.utmCampaign || '—',
        }));
        break;
      }

      case 'pqr': {
        const pqrs = await prisma.pqrContacto.findMany({
          where: { fechaRadicado: { gte: fechaDesde, lte: fechaHasta } },
          orderBy: { fechaRadicado: 'desc' },
        });

        columnas = ['Radicado', 'Fecha', 'Tipo', 'Remitente', 'Asunto', 'Estado', 'Resuelto en (días)'];
        data = pqrs.map(p => {
          const diasResolucion = p.fechaResolucion
            ? Math.round((new Date(p.fechaResolucion) - new Date(p.fechaRadicado)) / (1000 * 60 * 60 * 24))
            : null;
          return {
            radicado: p.radicado,
            fecha: new Date(p.fechaRadicado).toLocaleDateString('es-CO'),
            tipo: p.tipoSolicitud,
            remitente: p.nombreRemitente,
            asunto: p.asunto,
            estado: p.estadoTicket,
            diasResolucion: diasResolucion ?? 'Pendiente',
          };
        });
        break;
      }

      case 'productos': {
        const productos = await prisma.producto.findMany({
          include: {
            marca: { select: { nombre: true } },
            vistas: { select: { cantidadVistas: true } },
            leads: { select: { idLead: true } },
            resenas: { select: { calificacion: true } },
          },
          orderBy: { fechaCreacion: 'desc' },
        });

        columnas = ['ID', 'Modelo', 'Marca', 'Precio', 'Vistas', 'Leads', 'Reseñas', 'Calificación Prom.', 'Activo'];
        data = productos.map(p => {
          const vistas = p.vistas.reduce((s, v) => s + v.cantidadVistas, 0);
          const totalResenas = p.resenas.length;
          const calProm = totalResenas > 0
            ? (p.resenas.reduce((s, r) => s + r.calificacion, 0) / totalResenas).toFixed(1)
            : '—';
          return {
            id: p.idProducto,
            modelo: p.modelo,
            marca: p.marca.nombre,
            precio: parseFloat(p.precioContado),
            vistas,
            leads: p.leads.length,
            resenas: totalResenas,
            calificacion: calProm,
            activo: p.estadoRegistro ? 'Sí' : 'No',
          };
        });
        break;
      }

      default:
        return res.status(400).json({ success: false, message: 'Tipo de reporte inválido.' });
    }

    // Resumen estadístico
    const resumen = {
      total: data.length,
      desde: fechaDesde.toLocaleDateString('es-CO'),
      hasta: fechaHasta.toLocaleDateString('es-CO'),
      tipo,
    };

    if (tipo === 'ventas' && data.length > 0) {
      resumen.totalIngresos = data.reduce((s, r) => s + r.total, 0);
      resumen.ticketPromedio = resumen.totalIngresos / data.length;
    }

    res.json({ success: true, columnas, data, resumen });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/reportes/ventas-diarias
 * Ventas diarias de los últimos N días (para sparklines)
 */
async function getVentasDiarias(req, res, next) {
  try {
    const { dias = 30 } = req.query;
    const desde = new Date(Date.now() - parseInt(dias) * 24 * 60 * 60 * 1000);

    const raw = await prisma.$queryRaw`
      SELECT 
        DATE(fecha_venta) as dia,
        CAST(COUNT(*) AS SIGNED) as cantidad,
        CAST(COALESCE(SUM(total), 0) AS DECIMAL(15,2)) as total
      FROM ventas
      WHERE estado_registro = true AND fecha_venta >= ${desde}
      GROUP BY DATE(fecha_venta)
      ORDER BY dia ASC
    `;

    // Rellenar días vacíos
    const mapa = {};
    for (const r of raw) mapa[r.dia.toISOString().split('T')[0]] = r;

    const resultado = [];
    for (let i = parseInt(dias) - 1; i >= 0; i--) {
      const fecha = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = fecha.toISOString().split('T')[0];
      resultado.push({
        dia: key,
        cantidad: mapa[key]?.cantidad ?? 0,
        total: mapa[key]?.total ?? 0,
      });
    }

    res.json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/reportes/ticket-promedio
 * Ticket promedio del mes actual vs año pasado
 */
async function getTicketPromedio(req, res, next) {
  try {
    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [meActual, mesAnterior] = await Promise.all([
      prisma.venta.aggregate({
        where: { estadoRegistro: true, fechaVenta: { gte: firstDayMonth } },
        _avg: { total: true },
        _count: true,
      }),
      prisma.venta.aggregate({
        where: { estadoRegistro: true, fechaVenta: { gte: firstDayLastMonth, lte: lastDayLastMonth } },
        _avg: { total: true },
        _count: true,
      }),
    ]);

    const ticketActual  = parseFloat(meActual._avg.total || 0);
    const ticketAnterior = parseFloat(mesAnterior._avg.total || 0);
    const tendencia = ticketAnterior > 0
      ? (((ticketActual - ticketAnterior) / ticketAnterior) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        ticketPromedio: ticketActual,
        ventasMes: meActual._count,
        ticketMesAnterior: ticketAnterior,
        tendencia: parseFloat(tendencia),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/reportes/sparkline/:productoId
 * Leads por día de los últimos 30 días para un producto (sparkline)
 */
async function getSparklineProducto(req, res, next) {
  try {
    const id = parseInt(req.params.productoId);
    const desde = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const raw = await prisma.$queryRaw`
      SELECT 
        DATE(fecha_contacto) as dia,
        CAST(COUNT(*) AS SIGNED) as leads
      FROM leads_contacto
      WHERE id_producto = ${id} AND fecha_contacto >= ${desde}
      GROUP BY DATE(fecha_contacto)
      ORDER BY dia ASC
    `;

    // Rellenar 30 días
    const mapa = {};
    for (const r of raw) mapa[r.dia.toISOString().split('T')[0]] = r.leads;

    const data = [];
    for (let i = 29; i >= 0; i--) {
      const fecha = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = fecha.toISOString().split('T')[0];
      data.push({ dia: key, leads: mapa[key] ?? 0 });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = { getReporte, getVentasDiarias, getTicketPromedio, getSparklineProducto };
