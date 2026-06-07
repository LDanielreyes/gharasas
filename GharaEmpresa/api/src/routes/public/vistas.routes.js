const express = require('express');
const router = express.Router();
const { publicLimiter } = require('../../middleware/rateLimiter');
const vistasController = require('../../controllers/public/vistas.controller');

router.post('/:id', publicLimiter, vistasController.register);

module.exports = router;
