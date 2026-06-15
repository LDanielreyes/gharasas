import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OurApproaches = () => {
    const navigate = useNavigate();

    return (
        <section id="servicios" className="py-16 md:py-32 bg-surface-light dark:bg-surface-dark overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-10 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="font-display font-bold text-3xl md:text-5xl text-[#0C4D89]"
                    >
                        Nuestros Enfoques
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-600 dark:text-slate-400 font-body text-xl max-w-2xl"
                    >
                        Instalación profesional y mantenimiento preventivo para todo tipo de infraestructuras.
                    </motion.p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                        whileHover={{ y: -10 }}
                        onClick={() => navigate('/servicios/residenciales')}
                        className="group relative h-[360px] sm:h-[500px] lg:h-[700px] w-full lg:w-[110%] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer z-10 lg:hover:z-30 transition-all duration-500"
                    >
                        <div className="absolute inset-0">
                            <img
                                src="/media/tecnico-instalando-unidad-split.webp"
                                alt="Technician installing wall unit"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 p-6 md:p-10 lg:p-14 w-full">
                            <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3">Para Vivienda</h3>
                            <p className="text-slate-200 text-lg mb-8 max-w-md">Instalación y reparación de unidades split y compactas.</p>
                            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-white group-hover:text-primary transition-all duration-300">
                                <span className="material-symbols-outlined text-2xl">arrow_outward</span>
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                        whileHover={{ y: -10 }}
                        onClick={() => navigate('/servicios/empresariales')}
                        className="group relative h-[360px] sm:h-[500px] lg:h-[700px] w-full lg:w-[110%] lg:-ml-[10%] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer z-20 mt-8 lg:mt-24"
                    >
                        <div className="absolute inset-0">
                            <img
                                src="/media/aire-industrial.webp"
                                alt="Large commercial rooftop unit technician working"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 p-6 md:p-10 lg:p-14 w-full">
                            <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3">Para Empresa</h3>
                            <p className="text-slate-200 text-lg mb-8 max-w-md">Mantenimiento de sistemas industriales y VRF complex HVAC.</p>
                            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-white group-hover:text-primary transition-all duration-300">
                                <span className="material-symbols-outlined text-2xl">arrow_outward</span>
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default OurApproaches;

