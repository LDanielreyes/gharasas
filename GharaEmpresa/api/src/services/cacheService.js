const cache = require('../config/cache');

const KEYS = {
  CATALOGO: 'catalogo',
  MARCAS: 'marcas',
  FAQ: 'faq',
  PRODUCTO_DETALLE: 'producto_detalle',
};

/**
 * Obtener valor de caché o ejecutar fetcher
 */
async function getOrSet(key, fetcher, ttl) {
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const data = await fetcher();
  cache.set(key, data, ttl);
  return data;
}

/**
 * Invalidar todas las claves de catálogo cuando hay cambios
 */
function invalidateProductos() {
  // Eliminar catálogo y todos los detalles de producto
  const keys = cache.keys();
  for (const key of keys) {
    if (
      key.startsWith(KEYS.CATALOGO) ||
      key.startsWith(KEYS.PRODUCTO_DETALLE)
    ) {
      cache.del(key);
    }
  }
}

function invalidateMarcas() {
  cache.del(KEYS.MARCAS);
  invalidateProductos(); // Marcas afectan el catálogo
}

function invalidateFaq() {
  cache.del(KEYS.FAQ);
}

module.exports = {
  KEYS,
  getOrSet,
  invalidateProductos,
  invalidateMarcas,
  invalidateFaq,
};
