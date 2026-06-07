const express = require('express');
const router = express.Router();
const { publicLimiter } = require('../../middleware/rateLimiter');
const { sanitize } = require('../../middleware/sanitize');
const productosController = require('../../controllers/public/productos.controller');

router.use(publicLimiter);
router.use(sanitize);

router.get('/', productosController.getAll);
router.get('/:id', productosController.getById);

module.exports = router;
