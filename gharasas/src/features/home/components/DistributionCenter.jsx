import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DistributionCenter = () => {
    const navigate = useNavigate();

    return (
        <section id="aliados" className="bg-background-light dark:bg-background-dark py-24">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ scale: 0.97 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                    className="relative h-[280px] sm:h-[380px] md:h-[500px] rounded-3xl overflow-hidden group shadow-2xl cursor-pointer"
                    onClick={() => navigate('/aliados?tab=distribuidores')}
                >
                    <div className="absolute inset-0">
                        <img
                            src="/media/centro-de-distribucion.webp"
                            alt="Modern warehouse distribution center"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-900/50 group-hover:bg-slate-900/40 transition-colors duration-500"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <span
                            className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6 backdrop-blur-sm"
                        >
                            Networking
                        </span>
                        <h3
                            className="font-display font-bold text-2xl sm:text-4xl md:text-6xl text-white mb-4"
                        >
                            Centro de Distribución
                        </h3>
                        <p
                            className="text-slate-200 text-sm sm:text-base md:text-xl max-w-2xl mb-6 hidden sm:block"
                        >
                            Únete a nuestra red de instaladores y distribuidores certificados para acceder a precios exclusivos.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/aliados?tab=distribuidores');
                            }}
                            className="bg-white/90 backdrop-blur-md text-slate-900 hover:bg-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg transition-all shadow-2xl border border-white/50"
                        >
                            Acceso Aliados
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DistributionCenter;

