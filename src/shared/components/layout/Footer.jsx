import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    // Información de contacto
    const contactInfo = {
        whatsapp: '3022326569',
        whatsappLink: 'https://wa.me/573022326569',
        email: 'gharasas.colombia@gmail.com',
        instagram: 'https://www.instagram.com/gharasas?igsh=M3d6NzRrOGZvdWx3'
    };

    // Enlaces de navegación
    const navigationLinks = {
        productos: [
            { name: 'Calculadora BTU', path: '/calculadora' },
            { name: 'Servicios', path: '/servicios' },
            { name: 'Residenciales', path: '/servicios/residenciales' },
            { name: 'Empresariales', path: '/servicios/empresariales' }
        ],
        compania: [
            { name: 'Inicio', path: '/' },
            { name: 'Familia Ghara', path: '/familia' },
            { name: 'Aliados', path: '/aliados' },
            { name: 'Contáctanos', action: 'whatsapp' }
        ]
    };

    const handleNavClick = (e, link) => {
        e.preventDefault();
        if (link.action === 'whatsapp') {
            window.open(contactInfo.whatsappLink, '_blank');
        } else if (link.path) {
            navigate(link.path);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLogoClick = (e) => {
        e.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Redes sociales disponibles
    const socialLinks = [
        {
            name: 'Instagram',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
            url: contactInfo.instagram,
            label: 'IG'
        },
        {
            name: 'WhatsApp',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            url: contactInfo.whatsappLink,
            label: 'WA'
        },
        {
            name: 'Email',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            url: `mailto:${contactInfo.email}`,
            label: 'EM'
        }
    ];

    return (
        <footer className="bg-slate-900 dark:bg-black text-white pt-24 overflow-hidden relative transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Sección Superior: Logo, Enlaces */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, staggerChildren: 0.1 }}
                >
                    {/* Marca / Logo y Contacto */}
                    <motion.div
                        className="col-span-1 md:col-span-6 flex flex-col items-start"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <a href="/" onClick={handleLogoClick} className="mb-6 block">
                            <img src="/media/logo-blanco-ghara.svg" alt="Ghara" className="h-10 md:h-12 w-auto" />
                        </a>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6 font-light">
                            Redefiniendo la experiencia atmosférica. <br />
                            Climatización del futuro para espacios exigentes.
                        </p>

                        {/* Información de contacto directa */}
                        <div className="space-y-3 mb-8">
                            <a
                                href={contactInfo.whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group"
                            >
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </span>
                                <span className="text-sm font-medium">+57 {contactInfo.whatsapp}</span>
                            </a>
                            <a
                                href={`mailto:${contactInfo.email}`}
                                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
                            >
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <span className="text-sm font-medium">{contactInfo.email}</span>
                            </a>
                        </div>

                        {/* Redes sociales */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300"
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.3 + (index * 0.1),
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                    title={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Columna de Enlaces 1: SERVICIOS */}
                    <motion.div
                        className="col-span-1 md:col-span-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="font-bold text-cyan-400 dark:text-cyber-cyan dark:shadow-[0_0_10px_rgba(0,240,255,0.4)] mb-6 text-xs uppercase tracking-widest transition-all">Servicios</h4>
                        <ul className="space-y-3 text-sm text-gray-400 dark:text-slate-500">
                            {navigationLinks.productos.map((item, index) => (
                                <motion.li
                                    key={item.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (index * 0.05) }}
                                >
                                    <motion.a
                                        href={item.path}
                                        onClick={(e) => handleNavClick(e, item)}
                                        className="hover:text-white dark:hover:text-cyber-cyan transition-colors inline-block relative group cursor-pointer"
                                        whileHover={{ x: 4 }}
                                    >
                                        {item.name}
                                        <motion.span
                                            className="absolute bottom-0 left-0 h-[1px] bg-cyan-400"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Columna de Enlaces 2: COMPAÑÍA */}
                    <motion.div
                        className="col-span-1 md:col-span-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h4 className="font-bold text-cyan-400 dark:text-cyber-cyan dark:shadow-[0_0_10px_rgba(0,240,255,0.4)] mb-6 text-xs uppercase tracking-widest transition-all">Compañía</h4>
                        <ul className="space-y-3 text-sm text-gray-400 dark:text-slate-500">
                            {navigationLinks.compania.map((item, index) => (
                                <motion.li
                                    key={item.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + (index * 0.05) }}
                                >
                                    <motion.a
                                        href={item.path || '#'}
                                        onClick={(e) => handleNavClick(e, item)}
                                        className="hover:text-white dark:hover:text-cyber-cyan transition-colors inline-block relative group cursor-pointer"
                                        whileHover={{ x: 4 }}
                                    >
                                        {item.name}
                                        {item.action === 'whatsapp' && (
                                            <span className="ml-2 inline-flex items-center text-green-400">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                            </span>
                                        )}
                                        <motion.span
                                            className="absolute bottom-0 left-0 h-[1px] bg-cyan-400"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>

                {/* CTA de WhatsApp */}
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <p className="text-gray-400 mb-4 text-sm">¿Necesitas ayuda con tu proyecto de climatización?</p>
                    <motion.a
                        href={contactInfo.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-green-500/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Escríbenos por WhatsApp
                    </motion.a>
                </motion.div>

                {/* Barra Inferior */}
                <motion.div
                    className="border-t border-white/10 pt-8 pb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-widest text-gray-500 uppercase font-mono"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <p>© {currentYear} GHARA SAS. TODOS LOS DERECHOS RESERVADOS.</p>
                    <div className="flex items-center gap-4 text-gray-600">
                        <span>Barranquilla & Cartagena, Colombia</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">NIT: En trámite</span>
                    </div>
                </motion.div>
            </div>

            {/* Huge GHARA Text Background */}
            <motion.div
                className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none z-0 opacity-10 select-none leading-none"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 0.1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                <span className="font-display font-black text-[25vw] text-white tracking-tighter leading-[0.7] block text-center transform translate-y-[10%]">
                    GHARA
                </span>
            </motion.div>
        </footer>
    );
};

export default Footer;
