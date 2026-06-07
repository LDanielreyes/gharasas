const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const upload = require('../../config/multer');
const descargablesController = require('../../controllers/admin/descargables.controller');

router.use(auth);

// CRUD de Descargables (Admin)
router.get('/', descargablesController.getAll);
router.post('/bulk', upload.array('archivos', 20), descargablesController.createBulk);
router.post('/', upload.single('archivo'), descargablesController.create);
router.put('/:id', upload.single('archivo'), descargablesController.update);
router.delete('/:id', descargablesController.delete);

module.exports = router;
