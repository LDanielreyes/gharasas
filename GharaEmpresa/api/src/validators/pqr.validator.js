const { z } = require('zod');
const { TIPOS_PQR } = require('../utils/constants');

const pqrSchema = z.object({
  tipoSolicitud: z.enum(TIPOS_PQR, { message: 'Tipo de solicitud inválido' }),
  nombreRemitente: z.string().min(2, 'Nombre requerido').max(150),
  emailRemitente: z.string().email('Email inválido').max(150),
  telefonoRemitente: z.string().min(7, 'Teléfono requerido').max(20),
  asunto: z.string().min(3, 'Asunto requerido').max(150),
  mensaje: z.string().min(10, 'Mensaje debe tener al menos 10 caracteres').max(5000),
  idVenta: z.number().int().positive().optional().nullable(),
  aceptoHabeasData: z.literal(true, {
    errorMap: () => ({ message: 'Debe aceptar la política de tratamiento de datos personales' }),
  }),
});

module.exports = { pqrSchema };
