const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const { sanitize } = require('../../middleware/sanitize');
const upload = require('../../config/multer');
const { validateFile } = require('../../middleware/validateFile');
const productosController = require('../../controllers/admin/productos.controller');
const imagenesController = require('../../controllers/admin/imagenes.controller');

router.use(auth);
router.use(sanitize);

// Productos CRUD + Soft Delete
router.get('/', productosController.getAll);
router.post('/', productosController.create);
router.put('/:id', productosController.update);
router.patch('/:id/inactivar', productosController.inactivar);
router.patch('/:id/activar', productosController.activar);

// Imágenes y Archivos
router.post('/:id/imagenes', upload.array('imagenes', 10), validateFile, imagenesController.upload);
router.post('/:id/ficha', upload.single('ficha'), validateFile, productosController.uploadFichaTecnica);
router.delete('/:id/ficha', productosController.removeFichaTecnica);

module.exports = router;
