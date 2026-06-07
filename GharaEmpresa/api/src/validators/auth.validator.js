const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(12, 'Contraseña debe tener al menos 12 caracteres'),
});

module.exports = { loginSchema };
