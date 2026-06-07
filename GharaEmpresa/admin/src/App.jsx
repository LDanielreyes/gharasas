import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './shared/components/Layout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';

import DashboardPage  from './features/dashboard/DashboardPage';
import PqrPage        from './features/pqr/PqrPage';
import ProductosPage  from './features/productos/ProductosPage';
import ResenasPage    from './features/resenas/ResenasPage';
import SeoPage        from './features/seo/SeoPage';
import ReportesPage   from './features/reportes/ReportesPage';
import AdministradoresPage from './features/usuarios/AdministradoresPage';
import DescargablesPage from './features/descargables/DescargablesPage';
import FaqPage from './features/faq/FaqPage';

// Rutas Placeholder para módulos en construcción
const Placeholder = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
    <div style={{
      width: 56, height: 56, borderRadius: '12px',
      background: 'rgba(0,181,216,0.08)',
      border: '1px solid rgba(0,181,216,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B5D8" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    </div>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F0EEE8', fontFamily: "'Syne', sans-serif", marginBottom: '6px' }}>{title}</h2>
      <p style={{ fontSize: '0.85rem', color: '#52566A', fontFamily: "'IBM Plex Sans', sans-serif" }}>Este módulo está en construcción.</p>
    </div>
  </div>
);


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductosPage />} />
                    <Route path="/pqr"       element={<PqrPage />} />
          <Route path="/resenas"   element={<ResenasPage />} />
          <Route path="/reportes"  element={<ReportesPage />} />
          <Route path="/seo"       element={<SeoPage />} />
          <Route path="/preguntas" element={<FaqPage />} />
          <Route path="/usuarios"  element={<AdministradoresPage />} />
          <Route path="/descargables"  element={<DescargablesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
