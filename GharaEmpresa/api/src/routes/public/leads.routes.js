const express = require('express');
const router = express.Router();
const { publicLimiter } = require('../../middleware/rateLimiter');
const { sanitize } = require('../../middleware/sanitize');
const leadsController = require('../../controllers/public/leads.controller');

router.post('/', publicLimiter, sanitize, leadsController.create);

module.exports = router;
