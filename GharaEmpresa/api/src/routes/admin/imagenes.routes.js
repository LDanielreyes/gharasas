const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const imagenesController = require('../../controllers/admin/imagenes.controller');

router.use(auth);

router.put('/:id/orden', imagenesController.updateOrden);
router.delete('/:id', imagenesController.remove);

module.exports = router;
