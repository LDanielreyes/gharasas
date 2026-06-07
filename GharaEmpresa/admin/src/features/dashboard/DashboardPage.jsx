import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle, Package, ExternalLink, Eye, MessageSquare } from 'lucide-react';
import apiClient from '../../api/client';

const KpiCard = ({ title, value, icon: Icon, color, subtitulo }) => (
  <div className="gh-card" style={{ padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, background: `var(--${color}-50)`, borderRadius: '50%', opacity: 0.5 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--gh-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
        <h3 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--gh-text-primary)', marginTop: '6px' }}>{value || 0}</h3>
        {subtitulo && <p style={{ fontSize: '0.75rem', color: 'var(--gh-text-muted)', marginTop: '4px' }}>{subtitulo}</p>}
      </div>
      <div style={{ padding: '10px', background: `var(--${color}-50)`, borderRadius: '12px', color: `var(--${color}-600)` }}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Abierto':    { bg: '#fee2e2', col: '#b91c1c' },
    'En Proceso': { bg: '#fef9c3', col: '#854d0e' },
    'Resuelto':   { bg: '#dcfce7', col: '#15803d' },
  };
  const s = styles[status] || styles['Abierto'];
  return (
    <span style={{ background: s.bg, color: s.col, padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
      {status}
    </span>
  );
};

const DashboardPage = () => {
  const [kpis, setKpis] = useState({});
  const [pqrs, setPqrs] = useState([]);
  const [embudo, setEmbudo] = useState({});
  const [topProductos, setTopProductos] = useState({ masVistos: [], masVendidos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, pqrRes, embudoRes, topRes] = await Promise.allSettled([
          apiClient.get('/admin/analytics/dashboard'),
          apiClient.get('/admin/pqr?limit=4&estado=Abierto'),
          apiClient.get('/admin/analytics/embudos'),
          apiClient.get('/admin/analytics/productos-top?limite=5')
        ]);

        if (dashRes.status === 'fulfilled') {
          setKpis(dashRes.value.data.data);
        }
        if (pqrRes.status === 'fulfilled') {
          setPqrs(pqrRes.value.data.data?.slice(0, 4) || []);
        }
        if (embudoRes.status === 'fulfilled') {
          setEmbudo(embudoRes.value.data.data);
        }
        if (topRes.status === 'fulfilled') {
          setTopProductos(topRes.value.data.data);
        }
      } catch (e) {
        console.error('Dashboard error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ── KPIs Principales ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <KpiCard title="Cotizaciones (Mes)"  value={kpis.leadsMes}               icon={Users}        color="blue" subtitulo={`Hoy: ${kpis.leadsHoy || 0}`} />
        <KpiCard title="Reseñas Pendientes"  value={kpis.resenaPendientes}       icon={MessageSquare}color="orange" />
        <KpiCard title="PQR Abiertos"        value={kpis.pqrAbiertos}            icon={AlertCircle}  color="red" />
        <KpiCard title="Productos Activos"   value={kpis.productosActivos}       icon={Package}      color="emerald" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* ── Embudo de Conversión (Leads) ── */}
        <div className="gh-card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>Embudo de Interacción</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--gh-text-muted)', marginTop: '2px' }}>Vistas vs Cotizaciones por WhatsApp</p>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--blue-50)', color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--gh-text-muted)', fontWeight: 600 }}>1. Vistas de Producto</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>{embudo?.vistas?.toLocaleString() || 0}</h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gh-text-muted)' }}>100%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--blue-500)', width: '100%' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--gh-text-muted)', fontWeight: 600 }}>2. Cotizaciones (Leads de WhatsApp)</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>{embudo?.leads?.toLocaleString() || 0}</h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-600)' }}>{embudo?.tasaLeads}% conversión</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--green-500)', width: `${Math.min(embudo?.tasaLeads || 0, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Productos (Vistas) ── */}
        <div className="gh-card" style={{ padding: '22px 24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>Top 5 Productos Más Vistos</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--gh-text-muted)', marginTop: '2px' }}>Los productos que generan mayor interés</p>
          </div>
          {topProductos.masVistos?.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gh-text-muted)', fontSize: '0.875rem' }}>
              Aún no hay datos de vistas de productos.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topProductos.masVistos?.map((p, i) => (
                <div key={p.idProducto} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: i === 0 ? 'var(--blue-100)' : i === 1 ? 'var(--slate-200)' : i === 2 ? 'var(--sky-100)' : '#e2e8f0', color: i === 0 ? 'var(--blue-600)' : i === 1 ? 'var(--slate-600)' : i === 2 ? 'var(--sky-700)' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                      #{i + 1}
                    </div>
                    <p style={{ fontWeight: 600, color: 'var(--gh-text-primary)', fontSize: '0.85rem' }}>{p.nombre}</p>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--blue-600)', fontSize: '0.9rem' }}>
                    {p.vistas} vistas
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tickets PQR ── */}
      <div className="gh-card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>Tickets PQR Recientes</h2>
          <Link to="/pqr" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: '#1565cc', fontWeight: 500, textDecoration: 'none' }}>
            Ver todos <ExternalLink size={13} />
          </Link>
        </div>
        {pqrs.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gh-text-muted)', fontSize: '0.875rem' }}>
            {loading ? 'Cargando tickets...' : '¡No hay tickets abiertos! Todo está bajo control.'}
          </div>
        ) : (
          <table className="data-table" style={{ marginTop: '0' }}>
            <thead>
              <tr>
                <th>TICKET</th>
                <th>REMITENTE</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {pqrs.map(pqr => (
                <tr key={pqr.idPqr}>
                  <td style={{ fontWeight: 600, color: '#1565cc', fontSize: '0.8rem' }}>#{pqr.radicado}</td>
                  <td style={{ fontWeight: 500, color: 'var(--gh-text-primary)', fontSize: '0.8rem' }}>{pqr.nombreRemitente}</td>
                  <td><StatusBadge status={pqr.estadoTicket} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
