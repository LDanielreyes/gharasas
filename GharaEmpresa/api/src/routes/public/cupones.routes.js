const router = require('express').Router();
const { publicLimiter } = require('../../middleware/rateLimiter');
const ctrl = require('../../controllers/public/cupones.controller');

router.post('/validar', publicLimiter, ctrl.validarCupon);

module.exports = router;
