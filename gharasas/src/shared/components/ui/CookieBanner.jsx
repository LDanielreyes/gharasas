import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { loadAnalytics } from '../../utility/analytics';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true, // Siempre activadas
        analytics: true,
        marketing: false
    });

    useEffect(() => {
        const hasAccepted = localStorage.getItem('ghara_cookie_prefs');
        if (!hasAccepted) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    const savePreferences = (prefs) => {
        localStorage.setItem('ghara_cookie_prefs', JSON.stringify({
            ...prefs,
            timestamp: new Date().toISOString(),
            version: '1.0'
        }));
        
        if (prefs.analytics) {
            loadAnalytics();
        }
        setIsVisible(false);
    };

    const acceptAll = () => savePreferences({ essential: true, analytics: true, marketing: true });
    const rejectAll = () => savePreferences({ essential: true, analytics: false, marketing: false });
    const saveSelection = () => savePreferences(preferences);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-5 md:p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mt-10 -mr-10 pointer-events-none"></div>

                        {!showSettings ? (
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                                <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full text-primary dark:text-cyber-cyan">
                                    <span className="material-symbols-outlined text-3xl">cookie</span>
                                </div>
                                
                                <div className="flex-grow text-center md:text-left z-10 text-slate-600 dark:text-slate-400 text-sm md:text-base">
                                    <p>
                                        Utilizamos cookies propias y de terceros para brindarte la mejor experiencia, analizar el tráfico y personalizar contenido. 
                                        Conoce nuestra <Link to="/politica-de-datos" className="text-primary dark:text-cyber-cyan hover:underline font-bold">Política de Datos</Link>.
                                    </p>
                                </div>
                                
                                <div className="flex-shrink-0 flex flex-wrap justify-center gap-2 md:gap-3 w-full md:w-auto z-10">
                                    <button onClick={rejectAll} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        Solo esenciales
                                    </button>
                                    <button onClick={() => setShowSettings(true)} className="px-4 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Configurar
                                    </button>
                                    <button onClick={acceptAll} className="bg-gradient-to-r from-primary to-blue-600 dark:from-cyber-cyan dark:to-blue-500 text-white dark:text-black px-6 py-2 rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                        Aceptar todas
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Preferencias de Cookies</h3>
                                
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                    <div className="flex items-start justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">Esenciales (Requeridas)</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Necesarias para el funcionamiento básico del sitio y seguridad.</p>
                                        </div>
                                        <input type="checkbox" checked disabled className="mt-1" />
                                    </div>

                                    <div className="flex items-start justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">Analíticas</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nos ayudan a entender cómo usas la web para mejorar tu experiencia (ej. Google Analytics).</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.analytics} 
                                            onChange={(e) => setPreferences(prev => ({...prev, analytics: e.target.checked}))}
                                            className="mt-1 cursor-pointer" 
                                        />
                                    </div>

                                    <div className="flex items-start justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">Marketing</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Se usan para rastrear a los visitantes en los sitios web. La intención es mostrar anuncios relevantes.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.marketing} 
                                            onChange={(e) => setPreferences(prev => ({...prev, marketing: e.target.checked}))}
                                            className="mt-1 cursor-pointer" 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <button onClick={saveSelection} className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                        Guardar preferencias
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
