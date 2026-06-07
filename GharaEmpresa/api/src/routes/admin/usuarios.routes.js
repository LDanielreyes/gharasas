const express = require('express');
const router = express.Router();
const adminUsuariosController = require('../../controllers/admin/usuarios.controller');
const { auth } = require('../../middleware/auth');

router.use(auth);

// Perfil propio (debe ir ANTES de /:id para que Express no lo confunda)
router.put('/me/perfil', adminUsuariosController.updatePerfil);

// CRUD (solo SuperAdmin)
router.get('/', adminUsuariosController.getAll);
router.post('/', adminUsuariosController.create);
router.put('/:id', adminUsuariosController.update);
router.delete('/:id', adminUsuariosController.delete);

module.exports = router;
