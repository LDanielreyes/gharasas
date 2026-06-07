import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import client from '../../shared/api/client';

/* ─── Benefit row ──────────────────────────────────────── */
const BenefitRow = ({ num, icon, title, desc, index }) => {
    const ref = React.useRef(null);
    const inView = useInView(ref, { once: true, margin: '-12%' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
            className="flex items-start gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0 group"
        >
            <span className="font-mono text-[11px] font-bold text-slate-300 dark:text-white/15 pt-1 shrink-0 w-5 select-none">
                {num}
            </span>
            <div className="w-9 h-9 shrink-0 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20 transition-colors">
                <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-xl">{icon}</span>
            </div>
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug mb-1">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
};

/* ─── Step card ────────────────────────────────────────── */
const StepCard = ({ n, title, desc, index }) => {
    const ref = React.useRef(null);
    const inView = useInView(ref, { once: true, margin: '-10%' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.12, ease: 'easeOut' }}
            className="relative"
        >
            <span className="absolute -top-3 left-0 font-mono font-black text-[48px] leading-none text-white/5 select-none pointer-events-none">
                {n}
            </span>
            <div className="relative pt-4">
                <div className="w-7 h-7 rounded-full border-2 border-cyan-400 flex items-center justify-center font-bold text-cyan-400 text-xs mb-3 shrink-0">
                    {n}
                </div>
                <h3 className="font-bold text-white text-base mb-1.5">{title}</h3>
                <p className="text-slate-400 text-[14px] leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
};

/* ─── Main ─────────────────────────────────────────────── */
const AfiliadosPage = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('tecnicos');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitLead = async (e, origen) => {
        e.preventDefault();
        setIsSubmitting(true);
        const md = new FormData(e.target);
        
        const nombre = origen === 'Afiliados - Técnico' 
            ? md.get('nombre') 
            : `${md.get('nombre')} ${md.get('apellido')}`;
            
        try {
            await client.post('/leads', {
                nombre: nombre || 'Sin Nombre',
                email: md.get('email') || 'no-email@ghara.com',
                telefono: md.get('telefono') || '0000000',
                empresa: md.get('empresa') || md.get('cedula') || '',
                ciudad: md.get('ciudad') || '',
                origen: origen,
                comentarios: `Cédula/NIT: ${md.get('cedula') || md.get('empresa') || ''}. Depto: ${md.get('departamento') || ''}. Dir: ${md.get('direccion') || ''}`
            });
            Swal.fire({ icon: 'info', title: 'Notificación', text: '¡Solicitud enviada correctamente!', confirmButtonColor: '#22c5e8' });
            setIsFormOpen(false);
            e.target.reset();
        } catch(err) {
            console.error(err);
            Swal.fire({ icon: 'info', title: 'Notificación', text: 'Error conectando al servidor. Por favor intenta de nuevo.', confirmButtonColor: '#22c5e8' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const t = searchParams.get('tab');
        if (t === 'distribuidores') setActiveTab('distribuidores');
        else if (t === 'tecnicos') setActiveTab('tecnicos');
    }, [searchParams]);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const isTecnicos = activeTab === 'tecnicos';

    const tecnicosBenefits = [
        { num: '01', icon: 'school', title: 'Capacitación Continua', desc: 'Acceso a cursos certificados en nuevas tecnologías, VRF y sistemas inverter con expertos de la industria.' },
        { num: '02', icon: 'work', title: 'Bolsa de Trabajo', desc: 'Prioridad en la asignación de servicios de instalación y mantenimiento solicitados por nuestros clientes.' },
    ];

    const distribuidoresBenefits = [
        { num: '01', icon: 'inventory_2', title: 'Inventario Prioritario', desc: 'Acceso garantizado a stock de equipos de alta demanda y repuestos originales con despacho preferencial.' },
        { num: '02', icon: 'request_quote', title: 'Márgenes Exclusivos', desc: 'Estructura de precios mayorista escalonada diseñada para maximizar la rentabilidad de tu negocio.' },
        { num: '03', icon: 'support_agent', title: 'Soporte Comercial', desc: 'Asignación de un ejecutivo de cuenta dedicado y material de apoyo para tus cierres de venta.' },
    ];

    const tecnicosSteps = [
        { n: '1', title: 'Registro y Documentación', desc: 'Sube tu hoja de vida y certificados técnicos al portal.' },
        { n: '2', title: 'Evaluación Técnica', desc: 'Presenta una prueba de conocimientos y entrevista con nuestro jefe técnico.' },
    ];

    const distribuidoresSteps = [
        { n: '1', title: 'Solicitud de Distribución', desc: 'Completa el formulario comercial con los datos de tu empresa.' },
        { n: '2', title: 'Validación Comercial', desc: 'Revisión de documentos legales y estudio de crédito.' },
        { n: '3', title: 'Firma de Contrato', desc: 'Formalización de la alianza y apertura de cuenta mayorista.' },
    ];

    const benefits = isTecnicos ? tecnicosBenefits : distribuidoresBenefits;
    const steps = isTecnicos ? tecnicosSteps : distribuidoresSteps;

    return (
        <div className="bg-white dark:bg-[#0a0a0a] min-h-screen overflow-x-hidden">

            {/* ══ HERO ═════════════════════════════════════════════ */}
            <section className="relative min-h-[95svh] flex flex-col justify-end overflow-hidden">
                <div className="absolute inset-0">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeTab}
                            src={isTecnicos
                                ? "/media/tecnico.webp"
                                : "/media/distribuidor.webp"
                            }
                            alt={isTecnicos ? "Técnico trabajando" : "Almacén de distribución"}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </div>

                <div className="relative z-10 container mx-auto px-5 md:px-8 pb-12 md:pb-20 pt-36 md:pt-48">
                    <motion.p
                        key={`label-${activeTab}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-cyan-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
                    >
                        {isTecnicos ? 'Red de Técnicos · 2026' : 'Red de Distribuidores · 2026'}
                    </motion.p>

                    <motion.h1
                        key={`h1-${activeTab}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="font-display font-black text-white leading-[0.95] text-[clamp(2.6rem,10vw,6.5rem)] mb-7 max-w-2xl"
                    >
                        {isTecnicos ? (
                            <>Únete como<br /><span className="text-cyan-400">Técnico Certificado</span></>
                        ) : (
                            <>Conviértete en<br /><span className="text-cyan-400">Distribuidor Oficial</span></>
                        )}
                    </motion.h1>

                    <motion.div
                        key={`cta-${activeTab}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.12 }}
                        className="flex flex-col sm:flex-row sm:items-center gap-5"
                    >
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-sm border-l-4 border-cyan-500 pl-4">
                            {isTecnicos
                                ? 'Accede a proyectos exclusivos, capacitación continua y herramientas profesionales.'
                                : 'Obtén precios mayoristas directos y soporte prioritario para escalar tu negocio.'}
                        </p>

                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="shrink-0 inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-black font-bold px-8 py-4 rounded-full transition-colors duration-200 text-base w-full sm:w-auto"
                        >
                            {isTecnicos ? 'Registrarme Ahora' : 'Solicitar Alianza'}
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ══ BENEFICIOS ════════════════════════════════════════ */}
            <section className="py-10 md:py-14 bg-white dark:bg-[#0f0f0f]">
                <div className="container mx-auto px-5 md:px-8">
                    <div className="mb-6">
                        <p className="text-cyan-500 text-[11px] font-bold tracking-[0.2em] uppercase mb-2">¿Por qué unirse?</p>
                        <h2 className="font-display font-black text-slate-900 dark:text-white text-2xl md:text-3xl leading-tight">
                            {isTecnicos ? 'Beneficios para Técnicos Certificados' : 'Ventajas para Distribuidores'}
                        </h2>
                    </div>
                    <div>
                        {benefits.map((b, i) => <BenefitRow key={i} index={i} {...b} />)}
                    </div>
                </div>
            </section>

            {/* ══ PROCESO ═══════════════════════════════════════════ */}
            <section className="py-10 md:py-14 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/5 blur-[60px] pointer-events-none" />

                <div className="container mx-auto px-5 md:px-8 relative z-10">
                    <p className="text-cyan-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-3">El proceso</p>
                    <h2 className="font-display font-black text-white text-2xl md:text-3xl leading-tight mb-8 md:mb-10">
                        {isTecnicos ? 'Proceso de Certificación' : 'Proceso de Alta Comercial'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
                        {steps.map((s, i) => (
                            <div
                                key={i}
                                className={`${i > 0 ? 'md:border-l border-white/10 md:pl-10' : ''} ${i < steps.length - 1 ? 'md:pr-10 border-b border-white/10 pb-10 md:pb-0 md:border-b-0' : ''}`}
                            >
                                <StepCard index={i} {...s} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA FINAL ════════════════════════════════════════ */}
            <section className="py-16 md:py-20 bg-cyan-500">
                <div className="container mx-auto px-5 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div>
                        <h2 className="font-display font-black text-black text-3xl md:text-4xl leading-tight mb-2">
                            ¿Listo para llevar tu negocio<br className="hidden md:block" /> al siguiente nivel?
                        </h2>
                        <p className="text-black/60 text-base">
                            No pierdas la oportunidad de ser parte de la red de climatización más robusta de la región.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <button
                            onClick={() => { setIsFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="inline-flex items-center justify-center gap-2 bg-black text-white font-bold px-7 py-4 rounded-full hover:bg-slate-800 transition-colors text-base"
                        >
                            Postular Ahora
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                        <a
                            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '573022326569'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-black/25 text-black font-bold px-7 py-4 rounded-full hover:bg-black/10 transition-colors text-base"
                        >
                            Hablar con Ventas
                        </a>
                    </div>
                </div>
            </section>

            {/* ══ MODAL ════════════════════════════════════════════ */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 80 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 80 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                            className="relative w-full sm:max-w-lg bg-white dark:bg-[#111] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* drag handle móvil */}
                            <div className="flex justify-center pt-3 pb-1 sm:hidden">
                                <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
                            </div>

                            <div className="p-6 sm:p-8 max-h-[88svh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                                        {isTecnicos ? 'Registro de Técnico' : 'Solicitud Distribuidor'}
                                    </h3>
                                    <button
                                        onClick={() => setIsFormOpen(false)}
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                {isTecnicos ? (
                                    <form className="space-y-4" onSubmit={e => handleSubmitLead(e, 'Afiliados - Técnico')}>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre completo *</label>
                                            <input name="nombre" type="text" required placeholder="Tu nombre completo" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white dark:placeholder:text-white/30" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cédula *</label>
                                                <input name="cedula" type="text" required placeholder="1234567890" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white dark:placeholder:text-white/30" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Celular *</label>
                                                <input name="telefono" type="tel" required placeholder="300 123 4567" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white dark:placeholder:text-white/30" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ciudad *</label>
                                                <input name="ciudad" type="text" required placeholder="Barranquilla" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white dark:placeholder:text-white/30" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Departamento *</label>
                                                <input name="departamento" type="text" required placeholder="Atlántico" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white dark:placeholder:text-white/30" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dirección *</label>
                                            <input name="direccion" type="text" required placeholder="Calle 45 #23-10" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white dark:placeholder:text-white/30" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Correo electrónico</label>
                                            <input name="email" type="email" placeholder="tucorreo@ejemplo.com" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white dark:placeholder:text-white/30" />
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 dark:border-white/10">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Documentos adjuntos</p>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Hoja de vida (HV) *', accept: '.pdf,.doc,.docx', req: true },
                                                    { label: 'Certificados de estudio *', accept: '.pdf,.jpg,.jpeg,.png', req: true },
                                                    { label: 'Certif. trabajo en altura', accept: '.pdf,.jpg,.jpeg,.png', req: false },
                                                    { label: 'Certificado de ARL', accept: '.pdf,.jpg,.jpeg,.png', req: false },
                                                ].map((f, i) => (
                                                    <div key={i}>
                                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{f.label}</label>
                                                        <input type="file" required={f.req} accept={f.accept} className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-50 file:text-cyan-700 dark:file:bg-cyan-500/10 dark:file:text-cyan-400 cursor-pointer" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-cyan-500 hover:bg-cyan-400 transition-colors">
                                            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                                        </button>
                                        <p className="text-center text-xs text-slate-400">Al enviar aceptas nuestra política de tratamiento de datos.</p>
                                    </form>
                                ) : (
                                    <form className="space-y-4" onSubmit={e => handleSubmitLead(e, 'Afiliados - Distribuidor')}>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre *</label>
                                                <input name="nombre" type="text" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Apellido *</label>
                                                <input name="apellido" type="text" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Razón Social / NIT *</label>
                                            <input name="empresa" type="text" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Celular *</label>
                                                <input name="telefono" type="tel" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email *</label>
                                                <input name="email" type="email" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ciudad *</label>
                                            <input name="ciudad" type="text" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors dark:text-white" />
                                        </div>
                                        <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-cyan-500 hover:bg-cyan-400 transition-colors">
                                            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                                        </button>
                                        <p className="text-center text-xs text-slate-400">Al enviar aceptas nuestra política de tratamiento de datos.</p>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AfiliadosPage;
