import React from 'react';

const BrandLogos = () => {
    const logos = [
        { name: 'Hisense', src: '/media/hisense-seeklogo.svg' },
        { name: 'Mabe', src: '/media/mabe-seeklogo.svg' },
        { name: 'McQuay', src: '/media/mcquay-seeklogo.svg' },
        { name: 'Midea', src: '/media/midea-seeklogo.svg' },
        { name: 'Mirage', src: '/media/mirage-appliances-seeklogo.svg' }
    ];

    return (
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden relative">
            {/* Fade Gradients */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>

            {/* Carousel Container */}
            <div className="flex overflow-hidden select-none group">
                {/* First Set */}
                <div className="flex gap-16 md:gap-24 items-center flex-shrink-0 animate-scroll-infinite">
                    {logos.map((logo, index) => (
                        <img
                            key={`logo-1-${index}`}
                            alt={logo.name}
                            className="h-10 md:h-14 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex-shrink-0"
                            src={logo.src}
                        />
                    ))}
                </div>

                {/* Second Set (Duplicate) */}
                <div className="flex gap-16 md:gap-24 items-center flex-shrink-0 ml-16 md:ml-24 animate-scroll-infinite" aria-hidden="true">
                    {logos.map((logo, index) => (
                        <img
                            key={`logo-2-${index}`}
                            alt={logo.name}
                            className="h-10 md:h-14 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex-shrink-0"
                            src={logo.src}
                        />
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes scroll-infinite {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-100%); }
                    }
                    .animate-scroll-infinite {
                        animation: scroll-infinite 30s linear infinite;
                    }
                    .group:hover .animate-scroll-infinite {
                        animation-play-state: paused;
                    }
                `
            }} />
        </section>
    );
};

export default BrandLogos;