const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const { getFaqs, createFaq, updateFaq, deleteFaq } = require('../../controllers/admin/faq.controller');

router.use(auth);

router.get('/', getFaqs);
router.post('/', createFaq);
router.put('/:id', updateFaq);
router.delete('/:id', deleteFaq);

module.exports = router;
