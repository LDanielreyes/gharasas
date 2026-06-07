module.exports = {
  // Tipos de PQR válidos
  TIPOS_PQR: ['Peticion', 'Queja', 'Reclamo', 'Sugerencia', 'Contacto'],

  // Estados de moderación de reseñas
  ESTADOS_MODERACION: ['Pendiente', 'Aprobado', 'Rechazado'],

  // Estados de inventario
  ESTADOS_INVENTARIO: ['DISPONIBLES', 'AGOTADO', 'PRÓXIMAMENTE', 'DESCONTINUADO'],

  // Estados de venta
  ESTADOS_VENTA: ['COMPLETADA', 'PENDIENTE', 'CANCELADA'],

  // Estados de ticket PQR
  ESTADOS_TICKET: ['Abierto', 'En Proceso', 'Resuelto', 'Cerrado'],

  // Roles de administrador
  ROLES_ADMIN: ['SuperAdmin', 'Administrador', 'Asesor'],

  // Tecnologías de aires acondicionados
  TECNOLOGIAS: ['Inverter', 'Convencional', 'Inverter+'],

  // Caché TTLs (en segundos)
  CACHE_TTL: {
    CATALOGO: 600,    // 10 minutos
    MARCAS: 3600,     // 1 hora
    FAQ: 3600,        // 1 hora
    DETALLE: 600,     // 10 minutos
  },
};
