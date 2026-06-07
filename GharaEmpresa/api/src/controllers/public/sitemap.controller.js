const prisma = require('../../config/database');

async function generateSitemap(req, res, next) {
  try {
    // 1. Obtener todos los productos activos con slug
    const productos = await prisma.producto.findMany({
      where: {
        estadoRegistro: true,
        slug: { not: null }
      },
      select: {
        slug: true,
        fechaCreacion: true
      }
    });

    const baseUrl = 'https://www.gharasas.com';

    // 2. Definir rutas estaticas principales
    const rutasEstaticas = [
      '/',
      '/catalogo',
      '/residencial',
      '/enterprise',
      '/proyectos',
      '/sobre-nosotros',
      '/pqr',
      '/preguntas-frecuentes',
      '/descargables',
      '/politica-datos'
    ];

    // 3. Construir el XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const hoy = new Date().toISOString().split('T')[0];
    for (const ruta of rutasEstaticas) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${ruta}</loc>\n`;
      xml += `    <lastmod>${hoy}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${ruta === '/' ? '1.0' : '0.8'}</priority>\n`;
      xml += '  </url>\n';
    }

    // Anadir productos
    for (const p of productos) {
      if (!p.slug || p.slug.trim() === '') continue;
      
      const lastMod = p.fechaCreacion 
        ? p.fechaCreacion.toISOString().split('T')[0] 
        : hoy;
        
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/catalogo/${p.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
    
  } catch (error) {
    next(error);
  }
}

module.exports = { generateSitemap };
