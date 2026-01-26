import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Services from './components/Services';

const ServicesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="pt-20"
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
                <Services />
            </motion.div>
        </motion.div>
    );
};

export default ServicesPage;
