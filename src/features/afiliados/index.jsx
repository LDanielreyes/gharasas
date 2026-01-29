import React, { useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ScrollReveal from '../../shared/components/ui/ScrollReveal';

const BenefitCard = ({ icon, title, description, index }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl hover:shadow-lg transition-all duration-300 group border border-slate-100 dark:border-white/5"
        >
            <motion.div
                className="w-14 h-14 bg-white dark:bg-black rounded-2xl flex items-center justify-center text-primary dark:text-cyber-cyan shadow-sm mb-6 group-hover:scale-110 transition-transform"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
            >
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </motion.div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
        </motion.div>
    );
};



const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-white/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-cyber-cyan transition-colors">
                    {question}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
                <p className="pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const AfiliadosPage = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('tecnicos');
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Helper to determine active theme color for modal/button
    const activeColorClass = activeTab === 'tecnicos' ? 'from-primary to-cyan-400' : 'from-cyan-500 to-blue-600';

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'distribuidores') {
            setActiveTab('distribuidores');
        } else if (tabParam === 'tecnicos') {
            setActiveTab('tecnicos');
        }
    }, [searchParams]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">

            {/* Tab Navigation */}
            {/* Tab Navigation Removed - Using Navbar Dropdown instead */}

            {/* Hero Section - Services Style */}
            <section className="relative h-[600px] flex items-center overflow-hidden">
                {/* Background Images with Transition */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={activeTab === 'tecnicos'
                                    ? "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2069&auto=format&fit=crop"
                                    : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
                                }
                                alt={activeTab === 'tecnicos' ? "Técnico trabajando" : "Almacén de distribución"}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
                    <div className="max-w-3xl">

                        {/* Badge */}
                        <motion.div
                            key={`badge-${activeTab}`}
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0 }}
                            className="mb-6"
                        >
                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-white bg-gradient-to-r ${activeColorClass}`}>
                                {activeTab === 'tecnicos' ? 'Red de Técnicos 2026' : 'Red de Distribuidores 2026'}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            key={`title-${activeTab}`}
                            className="font-display font-bold text-5xl md:text-7xl text-white leading-tight mb-6"
                            initial={{ opacity: 1, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0 }}
                        >
                            {activeTab === 'tecnicos' ? (
                                <>
                                    Únete como <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Técnico Certificado</span>
                                </>
                            ) : (
                                <>
                                    Conviértete en <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Distribuidor Oficial</span>
                                </>
                            )}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            key={`desc-${activeTab}`}
                            className="text-xl text-slate-200 leading-relaxed mb-10 border-l-4 border-cyan-400 pl-6"
                            initial={{ opacity: 1, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0 }}
                        >
                            {activeTab === 'tecnicos'
                                ? 'Accede a proyectos exclusivos, capacitación continua y herramientas profesionales.'
                                : 'Obtén precios mayoristas directos y soporte prioritario para escalar tu negocio.'
                            }
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            key={`cta-${activeTab}`}
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0 }}
                            className="flex flex-col sm:flex-row items-start gap-6"
                        >
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className={`group relative px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20`}
                            >
                                <span className="flex items-center gap-3">
                                    {activeTab === 'tecnicos' ? 'Registrarme Ahora' : 'Solicitar Alianza'}
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </span>
                            </button>

                            <button
                                onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex items-center gap-2 font-bold text-slate-300 hover:text-white transition-colors px-6 py-4"
                            >
                                Ver beneficios
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                        </motion.div>

                    </div>
                </div>

                {/* Modal Overlay */}
                <AnimatePresence>
                    {isFormOpen && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFormOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
                            >
                                {/* Decorative Header Line */}
                                <div className={`h-2 w-full bg-gradient-to-r ${activeColorClass}`} />

                                <div className="p-8 max-h-[85vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                                            {activeTab === 'tecnicos' ? 'Registro de Técnico' : 'Solicitud Distribuidor'}
                                        </h3>
                                        <button
                                            onClick={() => setIsFormOpen(false)}
                                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>

                                    {activeTab === 'tecnicos' ? (
                                        /* Formulario para Técnicos */
                                        <form className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre completo *</label>
                                                <input type="text" required placeholder="Tu nombre completo" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Número de cédula *</label>
                                                    <input type="text" required placeholder="Ej: 1234567890" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Número de celular *</label>
                                                    <input type="tel" required placeholder="Ej: 300 123 4567" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ciudad de residencia *</label>
                                                    <input type="text" required placeholder="Ej: Barranquilla" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Departamento *</label>
                                                    <input type="text" required placeholder="Ej: Atlántico" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dirección *</label>
                                                <input type="text" required placeholder="Ej: Calle 45 #23-10" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Correo electrónico</label>
                                                <input type="email" placeholder="tucorreo@ejemplo.com" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                            </div>

                                            {/* Sección de documentos */}
                                            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Documentos adjuntos</p>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Hoja de vida (HV) *</label>
                                                        <input type="file" required accept=".pdf,.doc,.docx" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary dark:file:bg-cyber-cyan/10 dark:file:text-cyber-cyan hover:file:bg-primary/20 cursor-pointer" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Certificados de estudio *</label>
                                                        <input type="file" required accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary dark:file:bg-cyber-cyan/10 dark:file:text-cyber-cyan hover:file:bg-primary/20 cursor-pointer" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Certificado de trabajo en altura</label>
                                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary dark:file:bg-cyber-cyan/10 dark:file:text-cyber-cyan hover:file:bg-primary/20 cursor-pointer" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Certificado de ARL</label>
                                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary dark:file:bg-cyber-cyan/10 dark:file:text-cyber-cyan hover:file:bg-primary/20 cursor-pointer" />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className={`w-full py-4 mt-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r ${activeColorClass}`}
                                            >
                                                Enviar Solicitud
                                            </button>
                                            <p className="text-center text-xs text-slate-400 mt-4">
                                                Al enviar aceptas nuestra política de tratamiento de datos.
                                            </p>
                                        </form>
                                    ) : (
                                        /* Formulario para Distribuidores */
                                        <form className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre *</label>
                                                    <input type="text" required placeholder="Tu nombre" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Apellido *</label>
                                                    <input type="text" required placeholder="Tu apellido" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Razón Social / NIT *</label>
                                                <input type="text" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Celular *</label>
                                                    <input type="tel" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email *</label>
                                                    <input type="email" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ciudad *</label>
                                                <input type="text" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                            </div>

                                            <button
                                                type="submit"
                                                className={`w-full py-4 mt-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r ${activeColorClass}`}
                                            >
                                                Enviar Solicitud
                                            </button>
                                            <p className="text-center text-xs text-slate-400 mt-4">
                                                Al enviar aceptas nuestra política de tratamiento de datos.
                                            </p>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="max-w-xl">
                            <span className="text-cyan-500 font-bold text-xs tracking-widest uppercase mb-2 block">¿Por qué unirse?</span>
                            <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white">
                                {activeTab === 'tecnicos'
                                    ? 'Beneficios para Técnicos Certificados'
                                    : 'Ventajas para Distribuidores'}
                            </h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs text-right md:text-left">
                            {activeTab === 'tecnicos'
                                ? 'Impulsa tu carrera profesional con el respaldo de una marca líder.'
                                : 'Escala tu negocio con nuestra infraestructura logística y comercial.'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {activeTab === 'tecnicos' ? (
                            <>
                                <BenefitCard
                                    icon="school"
                                    title="Capacitación Continua"
                                    description="Acceso a cursos certificados en nuevas tecnologías, VRF y sistemas inverter con expertos de la industria."
                                    index={0}
                                />
                                <BenefitCard
                                    icon="handyman"
                                    title="Kit de Bienvenida"
                                    description="Recibe uniformes, herramientas especializadas y material promocional oficial de la marca Ghara."
                                    index={1}
                                />
                                <BenefitCard
                                    icon="work"
                                    title="Bolsa de Trabajo"
                                    description="Prioridad en la asignación de servicios de instalación y mantenimiento solicitados por nuestros clientes."
                                    index={2}
                                />
                            </>
                        ) : (
                            <>
                                <BenefitCard
                                    icon="inventory_2"
                                    title="Inventario Prioritario"
                                    description="Acceso garantizado a stock de equipos de alta demanda y repuestos originales con despacho preferencial."
                                    index={0}
                                />
                                <BenefitCard
                                    icon="request_quote"
                                    title="Márgenes Exclusivos"
                                    description="Estructura de precios mayorista escalonada diseñada para maximizar la rentabilidad de tu negocio."
                                    index={1}
                                />
                                <BenefitCard
                                    icon="support_agent"
                                    title="Soporte Comercial"
                                    description="Asignación de un ejecutivo de cuenta dedicado y material de apoyo para tus cierres de venta."
                                    index={2}
                                />
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Growth Path - Conditional Rendering */}


            {/* Process Steps */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-20">
                        <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">
                            {activeTab === 'tecnicos' ? 'Proceso de Certificación' : 'Proceso de Alta Comercial'}
                        </h2>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {/* Line */}
                        <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-white/10"></div>

                        {(activeTab === 'tecnicos' ? [
                            { step: "1", title: "Registro y Documentación", desc: "Sube tu hoja de vida y certificados técnicos al portal." },
                            { step: "2", title: "Evaluación Técnica", desc: "Presenta una prueba de conocimientos y entrevista con nuestro jefe técnico." },
                            { step: "3", title: "Bienvenida y Kit", desc: "Recibe tu certificación, accesos a la app y dotación inicial." }
                        ] : [
                            { step: "1", title: "Solicitud de Distribución", desc: "Completa el formulario comercial con los datos de tu empresa." },
                            { step: "2", title: "Validación Comercial", desc: "Revisión de documentos legales y estudio de crédito." },
                            { step: "3", title: "Firma de Contrato", desc: "Formalización de la alianza y apertura de cuenta mayorista." }
                        ]).map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center relative z-10">
                                <div className="w-16 h-16 rounded-full bg-primary text-white dark:bg-cyber-cyan dark:text-black font-bold text-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-tech-cyan">
                                    {item.step}
                                </div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-slate-50 dark:bg-surface-dark">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Preguntas Frecuentes</h2>
                    </div>

                    <div className="bg-white dark:bg-black rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-white/5">
                        {activeTab === 'tecnicos' ? (
                            <>
                                <FaqItem
                                    question="¿Tiene algún costo certificarse?"
                                    answer="El proceso de registro es gratuito. Las certificaciones especializadas pueden tener un costo simbólico que incluye materiales y diploma."
                                />
                                <FaqItem
                                    question="¿Necesito tener herramienta propia?"
                                    answer="Para el nivel Técnico Aliado es necesario contar con herramienta básica. Para niveles superiores facilitamos acceso a herramienta especializada."
                                />
                                <FaqItem
                                    question="¿Cómo me asignan los servicios?"
                                    answer="A través de nuestra App de Técnicos recibirás notificaciones de servicios disponibles cerca de tu ubicación."
                                />
                            </>
                        ) : (
                            <>
                                <FaqItem
                                    question="¿Cuál es la compra mínima inicial?"
                                    answer="Para activar la cuenta de distribuidor requerimos una compra inicial de 5 equipos o su equivalente en monto."
                                />
                                <FaqItem
                                    question="¿Realizan envíos a otras ciudades?"
                                    answer="Sí, contamos con logística nacional. Para pedidos superiores a cierto monto el envío es gratuito a ciudades principales."
                                />
                                <FaqItem
                                    question="¿Ofrecen crédito?"
                                    answer="Sí, tras 3 meses de operación comercial continua y estudio financiero, activamos cupo de crédito a 30 días."
                                />
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Final Banner */}
            <section className="py-20 bg-slate-900 text-white dark:bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-3xl"></div>
                <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                    <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">¿Listo para llevar tu negocio al <br /> siguiente nivel?</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
                        No pierdas la oportunidad de ser parte de la red de climatización más robusta y moderna de la región.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                setIsFormOpen(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-primary hover:bg-white hover:text-primary dark:bg-cyber-cyan dark:hover:bg-white dark:text-black font-bold py-4 px-8 rounded-xl transition-all shadow-lg"
                        >
                            Postular Ahora
                        </button>
                        <a
                            href="https://wa.me/573022326569"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-transparent border border-white/30 hover:bg-white/10 py-4 px-8 rounded-xl font-bold transition-all inline-block"
                        >
                            Hablar con Ventas
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AfiliadosPage;
