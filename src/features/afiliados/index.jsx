import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
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
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-20 bg-background-light dark:bg-background-dark min-h-screen">

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-28">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 dark:bg-white/5 -skew-x-12 transform translate-x-32 -z-10"></div>

                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        {/* Text Content */}
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.span
                                className="inline-block px-3 py-1 bg-blue-100 dark:bg-cyber-cyan/20 text-primary dark:text-cyber-cyan text-xs font-bold tracking-widest uppercase rounded-full mb-6"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Red de Partners 2026
                            </motion.span>
                            <motion.h1
                                className="font-display font-bold text-5xl lg:text-7xl text-slate-900 dark:text-white leading-tight mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                Únete a la Red de <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 dark:from-white dark:to-cyber-cyan">Aliados Líderes</span>
                            </motion.h1>
                            <motion.p
                                className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                Potencia tu negocio de HVAC con suministro prioritario, capacitación técnica de vanguardia y acceso a proyectos exclusivos como Aliado Ghara.
                            </motion.p>

                            <motion.div
                                className="flex items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                {/* Clients/Trust badges could go here */}
                                <div className="h-8 w-24 bg-slate-200 dark:bg-white/10 rounded"></div>
                                <div className="h-8 w-24 bg-slate-200 dark:bg-white/10 rounded"></div>
                                <div className="h-8 w-24 bg-slate-200 dark:bg-white/10 rounded"></div>
                            </motion.div>
                        </motion.div>

                        {/* Form Card */}
                        <motion.div
                            className="w-full max-w-md lg:w-[450px]"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-cyan-400"></div>

                                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">Registro de Técnico Aliado</h3>

                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo *</label>
                                            <input type="text" required placeholder="Ej. Juan Pérez" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cédula *</label>
                                            <input type="text" required placeholder="1234567890" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Celular *</label>
                                            <input type="tel" required placeholder="300 123 4567" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Correo</label>
                                            <input type="email" placeholder="opcional@correo.com" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dirección *</label>
                                        <input type="text" required placeholder="Calle 123 #45-67" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ciudad *</label>
                                            <input type="text" required placeholder="Barranquilla" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Departamento *</label>
                                            <input type="text" required placeholder="Atlántico" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors" />
                                        </div>
                                    </div>

                                    {/* File Uploads styled as grouped buttons or smaller inputs */}
                                    <div className="space-y-3 pt-2">
                                        {[
                                            { label: 'Hoja de Vida (PDF) *', req: true, id: "hv" },
                                            { label: 'Certificados de Estudio *', req: true, id: "certs" },
                                            { label: 'Certificado Alturas', req: false, id: "height" },
                                            { label: 'Certificado ARL', req: false, id: "arl" }
                                        ].map((file) => (
                                            <div key={file.id} className="relative">
                                                <label htmlFor={file.id} className="cursor-pointer flex items-center justify-between w-full bg-slate-50 dark:bg-black border border-dashed border-slate-300 dark:border-white/20 rounded-lg px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group/file">
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover/file:text-primary dark:group-hover/file:text-cyber-cyan truncate max-w-[200px]">{file.label}</span>
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">upload_file</span>
                                                </label>
                                                <input type="file" id={file.id} required={file.req} className="hidden" />
                                            </div>
                                        ))}
                                    </div>

                                    <button type="submit" className="w-full bg-primary hover:bg-secondary dark:bg-cyber-cyan dark:hover:bg-white dark:text-black text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-2">
                                        Enviar Registro
                                    </button>

                                    <p className="text-[10px] text-center text-slate-400 mt-4">
                                        Campos marcados con * son obligatorios.
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
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
                            <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white">Beneficios de formar parte de nuestra red de Aliados</h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs text-right md:text-left">
                            Ofrecemos un ecosistema diseñado para escalar la operatividad de nuestros aliados.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BenefitCard
                            icon="local_shipping"
                            title="Suministro Prioritario"
                            description="Acceso preferencial a nuestro inventario global con tiempos de entrega reducidos y logística inteligente para tus obras."
                            index={0}
                        />
                        <BenefitCard
                            icon="school"
                            title="Capacitación Certificada"
                            description="Programas continuos de formación técnica en nuevas tecnologías HVAC y certificación oficial Ghara para tu equipo."
                            index={1}
                        />
                        <BenefitCard
                            icon="folder_special"
                            title="Nuevos Proyectos"
                            description="Conectamos tu expertise con leads calificados y proyectos de gran envergadura en tu zona de influencia comercial."
                            index={2}
                        />
                    </div>
                </div>
            </section>

            {/* Growth Path */}
            <section className="py-24 bg-slate-50 dark:bg-surface-dark">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-4">Elige tu camino de crecimiento</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Diseñamos programas específicos adaptados al tamaño y visión de tu estructura profesional.</p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <GrowthCard
                            isCompany={false}
                            title="Soy Técnico Independiente"
                            perks={[
                                "Gestión de agenda flexible y directa",
                                "Acceso a herramientas y repuestos originales",
                                "Soporte técnico 24/7 en campo"
                            ]}
                            linkText="Ver requisitos"
                            index={0}
                        />
                        <GrowthCard
                            isCompany={true}
                            title="Somos una Empresa"
                            perks={[
                                "Precios mayoristas y descuentos por volumen",
                                "Línea de crédito corporativo y financiamiento",
                                "Gestión de flotas y software de mantenimiento"
                            ]}
                            linkText="Registrar Empresa"
                            index={1}
                        />
                    </div>
                </div>
            </section>

            {/* Process Steps */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-20">
                        <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">¿Cómo funciona?</h2>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {/* Line */}
                        <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-white/10"></div>

                        {[
                            { step: "1", title: "Registro de Perfil", desc: "Completa tu información básica y sube tus certificaciones actuales." },
                            { step: "2", title: "Llamada de Validación", desc: "Nuestro equipo revisará tu experiencia para asignarte el nivel de aliado adecuado." },
                            { step: "3", title: "Recibe Proyectos", desc: "Comienza a recibir leads y suministros con condiciones exclusivas." }
                        ].map((item, idx) => (
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
                        <FaqItem
                            question="¿Tiene algún costo unirse a la red de aliados Ghara?"
                            answer="El registro inicial es gratuito. Algunos programas de certificación avanzada pueden tener costos de material, pero el acceso a la plataforma de leads es por comisión de éxito o suscripción según el plan."
                        />
                        <FaqItem
                            question="¿Qué equipos de climatización suministran?"
                            answer="Cubrimos toda la gama de HVAC: Residencial (Split, Multi-split), Comercial Ligero (Cassette, Conductos) e Industrial (VRF, Chillers). Trabajamos con las principales marcas globales."
                        />
                        <FaqItem
                            question="¿Cómo se gestionan los pagos de los proyectos?"
                            answer="Ghara actúa como intermediario de confianza. Los pagos se realizan quincenalmente sobre hitos cumplidos y validados por el cliente final."
                        />
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
