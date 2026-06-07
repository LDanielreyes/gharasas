const prisma = require('../../config/database');
const logger = require('../../config/logger');

/**
 * POST /api/leads — Registrar cotización WhatsApp con datos del cliente
 */
async function create(req, res, next) {
  try {
    const {
      idProducto,
      nombreCliente,
      telefono,
      email,
      canalContacto,
      productosInteres,
      utmSource,
      utmMedium,
      utmCampaign,
    } = req.body;

    const lead = await prisma.leadContacto.create({
      data: {
        idProducto: idProducto ? parseInt(idProducto) : null,
        nombreCliente: nombreCliente || null,
        telefono: telefono || null,
        email: email || null,
        canalContacto: canalContacto || 'WhatsApp_Catalogo',
        productosInteres: productosInteres || null,
        estadoLead: 'NUEVO',
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
      },
    });

    logger.info(`Lead registrado: ${lead.idLead} - ${nombreCliente || 'Anónimo'}`, {
      service: 'leads',
    });

    res.status(201).json({ success: true, data: { idLead: lead.idLead } });
  } catch (error) {
    next(error);
  }
}

module.exports = { create };
