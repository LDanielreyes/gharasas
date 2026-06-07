const prisma = require('../../config/database');

/**
 * GET /api/public/recomendaciones
 * Retorna recomendaciones de productos
 * Lógica: Si se pasa un productoId, retorna productos de la misma capacidad y tipo.
 * Si no, retorna los más populares globalmente.
 */
async function getRecomendaciones(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 4;
        const { productoId } = req.query;

        let queryOptions = {
            take: limit,
            where: { activo: true },
            include: {
                marca: { select: { nombre: true } }
            }
        };

        if (productoId) {
            // Recomendación híbrida: Productos similares
            const currentProduct = await prisma.producto.findUnique({
                where: { idProducto: parseInt(productoId) }
            });

            if (currentProduct) {
                queryOptions.where = {
                    activo: true,
                    idProducto: { not: currentProduct.idProducto }, // Excluir el mismo
                    AND: [
                        { capacidadBtu: currentProduct.capacidadBtu },
                        { tipo: currentProduct.tipo }
                    ]
                };
            }
        } else {
            // Recomendación global: Más vistos/vendidos
            queryOptions.orderBy = {
                ratingPromedio: 'desc'
            };
        }

        const recomendados = await prisma.producto.findMany(queryOptions);

        res.json({
            success: true,
            tipo: productoId ? 'similares' : 'globales',
            productos: recomendados
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getRecomendaciones
};
