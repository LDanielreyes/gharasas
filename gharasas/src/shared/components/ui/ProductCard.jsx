import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ name, description, price, image, category }) => {
    return (
        <motion.div
            className="group flex flex-col h-full bg-transparent perspective-1000"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8 }}
        >
            {/* Text Content First */}
            <div className="mb-4">
                <span className="text-primary dark:text-cyber-cyan text-xs font-bold tracking-widest uppercase transition-colors block mb-2">
                    {category}
                </span>

                <motion.h3
                    className="font-display font-bold text-xl text-primary dark:text-white group-hover:dark:text-cyber-cyan transition-colors mb-1"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    {name}
                </motion.h3>
                <p className="text-sm text-secondary dark:text-slate-400">{description}</p>
            </div>

            {/* Image Container - Tech Styling with 3D effect */}
            <motion.div
                className="relative bg-surface-light dark:bg-black rounded-3xl p-8 mb-6 flex items-center justify-center h-64 overflow-visible border-transparent dark:border dark:border-white/10 dark:group-hover:border-cyber-cyan transition-all duration-500"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{
                    boxShadow: '0 25px 50px -12px rgba(0, 240, 255, 0.25)',
                    scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
            >
                <motion.img
                    src={image}
                    alt={`${name} ${description}`}
                    className="w-full h-auto object-contain drop-shadow-xl z-10"
                    whileHover={{ scale: 1.15, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />

                {/* Tech Grid Background (Dark Mode Only) */}
                <div className="absolute inset-0 opacity-0 dark:opacity-20 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] rounded-3xl pointer-events-none transition-opacity duration-500"></div>

                {/* Glow effect on hover */}
                <motion.div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyber-cyan/0 to-cyber-cyan/0 dark:group-hover:from-cyber-cyan/10 dark:group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                />
            </motion.div>

            {/* Price and Action */}
            <div className="mt-auto flex items-center justify-between">
                <motion.span
                    className="font-display font-bold text-2xl text-primary dark:text-cyber-cyan transition-all"
                    whileHover={{ scale: 1.05 }}
                >
                    {price}
                </motion.span>

                <motion.button
                    className="w-10 h-10 rounded-full bg-slate-100 text-primary dark:bg-transparent dark:border dark:border-cyber-cyan dark:text-cyber-cyan flex items-center justify-center shadow-sm relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    {/* Ripple effect background */}
                    <motion.span
                        className="absolute inset-0 bg-primary dark:bg-cyber-cyan rounded-full"
                        initial={{ scale: 0, opacity: 0.5 }}
                        whileHover={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                    <span className="material-symbols-outlined relative z-10">add</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
