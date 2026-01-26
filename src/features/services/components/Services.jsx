import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ icon, title, features, recommended, index }) => (
    <motion.div
        className={`relative p-8 rounded-[2rem] h-full group cursor-pointer overflow-hidden
            ${recommended
                ? 'bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 shadow-xl scale-105 z-10 border border-blue-100 dark:border-cyan-500/30'
                : 'bg-white dark:bg-black border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/20'
            }
        `}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
            duration: 0.5,
            delay: index * 0.15,
            type: "spring",
            stiffness: 100
        }}
        whileHover={{
            y: -12,
            scale: recommended ? 1.05 : 1.02,
            boxShadow: recommended
                ? "0 30px 60px -12px rgba(6, 182, 212, 0.25)"
                : "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
        }}
    >
        {/* Glow Background Effect */}
        <div className={`absolute -inset-2 bg-gradient-to-r ${recommended ? 'from-cyan-400 to-blue-500' : 'from-slate-200 to-slate-200 dark:from-slate-800 dark:to-slate-800'} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>

        {recommended && (
            <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-lg shadow-cyan-500/20"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                    scale: { delay: 0.5, type: "spring", stiffness: 200 },
                    rotate: { delay: 0.5, type: "spring", stiffness: 200 },
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                Recomendado
            </motion.div>
        )}

        {/* Icon */}
        <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transition-colors duration-300
                ${recommended
                    ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-black shadow-lg shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-white group-hover:bg-blue-50 dark:group-hover:bg-slate-800 group-hover:text-blue-600 dark:group-hover:text-cyan-400'
                }
            `}
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
        >
            <span className="material-symbols-outlined">{icon}</span>
        </motion.div>

        <motion.h3
            className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-6"
            whileHover={{ x: 4, color: recommended ? "#06b6d4" : "#3b82f6" }}
        >
            {title}
        </motion.h3>

        <ul className="space-y-4 relative z-10">
            {features.map((item, idx) => (
                <motion.li
                    key={idx}
                    className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index * 0.15) + (idx * 0.05) }}
                    whileHover={{ x: 6 }}
                >
                    <motion.span
                        className={`material-symbols-outlined text-lg mt-0.5
                            ${recommended ? 'text-cyan-500' : 'text-slate-400 group-hover:text-blue-500 transition-colors'}
                        `}
                        whileHover={{ scale: 1.3, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        check_circle
                    </motion.span>
                    {item}
                </motion.li>
            ))}
        </ul>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 relative z-10">
            <motion.a
                href="#"
                className={`flex items-center gap-2 text-sm font-bold group/link
                    ${recommended ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors'}
                `}
                whileHover={{ gap: "0.75rem" }}
                transition={{ type: "spring", stiffness: 400 }}
            >
                {recommended ? 'Solicitar Plan' : 'Agendar Visita'}
                <motion.span
                    className="material-symbols-outlined text-lg"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    arrow_forward
                </motion.span>
            </motion.a>
        </div>
    </motion.div>
);

const Step = ({ number, title, description, index }) => (
    <motion.div
        className="flex flex-col items-center text-center relative z-10 group"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
        whileHover={{ y: -5 }}
    >
        <motion.div
            className="w-20 h-20 rounded-2xl border-2 border-slate-100 dark:border-white/10 text-slate-300 dark:text-slate-700 font-display font-bold text-3xl flex items-center justify-center mb-6 bg-white dark:bg-black relative z-10 shadow-lg dark:shadow-none transition-all duration-300"
            whileHover={{
                scale: 1.1,
                borderColor: "#3b82f6",
                color: "#3b82f6",
                boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)"
            }}
        >
            {number}
        </motion.div>
        <motion.h4
            className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3"
            whileHover={{ color: "#3b82f6" }}
        >
            {title}
        </motion.h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
            {description}
        </p>
    </motion.div>
);

