import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO } from '../../shared/hooks/useSEO';
import client from '../../shared/api/client';

// Utilidad para resaltar texto
const HighlightText = ({ text, highlight }) => {
    if (!highlight || !text) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-slate-900 dark:text-white rounded px-1">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

const FaqPage = () => {
    useSEO({
        title: 'Preguntas Frecuentes | Ghara - Centro de Ayuda',
        description: 'Encuentra respuestas a las preguntas más frecuentes sobre nuestros servicios de aire acondicionado.',
        keywords: ['preguntas frecuentes', 'FAQ', 'ayuda', 'Ghara'],
        ogImage: '/media/logo-ghara.svg'
    });

    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [voted, setVoted] = useState({});

    // Cargar FAQs y recuperar votos guardados
    useEffect(() => {
        client.get('/faq')
            .then(res => {
                if (res.data?.success) setFaqs(res.data.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        const savedVotes = localStorage.getItem('ghara_faq_votes');
        if (savedVotes) {
            try { setVoted(JSON.parse(savedVotes)); } catch (e) { }
        }
    }, []);



    const handleVote = async (id, type) => {
        if (voted[id]) return;
        
        // Optimistic update visual
        const newVoted = { ...voted, [id]: type };
        setVoted(newVoted);
        localStorage.setItem('ghara_faq_votes', JSON.stringify(newVoted));

        try {
            await client.post(`/faq/${id}/vote`, { type });
        } catch (error) {
            console.error('Error enviando voto:', error);
        }
    };

    const categories = ['Todas', ...new Set(faqs.map(f => f.categoria))];

    // Filtros
    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              faq.respuesta.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || faq.categoria === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const topFaqs = filteredFaqs.filter(f => f.esDestacada);
    const regularFaqs = filteredFaqs.filter(f => !f.esDestacada);

    // Agrupación de FAQs regulares
    const grouped = regularFaqs.reduce((acc, faq) => {
        if (!acc[faq.categoria]) acc[faq.categoria] = [];
        acc[faq.categoria].push(faq);
        return acc;
    }, {});

    const categoryIcons = {
        'General': 'info',
        'Productos': 'ac_unit',
        'Instalación': 'construction',
        'Mantenimiento': 'build',
        'Garantía': 'verified',
        'Pagos': 'payments',
        'Envíos': 'local_shipping'
    };

    const toggleFaq = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const renderFaqItem = (faq) => {
        const isOpen = openId === faq.idFaq;
        const hasVoted = voted[faq.idFaq];

        return (
            <motion.div
                key={faq.idFaq}
                id={`faq-${faq.idFaq}`}
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
                        isOpen ? 'text-primary dark:text-blue-400' : 'text-slate-800 dark:text-white'
                    }`}>
                        <HighlightText text={faq.pregunta} highlight={searchTerm} />
                    </span>
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`material-symbols-outlined text-xl flex-shrink-0 ${
                            isOpen ? 'text-primary dark:text-blue-400' : 'text-slate-400'
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
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line mb-6">
                                        <HighlightText text={faq.respuesta} highlight={searchTerm} />
                                    </p>
                                    
                                    {/* Componente de Feedback */}
                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {hasVoted ? 'Gracias por tu valoración.' : '¿Te resultó útil esta información?'}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVote(faq.idFaq, 'util')}
                                                disabled={!!hasVoted}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                                    hasVoted === 'util' 
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                                                        : hasVoted
                                                            ? 'opacity-40 cursor-not-allowed text-slate-400'
                                                            : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                👍 Sí
                                            </button>
                                            <button
                                                onClick={() => handleVote(faq.idFaq, 'no_util')}
                                                disabled={!!hasVoted}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                                    hasVoted === 'no_util' 
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' 
                                                        : hasVoted
                                                            ? 'opacity-40 cursor-not-allowed text-slate-400'
                                                            : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                👎 No
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            {/* Header / Buscador */}
            <header className="relative bg-primary dark:bg-slate-950 pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 blur-[100px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 blur-[100px] rounded-full mix-blend-screen" />
                </div>
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                        ¿Cómo podemos <span className="text-cyan-400">ayudarte?</span>
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                        Encuentra respuestas rápidas y claras a tus dudas sobre nuestros equipos de climatización.
                    </p>
                    
                    <div className="relative max-w-2xl mx-auto">
                        <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Ej. ¿Cómo realizo el mantenimiento de mi equipo?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-full py-3 sm:py-5 pl-12 sm:pl-16 pr-6 sm:pr-8 text-sm sm:text-base outline-none border-2 border-transparent focus:border-cyan-400 dark:focus:border-blue-500 shadow-2xl transition-all font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </header>

            <section className="py-12 md:py-24 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Filtros Categorías */}
                    <div className="flex flex-wrap gap-2 md:gap-3 mb-16 justify-center">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-primary dark:bg-blue-600 text-white shadow-lg shadow-primary/30 dark:shadow-blue-900/30'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredFaqs.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 block">
                                search_off
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                No se encontraron resultados
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                Intenta con otras palabras clave o explora todas las categorías.
                            </p>
                            <button 
                                onClick={() => {setSearchTerm(''); setSelectedCategory('Todas');}}
                                className="mt-6 text-primary dark:text-blue-400 font-bold hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Top FAQs Section */}
                            {topFaqs.length > 0 && selectedCategory === 'Todas' && !searchTerm && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-amber-500 dark:text-amber-400 text-xl">
                                                star
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-black text-slate-800 dark:text-white">Preguntas Destacadas</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {topFaqs.map(renderFaqItem)}
                                    </div>
                                </motion.div>
                            )}

                            {/* Categorized FAQs */}
                            {Object.entries(grouped).map(([category, items]) => (
                                <motion.div key={category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary dark:text-blue-400 text-xl">
                                                {categoryIcons[category] || 'help_outline'}
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{category}</h2>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                                            {items.length}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {items.map(renderFaqItem)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* CTA Section */}
                    {!loading && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 text-center">
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 p-8 md:p-12">
                                <span className="material-symbols-outlined text-4xl text-primary dark:text-blue-400 mb-4 block">support_agent</span>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">¿No encontraste lo que buscabas?</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
                                    Si tu pregunta no está aquí, puedes enviarnos una solicitud directamente y te responderemos lo antes posible.
                                </p>
                                <a href="/pqr" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
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
