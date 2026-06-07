const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const prisma = require('../../config/database');

router.use(auth);

// GET /api/admin/marcas — Listar todas las marcas
router.get('/', async (req, res, next) => {
  try {
    const marcas = await prisma.marca.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json({ success: true, data: marcas });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/marcas — Crear marca (solo SuperAdmin/Administrador)
router.post('/', authorize('SuperAdmin', 'Administrador'), async (req, res, next) => {
  try {
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ success: false, message: 'Nombre de marca requerido.' });
    }
    const marca = await prisma.marca.create({
      data: { nombre: nombre.trim().toUpperCase() },
    });
    res.status(201).json({ success: true, data: marca });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Esa marca ya existe.' });
    }
    next(error);
  }
});

module.exports = router;
