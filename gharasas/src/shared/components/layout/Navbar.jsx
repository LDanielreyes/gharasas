import React, { useState, useEffect } from 'react';
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    // Initial state: hero pages start with dark bg (white text), others start light (dark text)
    const [isScrollDark, setIsScrollDark] = useState(() => {
        const p = window.location.pathname;
        return p === '/' || p.includes('/servicios/') || p.includes('/aliados') || p.includes('/familia');
    });
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const { scrollY } = useScroll();
    const location = useLocation();
    const navigate = useNavigate();

    // Page detection
    const isHomePage = location.pathname === '/';
    const isServicesPage = location.pathname.includes('/servicios/');
    const isAliadosPage = location.pathname.includes('/aliados');
    const isFamiliaPage = location.pathname.includes('/familia');
    const isCatalogoPage = location.pathname === '/catalogo' || location.pathname.startsWith('/catalogo/');
    // Hero should be transparent ONLY on pages that have a dark photo hero
    // Catalogo has a light bg (#F4FAFA) so it is excluded here
    const hasTransparentHero = isHomePage || isServicesPage || isAliadosPage || isFamiliaPage;
    // Pages that are always light (dark text) except at the footer
    const isAlwaysLightNavPage =
        location.pathname.includes('/pqr') ||
        location.pathname.includes('/descargables') ||
        location.pathname.includes('/politica-de-datos') ||
        location.pathname.includes('/preguntas-frecuentes') ||
        location.pathname === '/catalogo' ||
        location.pathname.startsWith('/catalogo/') ||
        location.pathname.includes('/calculadora');

    // Footer visibility — controls text/logo color when footer enters viewport
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20);
    });

    // Immediately reset dark-state when navigating between page types
    // (runs before scroll detection, fixes flash of wrong text color on navigation)
    useEffect(() => {
        setIsScrollDark(hasTransparentHero);
    }, [hasTransparentHero]);

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
        const NAVBAR_PROBE_Y = 80;
        const getLuminance = (r, g, b) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        const handleScroll = () => {
            const candidates = document.querySelectorAll('section, main > div, [data-navbg]');
            let darkFound = false;

            for (const el of candidates) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= NAVBAR_PROBE_Y && rect.bottom >= NAVBAR_PROBE_Y) {
                    const bg = window.getComputedStyle(el).backgroundColor;
                    const nums = bg.match(/[\d.]+/g);

                    if (nums && nums.length >= 3) {
                        const [r, g, b, a = 1] = nums.map(Number);

                        if (a >= 0.05) {
                            // Real CSS background — check luminance
                            if (getLuminance(r, g, b) < 0.75) {
                                darkFound = true;
                                break;
                            }
                        } else if (hasTransparentHero) {
                            // Transparent section on a HERO page → detect photo backgrounds.
                            // Hero sections render the photo via <img class="object-cover">.
                            // Non-hero pages (PQR, Calculadora…) are excluded so they
                            // never accidentally get white text in light mode.
                            const hasBgImg = el.querySelector(
                                'img[class*="object-cover"], img.object-cover'
                            );
                            if (hasBgImg) {
                                darkFound = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (isHomePage) {
                let onLightSection = false;
                const lightSections = ['catalogo', 'aliados'];
                document.querySelectorAll('section[id]').forEach(sec => {
                    const rect = sec.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        if (lightSections.includes(sec.id)) onLightSection = true;
                    }
                });
                setIsScrollDark(!onLightSection);
            } else {
                setIsScrollDark(darkFound);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage, hasTransparentHero]);

    // Footer visibility detection via IntersectionObserver
    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsFooterVisible(entry.isIntersecting),
            { threshold: 0.05 }
        );
        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

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
            /* navigate removed */
        } else if (targetId === 'aliados') {
            navigate('/aliados');
        } else if (targetId === 'catálogo') {
            navigate('/catalogo');
        } else if (targetId === 'soporte') {
            /* dropdown only, no navigate */
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

    // 1. First determine text color logic
    let useDarkText = false;

    if (isAlwaysLightNavPage && !isDarkMode) {
        // PQR / Descargables: always dark blue text in light mode,
        // switch to white only when the footer is visible.
        useDarkText = !isFooterVisible;
    } else if (isScrolled) {
        if (isDarkMode) {
            useDarkText = false; // Dark mode → always white text
        } else {
            // Light mode: use white text if we're over a dark section
            useDarkText = !isScrollDark;
        }
    } else {
        // At the top
        if (hasTransparentHero) {
            useDarkText = false; // Transparent hero → always white
        } else {
            useDarkText = !isDarkMode; // Regular page top → follow theme
        }
    }

    // 2. Then determine navbar background based on text color state
    // We set a static padding (py-3 md:py-3.5) so proportions NEVER change on scroll.
    let navClasses = 'transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] border py-3 md:py-3.5 ';

    if (isScrolled) {
        // Scrolled state
        if (useDarkText) {
            navClasses += 'bg-white/70 backdrop-blur-xl shadow-xl border-white/40 ring-1 ring-black/5';
        } else {
            navClasses += 'bg-slate-900/70 backdrop-blur-xl shadow-xl border-white/10 ring-1 ring-white/10';
        }
    } else {
        // Top state
        if (hasTransparentHero) {
            // Glass muy sutil en top — permite ver el hero pero da presencia a la navbar
            navClasses += 'bg-white/10 dark:bg-black/20 border-white/20 backdrop-blur-md shadow-sm';
        } else {
            if (useDarkText) {
                navClasses += 'bg-white/80 backdrop-blur-xl shadow-md border-white/30';
            } else {
                navClasses += 'bg-slate-900/80 backdrop-blur-xl shadow-md border-white/10';
            }
        }
    }

    const textColorClass = useDarkText ? 'text-primary' : 'text-white';
    const logoSrc = useDarkText ? '/media/logo-azul-ghara.svg' : '/media/logo-blanco-ghara.svg';
    const hoverBgColor = useDarkText ? 'rgba(12, 77, 137, 0.08)' : 'rgba(255, 255, 255, 0.15)';

    return (
        <>
            <div
                className="fixed top-0 left-0 right-0 z-50 px-4 md:pt-6 pointer-events-none"
                style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
            >
                <motion.nav
                    className={`w-full pointer-events-auto rounded-2xl ${navClasses}`}
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
                            {['Inicio', 'Catálogo', 'Familia Ghara', 'Aliados', 'Servicios', 'Soporte'].map((item) => {
                                const isHovered = hoveredItem === item;

                                if (item === 'Servicios' || item === 'Aliados' || item === 'Soporte') {
                                    const subItems = item === 'Servicios' ? [
                                        { name: 'Residenciales', icon: 'home', path: '/servicios/residenciales' },
                                        { name: 'Empresariales', icon: 'business', path: '/servicios/empresariales' }
                                    ] : item === 'Aliados' ? [
                                        { name: 'Técnicos', icon: 'engineering', path: '/aliados?tab=tecnicos' },
                                        { name: 'Distribuidores', icon: 'local_shipping', path: '/aliados?tab=distribuidores' }
                                    ] : [
                                        { name: 'PQR', icon: 'forum', path: '/pqr' },
                                        { name: 'Descargables', icon: 'download', path: '/descargables' },
                                        { name: 'Preguntas Frecuentes', icon: 'help', path: '/preguntas-frecuentes' }
                                    ];

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
                                                            {subItems.map((subItem) => (
                                                                <a
                                                                    key={subItem.name}
                                                                    href={subItem.path}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (subItem.path.includes('?')) {
                                                                            // Handle query params for Aliados
                                                                            navigate(subItem.path);
                                                                        } else {
                                                                            navigate(subItem.path);
                                                                        }
                                                                        setHoveredItem(null);
                                                                    }}
                                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item relative overflow-hidden"
                                                                >
                                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-cyan-500/10 flex items-center justify-center text-primary dark:text-cyan-400 group-hover/item:bg-primary group-hover/item:text-white dark:group-hover/item:bg-cyan-500 dark:group-hover/item:text-black transition-all">
                                                                        <span className="material-symbols-outlined text-xl">{subItem.icon}</span>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{subItem.name}</span>
                                                                        <span className="text-[10px] text-slate-500 font-medium">Ver {item.toLowerCase()}</span>
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
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${useDarkText ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/20 text-white'}`}
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
            </div>

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
                        <div className="space-y-1">
                            <a
                                href="#inicio"
                                onClick={(e) => handleNavClick(e, 'Inicio')}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">home</span>
                                Inicio
                            </a>
                            <a
                                href="/catalogo"
                                onClick={(e) => handleNavClick(e, 'Catálogo')}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">view_list</span>
                                Catálogo
                            </a>
                            <a
                                href="#familia"
                                onClick={(e) => handleNavClick(e, 'Familia Ghara')}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">diversity_3</span>
                                Familia Ghara
                            </a>

                            <div className="my-3 border-t border-slate-100 dark:border-white/5" />
                            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Aliados</p>

                            <a
                                href="/aliados?tab=tecnicos"
                                onClick={(e) => { e.preventDefault(); navigate('/aliados?tab=tecnicos'); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">engineering</span>
                                Técnicos
                            </a>
                            <a
                                href="/aliados?tab=distribuidores"
                                onClick={(e) => { e.preventDefault(); navigate('/aliados?tab=distribuidores'); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">local_shipping</span>
                                Distribuidores
                            </a>

                            <div className="my-3 border-t border-slate-100 dark:border-white/5" />
                            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Servicios</p>

                            <a
                                href="/servicios/residenciales"
                                onClick={(e) => { e.preventDefault(); navigate('/servicios/residenciales'); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">house</span>
                                Residenciales
                            </a>
                            <a
                                href="/servicios/empresariales"
                                onClick={(e) => { e.preventDefault(); navigate('/servicios/empresariales'); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">business</span>
                                Empresariales
                            </a>

                            <div className="my-3 border-t border-slate-100 dark:border-white/5" />
                            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Soporte</p>

                            <a
                                href="/pqr"
                                onClick={(e) => { e.preventDefault(); navigate('/pqr'); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">forum</span>
                                PQR
                            </a>
                            <a
                                href="/descargables"
                                onClick={(e) => { e.preventDefault(); navigate('/descargables'); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">download</span>
                                Descargables
                            </a>
                            <a
                                href="/preguntas-frecuentes"
                                onClick={(e) => { e.preventDefault(); navigate('/preguntas-frecuentes'); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-cyber-cyan rounded-xl transition-all"
                            >
                                <span className="material-symbols-outlined">help</span>
                                Preguntas Frecuentes
                            </a>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-center justify-between px-1 mb-4">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tema</span>
                                    <button
                                        onClick={toggleTheme}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${isDarkMode
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
                                <button
                                    onClick={() => { navigate('/calculadora'); setIsMobileMenuOpen(false); }}
                                    className="w-full btn-primary-glow text-white px-6 py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
                                >
                                    <span className="material-symbols-outlined">calculate</span>
                                    Calcula tu aire
                                </button>
                            </div>
                        </div>
                    </nav>


                </div>
            </div>
        </>
    );
};

export default Navbar;
