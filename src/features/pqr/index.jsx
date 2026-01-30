import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useSEO } from '../../shared/hooks/useSEO';

const PQRPage = () => {
    useSEO({
        title: 'PQR | Ghara - Peticiones, Quejas y Reclamos',
        description: 'Envía tus peticiones, quejas, reclamos o sugerencias. En Ghara valoramos tu opinión para mejorar continuamente nuestros servicios.',
        keywords: ['PQR', 'peticiones', 'quejas', 'reclamos', 'Ghara', 'atención al cliente'],
        ogImage: '/media/logo-ghara.svg'
    });

    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        type: '',
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSending, setIsSending] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const pqrTypes = [
        { value: 'peticion', label: 'Petición', icon: 'mail', description: 'Solicita información o servicios' },
        { value: 'queja', label: 'Queja', icon: 'feedback', description: 'Expresa inconformidad con el servicio' },
        { value: 'reclamo', label: 'Reclamo', icon: 'report_problem', description: 'Reporta incumplimientos o fallas' },
        { value: 'sugerencia', label: 'Sugerencia', icon: 'lightbulb', description: 'Comparte ideas para mejorar' }
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeSelect = (type) => {
        setFormData({ ...formData, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setSubmitStatus(null);

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID_PQR,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID_PQR,
                {
                    type: formData.type,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY_PQR
            );
            setSubmitStatus('success');
            setFormData({ type: '', name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending PQR:', error);
            setSubmitStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black pt-24 pb-16">
            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <span className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        Atención al Cliente
                    </span>
                    <h1 className="font-display font-bold text-4xl md:text-6xl text-slate-900 dark:text-white mb-6">
                        Peticiones, Quejas y <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Reclamos</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        Tu opinión es importante para nosotros. Estamos comprometidos a resolver tus inquietudes en el menor tiempo posible.
                    </p>
                </motion.div>
            </section>

            {/* PQR Form */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Type Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-10"
                    >
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4 text-center">
                            ¿Qué tipo de solicitud deseas enviar?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {pqrTypes.map((type) => (
                                <motion.button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleTypeSelect(type.value)}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${formData.type === type.value
                                        ? 'border-primary dark:border-cyan-400 bg-primary/5 dark:bg-cyan-400/10'
                                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-primary/50 dark:hover:border-cyan-400/50'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-3xl mb-3 block ${formData.type === type.value
                                        ? 'text-primary dark:text-cyan-400'
                                        : 'text-slate-400'
                                        }`}>
                                        {type.icon}
                                    </span>
                                    <span className={`font-bold block mb-1 ${formData.type === type.value
                                        ? 'text-primary dark:text-cyan-400'
                                        : 'text-slate-700 dark:text-white'
                                        }`}>
                                        {type.label}
                                    </span>
                                    <span className="text-xs text-slate-500">{type.description}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 dark:border-white/5"
                    >
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSending}
                                    placeholder="Tu nombre completo"
                                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary dark:focus:border-cyan-400 transition-colors disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Correo electrónico *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSending}
                                    placeholder="tucorreo@ejemplo.com"
                                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary dark:focus:border-cyan-400 transition-colors disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Teléfono de contacto
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={isSending}
                                    placeholder="300 123 4567"
                                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary dark:focus:border-cyan-400 transition-colors disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Asunto *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSending}
                                    placeholder="Breve descripción del asunto"
                                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary dark:focus:border-cyan-400 transition-colors disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Descripción detallada *
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                disabled={isSending}
                                rows={6}
                                placeholder="Describe tu solicitud con el mayor detalle posible..."
                                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary dark:focus:border-cyan-400 transition-colors resize-none disabled:opacity-50"
                            ></textarea>
                        </div>

                        {/* Status Messages */}
                        {submitStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined text-xl">check_circle</span>
                                <div>
                                    <p className="font-bold">¡Solicitud enviada exitosamente!</p>
                                    <p className="text-sm opacity-80">Te responderemos en un plazo máximo de 15 días hábiles.</p>
                                </div>
                            </motion.div>
                        )}
                        {submitStatus === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined text-xl">error</span>
                                <div>
                                    <p className="font-bold">Error al enviar</p>
                                    <p className="text-sm opacity-80">Por favor intenta nuevamente o contáctanos directamente.</p>
                                </div>
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isSending || !formData.type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-primary to-blue-600 dark:from-cyan-500 dark:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSending ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">send</span>
                                    Enviar Solicitud
                                </>
                            )}
                        </motion.button>

                        <p className="text-center text-xs text-slate-400 mt-4">
                            Al enviar esta solicitud, aceptas nuestra{' '}
                            <a href="/descargables" className="text-primary dark:text-cyan-400 hover:underline">
                                política de tratamiento de datos
                            </a>.
                        </p>
                    </motion.form>

                    {/* Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        {[
                            { icon: 'schedule', title: 'Tiempo de respuesta', desc: 'Máximo 15 días hábiles' },
                            { icon: 'support_agent', title: 'Atención personalizada', desc: 'Seguimiento de tu caso' },
                            { icon: 'verified', title: 'Respuesta garantizada', desc: 'Solución a tu solicitud' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 text-center"
                            >
                                <span className="material-symbols-outlined text-3xl text-primary dark:text-cyan-400 mb-3 block">{item.icon}</span>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PQRPage;
