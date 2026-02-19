import { useState, useEffect } from 'react';

/**
 * Hook para detectar el navegador y sus capacidades
 * @returns {Object} Información del navegador
 */
export const useBrowserDetect = () => {
    const [browserInfo, setBrowserInfo] = useState({
        name: 'unknown',
        version: 0,
        isChrome: false,
        isFirefox: false,
        isSafari: false,
        isEdge: false,
        isOpera: false,
        isMobile: false,
        supportsWebP: false,
        supportsAVIF: false,
        supportsBackdropFilter: false,
        supportsViewTransition: false,
    });

    useEffect(() => {
        const ua = navigator.userAgent;
        const vendor = navigator.vendor || '';

        // Detectar navegador
        let name = 'unknown';
        let version = 0;
        let isChrome = false;
        let isFirefox = false;
        let isSafari = false;
        let isEdge = false;
        let isOpera = false;

        if (/Edg\//.test(ua)) {
            name = 'edge';
            isEdge = true;
            version = parseInt(ua.match(/Edg\/(\d+)/)?.[1] || '0');
        } else if (/Chrome/.test(ua) && /Google Inc/.test(vendor)) {
            name = 'chrome';
            isChrome = true;
            version = parseInt(ua.match(/Chrome\/(\d+)/)?.[1] || '0');
        } else if (/Firefox/.test(ua)) {
            name = 'firefox';
            isFirefox = true;
            version = parseInt(ua.match(/Firefox\/(\d+)/)?.[1] || '0');
        } else if (/Safari/.test(ua) && /Apple Computer/.test(vendor)) {
            name = 'safari';
            isSafari = true;
            version = parseInt(ua.match(/Version\/(\d+)/)?.[1] || '0');
        } else if (/OPR\/|Opera/.test(ua)) {
            name = 'opera';
            isOpera = true;
            version = parseInt(ua.match(/(?:OPR|Opera)\/(\d+)/)?.[1] || '0');
        }

        // Detectar móvil
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

        // Detectar capacidades de formatos de imagen
        const supportsWebP = document.createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('data:image/webp') === 0;

        // Detectar AVIF (más complejo, requiere async pero lo simplificamos)
        const supportsAVIF = name === 'chrome' && version >= 85 ||
            name === 'edge' && version >= 85 ||
            name === 'firefox' && version >= 93 ||
            name === 'safari' && version >= 16;

        // Detectar backdrop-filter
        const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') ||
            CSS.supports('-webkit-backdrop-filter', 'blur(10px)');

        // Detectar View Transition API
        const supportsViewTransition = 'startViewTransition' in document;

        setBrowserInfo({
            name,
            version,
            isChrome,
            isFirefox,
            isSafari,
            isEdge,
            isOpera,
            isMobile,
            supportsWebP,
            supportsAVIF,
            supportsBackdropFilter,
            supportsViewTransition,
        });

        // Añadir clases al HTML para CSS condicional
        const html = document.documentElement;
        html.classList.add(`browser-${name}`);
        html.classList.add(`browser-version-${version}`);
        if (isMobile) html.classList.add('is-mobile');
        if (supportsWebP) html.classList.add('supports-webp');
        if (supportsAVIF) html.classList.add('supports-avif');
        if (supportsBackdropFilter) html.classList.add('supports-backdrop-filter');

    }, []);

    return browserInfo;
};

export default useBrowserDetect;
