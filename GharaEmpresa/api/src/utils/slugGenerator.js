const prisma = require('../config/database');

/**
 * Genera slug SEO desde campos del producto
 * Fórmula: [Marca]-[Tecnología]-[Modelo]-[BTU]-btu
 */
function generarSlug(marca, tecnologia, modelo, capacidadBtu) {
  const partes = [marca, tecnologia, modelo, `${capacidadBtu}-btu`];
  return partes
    .join('-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // quitar acentos
    .replace(/[^a-z0-9\s-]/g, '')      // solo alfanuméricos y guiones
    .replace(/\s+/g, '-')              // espacios → guiones
    .replace(/-{2,}/g, '-')            // guiones dobles → uno
    .replace(/^-|-$/g, '');            // quitar guiones extremos
}

/**
 * Genera slugs en masa para productos sin slug
 * Usado en seed o migración manual
 */
async function generarSlugsMasivo() {
  const productos = await prisma.producto.findMany({
    where: { slug: null },
    include: { marca: { select: { nombre: true } } },
  });

  let generados = 0;
  for (const p of productos) {
    const slugBase = generarSlug(p.marca.nombre, p.tecnologia, p.modelo, p.capacidadBtu);
    let slug = slugBase;
    let intento = 1;

    // Asegurar unicidad
    while (true) {
      const exists = await prisma.producto.findUnique({ where: { slug } });
      if (!exists || exists.idProducto === p.idProducto) break;
      slug = `${slugBase}-${intento++}`;
    }

    await prisma.producto.update({
      where: { idProducto: p.idProducto },
      data: { slug },
    });
    generados++;
  }

  return generados;
}

module.exports = { generarSlug, generarSlugsMasivo };
