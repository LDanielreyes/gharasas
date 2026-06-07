import React from 'react';
import { motion } from 'framer-motion';

export const ServiceCard = ({ icon, title, features, recommended, index }) => (
    <motion.div
        className={`relative p-8 rounded-[2rem] h-full group cursor-pointer overflow-hidden
            ${recommended
                ? 'bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 shadow-xl scale-105 z-10 border border-blue-100 dark:border-cyan-500/30'
                : 'bg-white dark:bg-black border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/20'
            }
        `}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
            duration: 0.5,
            delay: index * 0.15,
            type: "spring",
            stiffness: 100
        }}
        whileHover={{
            y: -12,
            scale: recommended ? 1.05 : 1.02,
            boxShadow: recommended
                ? "0 30px 60px -12px rgba(6, 182, 212, 0.25)"
                : "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
        }}
    >
        {/* Glow Background Effect */}
        <div className={`absolute -inset-2 bg-gradient-to-r ${recommended ? 'from-cyan-400 to-blue-500' : 'from-slate-200 to-slate-200 dark:from-slate-800 dark:to-slate-800'} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>

        {recommended && (
            <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-lg shadow-cyan-500/20"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                    scale: { delay: 0.5, type: "spring", stiffness: 200 },
                    rotate: { delay: 0.5, type: "spring", stiffness: 200 },
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                Recomendado
            </motion.div>
        )}

        {/* Icon */}
        <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transition-colors duration-300
                ${recommended
                    ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-black shadow-lg shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-white group-hover:bg-blue-50 dark:group-hover:bg-slate-800 group-hover:text-blue-600 dark:group-hover:text-cyan-400'
                }
            `}
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
        >
            <span className="material-symbols-outlined">{icon}</span>
        </motion.div>

        <motion.h3
            className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-6"
            whileHover={{ x: 4, color: recommended ? "#06b6d4" : "#3b82f6" }}
        >
            {title}
        </motion.h3>

        <ul className="space-y-4 relative z-10">
            {features.map((item, idx) => (
                <motion.li
                    key={idx}
                    className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index * 0.15) + (idx * 0.05) }}
                    whileHover={{ x: 6 }}
                >
                    <motion.span
                        className={`material-symbols-outlined text-lg mt-0.5
                            ${recommended ? 'text-cyan-500' : 'text-slate-400 group-hover:text-blue-500 transition-colors'}
                        `}
                        whileHover={{ scale: 1.3, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        check_circle
                    </motion.span>
                    {item}
                </motion.li>
            ))}
        </ul>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 relative z-10">
            <motion.a
                href="#"
                className={`flex items-center gap-2 text-sm font-bold group/link
                    ${recommended ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors'}
                `}
                whileHover={{ gap: "0.75rem" }}
                transition={{ type: "spring", stiffness: 400 }}
            >
                {recommended ? 'Solicitar Plan' : 'Agendar Visita'}
                <motion.span
                    className="material-symbols-outlined text-lg"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    arrow_forward
                </motion.span>
            </motion.a>
        </div>
    </motion.div>
);

export const Step = ({ number, title, description, index }) => (
    <motion.div
        className="flex flex-col items-center text-center relative z-10 group"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
        whileHover={{ y: -5 }}
    >
        <motion.div
            className="w-20 h-20 rounded-2xl border-2 border-slate-100 dark:border-white/10 text-slate-300 dark:text-slate-700 font-display font-bold text-3xl flex items-center justify-center mb-6 bg-white dark:bg-black relative z-10 shadow-lg dark:shadow-none transition-all duration-300"
            whileHover={{
                scale: 1.1,
                borderColor: "#3b82f6",
                color: "#3b82f6",
                boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)"
            }}
        >
            {number}
        </motion.div>
        <motion.h4
            className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3"
            whileHover={{ color: "#3b82f6" }}
        >
            {title}
        </motion.h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
            {description}
        </p>
    </motion.div>
);
