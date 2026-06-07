const router = require('express').Router();
const { auth, authorize } = require('../../middleware/auth');
const { validateId } = require('../../middleware/validateId');
const ctrl = require('../../controllers/admin/cupones.controller');

// Todas las rutas requieren autenticación y rol Admin
router.use(auth, authorize('SuperAdmin', 'Administrador'));

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', validateId, ctrl.update);
router.delete('/:id', validateId, ctrl.remove);

module.exports = router;
