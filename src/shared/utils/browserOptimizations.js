/**
 * Utilidad para generar URLs de imágenes optimizadas según el navegador
 */

/**
 * Obtiene la mejor versión de una imagen según el soporte del navegador
 * @param {string} basePath - Ruta base de la imagen sin extensión
 * @param {Object} options - Opciones de formato
 * @returns {string} URL de la imagen optimizada
 */
export const getOptimizedImageUrl = (basePath, options = {}) => {
    const {
        supportsAVIF = false,
        supportsWebP = false,
        fallbackExt = 'jpg'
    } = options;

    // Prioridad: AVIF > WebP > Fallback
    if (supportsAVIF) {
        return `${basePath}.avif`;
    } else if (supportsWebP) {
        return `${basePath}.webp`;
    } else {
        return `${basePath}.${fallbackExt}`;
    }
};

/**
 * Genera srcset para imágenes responsive
 * @param {string} basePath - Ruta base sin extensión
 * @param {Array} sizes - Array de tamaños [width, descriptor]
 * @param {Object} browserInfo - Información del navegador
 * @returns {string} String srcset
 */
export const generateSrcSet = (basePath, sizes, browserInfo) => {
    const ext = browserInfo.supportsAVIF ? 'avif' :
        browserInfo.supportsWebP ? 'webp' : 'jpg';

    return sizes
        .map(([width, descriptor]) => `${basePath}-${width}w.${ext} ${descriptor}`)
        .join(', ');
};

/**
 * Componente de imagen optimizada
 */
export const OptimizedImage = ({ src, alt, className, sizes, ...props }) => {
    // Nota: Este componente debería usar useBrowserDetect en un contexto React
    // Por ahora es un placeholder para la implementación completa
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
            {...props}
        />
    );
};

/**
 * Configuración de optimizaciones por navegador
 */
export const browserOptimizations = {
    chrome: {
        // Chrome soporta la mayoría de características modernas
        enableViewTransitions: true,
        enableBackdropFilter: true,
        preferredImageFormat: 'avif',
        enablePrefetch: true,
    },
    firefox: {
        // Firefox tiene buen soporte pero algunos features más recientes pueden variar
        enableViewTransitions: false, // Verificar versión
        enableBackdropFilter: true,
        preferredImageFormat: 'webp',
        enablePrefetch: true,
    },
    safari: {
        // Safari requiere -webkit- prefixes en algunos casos
        enableViewTransitions: false,
        enableBackdropFilter: true, // Necesita -webkit-
        preferredImageFormat: 'webp',
        enablePrefetch: false, // Safari maneja esto diferente
        useWebkitPrefix: true,
    },
    edge: {
        // Edge (Chromium) similar a Chrome
        enableViewTransitions: true,
        enableBackdropFilter: true,
        preferredImageFormat: 'avif',
        enablePrefetch: true,
    },
    opera: {
        // Opera basado en Chromium
        enableViewTransitions: true,
        enableBackdropFilter: true,
        preferredImageFormat: 'webp',
        enablePrefetch: true,
    },
    unknown: {
        // Configuración segura para navegadores desconocidos
        enableViewTransitions: false,
        enableBackdropFilter: false,
        preferredImageFormat: 'jpg',
        enablePrefetch: false,
    }
};

/**
 * Obtiene las optimizaciones recomendadas para un navegador
 */
export const getBrowserOptimizations = (browserName) => {
    return browserOptimizations[browserName] || browserOptimizations.unknown;
};
