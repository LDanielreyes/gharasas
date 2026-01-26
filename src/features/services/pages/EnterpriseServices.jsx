import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div>
            <h4 className="font-bold text-white text-base">{title}</h4>
            <p className="text-blue-100 text-xs">{desc}</p>
        </div>
    </div>
);

const BenefitItem = ({ icon, title, desc, delay }) => (
    <motion.div
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-lg border border-slate-50 dark:border-white/5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5 }}
    >
        <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-6">
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

const ServiceCard = ({ icon, title, features, linkText, isEssencial, index }) => (
    <motion.div
        className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-white/5 relative flex flex-col h-full group"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -8 }}
    >
        {isEssencial && (
            <span className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Corporativo
            </span>
        )}

        <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white dark:text-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-slate-500/20">
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>

        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6 pr-8 leading-tight">
            {title}
        </h3>

        <ul className="space-y-3 mb-8 flex-grow">
            {features.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                    <span className="material-symbols-outlined text-blue-500 text-base mt-0.5">check_circle</span>
                    {item}
                </li>
            ))}
        </ul>

        <a href="#" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm group-hover:gap-3 transition-all hover:text-blue-600 dark:hover:text-cyan-400">
            {linkText}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </a>
    </motion.div>
);

const EnterpriseServices = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-black min-h-screen font-body w-full overflow-x-hidden">

            {/* Hero Section with Image Background */}
            <div className="relative h-[600px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
                        alt="Infraestructura moderna de edificio corporativo"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
                    <motion.div
                        className="max-w-3xl"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-display font-bold text-5xl md:text-6xl text-white leading-tight mb-6">
                            Servicios Empresariales: <br />
                            Potencia y <span className="text-blue-500">Eficiencia</span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-xl mb-8 border-l-4 border-blue-500 pl-6">
                            Garantizamos la continuidad operativa de tu infraestructura crítica con soluciones de climatización industrial de alto nivel.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Nuestros Servicios Grid */}
            <div className="container mx-auto px-4 md:px-6 py-24 relative z-20 -mt-20">
                <div className="text-center mb-16">
                    <h2 className="text-slate-500 dark:text-cyan-400 font-bold tracking-widest uppercase mb-2">Infraestructura Crítica</h2>
                    <h3 className="font-display font-bold text-4xl text-slate-900 dark:text-white">SOLUCIONES CORPORATIVAS</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ServiceCard
                        index={0}
                        icon="factory"
                        title="Mantenimiento Industrial"
                        features={["Protocolos ISO", "Gestión de activos", "Informes técnicos detallados"]}
                        linkText="Gestionar Contrato"
                    />
                    <ServiceCard
                        index={1}
                        icon="hub"
                        title="Proyectos VRF y Chillers"
                        features={["Diseño de ingeniería", "Instalación certificada", "Puesta en marcha"]}
                        linkText="Cotizar Proyecto"
                    />
                    <ServiceCard
                        index={2}
                        icon="air"
                        title="Sistemas de Ventilación"
                        features={["Extracción industrial", "Filtrado HEPA", "Calidad de aire interior"]}
                        linkText="Ver Soluciones"
                    />
                    <ServiceCard
                        index={3}
                        icon="query_stats"
                        title="Auditoría Energética"
                        isEssencial={true}
                        features={["Análisis de consumo", "Optimización ROI", "Automatización BMS"]}
                        linkText="Solicitar Auditoría"
                    />
                </div>
            </div>

            {/* Trust Strip */}
            <div className="bg-slate-900 py-12 border-y border-white/5 shadow-inner">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureItem
                            icon="verified"
                            title="Certificación Técnica"
                            desc="Personal acreditado en normas de seguridad industrial."
                        />
                        <FeatureItem
                            icon="support_agent"
                            title="Soporte 24/7"
                            desc="Atención prioritaria para emergencias operativas."
                        />
                        <FeatureItem
                            icon="engineering"
                            title="Ingeniería de Valor"
                            desc="Optimizamos costos sin sacrificar rendimiento."
                        />
                    </div>
                </div>
            </div>

            {/* Strategic Value Section */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-4">Estrategia Operativa</h2>
                        <p className="text-slate-500 dark:text-slate-400">Maximizamos el ciclo de vida de tus activos fijos mediante planes preventivos inteligentes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BenefitItem
                            index={0}
                            icon="rule"
                            title="Continuidad Operativa"
                            desc="Minimiza tiempos de inactividad no planificados (downtime)."
                            delay={0.1}
                        />
                        <BenefitItem
                            index={1}
                            icon="trending_down"
                            title="Reducción de Costos"
                            desc="Menor consumo energético y menos reparaciones correctivas mayores."
                            delay={0.2}
                        />
                        <BenefitItem
                            index={2}
                            icon="gavel"
                            title="Cumplimiento Normativo"
                            desc="Adherencia a normas ambientales y de seguridad laboral vigentes."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <div className="pb-24 pt-10">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        className="bg-slate-900 dark:bg-surface-dark rounded-[3rem] p-12 md:p-20 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        <div className="relative z-10">
                            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-6">¿Buscas un aliado estratégico?</h2>
                            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
                                Eleva el estándar de tu infraestructura. Agenda una reunión con nuestros ingenieros especialistas.
                            </p>

                            <motion.button
                                className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-10 rounded-full shadow-xl flex items-center justify-center gap-3 mx-auto transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open('https://wa.me/573022326569', '_blank')}
                            >
                                <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                                Cotizar Proyecto
                            </motion.button>
                            <p className="mt-4 text-xs text-slate-500">Atención personalizada para empresas</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseServices;
