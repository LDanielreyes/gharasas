import React, { useState, useEffect } from 'react';
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isScrollDark, setIsScrollDark] = useState(true);
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const { scrollY } = useScroll();
    const location = useLocation();
    const navigate = useNavigate();

    // Page detection
    const isHomePage = location.pathname === '/';
    // Check for service pages (both residential and enterprise)
    const isServicesPage = location.pathname.includes('/servicios/');
    // Hero should be transparent on Home and Service pages
    const hasTransparentHero = isHomePage || isServicesPage;

    // Determine if we are on a "Dark Section" (requiring white text)
    // On Home: Calculated dynamically via scroll position
    // On Services: Top is Dark (Hero Image), Scrolled is Light (White Body)
    // const isDarkSection = isHomePage ? isScrollDark : (hasTransparentHero && !isScrolled);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20);
    });

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    useEffect(() => {
        // Only run section detection on Home Page
        if (!isHomePage) return;

        const handleScroll = () => {
            let onLightSection = false;
            const lightSections = ['catalogo', 'aliados'];

            const sections = document.querySelectorAll('section[id]');
            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    if (lightSections.includes(sec.id)) {
                        onLightSection = true;
                    }
                }
            });
            setIsScrollDark(!onLightSection);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const handleNavClick = (e, item) => {
        e.preventDefault();
        const targetId = item.toLowerCase().split(' ')[0];

        if (targetId === 'inicio') {
            navigate('/');
            window.scrollTo(0, 0);
        } else if (targetId === 'familia') {
            navigate('/familia');
        } else if (targetId === 'servicios') {
            navigate('/servicios');
        } else if (targetId === 'aliados') {
            navigate('/aliados');
        } else if (targetId === 'catálogo') {
            navigate('/catalogo');
        } else {
            if (isHomePage) {
                const element = document.getElementById(targetId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate(`/#${targetId}`);
            }
        }
        setIsMobileMenuOpen(false);
    };

    // --- Dynamic Styles Calculation ---

    let navClasses = 'transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] border border-transparent';

    if (isScrolled) {
        // SCROLLED STATE

        // If we are on a "Dark Section" (Home Dark Section OR Services Top technically but scrolled means we left top...)
        // Actually for Services, once scrolled, we are on white body, so isDarkSection is false.
        // For Home, depends on section.

        // Default Logic when scrolled: Glass effect
        if (isHomePage) {
            if (isScrollDark) {
                // Scrolled on Dark Home Section -> Dark Glass
                navClasses = 'glass-dark shadow-lg border-white/5 py-3';
            } else {
                // Scrolled on Light Home Section -> Light Glass
                navClasses = 'glass shadow-lg border-white/20 py-3';
            }
        } else {
            // Not Home (Services, etc)
            // If Dark Mode -> Dark Glass
            if (isDarkMode) {
                navClasses = 'glass-dark shadow-lg border-white/5 py-3';
            } else {
                // Light Mode -> Light Glass
                navClasses = 'glass shadow-lg border-white/20 py-3';
            }
        }
    } else {
        // TOP STATE (Not Scrolled)
        if (hasTransparentHero) {
            // Transparent for Hero
            navClasses = 'bg-transparent py-5 border-transparent';
        } else {
            // Regular Pages Top
            if (isDarkMode) {
                navClasses = 'glass-dark shadow-lg border-white/5 py-4';
            } else {
                navClasses = 'glass shadow-lg border-white/20 py-4';
            }
        }
    }

    // Text Color Logic
    let useDarkText = false;

    if (isScrolled) {
        // Scrolled
        if (isDarkMode) {
            useDarkText = false; // Dark Mode Scrolled -> White Text
        } else {
            // Light Mode Scrolled
            if (isHomePage) {
                useDarkText = !isScrollDark; // Home: Depend on section (Dark Section = White Text)
            } else {
                useDarkText = true; // Service/Other: White bg -> Dark Text
            }
        }
    } else {
        // Top
        if (hasTransparentHero) {
            useDarkText = false; // Transparent Hero -> White Text always
        } else {
            useDarkText = !isDarkMode; // Regular Page -> Follow Theme
        }
    }

    const textColorClass = useDarkText ? 'text-primary' : 'text-white';
    const logoSrc = useDarkText ? '/media/logo-azul-ghara.svg' : '/media/logo-blanco-ghara.svg';
    const hoverBgColor = useDarkText ? 'rgba(12, 77, 137, 0.08)' : 'rgba(255, 255, 255, 0.15)';

    return (
        <>
            <motion.nav
                className={`fixed top-4 left-4 right-4 z-50 rounded-2xl ${navClasses}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">

                    {/* Logo */}
                    <a href="/" onClick={(e) => handleNavClick(e, 'Inicio')} className="flex items-center gap-3 relative z-10">
                        <motion.img
                            src={logoSrc}
                            alt="Ghara"
                            className="h-16 md:h-20 w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        />
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {['Inicio', 'Familia Ghara', 'Aliados', 'Servicios'].map((item) => {
                            const isHovered = hoveredItem === item;

                            if (item === 'Servicios') {
                                return (
                                    <div
                                        key={item}
                                        className="relative group px-1"
                                        onMouseEnter={() => setHoveredItem(item)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <button
                                            onClick={(e) => handleNavClick(e, item)}
                                            className={`relative px-5 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${textColorClass} cursor-pointer flex items-center gap-1 z-10`}
                                        >
                                            {item}
                                            <motion.span
                                                animate={{ rotate: isHovered ? 180 : 0 }}
                                                className="material-symbols-outlined text-sm"
                                            >
                                                expand_more
                                            </motion.span>

                                            {isHovered && (
                                                <motion.div
                                                    layoutId="navbar-hover"
                                                    className="absolute inset-0 rounded-full z-[-1]"
                                                    style={{ backgroundColor: hoverBgColor }}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </button>

                                        {/* Dropdown */}
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute top-full left-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden origin-top-left border border-slate-100 dark:border-slate-800"
                                                >
                                                    <div className="p-2 space-y-1">
                                                        {[
                                                            { name: 'Residenciales', icon: 'home', path: '/servicios/residenciales' },
                                                            { name: 'Empresariales', icon: 'business', path: '/servicios/empresariales' }
                                                        ].map((subItem) => (
                                                            <a
                                                                key={subItem.name}
                                                                href={subItem.path}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    navigate(subItem.path);
                                                                    setHoveredItem(null);
                                                                }}
                                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item relative overflow-hidden"
                                                            >
                                                                <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-cyan-500/10 flex items-center justify-center text-primary dark:text-cyan-400 group-hover/item:bg-primary group-hover/item:text-white dark:group-hover/item:bg-cyan-500 dark:group-hover/item:text-black transition-all">
                                                                    <span className="material-symbols-outlined text-xl">{subItem.icon}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{subItem.name}</span>
                                                                    <span className="text-[10px] text-slate-500 font-medium">Ver servicios</span>
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            }

                            return (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().split(' ')[0]}`}
                                    onClick={(e) => handleNavClick(e, item)}
                                    onMouseEnter={() => setHoveredItem(item)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={`relative px-5 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${textColorClass} cursor-pointer z-10 block`}
                                >
                                    {item}
                                    {hoveredItem === item && (
                                        <motion.div
                                            layoutId="navbar-hover"
                                            className="absolute inset-0 rounded-full z-[-1]"
                                            style={{ backgroundColor: hoverBgColor }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </a>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-full transition-colors ${useDarkText ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/20 text-white'}`}
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Alternar tema"
                        >
                            <span className="material-symbols-outlined text-[1.25rem] leading-none">
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </motion.button>

                        {/* CTA */}
                        <motion.button
                            onClick={() => navigate('/calculadora')}
                            className="hidden md:block btn-primary-glow text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg relative overflow-hidden group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">Calcula tu aire</span>
                            <motion.div
                                className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"
                            />
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <button
                            className={`md:hidden p-2 rounded-lg ${textColorClass}`}
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined text-3xl">menu</span>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Sidebar Overlay - OUTSIDE nav */}
            <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Dark Backdrop */}
                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Sidebar Panel - FIXED positioning */}
                <div className={`fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Menú</h2>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            aria-label="Cerrar menú"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-6">
                        <div className="space-y-2">
                            {['Inicio', 'Familia Ghara', 'Aliados', 'Servicios'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().split(' ')[0]}`}
                                    onClick={(e) => handleNavClick(e, item)}
                                    className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </nav>

                    {/* Theme Toggle */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tema</span>
                            <button
                                onClick={toggleTheme}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isDarkMode
                                    ? 'bg-slate-800 text-yellow-400'
                                    : 'bg-slate-100 text-slate-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {isDarkMode ? 'dark_mode' : 'light_mode'}
                                </span>
                                <span>{isDarkMode ? 'Oscuro' : 'Claro'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
