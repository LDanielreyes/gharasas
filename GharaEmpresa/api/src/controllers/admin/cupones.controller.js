const prisma = require('../../config/database');
const logger = require('../../config/logger');

/**
 * GET /api/admin/cupones
 * Listar todos los cupones
 */
async function getAll(req, res, next) {
    try {
        const cupones = await prisma.cupon.findMany({
            include: { _count: { select: { usos: true } } },
            orderBy: { fechaCreacion: 'desc' },
        });
        res.json({ success: true, cupones });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/admin/cupones
 * Crear un cupón
 */
async function create(req, res, next) {
    try {
        const { codigo, tipoDescuento, valorDescuento, minimoCompra, limiteUsos, fechaInicio, fechaExpiracion } = req.body;

        if (!codigo || !tipoDescuento || valorDescuento === undefined || !fechaInicio || !fechaExpiracion) {
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios: codigo, tipoDescuento, valorDescuento, fechaInicio, fechaExpiracion.' });
        }

        const tipos = ['PORCENTAJE', 'VALOR_FIJO', 'ENVIO_GRATIS'];
        if (!tipos.includes(tipoDescuento)) {
            return res.status(400).json({ success: false, message: `tipoDescuento inválido. Opciones: ${tipos.join(', ')}` });
        }

        // Validar que el código no exista
        const existing = await prisma.cupon.findUnique({ where: { codigo: codigo.toUpperCase() } });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe un cupón con ese código.' });
        }

        const cupon = await prisma.cupon.create({
            data: {
                codigo: codigo.toUpperCase(),
                tipoDescuento,
                valorDescuento: parseFloat(valorDescuento),
                minimoCompra: minimoCompra ? parseFloat(minimoCompra) : null,
                limiteUsos: parseInt(limiteUsos) || 0,
                fechaInicio: new Date(fechaInicio),
                fechaExpiracion: new Date(fechaExpiracion),
                activo: true,
            },
        });

        logger.info(`Cupón creado: ${codigo}`, { adminId: req.admin?.idAdmin });
        res.status(201).json({ success: true, cupon });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/admin/cupones/:id
 * Actualizar un cupón
 */
async function update(req, res, next) {
    try {
        const { id } = req.params;
        const { codigo, tipoDescuento, valorDescuento, minimoCompra, limiteUsos, fechaInicio, fechaExpiracion, activo } = req.body;

        const data = {};
        if (codigo !== undefined) data.codigo = codigo.toUpperCase();
        if (tipoDescuento !== undefined) data.tipoDescuento = tipoDescuento;
        if (valorDescuento !== undefined) data.valorDescuento = parseFloat(valorDescuento);
        if (minimoCompra !== undefined) data.minimoCompra = minimoCompra ? parseFloat(minimoCompra) : null;
        if (limiteUsos !== undefined) data.limiteUsos = parseInt(limiteUsos);
        if (fechaInicio !== undefined) data.fechaInicio = new Date(fechaInicio);
        if (fechaExpiracion !== undefined) data.fechaExpiracion = new Date(fechaExpiracion);
        if (activo !== undefined) data.activo = activo === true || activo === 'true';

        const cupon = await prisma.cupon.update({
            where: { idCupon: parseInt(id) },
            data,
        });

        logger.info(`Cupón actualizado: ${id}`, { adminId: req.admin?.idAdmin });
        res.json({ success: true, cupon });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/admin/cupones/:id
 */
async function remove(req, res, next) {
    try {
        const { id } = req.params;
        await prisma.cupon.delete({ where: { idCupon: parseInt(id) } });

        logger.info(`Cupón eliminado: ${id}`, { adminId: req.admin?.idAdmin });
        res.json({ success: true, message: 'Cupón eliminado.' });
    } catch (error) {
        next(error);
    }
}

module.exports = { getAll, create, update, remove };
