import React, { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import client from '../shared/api/client';
import Navbar from '../shared/components/layout/Navbar';
import Footer from '../shared/components/layout/Footer';
import ScrollToTop from '../shared/components/utility/ScrollToTop';
import PageLoader from '../shared/components/ui/PageLoader';
import CookieBanner from '../shared/components/ui/CookieBanner';
import useBrowserDetect from '../shared/hooks/useBrowserDetect';
import { loadAnalytics } from '../shared/utility/analytics';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '573022326569';

/* Botón flotante de WhatsApp — visible en todas las páginas */
function WhatsAppFAB() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-5 z-50 group flex items-center gap-2"
    >
      {/* ícono circular */}
      <span className="
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-green-500 hover:bg-green-600
        shadow-lg shadow-green-500/40
        hover:shadow-green-500/60
        transition-all duration-200
        active:scale-95
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500
      ">
        {/* SVG del logo de WhatsApp */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.477.65 4.8 1.782 6.818L2 30l7.394-1.74A13.952 13.952 0 0016.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm0 25.6a11.558 11.558 0 01-5.89-1.607l-.423-.25-4.387 1.032.985-4.276-.276-.44A11.553 11.553 0 014.4 16.003c0-6.406 5.197-11.603 11.603-11.603S27.6 9.597 27.6 16.003 22.41 27.6 16.003 27.6zm6.368-8.677c-.349-.174-2.066-1.018-2.386-1.135-.32-.116-.553-.174-.786.174-.232.349-.9 1.135-1.103 1.368-.203.232-.406.261-.755.087-.349-.174-1.474-.543-2.807-1.73-1.038-.924-1.738-2.065-1.941-2.414-.203-.349-.022-.538.152-.712.157-.156.349-.407.523-.61.174-.204.232-.349.348-.582.116-.232.058-.436-.029-.61-.087-.174-.786-1.893-1.077-2.592-.283-.681-.57-.589-.786-.6l-.669-.011c-.232 0-.61.087-.93.436-.32.349-1.222 1.193-1.222 2.912s1.251 3.376 1.425 3.608c.174.232 2.462 3.76 5.964 5.273.833.36 1.483.574 1.99.735.836.266 1.597.228 2.199.138.671-.1 2.066-.844 2.358-1.66.291-.813.291-1.511.203-1.66-.087-.145-.32-.232-.669-.407z" />
        </svg>
      </span>
    </a>
  );
}

function App() {
  const browserInfo = useBrowserDetect();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🌐 Browser:', browserInfo.name, 'v' + browserInfo.version, '| Mobile:', browserInfo.isMobile);
    }
  }, [browserInfo]);

  useEffect(() => {
    const prefs = localStorage.getItem('ghara_cookie_prefs');
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        if (parsed.analytics) {
          loadAnalytics();
        }
      } catch (e) {
        // Ignorar
      }
    }
  }, []);

  const location = useLocation();

  useEffect(() => {
    // El tracking genérico de rutas fue removido porque la API solo registra vistas específicas por producto (POST /api/vistas/:id)
    // Se delega esta analítica a Google Analytics u otra herramienta externa.
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-300">
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
      <WhatsAppFAB />
      <CookieBanner />
    </main>
  );
}

export default App;
