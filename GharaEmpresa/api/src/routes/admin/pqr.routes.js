const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const { sanitize } = require('../../middleware/sanitize');
const pqrController = require('../../controllers/admin/pqr.controller');

router.use(auth);
router.use(sanitize);

router.get('/', pqrController.getAll);
router.get('/exportar', pqrController.exportar);
router.patch('/:id/responder', pqrController.responder);

module.exports = router;
