import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO } from '../../shared/hooks/useSEO';
import client from '../../shared/api/client';

const FaqPage = () => {
    useSEO({
        title: 'Preguntas Frecuentes | Ghara - Centro de Ayuda',
        description: 'Encuentra respuestas a las preguntas m\u00e1s frecuentes sobre nuestros servicios de aire acondicionado, instalaci\u00f3n, mantenimiento y garant\u00edas.',
        keywords: ['preguntas frecuentes', 'FAQ', 'ayuda', 'Ghara', 'aire acondicionado', 'soporte'],
        ogImage: '/media/logo-ghara.svg'
    });

    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await client.get('/faq');
                setFaqs(res.data.data || []);
            } catch (error) {
                console.error('Error loading FAQ:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const toggleFaq = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const filtered = faqs.filter(faq =>
        faq.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.respuesta.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by categoria if available
    const grouped = filtered.reduce((acc, faq) => {
        const cat = faq.categoria || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(faq);
        return acc;
    }, {});

    const categoryIcons = {
        'General': 'help_outline',
        'Productos': 'inventory_2',
        'Instalaci\u00f3n': 'construction',
        'Mantenimiento': 'build',
        'Garant\u00eda': 'verified_user',
        'Pagos': 'payments',
        'Env\u00edos': 'local_shipping',
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black pt-32 pb-16">
            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <span className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        Centro de Ayuda
                    </span>
                    <h1 className="font-display font-bold text-4xl md:text-6xl text-slate-900 dark:text-white mb-6">
                        Preguntas <span className="text-primary dark:text-blue-400">Frecuentes</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        Encuentra respuestas r&aacute;pidas a las dudas m&aacute;s comunes sobre nuestros servicios, productos y procesos.
                    </p>
                </motion.div>
            </section>

            {/* Search Bar */}
            <section className="container mx-auto px-4 md:px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar una pregunta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary dark:focus:border-cyan-400 focus:outline-none transition-all duration-300 text-base"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* FAQ Content */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    {loading ? (
                        <div className="text-center py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="inline-block"
                            >
                                <span className="material-symbols-outlined text-4xl text-primary dark:text-blue-400">
                                    progress_activity
                                </span>
                            </motion.div>
                            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Cargando preguntas...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">
                                search_off
                            </span>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                                No se encontraron resultados
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                Intenta con otros t&eacute;rminos de b&uacute;squeda o{' '}
                                <a href="/pqr" className="text-primary dark:text-blue-400 font-bold hover:underline">
                                    env&iacute;anos tu consulta directamente
                                </a>.
                            </p>
                        </motion.div>
                    ) : (
                        Object.entries(grouped).map(([category, items], catIdx) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                                className="mb-10"
                            >
                                {/* Category Header */}
                                {Object.keys(grouped).length > 1 && (
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-cyan-500/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary dark:text-blue-400 text-xl">
                                                {categoryIcons[category] || 'help_outline'}
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{category}</h2>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                                            {items.length}
                                        </span>
                                    </div>
                                )}

                                {/* FAQ Accordion */}
                                <div className="space-y-3">
                                    {items.map((faq) => {
                                        const isOpen = openId === faq.idFaq;
                                        return (
                                            <motion.div
                                                key={faq.idFaq}
                                                className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                                                    isOpen
                                                        ? 'border-primary/30 dark:border-blue-400/30 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none'
                                                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-primary/20 dark:hover:border-cyan-400/20'
                                                }`}
                                                layout
                                            >
                                                <button
                                                    onClick={() => toggleFaq(faq.idFaq)}
                                                    className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4 cursor-pointer"
                                                >
                                                    <span className={`font-bold text-base md:text-lg transition-colors duration-300 ${
                                                        isOpen
                                                            ? 'text-primary dark:text-blue-400'
                                                            : 'text-slate-800 dark:text-white'
                                                    }`}>
                                                        {faq.pregunta}
                                                    </span>
                                                    <motion.span
                                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className={`material-symbols-outlined text-xl flex-shrink-0 ${
                                                            isOpen
                                                                ? 'text-primary dark:text-blue-400'
                                                                : 'text-slate-400'
                                                        }`}
                                                    >
                                                        expand_more
                                                    </motion.span>
                                                </button>

                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            key="content"
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        >
                                                            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                                                                <div className="border-t border-slate-100 dark:border-white/5 pt-4">
                                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                                                        {faq.respuesta}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))
                    )}

                    {/* CTA Section */}
                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-16 text-center"
                        >
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 p-8 md:p-12">
                                <span className="material-symbols-outlined text-4xl text-primary dark:text-blue-400 mb-4 block">
                                    support_agent
                                </span>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    &iquest;No encontraste lo que buscabas?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
                                    Si tu pregunta no est&aacute; aqu&iacute;, puedes enviarnos una solicitud directamente y te responderemos lo antes posible.
                                </p>
                                <a
                                    href="/pqr"
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-lg">forum</span>
                                    Enviar una solicitud
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default FaqPage;
