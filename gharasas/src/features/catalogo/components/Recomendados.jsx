import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../../../shared/api/client';

// Componente Skeleton para Loading
const ProductSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-t-2xl"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="flex gap-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
            </div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mt-4"></div>
        </div>
    </div>
);

const Recomendados = ({ currentProductId = null, limit = 4 }) => {
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecomendaciones = async () => {
            setIsLoading(true);
            try {
                // Endpoint sugerido en el contrato
                const params = currentProductId ? { productoId: currentProductId, limit } : { limit };
                const res = await client.get('/public/recomendaciones', { params });
                
                if (res.data.success && res.data.productos) {
                    setRecomendaciones(res.data.productos);
                }
            } catch (error) {
                console.error("Error cargando recomendaciones", error);
                // Graceful degradation: no mostrar nada si falla
                setRecomendaciones([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecomendaciones();
    }, [currentProductId, limit]);

    if (!isLoading && recomendaciones.length === 0) return null;

    return (
        <section className="py-12 border-t border-slate-200 dark:border-white/10 mt-12">
            <div className="flex items-center gap-2 mb-8">
                <span className="material-symbols-outlined text-primary dark:text-cyber-cyan text-2xl">recommend</span>
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                    {currentProductId ? 'Equipos Similares' : 'Recomendados para ti'}
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {isLoading ? (
                        Array(limit).fill(0).map((_, i) => <ProductSkeleton key={`skel-${i}`} />)
                    ) : (
                        recomendaciones.map((prod, idx) => (
                            <motion.div
                                key={prod.idProducto || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                                onClick={() => window.location.href = `/catalogo/${prod.idProducto}`}
                            >
                                <div className="h-48 bg-slate-50 dark:bg-black p-6 flex items-center justify-center">
                                    <img 
                                        src={prod.imagenPrincipal || '/media/placeholder.png'} 
                                        alt={prod.modelo} 
                                        className="max-h-full object-contain group-hover:scale-110 transition-transform"
                                    />
                                </div>
                                <div className="p-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{prod.marca?.nombre}</span>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{prod.modelo}</h4>
                                    <div className="flex justify-between items-end mt-4">
                                        <p className="font-bold text-primary dark:text-cyber-cyan">
                                            ${parseFloat(prod.precioContado || 0).toLocaleString()}
                                        </p>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Recomendados;
