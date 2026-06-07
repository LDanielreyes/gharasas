import React from 'react';

/**
 * BrandLogos — Marquee de velocidad constante en todos los dispositivos.
 *
 * Usa un solo track con 10 logos (5 originales x2 duplicados) y
 * translateX(-50%). Como el ancho de cada logo es fijo en px, la
 * distancia total animada es siempre la misma sin importar el viewport.
 *
 * Fórmula: duration = (N_logos × LOGO_SLOT_PX) / PX_PER_SECOND
 *   Mobile:  5 × 140px = 700px  →  700 / 20px/s = 35s
 *   Desktop: 5 × 200px = 1000px → 1000 / 20px/s = 50s
 */

const logos = [
    { name: 'Hisense', src: '/media/hisense-seeklogo.svg' },
    { name: 'Mabe', src: '/media/mabe-seeklogo.svg' },
    { name: 'McQuay', src: '/media/mcquay-seeklogo.svg' },
    { name: 'Midea', src: '/media/midea-seeklogo.svg' },
    { name: 'Mirage', src: '/media/mirage-appliances-seeklogo.svg' },
];

const track = [...logos, ...logos]; // 10 items → animamos −50 %

const BrandLogos = () => (
    <section className="hidden md:block py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden relative">

        {/* Fade Gradients */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

        {/* Marquee Viewport */}
        <div className="ghara-viewport flex overflow-hidden select-none">
            <div className="ghara-track flex items-center">
                {track.map((logo, i) => (
                    <div key={i} className="ghara-slot flex-shrink-0 flex items-center justify-center">
                        <img
                            src={logo.src}
                            alt={logo.name}
                            className="ghara-img object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        />
                    </div>
                ))}
            </div>
        </div>

        <style>{`
            /* ── Tamaño fijo de cada slot ────────── */
            /* Mobile: slot 140 px, imagen 80 px     */
            .ghara-slot  { width: 140px; height: 44px; }
            .ghara-img   { width: 80px;  height: 44px; }

            /* Desktop: slot 200 px, imagen 120 px   */
            @media (min-width: 768px) {
                .ghara-slot { width: 200px; height: 52px; }
                .ghara-img  { width: 120px; height: 52px; }
            }

            /* ── Animación ───────────────────────── */
            @keyframes ghara-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }

            /*
             * Mobile:  5 slots × 140px = 700px  → 700/20 = 35s
             * Desktop: 5 slots × 200px = 1000px → 1000/20 = 50s
             * Cambiar el divisor (20) para ajustar px/s globalmente.
             */
            .ghara-track {
                width: max-content;
                animation: ghara-scroll 35s linear infinite;
            }

            @media (min-width: 768px) {
                .ghara-track {
                    animation-duration: 50s;
                }
            }

            /* Pausar en hover */
            .ghara-viewport:hover .ghara-track {
                animation-play-state: paused;
            }
        `}</style>
    </section>
);

export default BrandLogos;