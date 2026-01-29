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

const GrowthCard = ({ isCompany, title, perks, linkText, index }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isCompany ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isCompany ? 50 : -50 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`p-10 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 hover:shadow-2xl
        ${isCompany
                    ? 'bg-slate-900 text-white dark:bg-black dark:border dark:border-cyber-cyan/30'
                    : 'bg-white text-slate-900 border border-slate-100 shadow-xl dark:bg-slate-900 dark:text-white dark:border-white/10'
                }
    `}>
            {/* Badge */}
            <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6
            ${isCompany ? 'bg-white/10 text-white' : 'bg-blue-50 text-primary dark:bg-cyber-cyan/10 dark:text-cyber-cyan'}
        `}>
                {isCompany ? 'Para Organizaciones' : 'Para Profesionales'}
            </div>

            <h3 className="font-display font-bold text-3xl mb-8">{title}</h3>

            <ul className="space-y-4 mb-10">
                {perks.map((perk, idx) => (
                    <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                        className="flex items-start gap-3 text-sm"
                    >
                        <span className={`material-symbols-outlined text-lg mt-0.5
                        ${isCompany ? 'text-cyan-400 dark:text-cyber-cyan' : 'text-primary dark:text-cyber-cyan'}
                    `}>check_circle</span>
                        <span className={isCompany ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}>{perk}</span>
                    </motion.li>
                ))}
            </ul>

            <a href={isCompany ? "https://ukyk65xb.forms.app/untitled-form" : "#"} target={isCompany ? "_blank" : "_self"} className={`inline-flex items-center gap-2 font-bold text-sm transition-all hover:gap-3
            ${isCompany ? 'text-white hover:text-cyan-400' : 'text-primary hover:text-secondary dark:text-cyber-cyan'}
        `}>
                {linkText} <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </a>

            {/* Decorative Icon */}
            <span className={`material-symbols-outlined absolute bottom-4 right-4 text-[10rem] opacity-5 pointer-events-none
            ${isCompany ? 'text-white' : 'text-slate-900 dark:text-white'}
        `}>
                {isCompany ? 'domain' : 'engineering'}
            </span>
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
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
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
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
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {activeTab === 'tecnicos'
                                ? 'Accede a proyectos exclusivos, capacitación continua y herramientas profesionales.'
                                : 'Obtén precios mayoristas directos y soporte prioritario para escalar tu negocio.'
                            }
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            key={`cta-${activeTab}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
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
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{activeTab === 'tecnicos' ? 'Cédula / NIT *' : 'Razón Social / NIT *'}</label>
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
            <section className="py-24 bg-slate-50 dark:bg-surface-dark">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-4">
                            {activeTab === 'tecnicos' ? 'Tu Camino Profesional' : 'Modelos de Distribución'}
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            {activeTab === 'tecnicos'
                                ? 'Diseñamos un plan de carrera para acompañar tu crecimiento desde nivel junior hasta master.'
                                : 'Opciones flexibles adaptadas al tamaño y capacidad operativa de tu empresa.'}
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {activeTab === 'tecnicos' ? (
                            <>
                                <GrowthCard
                                    isCompany={false}
                                    title="Técnico Aliado"
                                    perks={[
                                        "Acceso a capacitaciones básicas",
                                        "Descuentos en repuestos",
                                        "Uniforme oficial básico"
                                    ]}
                                    linkText="Aplicar Ahora"
                                    index={0}
                                />
                                <GrowthCard
                                    isCompany={false}
                                    title="Técnico Master"
                                    perks={[
                                        "Prioridad en asignación de servicios",
                                        "Certificación avanzada VRF",
                                        "Herramientas especializadas a crédito"
                                    ]}
                                    linkText="Ver Requisitos Master"
                                    index={1}
                                />
                            </>
                        ) : (
                            <>
                                <GrowthCard
                                    isCompany={true}
                                    title="Distribuidor Autorizado"
                                    perks={[
                                        "Acceso a lista de precios mayorista",
                                        "Material POP para punto de venta",
                                        "Capacitación para fuerza de ventas"
                                    ]}
                                    linkText="Ser Distribuidor"
                                    index={0}
                                />
                                <GrowthCard
                                    isCompany={true}
                                    title="Premium Partner"
                                    perks={[
                                        "Los mejores márgenes del mercado",
                                        "Línea de crédito extendida",
                                        "Rebates anuales por volumen de venta"
                                    ]}
                                    linkText="Aplicar a Premium"
                                    index={1}
                                />
                            </>
                        )}
                    </div>
                </div>
            </section>

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
                        <button className="bg-primary hover:bg-white hover:text-primary dark:bg-cyber-cyan dark:hover:bg-white dark:text-black font-bold py-4 px-8 rounded-xl transition-all shadow-lg">
                            Postular Ahora
                        </button>
                        <button className="bg-transparent border border-white/30 hover:bg-white/10 py-4 px-8 rounded-xl font-bold transition-all">
                            Hablar con Ventas
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AfiliadosPage;
