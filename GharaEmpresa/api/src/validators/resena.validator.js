const { z } = require('zod');

const resenaSchema = z.object({
  idProducto: z.number().int().positive('Producto requerido'),
  aliasAutor: z.string().max(50).optional().default('Anónimo'),
  calificacion: z.number().int().min(1).max(5, 'Calificación entre 1 y 5'),
  comentario: z.string().max(1000).optional().nullable(),
});

module.exports = { resenaSchema };
