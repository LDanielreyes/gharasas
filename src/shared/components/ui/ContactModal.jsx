import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Residencial',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // --- CONFIGURACIÓN EMAILJS ---
        // Pega aquí tus datos de EmailJS
        const serviceId = 'service_n6c86pz';
        const templateId = 'template_7zljcxk';
        const publicKey = 'Kj5T5N8Q9CEk299Ne';
        // -----------------------------

        // Lógica real de envío
        try {
            // Import dinámico
            const emailjs = (await import('@emailjs/browser')).default;

            await emailjs.send(serviceId, templateId, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            }, publicKey);

        } catch (error) {
            console.error('Error enviando email:', error);

            // Manejo robusto de errores
            const errorMessage = error?.text || error?.message || 'Error desconocido';

            if (errorMessage.includes('Invalid login') || error?.status === 412) {
                alert('Error de autenticación: Verifica la contraseña en el panel de EmailJS.');
            } else if (errorMessage.includes('Cannot find module')) {
                alert('Falta instalar la librería. Ejecuta: npm install @emailjs/browser');
            } else {
                alert(`Error al enviar: ${errorMessage}`);
            }

            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
            setFormData({ name: '', email: '', phone: '', subject: 'Residencial', message: '' });
        }, 3000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-lg pointer-events-auto"
                        >
                            <div className="relative glass-panel rounded-[2rem] p-8 md:p-10 overflow-hidden border border-white/20 dark:border-cyan-500/30">
                                {/* Decorative Gradients */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 dark:bg-cyber-cyan/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 dark:bg-purple-500/10 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2"></div>

                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="font-display font-bold text-3xl text-primary dark:text-white mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-cyan-500">mail</span>
                                            Contáctanos
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Envíanos un mensaje y te responderemos pronto.
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                {isSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 text-center"
                                    >
                                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                                        </div>
                                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">¡Mensaje Enviado!</h4>
                                        <p className="text-slate-600 dark:text-slate-400">Gracias por contactarnos. Te responderemos a la brevedad.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Nombre</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-lg">person</span>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary dark:focus:ring-cyber-cyan focus:border-transparent outline-none transition-all"
                                                        placeholder="Tu nombre"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Teléfono</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-lg">phone</span>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary dark:focus:ring-cyber-cyan focus:border-transparent outline-none transition-all"
                                                        placeholder="Tu teléfono"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Correo Electrónico</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-lg">mail</span>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary dark:focus:ring-cyber-cyan focus:border-transparent outline-none transition-all"
                                                    placeholder="ejemplo@correo.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Interés</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-lg">category</span>
                                                <select
                                                    value={formData.subject}
                                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                    className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-cyber-cyan focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option>Residencial</option>
                                                    <option>Comercial</option>
                                                    <option>Industrial</option>
                                                    <option>Mantenimiento</option>
                                                    <option>Otro</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-3.5 text-slate-400 text-lg pointer-events-none">expand_more</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Mensaje</label>
                                            <div className="relative">
                                                <textarea
                                                    required
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                    rows="4"
                                                    className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary dark:focus:ring-cyber-cyan focus:border-transparent outline-none transition-all resize-none"
                                                    placeholder="¿En qué podemos ayudarte?"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <span>Enviar Mensaje</span>
                                                    <span className="material-symbols-outlined">send</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
