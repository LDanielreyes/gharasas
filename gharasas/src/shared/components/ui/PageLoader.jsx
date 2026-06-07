import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full mb-4"
            />
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                Cargando...
            </p>
        </div>
    );
};

export default PageLoader;
