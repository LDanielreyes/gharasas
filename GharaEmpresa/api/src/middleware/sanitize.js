const DOMPurify = require('isomorphic-dompurify');

/**
 * Middleware de sanitización de inputs
 * Limpia todos los campos string del body para prevenir XSS
 */
const sanitize = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    sanitizeObject(req.params);
  }
  next();
};

function sanitizeObject(obj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = DOMPurify.sanitize(obj[key], {
        ALLOWED_TAGS: [],      // Sin tags HTML
        ALLOWED_ATTR: [],      // Sin atributos
      }).trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

module.exports = { sanitize };
