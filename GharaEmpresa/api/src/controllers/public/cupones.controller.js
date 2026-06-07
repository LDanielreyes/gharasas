const prisma = require('../../config/database');

/**
 * POST /api/public/cupones/validar
 * Validar un cupón antes de aplicarlo.
 * Body: { codigo, subtotal? }
 * Retorna el detalle del descuento sin registrar el uso.
 */
async function validarCupon(req, res, next) {
    try {
        const { codigo, subtotal } = req.body;

        if (!codigo) {
            return res.status(400).json({ success: false, message: 'El código del cupón es obligatorio.' });
        }

        const cupon = await prisma.cupon.findUnique({
            where: { codigo: codigo.toUpperCase() },
        });

        if (!cupon) {
            return res.status(404).json({ success: false, message: 'Cupón no encontrado.' });
        }

        // Verificar si está activo
        if (!cupon.activo) {
            return res.status(410).json({ success: false, message: 'Este cupón ya no está disponible.' });
        }

        // Verificar fechas de vigencia
        const now = new Date();
        if (now < cupon.fechaInicio || now > cupon.fechaExpiracion) {
            return res.status(410).json({ success: false, message: 'Este cupón ha expirado o aún no está vigente.' });
        }

        // Verificar límite de usos
        if (cupon.limiteUsos > 0 && cupon.usosActuales >= cupon.limiteUsos) {
            return res.status(410).json({ success: false, message: 'Este cupón ha alcanzado su límite de usos.' });
        }

        // Verificar mínimo de compra
        const montoSubtotal = parseFloat(subtotal) || 0;
        if (cupon.minimoCompra && montoSubtotal < parseFloat(cupon.minimoCompra)) {
            return res.status(400).json({
                success: false,
                message: `El monto mínimo de compra para este cupón es $${parseFloat(cupon.minimoCompra).toLocaleString()}.`,
            });
        }

        // Calcular el descuento
        let descuento = 0;
        let descripcion = '';

        switch (cupon.tipoDescuento) {
            case 'PORCENTAJE':
                descuento = montoSubtotal * (parseFloat(cupon.valorDescuento) / 100);
                descripcion = `${parseFloat(cupon.valorDescuento)}% de descuento`;
                break;
            case 'VALOR_FIJO':
                descuento = Math.min(parseFloat(cupon.valorDescuento), montoSubtotal);
                descripcion = `$${parseFloat(cupon.valorDescuento).toLocaleString()} de descuento`;
                break;
            case 'ENVIO_GRATIS':
                descuento = 0; // El envío se calcula aparte
                descripcion = 'Envío gratis';
                break;
            default:
                break;
        }

        res.json({
            success: true,
            cupon: {
                codigo: cupon.codigo,
                tipoDescuento: cupon.tipoDescuento,
                descripcion,
                descuento: Math.round(descuento),
                envioGratis: cupon.tipoDescuento === 'ENVIO_GRATIS',
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { validarCupon };
