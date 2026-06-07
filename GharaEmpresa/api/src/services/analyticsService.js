const prisma = require('../config/database');

/**
 * KPIs del Dashboard
 */
async function getDashboardKpis() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalProductos,
    productosActivos,
    ventasMes,
    totalVentasMes,
    leadsHoy,
    leadsMes,
    pqrAbiertos,
    resenaPendientes,
  ] = await Promise.all([
    prisma.producto.count(),
    prisma.producto.count({ where: { estadoRegistro: true } }),
    prisma.venta.count({
      where: {
        estadoRegistro: true,
        fechaVenta: { gte: firstDayOfMonth },
      },
    }),
    prisma.venta.aggregate({
      where: {
        estadoRegistro: true,
        fechaVenta: { gte: firstDayOfMonth },
      },
      _sum: { total: true },
    }),
    prisma.leadContacto.count({
      where: {
        fechaContacto: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
      },
    }),
    prisma.leadContacto.count({
      where: { fechaContacto: { gte: firstDayOfMonth } },
    }),
    prisma.pqrContacto.count({ where: { estadoTicket: 'Abierto' } }),
    prisma.resena.count({ where: { estadoModeracion: 'Pendiente' } }),
  ]);


    const ventasHistorico = await prisma.venta.groupBy({
      by: ['fechaVenta'],
      where: { estadoRegistro: true, fechaVenta: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } },
      _sum: { total: true }
    });
    
    // Formatear a meses
    const historicoMap = {};
    for (const v of ventasHistorico) {
      const mes = v.fechaVenta.toLocaleString('es-CO', { month: 'short' });
      if (!historicoMap[mes]) historicoMap[mes] = 0;
      historicoMap[mes] += parseFloat(v._sum.total || 0);
    }
    
    const ventasHistoricoArr = Object.keys(historicoMap).map(mes => ({
      mes,
      ventas: historicoMap[mes]
    }));

  return {
    totalProductos,
    productosActivos,
    ventasMes,
    ingresosMes: totalVentasMes._sum.total || 0,
    leadsHoy,
    leadsMes,
    pqrAbiertos,
    resenaPendientes,
    ventasHistorico: ventasHistoricoArr,
  };
}

/**
 * Embudo de Conversión: Vistas → Leads → Ventas (por período y UTM)
 */
async function getEmbudo({ desde, hasta, utmSource }) {
  const where = {};
  if (desde) where.fechaContacto = { gte: new Date(desde) };
  if (hasta) where.fechaContacto = { ...where.fechaContacto, lte: new Date(hasta) };
  if (utmSource) where.utmSource = utmSource;

  // Vistas totales del período
  const vistasWhere = {};
  if (desde) vistasWhere.fechaVista = { gte: new Date(desde) };
  if (hasta) vistasWhere.fechaVista = { ...vistasWhere.fechaVista, lte: new Date(hasta) };

  const [vistas, leads, ventas] = await Promise.all([
    prisma.vistaProducto.aggregate({
      where: vistasWhere,
      _sum: { cantidadVistas: true },
    }),
    prisma.leadContacto.count({ where }),
    prisma.venta.count({
      where: {
        estadoRegistro: true,
        ...(desde && { fechaVenta: { gte: new Date(desde) } }),
        ...(hasta && { fechaVenta: { lte: new Date(hasta) } }),
      },
    }),
  ]);

  const totalVistas = vistas._sum.cantidadVistas || 0;
  const tasaLeads = totalVistas > 0 ? ((leads / totalVistas) * 100).toFixed(2) : 0;
  const tasaConversion = leads > 0 ? ((ventas / leads) * 100).toFixed(2) : 0;

  return {
    vistas: totalVistas,
    leads,
    ventas,
    tasaLeads: parseFloat(tasaLeads),
    tasaConversion: parseFloat(tasaConversion),
  };
}

/**
 * Top productos más vistos y más vendidos
 */
async function getProductosTop(limite = 10) {
  const [masVistos, masVendidos] = await Promise.all([
    prisma.vistaProducto.groupBy({
      by: ['idProducto'],
      _sum: { cantidadVistas: true },
      orderBy: { _sum: { cantidadVistas: 'desc' } },
      take: limite,
    }),
    prisma.detalleVenta.groupBy({
      by: ['idProducto'],
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: 'desc' } },
      take: limite,
    }),
  ]);

  // Enriquecer con nombres de producto
  const productIds = [
    ...new Set([
      ...masVistos.map((v) => v.idProducto),
      ...masVendidos.map((v) => v.idProducto),
    ]),
  ];

  const productos = await prisma.producto.findMany({
    where: { idProducto: { in: productIds } },
    select: {
      idProducto: true,
      modelo: true,
      marca: { select: { nombre: true } },
    },
  });

  const productoMap = {};
  for (const p of productos) {
    productoMap[p.idProducto] = `${p.marca.nombre} ${p.modelo}`;
  }

  return {
    masVistos: masVistos.map((v) => ({
      idProducto: v.idProducto,
      nombre: productoMap[v.idProducto] || 'Desconocido',
      vistas: v._sum.cantidadVistas,
    })),
    masVendidos: masVendidos.map((v) => ({
      idProducto: v.idProducto,
      nombre: productoMap[v.idProducto] || 'Desconocido',
      vendidos: v._sum.cantidad,
    })),
  };
}

module.exports = { getDashboardKpis, getEmbudo, getProductosTop };
