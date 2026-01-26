import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContactModal from '../../../shared/components/ui/ContactModal';

const Hero = () => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    return (
        <section id="inicio" className="relative h-screen min-h-[850px] flex items-center overflow-hidden bg-slate-900 pb-20">
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />

            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/media/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-transparent z-10 pointer-events-none"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-20 h-full flex flex-col justify-center pt-32">
                <div className="max-w-xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                        className="font-display font-bold text-6xl lg:text-7xl xl:text-8xl leading-none text-white mb-8 tracking-tight drop-shadow-lg"
                    >
                        Mejorando tu <br />
                        <span className="text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">ambiente</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                        className="text-xl text-slate-100 font-body leading-relaxed mb-10 max-w-lg font-light drop-shadow-md"
                    >
                        Servicio técnico experto, instalación y distribución de equipos de climatización de primer nivel. Confía en los profesionales.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                        className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <h3 className="font-display font-bold text-xl mb-6 text-white flex items-center gap-2">
                            <span className="bg-white/20 p-2 rounded-lg material-symbols-outlined text-sm">calendar_month</span>
                            Contactar con Ghara
                        </h3>
                        <div className="space-y-4 relative z-10">
                            {/* WhatsApp Button */}
                            <a
                                href="https://wa.me/573022326569?text=Hola%20Ghara%2C%20quiero%20solicitar%20una%20cotizaci%C3%B3n"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl py-4 px-6 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group/btn"
                            >
                                <svg className="w-6 h-6 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <span>Contactar por WhatsApp</span>
                            </a>

                            {/* Email Button - Triggers Modal */}
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-xl py-4 px-6 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group/btn"
                            >
                                <span className="material-symbols-outlined group-hover/btn:scale-110 transition-transform">mail</span>
                                <span>Enviar Correo</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
                >
                    <span className="material-symbols-outlined text-white/50 text-4xl">keyboard_arrow_down</span>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
