const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const logger = require('../../config/logger');

const prisma = new PrismaClient();

const createUsuarioSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(12, "La contraseña debe tener al menos 12 caracteres"),
  rol: z.enum(["SuperAdmin", "Administrador", "Asesor"]).default("Asesor")
});

const updateUsuarioSchema = z.object({
  nombre: z.string().min(3).optional(),
  email: z.string().email().optional(),
  rol: z.enum(["SuperAdmin", "Administrador", "Asesor"]).optional(),
  password: z.string().min(12).optional()
});

const updatePerfilSchema = z.object({
  nombre: z.string().min(3).optional(),
  password: z.string().min(12).optional(),
  currentPassword: z.string().optional()
});

const adminUsuariosController = {
  getAll: async (req, res, next) => {
    try {
      if (req.admin.rol !== 'SuperAdmin') {
        return res.status(403).json({ message: "No tienes permisos para ver los usuarios administradores." });
      }

      const usuarios = await prisma.adminUsuario.findMany({
        select: {
          idAdmin: true,
          nombre: true,
          email: true,
          rol: true
        },
        orderBy: { idAdmin: 'asc' }
      });
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      if (req.admin.rol !== 'SuperAdmin') {
        return res.status(403).json({ message: "No tienes permisos para crear usuarios." });
      }

      const validData = createUsuarioSchema.parse(req.body);

      const existente = await prisma.adminUsuario.findUnique({
        where: { email: validData.email }
      });

      if (existente) {
        return res.status(400).json({ message: "El correo ya está registrado." });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(validData.password, salt);

      const nuevoUsuario = await prisma.adminUsuario.create({
        data: {
          nombre: validData.nombre,
          email: validData.email,
          rol: validData.rol,
          passwordHash
        },
        select: { idAdmin: true, nombre: true, email: true, rol: true }
      });

      logger.info(`Nuevo administrador creado: ${nuevoUsuario.email}`, { service: 'ghara-api', adminId: req.admin.idAdmin });
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      if (req.admin.rol !== 'SuperAdmin') {
        return res.status(403).json({ message: "No tienes permisos para editar usuarios." });
      }

      const idAdmin = parseInt(req.params.id);
      const validData = updateUsuarioSchema.parse(req.body);

      if (validData.email) {
        const existente = await prisma.adminUsuario.findUnique({ where: { email: validData.email } });
        if (existente && existente.idAdmin !== idAdmin) {
          return res.status(400).json({ message: "El correo ya está registrado." });
        }
      }

      const dataToUpdate = { ...validData };
      if (dataToUpdate.password) {
        const salt = await bcrypt.genSalt(10);
        dataToUpdate.passwordHash = await bcrypt.hash(dataToUpdate.password, salt);
        delete dataToUpdate.password;
      }

      const usuarioActualizado = await prisma.adminUsuario.update({
        where: { idAdmin },
        data: dataToUpdate,
        select: { idAdmin: true, nombre: true, email: true, rol: true }
      });

      logger.info(`Administrador actualizado: ${idAdmin}`, { service: 'ghara-api', adminId: req.admin.idAdmin });
      res.json(usuarioActualizado);
    } catch (error) {
      next(error);
    }
  },

  updatePerfil: async (req, res, next) => {
    try {
      const idAdmin = req.admin.idAdmin;
      const validData = updatePerfilSchema.parse(req.body);

      const usuarioActual = await prisma.adminUsuario.findUnique({ where: { idAdmin } });

      const dataToUpdate = {};
      if (validData.nombre) dataToUpdate.nombre = validData.nombre;

      if (validData.password) {
        if (!validData.currentPassword) {
          return res.status(400).json({ message: "Debes ingresar tu contraseña actual para cambiarla." });
        }
        
        const isMatch = await bcrypt.compare(validData.currentPassword, usuarioActual.passwordHash);
        if (!isMatch) {
          return res.status(400).json({ message: "La contraseña actual es incorrecta." });
        }

        const salt = await bcrypt.genSalt(10);
        dataToUpdate.passwordHash = await bcrypt.hash(validData.password, salt);
      }

      if (Object.keys(dataToUpdate).length === 0) {
        return res.json({ message: "No hay cambios." });
      }

      const usuarioActualizado = await prisma.adminUsuario.update({
        where: { idAdmin },
        data: dataToUpdate,
        select: { idAdmin: true, nombre: true, email: true, rol: true }
      });

      res.json(usuarioActualizado);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      if (req.admin.rol !== 'SuperAdmin') {
        return res.status(403).json({ message: "No tienes permisos para eliminar usuarios." });
      }

      const idAdmin = parseInt(req.params.id);
      if (idAdmin === req.admin.idAdmin) {
        return res.status(400).json({ message: "No puedes eliminar tu cuenta." });
      }

      await prisma.adminUsuario.delete({ where: { idAdmin } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminUsuariosController;
