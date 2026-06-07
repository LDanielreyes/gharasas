const express = require('express');
const router = express.Router();
const sitemapController = require('../../controllers/public/sitemap.controller');

router.get('/', sitemapController.generateSitemap);

module.exports = router;
