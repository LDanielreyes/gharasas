const express = require('express');
const router = express.Router();
const { loginLimiter } = require('../../middleware/rateLimiter');
const { sanitize } = require('../../middleware/sanitize');
const { auth } = require('../../middleware/auth');
const authController = require('../../controllers/admin/auth.controller');

router.post('/login', loginLimiter, sanitize, authController.login);
router.get('/me', auth, authController.me);
router.post('/refresh', sanitize, authController.refresh);

module.exports = router;
