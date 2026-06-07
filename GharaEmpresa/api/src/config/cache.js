const NodeCache = require('node-cache');

// TTL en segundos
const cache = new NodeCache({
  stdTTL: 600,        // 10 minutos default
  checkperiod: 120,   // Revisar expirados cada 2 min
  useClones: false,   // Mejor rendimiento (no clonar objetos)
});

module.exports = cache;
