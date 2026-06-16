import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Search, Bell, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--gh-bg)' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '220px', overflow: 'hidden' }}
           className="lg-pl-sidebar">

        {/* Topbar */}
        <header  style={{ height: "56px", 
          borderBottom: '1px solid rgba(240,238,232,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          gap: 16,
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            aria-label="Abrir menú"
            style={{ padding: '6px', color: 'var(--gh-text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
          >
            <Menu size={20} />
          </button>

          <div className="topbar-search hidden lg:flex">
            <Search size={14} color="#52566A" />
            <input placeholder="Buscar productos, PQR o reportes..." />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <ThemeToggle />

          <div style={{ position: 'relative' }}>
            <button
              aria-label="Notificaciones"
              onClick={() => setShowNotifs(!showNotifs)}
              style={{
                position: 'relative', padding: '7px', borderRadius: '8px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--gh-text-muted)', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gh-border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <Bell size={17} strokeWidth={1.75} />
              {showNotifs ? null : (
                <span style={{
                  position: 'absolute', top: '6px', right: '6px',
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--gh-danger)', border: '1.5px solid var(--gh-surface-1)',
                }} />
              )}
            </button>

            {showNotifs && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                width: '300px', background: 'var(--gh-surface-1)',
                border: '1px solid var(--gh-border)', borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50,
                overflow: 'hidden', padding: '12px 0'
              }}>
                <div style={{ padding: '0 16px 8px', borderBottom: '1px solid var(--gh-border)', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gh-text-primary)' }}>Notificaciones</h4>
                </div>
                <div style={{ padding: '8px 16px', display: 'flex', gap: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='var(--gh-surface-2)'} onMouseLeave={e => e.currentTarget.style.background='transparent'} onClick={() => setShowNotifs(false)}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gh-danger)', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gh-text-primary)', fontWeight: 500 }}>Nueva PQR abierta</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--gh-text-muted)' }}>Hace 5 min</p>
                  </div>
                </div>
                <div style={{ padding: '8px 16px', display: 'flex', gap: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='var(--gh-surface-2)'} onMouseLeave={e => e.currentTarget.style.background='transparent'} onClick={() => setShowNotifs(false)}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gh-accent)', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gh-text-primary)', fontWeight: 500 }}>Cotización residencial</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--gh-text-muted)' }}>Hace 1 hr</p>
                  </div>
                </div>
              </div>
            )}
          </div>

            <button
              aria-label="Configuración"
              style={{
                padding: '7px', borderRadius: '8px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--gh-text-muted)', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gh-border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <Settings size={17} strokeWidth={1.75} />
            </button>

            <div style={{ width: '1px', height: '20px', background: 'var(--gh-border)', margin: '0 4px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gh-text-primary)', lineHeight: 1.2, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Admin Ghara
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--gh-text-muted)', fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  System Admin
                </p>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'rgba(45, 196, 196,0.15)',
                border: '1px solid rgba(45, 196, 196,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gh-brand-1)', fontWeight: 500, fontSize: '0.8rem',
                fontFamily: "'Syne', sans-serif", flexShrink: 0,
              }}>
                A
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '24px 28px', background: 'var(--gh-bg)' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .lg-pl-sidebar { padding-left: 0 !important; }
        }
        @media (max-width: 767px) {
          main { padding: 16px !important; }
        }
        @media (min-width: 768px) {
          .dashboard-kpi-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .dashboard-2col-grid { grid-template-columns: 1fr 1fr !important; }
          .productos-kpi-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
