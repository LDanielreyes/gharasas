export const loadAnalytics = () => {
    if (document.getElementById('ga-script')) return; // Evitar cargar múltiples veces
    
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JBF9B5V25L';
    script.async = true;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-JBF9B5V25L', { anonymize_ip: true });
};
