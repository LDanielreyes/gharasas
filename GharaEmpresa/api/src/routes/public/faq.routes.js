const express = require('express');
const router = express.Router();
const prisma = require('../../config/database');
const { getOrSet, KEYS } = require('../../services/cacheService');
const { CACHE_TTL } = require('../../utils/constants');

router.get('/', async (req, res, next) => {
  try {
    const faq = await getOrSet(
      KEYS.FAQ,
      () => prisma.preguntaFrecuente.findMany({
        where: { estadoPublicacion: true },
        orderBy: { ordenVisualizacion: 'asc' },
      }),
      CACHE_TTL.FAQ
    );
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
