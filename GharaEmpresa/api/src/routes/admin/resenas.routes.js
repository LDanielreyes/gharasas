const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const { sanitize } = require('../../middleware/sanitize');
const resenasController = require('../../controllers/admin/resenas.controller');

router.use(auth);
router.use(sanitize);

router.get('/', resenasController.getAll);
router.patch('/:id/aprobar', resenasController.aprobar);
router.patch('/:id/rechazar', resenasController.rechazar);
router.delete('/:id', resenasController.eliminar);

module.exports = router;
