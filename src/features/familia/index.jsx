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
        <div className="min-h-screen bg-white dark:bg-black font-body">

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/media/family-hero.jpg"
                        alt="Familia Ghara"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent dark:from-black/80"></div>
                </div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-white">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block"
                    >
                        Familia Ghara
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-display font-bold text-5xl md:text-7xl mb-6 max-w-2xl leading-tight"
                    >
                        ¿Quiénes <span className="text-cyan-300 italic font-body">somos?</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl max-w-xl text-slate-100 font-light"
                    >
                        Somos un aliado comprometido con garantizar el confort de tu hogar o empresa. Entendemos que un ambiente fresco y agradable no es un lujo, sino una condición esencial para el bienestar.
                    </motion.p>
                </div>
            </section>

            {/* Historia Section - Why/How/What */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-4">Nuestra Esencia</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Más que una empresa de climatización, somos un aliado comprometido con tu bienestar.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* ¿Por qué? */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-black p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 text-center group hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 mx-auto bg-primary/10 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl text-primary dark:text-cyan-400">psychology</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-primary dark:text-cyan-400 mb-4">¿Por qué?</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Entendemos que un ambiente fresco y agradable no es un lujo, sino una condición esencial para el bienestar de los hogares y espacios de trabajo.
                            </p>
                        </motion.div>

                        {/* ¿Cómo? */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-black p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 text-center group hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 mx-auto bg-secondary/10 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl text-secondary dark:text-purple-400">handyman</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-secondary dark:text-purple-400 mb-4">¿Cómo?</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Desde la confianza, pasión e innovación. Ofrecemos servicios de atención y agendamiento 24/7 para estar siempre disponibles cuando nos necesites.
                            </p>
                        </motion.div>

                        {/* ¿Qué? */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-black p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 text-center group hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 mx-auto bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl text-cyan-500">ac_unit</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-cyan-500 mb-4">¿Qué?</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Más que una empresa de climatización, somos un aliado comprometido con garantizar el confort de tu hogar o empresa.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary dark:text-cyan-400 shadow-sm mb-6">
                                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                                </div>
                                <h3 className="font-display font-bold text-2xl mb-4 text-slate-900 dark:text-white">Nuestra Misión</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Brindar soluciones integrales y eficientes para la climatización de hogares y empresas en la costa Caribe colombiana. A través de nuestro equipo técnico calificado, garantizamos suministro de equipo, servicios de instalación, mantenimiento y reparación de aires acondicionados con los más altos estándares de calidad, asegurando el confort y la satisfacción de nuestros clientes.
                                </p>
                            </div>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full -mr-16 -mt-16 group-hover:bg-cyan-400/10 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-cyan-500 shadow-sm mb-6">
                                    <span className="material-symbols-outlined text-3xl">visibility</span>
                                </div>
                                <h3 className="font-display font-bold text-2xl mb-4 text-slate-900 dark:text-white">Nuestra Visión</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Ser reconocidos como empresa líder y de confianza en servicios de climatización en la zona de influencia, por nuestra excelencia operacional, la innovación en nuestras soluciones y un sólido compromiso con la fiabilidad y la atención personalizada, consolidándonos como la primera opción para clientes residenciales y comerciales.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <span className="text-cyan-500 font-bold text-xs uppercase tracking-widest mb-2 block">Nuestros Pilares</span>
                        <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white">Valores que nos definen</h2>
                        <p className="text-slate-500 mt-4">Más allá de la tecnología, nos mueven las personas.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: 'handshake', title: 'Confianza', desc: 'Construimos relaciones duraderas basadas en la transparencia. Cuando entras a la familia Ghara, tienes nuestro respaldo en cada paso.', color: 'text-primary' },
                            { icon: 'favorite', title: 'Cuidado', desc: 'Cuidamos cada detalle, desde la temperatura perfecta hasta el impacto ambiental. Nos importan tu salud y el planeta.', color: 'text-cyan-500' },
                            { icon: 'verified', title: 'Compromiso', desc: 'Mantenemos nuestra palabra. Nuestra garantía no es solo un papel, es una promesa de que estaremos ahí cuando nos necesites.', color: 'text-indigo-500' }
                        ].map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-black p-8 rounded-3xl text-center shadow-sm hover:shadow-xl transition-shadow border border-slate-100 dark:border-white/5"
                            >
                                <div className={`w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 ${val.color}`}>
                                    <span className="material-symbols-outlined text-3xl">{val.icon}</span>
                                </div>
                                <h3 className="font-bold text-xl mb-3 dark:text-white">{val.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white mb-2">Conoce al Equipo</h2>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm">Profesionales comprometidos con garantizar tu confort y satisfacción.</p>
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
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative bg-slate-100 shadow-lg">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <a
                                            href="https://wa.me/573022326569"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex gap-2 text-white items-center text-xs font-bold"
                                        >
                                            <span className="material-symbols-outlined text-lg">call</span>
                                            Contactar
                                        </a>
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-1 text-center">{member.name}</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-wider text-center">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documentos Legales - Políticas de Datos */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Transparencia</span>
                        <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white mb-4">Políticas y Autorizaciones</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            En Ghara valoramos tu privacidad. Consulta nuestras políticas de tratamiento de datos personales.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Política de Tratamiento de Datos */}
                        <motion.a
                            href="/media/documentos/politica-tratamiento-datos.pdf"
                            download
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-6 group hover:shadow-xl transition-shadow cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-primary/10 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-primary dark:text-cyan-400">description</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Política de Tratamiento de Datos</h3>
                                <p className="text-sm text-slate-500">Documento PDF</p>
                            </div>
                            <span className="material-symbols-outlined text-2xl text-primary dark:text-cyan-400 group-hover:translate-y-1 transition-transform">download</span>
                        </motion.a>

                        {/* Autorización de Tratamiento de Datos */}
                        <motion.a
                            href="/media/documentos/autorizacion-tratamiento-datos.pdf"
                            download
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-6 group hover:shadow-xl transition-shadow cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-secondary/10 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-secondary dark:text-purple-400">verified_user</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Autorización de Tratamiento de Datos</h3>
                                <p className="text-sm text-slate-500">Documento PDF</p>
                            </div>
                            <span className="material-symbols-outlined text-2xl text-secondary dark:text-purple-400 group-hover:translate-y-1 transition-transform">download</span>
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* PQR Section */}
            <section className="py-24 bg-white dark:bg-black" id="pqr">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row gap-16">
                        <div className="md:w-1/3">
                            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">TE ESCUCHAMOS</span>
                            <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-6">Peticiones, Quejas y Reclamos</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                Tu experiencia es fundamental para nosotros. Utiliza este canal formal para hacernos llegar tus comentarios y ayúdanos a seguir mejorando para tu familia.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                                <span className="material-symbols-outlined text-primary mb-2">info</span>
                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                    Responderemos a su solicitud en un plazo máximo de 48 horas hábiles.
                                </p>
                            </div>
                        </div>

                        <div className="md:w-2/3">
                            <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-white/5">
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nombre Completo</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de Solicitud</label>
                                        <div className="relative">
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                                            >
                                                <option>Petición</option>
                                                <option>Queja</option>
                                                <option>Reclamo</option>
                                                <option>Sugerencia</option>
                                                <option>Felicitación</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">No. Identificación (Opcional)</label>
                                        <input
                                            type="text"
                                            name="id"
                                            value={formData.id}
                                            onChange={handleInputChange}
                                            className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                            placeholder="Cédula / NIT"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mb-8">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mensaje</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                                        placeholder="Cuéntanos detalladamente tu solicitud..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-[#0C4D89] text-white font-bold py-4 rounded-xl hover:bg-[#073866] transition-colors shadow-lg shadow-blue-900/20">
                                    Enviar PQR
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 border-t border-slate-100 dark:border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white mb-8">¿Listo para unirte a la familia?</h2>
                    <div className="flex justify-center gap-4">
                        <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg">Agendar Visita</button>
                        <button className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white px-8 py-3 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">Llamar Ahora</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FamiliaGharaPage;
