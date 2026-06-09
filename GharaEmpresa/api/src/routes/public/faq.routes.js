const express = require('express');
const router = express.Router();
const prisma = require('../../config/database');
const { getOrSet, invalidateFaq, KEYS } = require('../../services/cacheService');
const { CACHE_TTL } = require('../../utils/constants');

// Obtener todas las FAQs publicas
router.get('/', async (req, res, next) => {
  try {
    const faq = await getOrSet(
      KEYS.FAQ,
      () => prisma.preguntaFrecuente.findMany({
        where: { estadoPublicacion: true },
        orderBy: [{ ordenVisualizacion: 'asc' }, { idFaq: 'desc' }],
      }),
      CACHE_TTL.FAQ
    );
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
});

// Registrar un voto util / no util
router.post('/:id/vote', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { type } = req.body; // 'util' or 'no_util'

    if (!['util', 'no_util'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Tipo de voto invalido' });
    }

    const field = type === 'util' ? 'votosUtiles' : 'votosNoUtiles';

    await prisma.preguntaFrecuente.update({
      where: { idFaq: id },
      data: {
        [field]: { increment: 1 }
      }
    });

    // Limpiar caché para que el admin y publico vean los votos actualizados (si se exponen)
    invalidateFaq();

    res.json({ success: true, message: 'Voto registrado' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
