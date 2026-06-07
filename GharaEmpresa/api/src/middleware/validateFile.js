const logger = require('../config/logger');

/**
 * Validación de archivos por Magic Bytes (MIME-type real)
 * Capa 2 del muro de seguridad contra Web Shells
 */
const MAGIC_BYTES = {
  'image/jpeg': [Buffer.from([0xFF, 0xD8, 0xFF])],
  'image/png': [Buffer.from([0x89, 0x50, 0x4E, 0x47])],
  'image/webp': [Buffer.from('RIFF')], // WebP: RIFF....WEBP
  'application/pdf': [Buffer.from([0x25, 0x50, 0x44, 0x46])], // %PDF
};

/**
 * Verifica que el contenido real del archivo corresponda a una imagen válida
 * No confía en la extensión ni en el Content-Type del header
 */
const validateFile = (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  const files = req.files || [req.file];

  for (const file of files) {
    if (!file || !file.buffer) continue;

    const isValid = isValidImage(file.buffer);

    if (!isValid) {
      logger.warn('⚠️ Intento de upload con archivo malicioso bloqueado', {
        ip: req.ip,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: req.originalUrl,
      });

      return res.status(400).json({
        success: false,
        message: 'El archivo no es válido. Solo se permiten imágenes (JPEG, PNG, WebP) o documentos (PDF).',
      });
    }
  }

  next();
};

function isValidImage(buffer) {
  if (!buffer || buffer.length < 4) return false;

  // Verificar JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }

  // Verificar PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return true;
  }

  // Verificar WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer.length > 11 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return true;
  }

  // Verificar PDF: %PDF (25 50 44 46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return true;
  }

  return false;
}

module.exports = { validateFile };
