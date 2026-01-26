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
            <span className="absolute top-6 right-6 bg-cyan-400 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Esencial
            </span>
        )}

        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>

        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6 pr-8 leading-tight">
            {title}
        </h3>

        <ul className="space-y-3 mb-8 flex-grow">
            {features.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                    <span className="material-symbols-outlined text-cyan-500 text-base mt-0.5">check_circle</span>
                    {item}
                </li>
            ))}
        </ul>

        <a href="#" className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold text-sm group-hover:gap-3 transition-all">
            {linkText}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </a>
    </motion.div>
);

const ResidentialServices = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-black min-h-screen font-body w-full overflow-x-hidden">

            {/* Hero Section with Image Background */}
            <div className="relative h-[600px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop"
                        alt="Familia feliz en sala con aire acondicionado"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
                    <motion.div
                        className="max-w-2xl"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-display font-bold text-5xl md:text-6xl text-white leading-tight mb-6">
                            Servicios Residenciales: <br />
                            Confort para tu <span className="text-cyan-400">Hogar</span>
                        </h1>
                        <p className="text-slate-200 text-lg md:text-xl leading-relaxed max-w-xl mb-8 border-l-4 border-cyan-400 pl-6">
                            Especialistas en climatización residencial. Cuidamos tu bienestar y el de tu familia con soluciones integrales de enfriamiento.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Nuestros Servicios Grid */}
            <div className="container mx-auto px-4 md:px-6 py-24 relative z-20 -mt-20">
                <div className="text-center mb-16">
                    <h2 className="text-blue-600 dark:text-cyan-400 font-bold tracking-widest uppercase mb-2">Soluciones Profesionales</h2>
                    <h3 className="font-display font-bold text-4xl text-slate-900 dark:text-white">NUESTROS SERVICIOS</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ServiceCard
                        index={0}
                        icon="mode_fan"
                        title="Suministro de equipos Mini Split y Cortinas"
                        features={["Marcas líderes del mercado", "Asesoría en dimensionamiento", "Garantía directa"]}
                        linkText="Cotizar Equipo"
                    />
                    <ServiceCard
                        index={1}
                        icon="build"
                        title="Instalación Profesional Certificada"
                        features={["Técnicos certificados", "Uso de materiales de primera", "Respeto por la estética"]}
                        linkText="Agendar Instalación"
                    />
                    <ServiceCard
                        index={2}
                        icon="shield"
                        title="Mantenimiento Preventivo"
                        isEssencial={true}
                        features={["Evita pérdida de capacidad", "Limpieza profunda", "Eliminación de bacterias"]}
                        linkText="Programar Mantenimiento"
                    />
                    <ServiceCard
                        index={3}
                        icon="bolt"
                        title="Reparación y Carga de Gas"
                        features={["Diagnóstico técnico preciso", "Recarga de refrigerante", "Soluciones rápidas"]}
                        linkText="Solicitar Revisión"
                    />
                </div>
            </div>

            {/* Trust Strip */}
            <div className="bg-[#0f3c64] py-12 border-y border-white/10 shadow-inner">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureItem
                            icon="verified_user"
                            title="Técnicos de Confianza"
                            desc="Personal verificado para tu seguridad."
                        />
                        <FeatureItem
                            icon="cleaning_services"
                            title="Cuidado de tus espacios"
                            desc="Usamos cobertores y dejamos impecable."
                        />
                        <FeatureItem
                            icon="manage_search"
                            title="Diagnóstico Exacto"
                            desc="Solo lo que tu equipo necesita."
                        />
                    </div>
                </div>
            </div>

            {/* Well-being Section */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-4">Tu Bienestar es Primero</h2>
                        <p className="text-slate-500 dark:text-slate-400">Diseñamos nuestros servicios para maximizar el confort en tu hogar, garantizando un ambiente saludable y eficiente.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BenefitItem
                            index={0}
                            icon="volume_off"
                            title="Silencio Absoluto"
                            desc="Mantenimiento enfocado en reducir ruidos molestos para un descanso perfecto."
                            delay={0.1}
                        />
                        <BenefitItem
                            index={1}
                            icon="air"
                            title="Aire Puro"
                            desc="Eliminamos alérgenos y polvo para proteger la salud respiratoria de tu familia."
                            delay={0.2}
                        />
                        <BenefitItem
                            index={2}
                            icon="savings"
                            title="Ahorro de Energía"
                            desc="Equipos optimizados que consumen menos electricidad, cuidando tu economía."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <div className="pb-24 pt-10">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        className="bg-slate-50 dark:bg-surface-dark rounded-[3rem] p-12 md:p-20 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        <div className="relative z-10">
                            <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 dark:text-white mb-6">¿Listo para un hogar más fresco?</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                                No dejes el confort de tu hogar en manos inexpertas. Agenda hoy mismo con Ghara y siente la diferencia.
                            </p>

                            <motion.button
                                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 mx-auto transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open('https://wa.me/573022326569', '_blank')}
                            >
                                <span className="material-symbols-outlined text-2xl">chat</span>
                                Agendar Servicio Hogar
                            </motion.button>
                            <p className="mt-4 text-xs text-slate-400">Respuesta rápida vía WhatsApp</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ResidentialServices;
