const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

const UPLOADS_DIR = path.join(__dirname, '../../uploads/productos');

/**
 * Procesa una imagen: valida → resize → strip EXIF → WebP → guarda
 * @param {Buffer} buffer - Buffer del archivo recibido por Multer
 * @param {number} productoId - ID del producto
 * @returns {string} Ruta relativa de la imagen guardada
 */
async function processAndSave(buffer, productoId) {
  const productDir = path.join(UPLOADS_DIR, String(productoId));
  await fs.mkdir(productDir, { recursive: true });

  const filename = `${uuidv4()}.webp`;
  const filepath = path.join(productDir, filename);

  try {
    await sharp(buffer)
      .rotate()                         // Auto-rotar según EXIF
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',                  // Mantener aspect ratio
        withoutEnlargement: true,       // No agrandar imágenes pequeñas
      })
      .webp({ quality: 80 })           // Convertir a WebP 80%
      .toFile(filepath);

    const relativePath = `/uploads/productos/${productoId}/${filename}`;
    logger.info(`Imagen procesada: ${relativePath}`);

    return relativePath;
  } catch (error) {
    logger.error('Error procesando imagen con Sharp', {
      error: error.message,
      productoId,
    });
    throw new Error('Error al procesar la imagen.');
  }
}

/**
 * Elimina un archivo de imagen del sistema de archivos
 * @param {string} rutaRelativa - Ruta relativa (ej: /uploads/productos/1/abc.webp)
 */
async function deleteFile(rutaRelativa) {
  const absolutePath = path.join(__dirname, '../..', rutaRelativa);
  try {
    await fs.unlink(absolutePath);
    logger.info(`Imagen eliminada: ${rutaRelativa}`);
  } catch (error) {
    // Si el archivo no existe, no es un error crítico
    if (error.code !== 'ENOENT') {
      logger.error('Error eliminando imagen', {
        error: error.message,
        path: rutaRelativa,
      });
    }
  }
}

module.exports = { processAndSave, deleteFile };
