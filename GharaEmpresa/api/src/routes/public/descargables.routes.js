const express = require('express');
const router = express.Router();
const descargablesController = require('../../controllers/admin/descargables.controller');

// GET público de descargables
router.get('/', descargablesController.getAll);

module.exports = router;
