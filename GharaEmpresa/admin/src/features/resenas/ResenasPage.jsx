import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, Star, RefreshCw, Trash2 } from 'lucide-react';
import apiClient from '../../api/client';

// ─── Star rating ──────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        fill={i < rating ? '#f59e0b' : 'none'}
        color={i < rating ? '#f59e0b' : '#d1d5db'}
        strokeWidth={i < rating ? 0 : 1.5}
      />
    ))}
  </div>
);

// ─── Moderation status ────────────────────────────────────
const ModerationBadge = ({ status }) => {
  const map = {
    'Pendiente': { bg: '#fef9c3', color: '#854d0e', label: 'Pendiente' },
    'Aprobado':  { bg: '#dcfce7', color: '#15803d', label: 'Aprobado' },
    'Rechazado': { bg: '#fee2e2', color: '#b91c1c', label: 'Rechazado' },
  };
  const s = map[status] || map['Pendiente'];
  return (
    <span style={{
      padding: '4px 10px', borderRadius: '99px',
      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em',
      textTransform: 'uppercase', background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
};

const ResenasPage = () => {
  const [resenas, setResenas]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtro, setFiltro]     = useState('Pendiente');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchResenas();
  }, [filtro]);

  const fetchResenas = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/resenas?estado=${filtro}&limit=50`);
      setResenas(res.data.data || []);
    } catch (e) {
      console.error('Error cargando reseñas', e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar reseña?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/admin/resenas/${id}`);
        setResenas(prev => prev.filter(r => r.idResena !== id));
        Swal.fire({ icon: 'success', title: 'Eliminada', text: 'La reseña ha sido eliminada.', confirmButtonColor: '#1a3f6a' });
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la reseña.', confirmButtonColor: '#1a3f6a' });
      }
    }
  };

  const handleModeration = async (id, action) => {
    try {
      await apiClient.patch(`/admin/resenas/${id}/${action}`);
      setResenas(prev =>
        prev.map(r =>
          r.idResena === id
            ? { ...r, estadoModeracion: action === 'aprobar' ? 'Aprobado' : 'Rechazado' }
            : r
        )
      );
    } catch (e) {
      Swal.fire({ icon: 'info', title: 'Notificación', text: 'Error al procesar la acción. Intenta de nuevo.', confirmButtonColor: '#1a3f6a' });
    }
  };

  const filtered = resenas.filter(r => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      r.aliasAutor?.toLowerCase().includes(q) ||
      r.comentario?.toLowerCase().includes(q) ||
      r.producto?.modelo?.toLowerCase().includes(q)
    );
  });

  const pendingCount = resenas.filter(r => r.estadoModeracion === 'Pendiente').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Moderación de Reseñas</h1>
          <p className="page-subtitle">
            Aprueba o rechaza los comentarios de clientes antes de publicarlos en el catálogo.
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchResenas} style={{ gap: 6 }}>
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {/* ── Filters + pending counter ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'stretch' }}>
        <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: '12px' }}>
          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Filtrar por comentario, autor o producto..."
              style={{
                width: '100%', paddingLeft: '36px', height: '38px',
                border: '1px solid #e9ecf1', borderRadius: '8px',
                fontSize: '0.875rem', background: '#f9fafb', outline: 'none',
                color: '#374151', fontFamily: 'inherit',
              }}
            />
          </div>
          {/* Status filter */}
          <select
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{
              height: '38px', padding: '0 36px 0 12px', border: '1px solid #e9ecf1',
              borderRadius: '8px', fontSize: '0.875rem', background: '#f9fafb',
              color: '#374151', outline: 'none', cursor: 'pointer',
              fontFamily: 'inherit', minWidth: '140px', appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
            }}
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Aprobado">Aprobadas</option>
            <option value="Rechazado">Rechazadas</option>
          </select>
        </div>

        {/* Pending counter */}
        <div className="card" style={{
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          background: pendingCount > 0 ? '#fef9c3' : '#f4f7fb',
          borderColor: pendingCount > 0 ? '#fde68a' : '#e9ecf1',
        }}>
          <AlertTriangle size={20} color={pendingCount > 0 ? '#854d0e' : '#9ca3af'} />
          <div>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: pendingCount > 0 ? '#854d0e' : '#374151' }}>
              {pendingCount}
            </p>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '1px' }}>Pendientes</p>
          </div>
        </div>
      </div>

      {/* ── Review cards ── */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
          Cargando reseñas...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <CheckCircle size={36} style={{ margin: '0 auto 12px', color: '#d1d5db' }} />
          <p style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>No hay reseñas aquí</p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            {filtro === 'Pendiente'
              ? '¡Todas las reseñas han sido moderadas!'
              : 'Cambia el filtro para ver otras reseñas.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(resena => (
            <div
              key={resena.idResena}
              className="card"
              style={{
                padding: '20px 22px',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                opacity: resena.estadoModeracion === 'Rechazado' ? 0.6 : 1,
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #1a3f6a20, #22c5e820)',
                border: '1.5px solid #bee3fc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem', color: '#1565cc',
              }}>
                {(resena.aliasAutor || resena.nombreReferencia || 'A')[0].toUpperCase()}
              </div>

              {/* Main content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#0d2137', fontSize: '0.9375rem' }}>
                        {resena.aliasAutor || resena.nombreReferencia || 'Anónimo'}
                      </span>
                      <StarRating rating={resena.calificacion} />
                      <ModerationBadge status={resena.estadoModeracion} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '3px' }}>
                      {formatDate(resena.fechaResena)}
                    </p>
                  </div>
                </div>

                {/* Product tag */}
                {resena.producto?.modelo && (
                  <span style={{
                    display: 'inline-block', marginTop: '8px',
                    padding: '3px 10px', borderRadius: '99px',
                    background: '#f0f2f5', color: '#6b7280',
                    fontSize: '0.72rem', fontWeight: 600,
                  }}>
                    Producto: {resena.producto.modelo}
                  </span>
                )}

                {/* Comment */}
                {resena.comentario && (
                  <p style={{ color: '#374151', fontSize: '0.9rem', marginTop: '10px', lineHeight: 1.6 }}>
                    {resena.comentario}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0, minWidth: '120px' }}>
                {resena.estadoModeracion === 'Pendiente' ? (
                  <>
                    <button
                      onClick={() => handleModeration(resena.idResena, 'aprobar')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '7px',
                        background: '#dcfce7', color: '#15803d',
                        border: '1px solid #bbf7d0',
                        fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#bbf7d0'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#dcfce7'; }}
                    >
                      <CheckCircle size={14} /> Aprobar
                    </button>

                  <>
                    <button
                      onClick={() => handleModeration(resena.idResena, 'rechazar')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '7px',
                        background: '#fee2e2', color: '#b91c1c',
                        border: '1px solid #fecaca',
                        fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fecaca'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; }}
                    >
                      <XCircle size={14} /> Rechazar
                    </button>
                    <button
                      onClick={() => handleDelete(resena.idResena)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '7px',
                        background: 'transparent', color: '#ef4444',
                        border: '1px solid #fecaca',
                        fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background 0.15s', marginTop: '4px'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </>

                  </>
                ) : (

                  <>
                  <span style={{ fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center', padding: '8px' }}>
                    Ya moderada
                  </span>
                  <button
                    onClick={() => handleDelete(resena.idResena)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '7px',
                      background: 'transparent', color: '#ef4444',
                      border: '1px solid #fecaca',
                      fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'background 0.15s', marginTop: '4px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                  </>

                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResenasPage;
