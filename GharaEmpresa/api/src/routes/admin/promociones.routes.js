const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const upload = require('../../config/multer');
const { auth, authorize } = require('../../middleware/auth');
const { validateFile } = require('../../middleware/validateFile');
const ctrl = require('../../controllers/admin/promociones.controller');

// Crear carpeta uploads si no existe
const uploadDir = path.join(__dirname, '../../../uploads/promociones');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/**
 * Middleware para procesar la imagen de banner con Sharp
 * Usa memoryStorage (multer global) + Magic Bytes (validateFile)
 * para prevenir web shell uploads
 */
const processPromoImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `promo_${uuidv4()}${path.extname(req.file.originalname).toLowerCase()}`;
    const outputPath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .resize(1200, 600, { fit: 'inside', withoutEnlargement: true })
      .toFile(outputPath);

    // Inyectar la ruta para que el controller la use
    req.file.savedFilename = filename;
    req.file.savedPath = outputPath;
    next();
  } catch (error) {
    next(error);
  }
};

router.get('/', auth, ctrl.getAll);
router.post('/', auth, authorize('SuperAdmin', 'Administrador'), upload.single('imagenBanner'), validateFile, processPromoImage, ctrl.create);
router.put('/:id', auth, authorize('SuperAdmin', 'Administrador'), upload.single('imagenBanner'), validateFile, processPromoImage, ctrl.update);
router.patch('/:id/toggle', auth, authorize('SuperAdmin', 'Administrador'), ctrl.toggleActive);
router.delete('/:id', auth, authorize('SuperAdmin', 'Administrador'), ctrl.remove);

module.exports = router;
