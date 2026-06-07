const { z } = require('zod');
const { TECNOLOGIAS, ESTADOS_INVENTARIO } = require('../utils/constants');

const createProductoSchema = z.object({
  idMarca: z.number().int().positive('Marca requerida'),
  modelo: z.string().min(1, 'Modelo requerido').max(150),
  tecnologia: z.string().min(1).max(50),
  lineaSerie: z.string().max(100).optional().nullable(),
  capacidadBtu: z.number().int().positive('BTU debe ser positivo'),
  voltaje: z.string().min(1).max(20),
  refrigerante: z.string().max(20).optional().nullable(),
  seer: z.number().positive().optional().nullable(),
  claseEnergetica: z.string().max(5).optional().nullable(),
  tieneWifi: z.boolean().optional().default(false),
  color: z.string().max(30).optional().default('Blanco'),
  precioContado: z.number().positive('Precio debe ser positivo'),
  estadoInventario: z.string().max(50).optional().default('DISPONIBLES'),
  fichaTecnica: z.string().max(255).optional().nullable(),
});

const updateProductoSchema = createProductoSchema.partial();

module.exports = { createProductoSchema, updateProductoSchema };
