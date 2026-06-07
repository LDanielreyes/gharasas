const express = require('express');
const router = express.Router();
const { formLimiter } = require('../../middleware/rateLimiter');
const { sanitize } = require('../../middleware/sanitize');
const { verifyTurnstile } = require('../../middleware/turnstile');
const pqrController = require('../../controllers/public/pqr.controller');

router.post('/', formLimiter, sanitize, verifyTurnstile, pqrController.create);

module.exports = router;
