import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({
    children,
    width = "100%",
    delay = 0,
    duration = 0.8,
    threshold = 0.2
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: duration, delay: delay, ease: [0.25, 0.4, 0.25, 1] }} // smooth cubic-bezier
            viewport={{ once: true, amount: threshold }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
