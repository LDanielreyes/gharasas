import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/components/layout/Navbar';
import Footer from '../shared/components/layout/Footer';
import useBrowserDetect from '../shared/hooks/useBrowserDetect';

function App() {
  // Detectar navegador y aplicar optimizaciones
  const browserInfo = useBrowserDetect();

  useEffect(() => {
    // Log browser info for debugging (can be removed in production)
    console.log('🌐 Browser detected:', browserInfo.name, 'v' + browserInfo.version);
    console.log('📱 Mobile:', browserInfo.isMobile);
    console.log('🖼️ WebP support:', browserInfo.supportsWebP);
    console.log('🎨 AVIF support:', browserInfo.supportsAVIF);
    console.log('✨ Backdrop-filter:', browserInfo.supportsBackdropFilter);
  }, [browserInfo]);

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-300">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}

export default App;
