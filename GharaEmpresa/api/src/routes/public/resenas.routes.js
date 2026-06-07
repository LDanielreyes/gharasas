const express = require('express');
const router = express.Router();
const { formLimiter } = require('../../middleware/rateLimiter');
const { sanitize } = require('../../middleware/sanitize');
const { verifyTurnstile } = require('../../middleware/turnstile');
const resenasController = require('../../controllers/public/resenas.controller');

router.post('/', formLimiter, sanitize, verifyTurnstile, resenasController.create);

module.exports = router;
