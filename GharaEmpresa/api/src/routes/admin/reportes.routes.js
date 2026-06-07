const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const reportesController = require('../../controllers/admin/reportes.controller');

router.use(auth);
router.use(authorize('SuperAdmin', 'Administrador'));

router.get('/',                           reportesController.getReporte);
router.get('/ventas-diarias',             reportesController.getVentasDiarias);
router.get('/ticket-promedio',            reportesController.getTicketPromedio);
router.get('/sparkline/:productoId',      reportesController.getSparklineProducto);

module.exports = router;
