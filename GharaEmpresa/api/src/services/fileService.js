const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

const UPLOADS_DIR = path.join(__dirname, '../../uploads/descargables');

/**
 * Guarda un archivo en disco sin procesar (para PDFs, DOCX, etc.)
 * @param {Buffer} buffer - Buffer del archivo
 * @param {string} originalName - Nombre original del archivo para extraer la extensión
 * @returns {string} Ruta relativa del archivo guardado
 */
async function saveRawFile(buffer, originalName) {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const ext = path.extname(originalName).toLowerCase();
  const filename = `${uuidv4()}${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);

  try {
    await fs.writeFile(filepath, buffer);
    const relativePath = `/uploads/descargables/${filename}`;
    logger.info(`Archivo guardado: ${relativePath}`);
    return relativePath;
  } catch (error) {
    logger.error('Error guardando archivo', { error: error.message });
    throw new Error('Error al guardar el archivo.');
  }
}

/**
 * Elimina un archivo del sistema de archivos
 * @param {string} rutaRelativa - Ruta relativa
 */
async function deleteFile(rutaRelativa) {
  const absolutePath = path.join(__dirname, '../..', rutaRelativa);
  try {
    await fs.unlink(absolutePath);
    logger.info(`Archivo eliminado: ${rutaRelativa}`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      logger.error('Error eliminando archivo', {
        error: error.message,
        path: rutaRelativa,
      });
    }
  }
}

module.exports = { saveRawFile, deleteFile };
