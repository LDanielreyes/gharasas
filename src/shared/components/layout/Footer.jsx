import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="bg-slate-900 dark:bg-black text-white pt-24 overflow-hidden relative transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Sección Superior: Logo, Enlaces */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, staggerChildren: 0.1 }}
                >
                    {/* Marca / Logo */}
                    <motion.div
                        className="col-span-1 md:col-span-6 flex flex-col items-start"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <a href="#" className="mb-8 block">
                            <img src="/media/logo-blanco-ghara.svg" alt="Ghara" className="h-10 md:h-12 w-auto" />
                        </a>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8 font-light">
                            Redefiniendo la experiencia atmosférica. <br />
                            Climatización del futuro para espacios exigentes.
                        </p>
                        <div className="flex gap-4">
                            {['IG', 'TW', 'LN'].map((social, index) => (
                                <motion.a
                                    key={social}
                                    href="#"
                                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-black transition-all duration-300"
                                    whileHover={{ scale: 1.2, rotate: 360 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.3 + (index * 0.1),
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                >
                                    {social}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Columna de Enlaces 1: PRODUCTOS */}
                    <motion.div
                        className="col-span-1 md:col-span-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="font-bold text-cyan-400 dark:text-cyber-cyan dark:shadow-[0_0_10px_rgba(0,240,255,0.4)] mb-8 text-xs uppercase tracking-widest transition-all">Productos</h4>
                        <ul className="space-y-4 text-sm text-gray-400 dark:text-slate-500">
                            {['Características', 'Especificaciones', 'Tecnología', 'Reseñas'].map((item, index) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (index * 0.05) }}
                                >
                                    <motion.a
                                        href="#"
                                        className="hover:text-white dark:hover:text-cyber-cyan transition-colors inline-block relative group"
                                        whileHover={{ x: 4 }}
                                    >
                                        {item}
                                        <motion.span
                                            className="absolute bottom-0 left-0 h-[1px] bg-cyber-cyan"
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
                        <h4 className="font-bold text-cyan-400 dark:text-cyber-cyan dark:shadow-[0_0_10px_rgba(0,240,255,0.4)] mb-8 text-xs uppercase tracking-widest transition-all">Compañía</h4>
                        <ul className="space-y-4 text-sm text-gray-400 dark:text-slate-500">
                            {['Manifiesto', 'Carreras', 'Sostenibilidad', 'Prensa'].map((item, index) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + (index * 0.05) }}
                                >
                                    <motion.a
                                        href="#"
                                        className="hover:text-white dark:hover:text-cyber-cyan transition-colors inline-block relative group"
                                        whileHover={{ x: 4 }}
                                    >
                                        {item}
                                        <motion.span
                                            className="absolute bottom-0 left-0 h-[1px] bg-cyber-cyan"
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

                {/* Barra Inferior */}
                <motion.div
                    className="border-t border-white/10 pt-8 pb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-widest text-gray-600 uppercase font-mono"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <p>© 2024 GHARA INC. TODOS LOS DERECHOS RESERVADOS.</p>
                    <div className="flex gap-8">
                        {['Privacidad', 'Términos', 'Cookies'].map((link, index) => (
                            <motion.a
                                key={link}
                                href="#"
                                className="hover:text-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 + (index * 0.05) }}
                            >
                                {link}
                            </motion.a>
                        ))}
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