const Services = () => {
    return (
        <section id="servicios" className="relative bg-white dark:bg-black overflow-hidden py-24 md:py-32">

            {/* Header */}
            <div className="container mx-auto px-4 md:px-6 mb-20 md:mb-32">
                <motion.div
                    className="max-w-3xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.h2
                        className="font-display font-bold text-5xl md:text-6xl text-slate-900 dark:text-white leading-tight mb-6"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Servicios <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 dark:from-white dark:to-cyber-cyan">Especializados</span>
                    </motion.h2>
                    <motion.div
                        className="h-1 w-24 bg-cyan-400 dark:bg-cyber-cyan rounded-full mb-8"
                        initial={{ width: 0 }}
                        whileInView={{ width: "6rem" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    />
                    <motion.p
                        className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        Soluciones integrales de climatización diseñadas para el máximo rendimiento y la pureza de tu ambiente.
                    </motion.p>
                </motion.div>
            </div>

            {/* Services Cards */}
            <div className="container mx-auto px-4 md:px-6 mb-32">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="font-display font-bold text-3xl text-slate-900 dark:text-white uppercase tracking-widest">Nuestros Servicios</h3>
                    <motion.div
                        className="h-0.5 w-12 bg-primary dark:bg-cyber-cyan mx-auto mt-4"
                        initial={{ width: 0 }}
                        whileInView={{ width: "3rem" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    <ServiceCard
                        index={0}
                        icon="build"
                        title="Visita Simple"
                        features={[
                            "Diagnóstico técnico inicial",
                            "Presupuesto detallado",
                            "Asesoría de instalación"
                        ]}
                    />
                    <ServiceCard
                        index={1}
                        icon="security"
                        title="Mantenimiento Preventivo"
                        recommended={true}
                        features={[
                            "Revisión general del equipo",
                            "Limpieza de filtros y componentes",
                            "Verificación de funcionamiento",
                            "Informe de estado del equipo"
                        ]}
                    />
                    <ServiceCard
                        index={2}
                        icon="ac_unit"
                        title="Mantenimiento Correctivo"
                        features={[
                            "Diagnóstico y reparación de fallas",
                            "Reemplazo de piezas y componentes",
                            "Pruebas de funcionamiento",
                            "Precio acorde a requerimientos"
                        ]}
                    />
                </div>
            </div>

            {/* Emergency Banner */}
            <motion.div
                className="w-full bg-primary dark:bg-slate-900 py-12 md:py-16 relative overflow-hidden mb-32"
                initial={{ opacity: 0, scaleY: 0.8 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-[url('/media/pattern.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <motion.div
                        className="flex items-center gap-6"
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.div
                            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="material-symbols-outlined text-3xl">notifications_active</span>
                        </motion.div>
                        <div>
                            <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">Atención de Emergencia 24/7</h3>
                            <p className="text-white/80">¿Tu equipo falló en el peor momento? Estamos listos para ayudarte.</p>
                        </div>
                    </motion.div>
                    <motion.button
                        className="bg-white text-primary font-bold py-4 px-8 rounded-full shadow-lg flex items-center gap-2 group"
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.span
                            className="material-symbols-outlined"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                            call
                        </motion.span>
                        Llamar Ahora
                    </motion.button>
                </div>
            </motion.div>

            {/* Process Steps */}
            <div className="container mx-auto px-4 md:px-6 mb-32">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Proceso de Servicio</h3>
                </motion.div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connecting Line with animation */}
                    <motion.div
                        className="hidden md:block absolute top-[2rem] left-[16%] right-[16%] h-0.5 bg-slate-200 dark:bg-white/10 z-0"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{ transformOrigin: "left" }}
                    />

                    <Step
                        index={0}
                        number="1"
                        title="Agendar"
                        description="Contacta con nosotros y selecciona el horario que mejor te convenga."
                    />
                    <Step
                        index={1}
                        number="2"
                        title="Inspeccionar"
                        description="Nuestro técnico certificado realiza un diagnóstico completo in situ."
                    />
                    <Step
                        index={2}
                        number="3"
                        title="Solucionar"
                        description="Ejecutamos el mantenimiento o reparación garantizando el funcionamiento."
                    />
                </div>
            </div>

            {/* Final CTA */}
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    className="bg-slate-50 dark:bg-surface-dark rounded-[3rem] p-12 md:p-24 text-center shadow-inner relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative z-10">
                        <motion.h2
                            className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-6"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            ¿Listo para mejorar tu ambiente?
                        </motion.h2>
                        <motion.p
                            className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            No dejes el confort de tu hogar o empresa en manos inexpertas. Agenda hoy mismo con Ghara.
                        </motion.p>
                        <motion.button
                            className="bg-primary dark:bg-transparent dark:border-2 dark:border-cyber-cyan text-white dark:text-cyber-cyan font-bold py-4 px-10 rounded-full relative overflow-hidden group"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.span
                                className="absolute inset-0 bg-secondary dark:bg-cyber-cyan"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10">Solicitar Servicio Ahora</span>
                        </motion.button>
                    </div>
                </motion.div>
            </div>

        </section>
    );
};

export default Services;
