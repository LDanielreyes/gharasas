import React, { useState, useEffect } from 'react';
import {
  Search, Download, AlertCircle, Clock, CheckCircle2,
  ChevronLeft, ChevronRight, RefreshCw,
} from 'lucide-react';
import apiClient from '../../api/client';
import Swal from 'sweetalert2';

// ─── Semáforo badge ───────────────────────────────────────
const SemaforoBadge = ({ semaforo }) => {
  if (!semaforo) return <span style={{ color: '#d1d5db', fontSize: '0.8rem' }}>—</span>;

  const map = {
    rojo:     { bg: '#fee2e2', color: '#b91c1c', icon: <AlertCircle size={12} />, label: `Vencido (${semaforo.diasTranscurridos}d)` },
    amarillo: { bg: '#fef9c3', color: '#854d0e', icon: <Clock size={12} />,       label: `Alerta — quedan ${semaforo.diasRestantes}d` },
    verde:    { bg: '#dcfce7', color: '#15803d', icon: <CheckCircle2 size={12} />, label: `En tiempo (${semaforo.diasRestantes}d)` },
  };
  const s = map[semaforo.color] || map.verde;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '99px',
      background: s.bg, color: s.color,
      fontSize: '0.72rem', fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {s.icon} {s.label}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    'Abierto':    { bg: '#dbeffe', color: '#1565cc' },
    'En Proceso': { bg: '#fef9c3', color: '#854d0e' },
    'Resuelto':   { bg: '#dcfce7', color: '#15803d' },
  };
  const s = map[status] || map['Abierto'];
  return (
    <span style={{
      background: s.bg, color: s.color, padding: '4px 10px',
      borderRadius: '99px', fontSize: '0.68rem', fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      {status}
    </span>
  );
};

const PqrPage = () => {
  const [pqrs, setPqrs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');

  useEffect(() => {
    fetchPqrs();
  }, [filterEstado]);

  const fetchPqrs = async () => {
    try {
      setLoading(true);
      let url = '/admin/pqr?limit=50';
      if (filterEstado !== 'Todos') url += `&estado=${filterEstado}`;
      const res = await apiClient.get(url);
      setPqrs(res.data.data || []);
    } catch (e) {
      console.error('Error cargando PQRs', e);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    try {
      const response = await apiClient.get('/admin/pqr/exportar', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PQR_Ghara_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al exportar. Intenta de nuevo.', confirmButtonColor: '#1a3f6a' });
    }
  };

    const resolverPqr = async (idPqr, radicado) => {
    const { value: respuesta } = await Swal.fire({
      title: 'Responder PQR',
      input: 'textarea',
      inputLabel: `Respuesta oficial para cerrar el ticket ${radicado}`,
      inputPlaceholder: 'Escribe tu respuesta aquí (mínimo 10 caracteres)...',
      inputAttributes: {
        'aria-label': 'Escribe tu respuesta aquí'
      },
      showCancelButton: true,
      confirmButtonText: 'Cerrar Ticket',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1a3f6a',
      inputValidator: (value) => {
        if (!value || value.length < 10) {
          return 'La respuesta es muy corta (mínimo 10 caracteres).'
        }
      }
    });

    if (!respuesta) return;

    try {
      await apiClient.patch(`/admin/pqr/${idPqr}/responder`, { respuesta });
      Swal.fire({ icon: 'success', title: 'Resuelto', text: 'PQR resuelto. Se notificará al cliente por correo.', confirmButtonColor: '#1a3f6a' });
      fetchPqrs();
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al responder el PQR.', confirmButtonColor: '#1a3f6a' });
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });

  const filtered = pqrs.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.radicado?.toLowerCase().includes(q) ||
      p.nombreRemitente?.toLowerCase().includes(q) ||
      p.asunto?.toLowerCase().includes(q)
    );
  });

  const openCount = pqrs.filter(p => p.estadoTicket !== 'Resuelto').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Gestión Legal — PQR</h1>
          <p className="page-subtitle">
            Semáforo basado en Ley 1581 · Plazo máximo: 15 días hábiles (SIC Colombia)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchPqrs} style={{ gap: 6 }}>
            <RefreshCw size={14} /> Actualizar
          </button>
          <button className="btn-primary" onClick={exportExcel} style={{ background: '#15803d', gap: 6 }}>
            <Download size={14} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total PQR',    value: pqrs.length, bg: '#f4f7fb', col: '#374151' },
          { label: 'Sin Resolver', value: openCount,   bg: '#fef9c3', col: '#854d0e' },
          { label: 'Resueltos',    value: pqrs.length - openCount, bg: '#dcfce7', col: '#15803d' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', background: s.bg, borderColor: 'transparent' }}>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: s.col, marginTop: '4px' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por radicado, nombre o asunto..."
            style={{
              width: '100%', paddingLeft: '36px', height: '38px',
              border: '1px solid #e9ecf1', borderRadius: '8px',
              fontSize: '0.875rem', background: '#f9fafb', outline: 'none',
              color: '#374151', fontFamily: 'inherit',
            }}
          />
        </div>
        <select
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
          style={{
            height: '38px', padding: '0 36px 0 12px', border: '1px solid #e9ecf1',
            borderRadius: '8px', fontSize: '0.875rem', background: '#f9fafb',
            color: '#374151', outline: 'none', cursor: 'pointer',
            fontFamily: 'inherit', minWidth: '150px', appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          }}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Abierto">Abiertos</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Resuelto">Resueltos</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
            Cargando tickets PQR...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <CheckCircle2 size={36} style={{ margin: '0 auto 12px', color: '#d1d5db' }} />
            <p style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
              {search || filterEstado !== 'Todos' ? 'Sin resultados con estos filtros' : '¡Sin tickets abiertos!'}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              {!search && filterEstado === 'Todos' && 'Todos los PQR han sido atendidos.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '20px' }}>RADICADO / FECHA</th>
                  <th>REMITENTE</th>
                  <th>ASUNTO</th>
                  <th>ESTADO</th>
                  <th>SEMÁFORO LEGAL</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(pqr => (
                  <tr key={pqr.idPqr}>
                    <td style={{ paddingLeft: '20px' }}>
                      <p style={{ fontWeight: 700, color: '#1565cc', fontSize: '0.875rem' }}>
                        {pqr.radicado}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                        {formatDate(pqr.fechaRadicado)}
                      </p>
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
                        {pqr.nombreRemitente}
                      </p>
                      <span style={{
                        display: 'inline-block', marginTop: '3px',
                        padding: '2px 8px', borderRadius: '99px',
                        fontSize: '0.68rem', fontWeight: 600,
                        background: '#f3f4f6', color: '#6b7280',
                      }}>
                        {pqr.tipoSolicitud}
                      </span>
                    </td>
                    <td style={{ maxWidth: '220px' }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#374151' }}>
                        {pqr.asunto}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={pqr.estadoTicket} />
                    </td>
                    <td>
                      <SemaforoBadge semaforo={pqr.semaforo} />
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      {pqr.estadoTicket !== 'Resuelto' && (
                        <button
                          onClick={() => resolverPqr(pqr.idPqr, pqr.radicado)}
                          style={{
                            padding: '6px 14px', borderRadius: '6px',
                            background: '#1a3f6a', color: '#fff',
                            fontSize: '0.78rem', fontWeight: 600,
                            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#163355'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#1a3f6a'; }}
                        >
                          Gestionar
                        </button>
                      )}
                      {pqr.estadoTicket === 'Resuelto' && (
                        <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Resuelto</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {!loading && filtered.length > 0 && (
          <div style={{
            padding: '13px 20px', borderTop: '1px solid #f0f2f5',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
              Mostrando <strong style={{ color: '#374151' }}>{filtered.length}</strong> de{' '}
              <strong style={{ color: '#374151' }}>{pqrs.length}</strong> tickets
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn-secondary" style={{ padding: '5px 10px' }} disabled>
                <ChevronLeft size={14} />
              </button>
              <span style={{ padding: '5px 10px', borderRadius: '6px', background: '#1a3f6a', color: '#fff', fontSize: '0.8125rem', fontWeight: 600 }}>1</span>
              <button className="btn-secondary" style={{ padding: '5px 10px' }} disabled>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PqrPage;
