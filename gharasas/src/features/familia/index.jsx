import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO } from '../../shared/hooks/useSEO';

// Gradientes de fondo sutiles y profesionales
const SubtleGradientOrbs = () => (
    <>
        {/* Orbe principal - muy sutil */}
        <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(55,198,216,0.08) 0%, transparent 60%)',
                top: '-20%',
                right: '-10%',
                filter: 'blur(80px)',
            }}
            animate={{
                opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orbe secundario */}
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(12,77,137,0.12) 0%, transparent 60%)',
                bottom: '-10%',
                left: '-5%',
                filter: 'blur(60px)',
            }}
            animate={{
                opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
    </>
);

// Patrón de líneas diagonales elegantes
const ElegantLines = () => (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 40px,
                    rgba(255,255,255,0.5) 40px,
                    rgba(255,255,255,0.5) 41px
                )`
            }}
        />
    </div>
);

// Efecto de viñeta sutil
const Vignette = () => (
    <div
        className="absolute inset-0 pointer-events-none"
        style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
        }}
    />
);

// Línea de luz horizontal que se mueve lentamente
const ScanLine = () => (
    <motion.div
        className="absolute left-0 right-0 h-px opacity-20"
        style={{
            background: 'linear-gradient(90deg, transparent, rgba(55,198,216,0.5), transparent)',
        }}
        initial={{ top: '0%' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    />
);

// Partículas mínimas y profesionales (solo algunas pequeñas)
const MinimalParticles = () => {
    const particles = useMemo(() =>
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 30 + 20,
            delay: Math.random() * 10,
        })), []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 rounded-full bg-white/20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

// Overlay con textura de ruido para apariencia premium
const NoiseTexture = () => (
    <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
    />
);

// Componente Carrusel de Equipo (Desktop)
const DesktopTeamCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0); // Start with CEO (index 0)

    const members = [
        { name: 'Raquel Ariza', role: 'CEO', img: '/media/EquipoGhara/tarjeta raqueljpeg.jpeg' },
        { name: 'Álvaro Ariza', role: 'Operaciones y Mantenimiento', img: '/media/EquipoGhara/tarjeta alvaro.jpeg' },
        { name: 'Jeorgiana Ariza', role: 'Mercadeo', img: '/media/EquipoGhara/tarjeta cesar.jpeg' },
        { name: 'Argemiro Paternina', role: 'Compras & Abastecimiento', img: '/media/EquipoGhara/tarjeta argemiro.jpeg' },
        { name: 'Victoria Acosta', role: 'Marketing', img: '/media/EquipoGhara/tarjeta victoriajpeg.jpeg' }
    ];

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % members.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto h-[450px] md:h-[500px] flex items-center justify-center perspective-1000">
            {/* Left Arrow */}
            <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-full z-40 p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-800 dark:text-white hover:bg-white/20 transition-all shadow-lg flex"
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {/* Right Arrow */}
            <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-full z-40 p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-800 dark:text-white hover:bg-white/20 transition-all shadow-lg flex"
            >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Cards Container */}
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="flex items-center justify-center w-full h-full relative">
                    {members.map((member, index) => {
                        let offset = (index - activeIndex);
                        if (offset > members.length / 2) offset -= members.length;
                        if (offset < -members.length / 2) offset += members.length;

                        if (Math.abs(offset) > 2) return null;

                        const styles = {
                            '0': { scale: 1.1, opacity: 1, zIndex: 20, x: 0, rotateY: 0, blur: 0 },
                            '1': { scale: 0.85, opacity: 0.6, zIndex: 10, x: 200, rotateY: -15, blur: '2px' },
                            '-1': { scale: 0.85, opacity: 0.6, zIndex: 10, x: -200, rotateY: 15, blur: '2px' },
                            '2': { scale: 0.7, opacity: 0.3, zIndex: 5, x: 350, rotateY: -30, blur: '5px' },
                            '-2': { scale: 0.7, opacity: 0.3, zIndex: 5, x: -350, rotateY: 30, blur: '5px' }
                        };

                        const currentStyle = styles[offset] || { scale: 0, opacity: 0 };

                        // Mobile adjustment
                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                        const xOffset = isMobile ? (offset * 80) : currentStyle.x; // Tighter stack on mobile

                        return (
                            <motion.div
                                key={index}
                                layout
                                initial={false}
                                animate={{
                                    scale: currentStyle.scale,
                                    opacity: currentStyle.opacity,
                                    zIndex: currentStyle.zIndex,
                                    x: xOffset,
                                    rotateY: currentStyle.rotateY,
                                    filter: `blur(${currentStyle.blur})`
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }} // Snappier transition
                                className="absolute inset-0 m-auto w-[260px] md:w-80 h-[380px] md:h-[450px] shadow-2xl rounded-2xl overflow-hidden cursor-pointer"
                                onClick={() => setActiveIndex(index)}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }}
                            >
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8 items-center text-center">
                                    <motion.div
                                        animate={{ y: offset === 0 ? 0 : 20, opacity: offset === 0 ? 1 : 0 }}
                                        className="w-full"
                                    >
                                        <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-2">{member.name}</h3>
                                        <p className="text-cyan-400 font-bold uppercase tracking-wider text-[10px] md:text-xs">{member.role}</p>
                                        {offset === 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/20 w-full">
                                                <div className="flex items-center justify-center gap-2 text-white/80 text-xs md:text-sm">
                                                    <span className="material-symbols-outlined text-sm">verified</span>
                                                    <span>Miembro Ghara</span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                                {offset !== 0 && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-all hover:bg-black/20"></div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination Indicators */}
            <div className="flex justify-center gap-3 mt-4 md:mt-12 relative z-20">
                {members.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === activeIndex
                            ? 'w-10 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50'
                            : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

// Componente Carrusel de Equipo Optimizado para Móvil
const MobileTeamCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const members = [
        { name: 'Raquel Ariza', role: 'CEO', img: '/media/EquipoGhara/tarjeta raqueljpeg.jpeg' },
        { name: 'Álvaro Ariza', role: 'Operaciones y Mantenimiento', img: '/media/EquipoGhara/tarjeta alvaro.jpeg' },
        { name: 'Jeorgiana Ariza', role: 'Mercadeo', img: '/media/EquipoGhara/tarjeta cesar.jpeg' },
        { name: 'Argemiro Paternina', role: 'Compras & Abastecimiento', img: '/media/EquipoGhara/tarjeta argemiro.jpeg' },
        { name: 'Victoria Acosta', role: 'Marketing', img: '/media/EquipoGhara/tarjeta victoriajpeg.jpeg' }
    ];

    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % members.length);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + members.length) % members.length);

    // Handlers for swipe
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Contenedor de la tarjeta (Swipeable) */}
            <div
                className="relative w-[300px] h-[450px] rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full relative"
                    >
                        <img
                            src={members[activeIndex].img}
                            alt={members[activeIndex].name}
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 items-center text-center">
                            <h3 className="font-display font-bold text-3xl text-white mb-2">{members[activeIndex].name}</h3>
                            <p className="text-cyan-400 font-bold uppercase tracking-wider text-xs mb-4">{members[activeIndex].role}</p>

                            <div className="pt-4 border-t border-white/20 w-full flex items-center justify-center gap-2 text-white/80 text-sm">
                                <span className="material-symbols-outlined text-base">verified</span>
                                <span>Miembro Ghara</span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Left/Right click areas for tapping */}
                <div className="absolute top-0 bottom-0 left-0 w-16 z-10" onClick={prevSlide} />
                <div className="absolute top-0 bottom-0 right-0 w-16 z-10" onClick={nextSlide} />
            </div>

            {/* Controles de Navegación y Paginación */}
            <div className="flex items-center justify-center gap-6 mt-8">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <div className="flex gap-2">
                    {members.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`transition-all duration-300 rounded-full h-2 ${idx === activeIndex
                                    ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500'
                                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

const FamiliaGharaPage = () => {
    useSEO({
        title: "Familia Ghara - Liderazgo y Valores | Ghara SAS",
        description: "Conoce a la Familia Ghara. Nuestro equipo de liderazgo, nuestra esencia, misión, visión y valores corporativos. Documentación legal y transparencia.",
        image: "https://gharasas.com/media/family-hero.jpg"
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Estado para el efecto de hover del mouse
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };



    // Variantes de animación para texto - carga inmediata
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0,
                delayChildren: 0
            }
        }
    };

    const wordVariants = {
        hidden: {
            opacity: 1,
            y: 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0
            }
        }
    };

    // Sin efecto de glow pulsante - más elegante
    const subtleVariants = {
        initial: { opacity: 0.9 },
        animate: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-black font-body selection:bg-cyan-500/30">

            {/* Hero Section - Full Screen con Fondo Animado */}
            <section
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                onMouseMove={handleMouseMove}
            >
                {/* Fondo con gradiente dinámico que sigue al mouse */}
                <div
                    className="absolute inset-0 z-0 transition-all duration-500"
                    style={{
                        background: `
                            radial-gradient(
                                circle at ${mousePosition.x}% ${mousePosition.y}%,
                                rgba(55,198,216,0.15) 0%,
                                transparent 50%
                            ),
                            linear-gradient(
                                135deg,
                                #0C4D89 0%,
                                #0d3a5f 25%,
                                #0a2a42 50%,
                                #081b2b 75%,
                                #050e15 100%
                            )
                        `
                    }}
                />

                {/* Elementos decorativos profesionales */}
                <SubtleGradientOrbs />
                <ElegantLines />
                <NoiseTexture />
                <ScanLine />
                <MinimalParticles />
                <Vignette />

                {/* Contenido */}
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center text-white pt-20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {/* Badge */}
                        <span
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            Familia Ghara
                        </span>

                        {/* Título con animación sutil */}
                        <motion.h1
                            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight"
                            variants={containerVariants}
                        >
                            <motion.span variants={wordVariants} className="inline-block mr-4">¿Quiénes</motion.span>
                            <motion.span
                                variants={wordVariants}
                                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 italic"
                            >
                                somos?
                            </motion.span>
                        </motion.h1>

                        {/* Descripción */}
                        <p className="text-lg md:text-2xl max-w-2xl mx-auto text-slate-200/90 font-light leading-relaxed mb-12">
                            Más que una empresa, somos su aliado. Entendemos el{' '}
                            <span className="font-bold text-cyan-300">
                                confort
                            </span>{' '}
                            como una necesidad esencial, no un lujo.
                        </p>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="#pqr"
                                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-900 font-bold rounded-full overflow-hidden hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <span className="material-symbols-outlined">forum</span>
                                    Contáctanos
                                </span>
                            </a>
                            <button
                                className="group px-8 py-4 border border-white/30 text-white font-bold rounded-full backdrop-blur-sm hover:bg-white/10 transition-all"
                                onClick={() => {
                                    const element = document.querySelector('section:nth-of-type(2)');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    Conoce más
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-xs text-white/50 uppercase tracking-widest">
                        Desplaza
                    </span>
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                </div>
            </section>

            {/* Essence Section - 3 Cards Highlight */}
            <section className="py-32 bg-white dark:bg-black relative">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 dark:text-white mb-6">Nuestra Esencia</h2>
                        <span className="block w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto rounded-full"></span>
                        <p className="text-slate-500 mt-6 uppercase tracking-widest text-xs">El corazón de lo que hacemos</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* ¿Por qué? */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <span className="material-symbols-outlined text-3xl">psychology</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">¿Por qué?</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                Porque el bienestar es la condición fundamental para una vida plena. Sin confort, no hay progreso.
                            </p>
                        </motion.div>

                        {/* ¿Cómo? - Highlighted */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-12 bg-[#081b2b] dark:bg-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden transform md:-translate-y-4 md:scale-105 z-10 text-white"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-cyan-500/30 text-white">
                                    <span className="material-symbols-outlined text-3xl">handyman</span>
                                </div>
                                <h3 className="font-display font-bold text-3xl mb-6">¿Cómo?</h3>
                                <p className="text-slate-300 leading-relaxed mb-8">
                                    A través de una metodología basada en la confianza, la pasión por el servicio y la innovación constante.
                                </p>
                                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-widest uppercase">
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                    24/7 Disponibilidad
                                </div>
                            </div>
                        </motion.div>

                        {/* ¿Qué? */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl"
                        >
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                                <span className="material-symbols-outlined text-3xl">ac_unit</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">¿Qué?</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                Somos su aliado estratégico en confort y climatización.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section - Carousel Interactivo */}
            <section className="py-24 bg-white dark:bg-black overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2"></div>
                    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl translate-x-1/2"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 dark:text-white mb-4">Equipo Ghara</h2>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm">
                            Profesionales comprometidos con garantizar tu confort.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <DesktopTeamCarousel />
                    </div>
                    <div className="block md:hidden">
                        <MobileTeamCarousel />
                    </div>

                </div>
            </section>

            {/* Mission & Vision - Creative Layout */}
            <section className="py-24 bg-slate-50 dark:bg-black/50 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Mission */}
                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-xl relative"
                            >
                                <div className="absolute left-0 top-10 h-20 w-2 bg-primary"></div>
                                <h3 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-6">Misión</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                    Garantizar soluciones integrales de climatización eficientes. Somos el equipo técnico calificado que asegura su confort, integridad, riqueza y continuidad.
                                </p>
                            </motion.div>
                        </div>

                        {/* Vision */}
                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#0f2438] text-white p-12 rounded-[3rem] shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <h3 className="font-display font-bold text-4xl">Visión</h3>
                                        <span className="material-symbols-outlined text-4xl text-cyan-400 opacity-50">visibility</span>
                                    </div>
                                    <p className="text-slate-300 text-lg leading-relaxed">
                                        Ser reconocidos como la empresa líder por nuestra <span className="text-cyan-400 font-bold">excelencia operacional</span> y capacidad de respuesta, siendo la primera opción en el caribe.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores - Minimalist */}
            <section className="py-32 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-xl">
                            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight mb-4">
                                Nuestros <br />
                                <span className="text-slate-400">Valores</span>
                            </h2>
                        </div>
                        <p className="text-right text-slate-500 max-w-sm text-sm border-t border-slate-200 dark:border-white/10 pt-4">
                            Los valores fundamentales que sustentan cada proyecto que emprendemos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-white/5">
                        {[
                            { title: 'Pasión', desc: 'Agendamiento fácil desde tu comodidad y recibe un servicio puerta a puerta con técnicos uniformados y plenamente identificados, para mayor seguridad y confianza.', num: '01' },
                            { title: 'Integridad', desc: 'Técnicos certificados y calificados por clientes. Siendo transparentes con nuestros clientes, manteniendo un cumplimiento constante.', num: '02' },
                            { title: 'Innovación', desc: 'Incorporamos tecnologías y prácticas actualizadas para optimizar nuestros procesos operacionales y de servicio al cliente.', num: '03' },
                            { title: 'Orientación al Servicio', desc: 'Escuchamos, orientamos y acompañamos al cliente antes, durante y después del servicio, respondemos con soluciones personalizadas para cada necesidad, garantizando su total satisfacción.', num: '04' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-white dark:bg-black p-10 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed mb-10">{item.desc}</p>
                                <span className="text-5xl font-display font-bold text-slate-100 dark:text-slate-800 group-hover:text-cyan-500/20 transition-colors block text-right">{item.num}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </div >
    );
};

export default FamiliaGharaPage;
