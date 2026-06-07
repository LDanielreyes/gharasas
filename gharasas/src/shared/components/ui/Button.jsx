import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = ({
    children,
    variant = 'primary',
    className,
    icon: Icon,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        outline: 'border-2 border-white text-white hover:bg-white/10',
        white: 'bg-white text-primary hover:bg-gray-100',
        ghost: 'text-white hover:bg-white/10',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                'px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
            {Icon && <Icon className="w-5 h-5" />}
        </motion.button>
    );
};

export default Button;
