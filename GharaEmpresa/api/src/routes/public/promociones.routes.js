const router = require('express').Router();
const { publicLimiter } = require('../../middleware/rateLimiter');
const ctrl = require('../../controllers/public/promociones.controller');

router.get('/', publicLimiter, ctrl.getActivePromociones);

module.exports = router;
