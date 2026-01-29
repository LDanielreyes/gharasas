import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FamiliaGharaPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        type: 'Petición',
        name: '',
        id: '',
        email: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Mensaje enviado (Simulación). Gracias por contactarnos.');
        setFormData({ type: 'Petición', name: '', id: '', email: '', message: '' });
    };

    return (
        <div className="bg-slate-50 dark:bg-black font-body selection:bg-cyan-500/30">

            {/* Hero Section - Full Screen & Centered */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/media/family-hero.jpg"
                        alt="Familia Ghara"
                        className="w-full h-full object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center text-white pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] mb-6">
                            Familia Ghara
                        </span>
                        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">
                            ¿Quiénes <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 italic">somos?</span>
                        </h1>
                        <p className="text-lg md:text-2xl max-w-2xl mx-auto text-slate-200 font-light leading-relaxed mb-12">
                            Más que una empresa, somos su aliado. Entendemos el <span className="font-bold text-white">confort</span> como una necesidad esencial, no un lujo.
                        </p>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <span className="material-symbols-outlined text-4xl">expand_more</span>
                </motion.div>
            </section>

            {/* Essence Section - 3 Cards Highlight */}
            <section className="py-32 bg-white dark:bg-black relative">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 dark:text-white mb-6">Nuestra Esencia</h2>
                        <span className="block w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto rounded-full"></span>
                        <p className="text-slate-500 mt-6 uppercase tracking-widest text-xs">El corazón de lo que hacemos</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* ¿Por qué? */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <span className="material-symbols-outlined text-3xl">psychology</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">¿Por qué?</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                Porque el bienestar es la condición fundamental para una vida plena. Sin confort, no hay progreso.
                            </p>
                        </motion.div>

                        {/* ¿Cómo? - Highlighted */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-12 bg-[#081b2b] dark:bg-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden transform md:-translate-y-4 md:scale-105 z-10 text-white"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-cyan-500/30 text-white">
                                    <span className="material-symbols-outlined text-3xl">handyman</span>
                                </div>
                                <h3 className="font-display font-bold text-3xl mb-6">¿Cómo?</h3>
                                <p className="text-slate-300 leading-relaxed mb-8">
                                    A través de una metodología basada en la confianza, la pasión por el servicio y la innovación constante.
                                </p>
                                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-widest uppercase">
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                    24/7 Disponibilidad
                                </div>
                            </div>
                        </motion.div>

                        {/* ¿Qué? */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl"
                        >
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                                <span className="material-symbols-outlined text-3xl">ac_unit</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">¿Qué?</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                Somos su aliado estratégico en confort y climatización.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Creative Layout */}
            <section className="py-24 bg-slate-50 dark:bg-black/50 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Mission */}
                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-xl relative"
                            >
                                <div className="absolute left-0 top-10 h-20 w-2 bg-primary"></div>
                                <h3 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-6">Misión</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                    Garantizar soluciones integrales de climatización eficientes. Somos el equipo técnico calificado que asegura su confort, integridad, riqueza y continuidad.
                                </p>
                            </motion.div>
                        </div>

                        {/* Vision */}
                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#0f2438] text-white p-12 rounded-[3rem] shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <h3 className="font-display font-bold text-4xl">Visión</h3>
                                        <span className="material-symbols-outlined text-4xl text-cyan-400 opacity-50">visibility</span>
                                    </div>
                                    <p className="text-slate-300 text-lg leading-relaxed">
                                        Ser reconocidos como la empresa líder por nuestra <span className="text-cyan-400 font-bold">excelencia operacional</span> y capacidad de respuesta, siendo la primera opción en el caribe.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillars - Minimalist */}
            <section className="py-32 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-xl">
                            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight mb-4">
                                Nuestros <br />
                                <span className="text-slate-400">Pilares</span>
                            </h2>
                        </div>
                        <p className="text-right text-slate-500 max-w-sm text-sm border-t border-slate-200 dark:border-white/10 pt-4">
                            Los valores fundamentales que sustentan cada proyecto que emprendemos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-px bg-slate-100 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-white/5">
                        {[
                            { title: 'Confianza', desc: 'Relaciones transparentes y duraderas con respaldo de nuestro mentor y aliados.', num: '01' },
                            { title: 'Cuidado', desc: 'Minuciosidad imparcial. Diseño y protección del medioambiente en nuestros usuarios.', num: '02' },
                            { title: 'Compromiso', desc: 'Responsabilidad real con los resultados y la satisfacción del cliente.', num: '03' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-white dark:bg-black p-12 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">{item.title}</h3>
                                    {/* <span className="material-symbols-outlined text-slate-300 group-hover:text-cyan-500 transition-colors">arrow_outward</span> */}
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed mb-12 h-16">{item.desc}</p>
                                <span className="text-6xl font-display font-bold text-slate-100 dark:text-slate-800 group-hover:text-cyan-500/20 transition-colors block text-right">{item.num}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section - PRESERVED EXACTLY */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-2">Liderazgo Ghara</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { name: 'Raquel Ariza', role: 'CEO', img: '/media/EquipoGhara/tarjeta raqueljpeg.jpeg' },
                            { name: 'Álvaro Ariza', role: 'Operaciones y Mantenimiento', img: '/media/EquipoGhara/tarjeta alvaro.jpeg' },
                            { name: 'Cesar Ariza', role: 'Operaciones y Mantenimiento', img: '/media/EquipoGhara/tarjeta cesar.jpeg' },
                            { name: 'Argemiro Paternina', role: 'Compras & Abastecimiento', img: '/media/EquipoGhara/tarjeta argemiro.jpeg' },
                            { name: 'Victoria Acosta', role: 'Marketing', img: '/media/EquipoGhara/tarjeta victoriajpeg.jpeg' }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 relative bg-slate-200 grayscale hover:grayscale-0 transition-all duration-500 shadow-md">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 flex flex-col justify-end p-4">
                                        <h3 className="font-bold text-white text-sm leading-tight">{member.name}</h3>
                                        <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold mt-1">{member.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documentos Legales - Horizontal Strip */}
            <section className="py-20 bg-white dark:bg-black border-y border-slate-100 dark:border-white/5">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Transparencia</h2>
                        <span className="text-xs text-slate-400">Documentación oficial actualizada 2024</span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {/* Política de Tratamiento de Datos */}
                        <a
                            href="/media/documentos/politica-tratamiento-datos.pdf"
                            download
                            className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-4"
                        >
                            <div className="w-10 h-10 bg-white dark:bg-black rounded-lg flex items-center justify-center shadow-sm text-slate-700 dark:text-white">
                                <span className="material-symbols-outlined text-xl">description</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Política de Privacidad</h3>
                                <p className="text-[10px] text-slate-500">Descargar PDF</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary ml-auto text-sm">download</span>
                        </a>

                        {/* Autorización */}
                        <a
                            href="/media/documentos/autorizacion-tratamiento-datos.pdf"
                            download
                            className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-4"
                        >
                            <div className="w-10 h-10 bg-white dark:bg-black rounded-lg flex items-center justify-center shadow-sm text-slate-700 dark:text-white">
                                <span className="material-symbols-outlined text-xl">verified_user</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cámaras de Sonrisa</h3>
                                <p className="text-[10px] text-slate-500">Descargar PDF</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary ml-auto text-sm">download</span>
                        </a>

                        {/* Cámara comercio dummy */}
                        <div className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 opacity-50 flex items-center gap-4 cursor-not-allowed">
                            <div className="w-10 h-10 bg-white dark:bg-black rounded-lg flex items-center justify-center shadow-sm text-slate-700 dark:text-white">
                                <span className="material-symbols-outlined text-xl">store</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cámara Comercio</h3>
                                <p className="text-[10px] text-slate-500">Descargar PDF</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 ml-auto text-sm">lock</span>
                        </div>

                        {/* Reporte anual dummy */}
                        <div className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 opacity-50 flex items-center gap-4 cursor-not-allowed">
                            <div className="w-10 h-10 bg-white dark:bg-black rounded-lg flex items-center justify-center shadow-sm text-slate-700 dark:text-white">
                                <span className="material-symbols-outlined text-xl">bar_chart</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reporte Anual</h3>
                                <p className="text-[10px] text-slate-500">Descargar PDF</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 ml-auto text-sm">lock</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* PQR Section - Modern Clean */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50" id="pqr">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-white dark:bg-black rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 bg-[#0d1b2a] p-12 text-white relative flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

                            <div>
                                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/20">Te escuchamos</span>
                                <h2 className="font-display font-bold text-3xl mb-4">Tu voz nos ayuda a mejorar</h2>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                    Utiliza este canal formal para Peticiones, Quejas, Reclamos o Sugerencias.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="material-symbols-outlined text-cyan-400">call</span>
                                    <span>+57 302 232 6569</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="material-symbols-outlined text-cyan-400">mail</span>
                                    <span>contacto@ghara.co</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/3 p-12">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 transition-all"
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 transition-all"
                                            placeholder="tucorreo@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Tipo solicitud</label>
                                        <div className="relative">
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 transition-all appearance-none"
                                            >
                                                <option>Petición</option>
                                                <option>Queja</option>
                                                <option>Reclamo</option>
                                                <option>Sugerencia</option>
                                                <option>Felicitación</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Vehículo</label>
                                        <input
                                            type="text"
                                            name="id"
                                            value={formData.id}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 transition-all"
                                            placeholder="Cédula vs, nit..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Mensaje</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 transition-all h-32 resize-none"
                                        placeholder="Escribe aquí tu mensaje..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="bg-[#0b1c2c] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors shadow-lg">
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-[#08131e] text-center">
                <div className="container mx-auto px-4">
                    <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-10">¿Listo para unirte a la familia?</h2>
                    <div className="flex items-center justify-center gap-6">
                        <button className="bg-cyan-400 text-[#08131e] px-10 py-4 rounded-none font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors">
                            Agendar Visita
                        </button>
                        <button className="border border-white/20 text-white px-10 py-4 rounded-none font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors">
                            Agendar Cita
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FamiliaGharaPage;
