import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../../shared/components/ui/ProductCard';

const products = [
    {
        name: "Split Inverter",
        price: "$499.00",
        image: "/media/split_wall_modern.png",
        category: "INVERTER",
        description: "Unidad Interior 1.5T"
    },
    {
        name: "Unidad Condensadora",
        price: "$850.00",
        image: "/media/condenser_outdoor.png",
        category: "CONDENSADORA",
        description: "Alta Eficiencia 2T"
    },
    {
        name: "Compacto Ventana",
        price: "$350.00",
        image: "/media/window_compact.png",
        category: "COMPACTO",
        description: "Serie 5000 BTU"
    },
    {
        name: "Industrial Series",
        price: "$1,299.00",
        image: "/media/industrial_ac.png",
        category: "INDUSTRIAL",
        description: "4 Toneladas"
    },
    {
        name: "VRF System",
        price: "Consultar",
        image: "/media/vrf_system.png",
        category: "COMERCIAL",
        description: "Volumen Refrigerante Variable"
    }
];

const BestSellers = () => {
    // Carousel reference for drag constraints
    const carouselRef = useRef(null);

    return (
        <section id="catalogo" className="py-24 bg-background-light dark:bg-background-dark overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="font-display font-bold text-5xl text-[#0C4D89] mb-4">Productos más vendidos</h2>
                        <p className="text-[#2678A4] font-body text-xl max-w-xl">
                            Equipos de alta eficiencia para distribución.
                        </p>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-2 font-bold text-[#0C4D89] hover:text-[#2678A4] transition-colors group">
                        Ver catálogo completo
                        <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </a>
                </div>

                {/* Carousel Container */}
                <motion.div ref={carouselRef} className="cursor-grab active:cursor-grabbing overflow-hidden">
                    <motion.div
                        drag="x"
                        dragConstraints={carouselRef}
                        className="flex gap-8 px-4"
                        style={{ width: "max-content" }} // Allows drag to work properly
                    >
                        {products.map((product, index) => (
                            <div key={index} className="w-[300px] md:w-[350px] flex-shrink-0">
                                <ProductCard {...product} />
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <div className="mt-8 flex justify-center gap-2 md:hidden">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>

                <div className="mt-12 text-center md:hidden">
                    <a href="#" className="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary transition-colors">
                        Ver catálogo completo
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
