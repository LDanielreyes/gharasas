const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const seoController = require('../../controllers/admin/seo.controller');

router.use(auth);

router.get('/',                   seoController.getAll);
router.patch('/:id',              authorize('SuperAdmin', 'Administrador'), seoController.update);
router.post('/generar-masivo',    authorize('SuperAdmin', 'Administrador'), seoController.generarMasivo);

module.exports = router;
