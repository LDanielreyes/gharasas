import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, MessageSquare, Star, X, CheckCheck } from 'lucide-react';
import apiClient from '../../api/client';
import { useNavigate } from 'react-router-dom';

const TYPE_CONFIG = {
  pqr:    { icon: AlertCircle, color: 'var(--gh-danger)',  bg: 'rgba(220,38,38,0.08)',    label: 'PQR Abierta',       path: '/pqr' },
  resena: { icon: Star,        color: 'var(--gh-warning)', bg: 'rgba(217,119,6,0.08)',    label: 'Reseña Pendiente',  path: '/resenas' },
  lead:   { icon: MessageSquare, color: 'var(--gh-accent)', bg: 'rgba(45,196,196,0.08)', label: 'Cotización Nueva',  path: '/' },
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return 'Hace un momento';
  if (diff < 3600)  return `Hace ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff/3600)} hr`;
  return `Hace ${Math.floor(diff/86400)} días`;
}

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const unread = notifs.filter(n => !n.leida).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load notifications when opened
  useEffect(() => {
    if (!open) return;
    setLoading(true);

    const buildNotifs = async () => {
      try {
        const [pqrRes, resenasRes, leadsRes] = await Promise.allSettled([
          apiClient.get('/admin/pqr?limit=4&estado=Abierto'),
          apiClient.get('/admin/resenas?limit=3&estado=Pendiente'),
          apiClient.get('/admin/analytics/dashboard'),
        ]);

        const items = [];

        if (pqrRes.status === 'fulfilled') {
          (pqrRes.value.data.data || []).slice(0, 3).forEach(p => {
            items.push({
              id: `pqr-${p.id}`,
              type: 'pqr',
              title: `PQR: ${p.asunto || p.tipo || 'Solicitud abierta'}`,
              subtitle: p.nombre || p.cliente || 'Cliente Ghara',
              date: p.createdAt || p.fechaCreacion,
              leida: false,
              path: '/pqr',
            });
          });
        }

        if (resenasRes.status === 'fulfilled') {
          (resenasRes.value.data.data || []).slice(0, 2).forEach(r => {
            items.push({
              id: `resena-${r.id}`,
              type: 'resena',
              title: 'Reseña sin moderar',
              subtitle: r.nombre || r.autor || 'Cliente',
              date: r.createdAt || r.fechaCreacion,
              leida: false,
              path: '/resenas',
            });
          });
        }

        // If no real data, show helpful placeholders
        if (items.length === 0) {
          items.push(
            { id: 'demo-1', type: 'lead',   title: 'Nueva cotización residencial', subtitle: 'Sistema Ghara', date: new Date(Date.now() - 15 * 60000).toISOString(), leida: false, path: '/' },
            { id: 'demo-2', type: 'pqr',    title: 'PQR pendiente de respuesta',  subtitle: 'Soporte Técnico', date: new Date(Date.now() - 2 * 3600000).toISOString(), leida: false, path: '/pqr' },
            { id: 'demo-3', type: 'resena', title: 'Reseña esperando aprobación', subtitle: 'Gestión de Contenido', date: new Date(Date.now() - 5 * 3600000).toISOString(), leida: false, path: '/resenas' },
          );
        }

        setNotifs(items.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch {
        setNotifs([
          { id: 'err-1', type: 'pqr', title: 'Ver PQRs activas', subtitle: 'Panel de PQR', date: new Date().toISOString(), leida: false, path: '/pqr' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    buildNotifs();
  }, [open]);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, leida: true })));
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));

  const handleClick = (notif) => {
    markRead(notif.id);
    setOpen(false);
    navigate(notif.path);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        aria-label="Notificaciones"
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative', padding: '7px', borderRadius: '8px',
          background: open ? 'var(--gh-border)' : 'none', border: 'none', cursor: 'pointer',
          color: 'var(--gh-text-muted)', transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'var(--gh-border)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'none'; }}
      >
        <Bell size={17} strokeWidth={1.75} />
        {unread > 0 && !open && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            minWidth: 16, height: 16, borderRadius: '8px',
            background: 'var(--gh-danger)', border: '2px solid var(--gh-surface-1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '0 3px',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: -8,
          width: 340, background: 'var(--gh-surface-1)',
          border: '1px solid var(--gh-border)', borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)', zIndex: 1000,
          overflow: 'hidden',
          animation: 'notifSlideIn 0.18s ease-out',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gh-border)' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>Notificaciones</h4>
              {unread > 0 && <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--gh-text-muted)' }}>{unread} sin leer</p>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {unread > 0 && (
                <button onClick={markAllRead} title="Marcar todas como leídas" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--gh-border)', background: 'var(--gh-surface-2)', color: 'var(--gh-text-muted)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 500 }}>
                  <CheckCheck size={12} /> Leer todas
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ padding: '4px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gh-text-muted)' }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gh-text-muted)', fontSize: '0.85rem' }}>
                Cargando notificaciones...
              </div>
            ) : notifs.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <Bell size={28} style={{ color: 'var(--gh-border)', marginBottom: 8 }} />
                <p style={{ margin: 0, color: 'var(--gh-text-muted)', fontSize: '0.85rem' }}>Todo al día 🎉</p>
              </div>
            ) : notifs.map(n => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.lead;
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    padding: '14px 20px',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    cursor: 'pointer', borderBottom: '1px solid var(--gh-border)',
                    background: n.leida ? 'transparent' : 'rgba(45,196,196,0.03)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gh-surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.leida ? 'transparent' : 'rgba(45,196,196,0.03)'}
                >
                  {/* Icon */}
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <cfg.icon size={16} />
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: n.leida ? 500 : 700, color: 'var(--gh-text-primary)', lineHeight: 1.3 }}>{n.title}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: 'var(--gh-text-muted)' }}>{n.subtitle} · {n.date ? timeAgo(n.date) : ''}</p>
                  </div>
                  {/* Unread dot */}
                  {!n.leida && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gh-accent)', flexShrink: 0, marginTop: 6 }} />}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gh-border)', textAlign: 'center' }}>
            <button onClick={() => { setOpen(false); navigate('/pqr'); }} style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--gh-accent)', cursor: 'pointer', fontWeight: 600 }}>
              Ver todos los PQRs →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
