const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const { getDashboardKpis, getEmbudo, getProductosTop } = require('../../services/analyticsService');

router.use(auth);

router.get('/dashboard', async (req, res, next) => {
  try {
    const kpis = await getDashboardKpis();
    res.json({ success: true, data: kpis });
  } catch (error) {
    next(error);
  }
});

router.get('/embudos', async (req, res, next) => {
  try {
    const { desde, hasta, utmSource } = req.query;
    const embudo = await getEmbudo({ desde, hasta, utmSource });
    res.json({ success: true, data: embudo });
  } catch (error) {
    next(error);
  }
});

router.get('/productos-top', async (req, res, next) => {
  try {
    const { limite } = req.query;
    const top = await getProductosTop(limite ? parseInt(limite) : 10);
    res.json({ success: true, data: top });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
