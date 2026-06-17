import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Globe, CheckCircle, AlertTriangle, RefreshCw,
  ChevronDown, ChevronUp, Save, Sparkles, Info,
} from 'lucide-react';
import apiClient from '../../api/client';

// ─── Slug auto-generator (mirror del backend) ────────────
function generarSlugLocal(marca, tecnologia, modelo, btus) {
  return [marca, tecnologia, modelo, `${btus}-btu`]
    .join('-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── SEO Quality indicators ───────────────────────────────
const SeoIndicator = ({ label, value, ideal, warn }) => {
  const len = (value || '').length;
  let color = '#9ca3af'; let icon = '—';
  if (len > 0) {
    if (len >= ideal[0] && len <= ideal[1]) { color = '#15803d'; icon = '✓'; }
    else if (len >= warn[0] && len <= warn[1]) { color = '#854d0e'; icon = '!'; }
    else { color = '#b91c1c'; icon = '✗'; }
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gh-text-muted)', marginTop: '3px' }}>
      <span>{label}</span>
      <span style={{ color, fontWeight: 600 }}>{icon} {len} caracteres (ideal {ideal[0]}–{ideal[1]})</span>
    </div>
  );
};


// ─── Google Search Preview ───────────────────────────────
const GooglePreview = ({ url, title, description }) => {
  const finalTitle = title || 'Título de tu producto';
  const finalDesc = description || 'Descripción detallada de tu producto para mostrar a los clientes.';
  
  return (
    <div style={{ padding: '16px', background: 'var(--gh-surface-2)', border: '1px solid var(--gh-border)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gh-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Vista Previa en Google</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--gh-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gh-text-primary)', fontWeight: 700, fontSize: '14px' }}>G</div>
          <div>
            <span style={{ fontSize: '14px', color: 'var(--gh-text-primary)', display: 'block' }}>Ghara SAS</span>
            <span style={{ fontSize: '12px', color: 'var(--gh-text-secondary)', display: 'block' }}>https://www.gharasas.com › catalogo › {url || 'slug-producto'}</span>
          </div>
        </div>
        <a href="#" style={{ fontSize: '20px', color: 'var(--gh-brand-1)', textDecoration: 'none', cursor: 'default', marginTop: '4px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {finalTitle}
        </a>
        <span style={{ fontSize: '14px', color: 'var(--gh-text-secondary)', lineHeight: '1.58', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {finalDesc}
        </span>
      </div>
    </div>
  );
};

// ─── Edit Panel (expandible por fila) ────────────────────

const EditPanel = ({ producto, onSave }) => {
  const baseSlug = generarSlugLocal(
    producto.marca?.nombre || '',
    producto.tecnologia || '',
    producto.modelo || '',
    producto.capacidadBtu || 0,
  );

  const [slug,            setSlug]            = useState(producto.slug || baseSlug);
  const [metaTitulo,      setMetaTitulo]      = useState(producto.metaTitulo || '');
  const [metaDescripcion, setMetaDescripcion] = useState(producto.metaDescripcion || '');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await apiClient.patch(`/admin/seo/${producto.idProducto}`, {
        slug: slug || undefined,
        metaTitulo:      metaTitulo      || undefined,
        metaDescripcion: metaDescripcion || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onSave(producto.idProducto, { slug, metaTitulo, metaDescripcion });
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      padding: '20px 24px', background: '#f8fafc',
      borderTop: '1px solid #e9ecf1', marginTop: '-1px',
    }}>
      {/* Slug */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gh-text-primary)' }}>
            Slug de URL <span style={{ color: 'var(--gh-text-muted)', fontWeight: 400 }}>(único, solo minúsculas y guiones)</span>
          </label>
          <button
            onClick={() => setSlug(baseSlug)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '0.72rem', color: '#1565cc', fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <Sparkles size={12} /> Auto-generar
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--gh-text-muted)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
            /catalogo/
          </span>
          <input
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            className="input-field"
            placeholder={baseSlug}
            style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Meta Título */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gh-text-primary)', marginBottom: '5px' }}>
          Meta-Título
        </label>
        <input
          value={metaTitulo}
          onChange={e => setMetaTitulo(e.target.value)}
          className="input-field"
          placeholder={`${producto.marca?.nombre} ${producto.modelo} | Ghara SAS`}
          maxLength={70}
        />
        <SeoIndicator label="Meta-Título" value={metaTitulo} ideal={[50, 60]} warn={[45, 70]} />
      </div>

      {/* Meta Descripción */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gh-text-primary)', marginBottom: '5px' }}>
          Meta-Descripción
        </label>
        <textarea
          value={metaDescripcion}
          onChange={e => setMetaDescripcion(e.target.value)}
          rows={2}
          maxLength={160}
          className="input-field"
          placeholder={`Compra el ${producto.modelo} de ${producto.capacidadBtu?.toLocaleString()} BTU. Envío a toda Colombia. Garantía oficial.`}
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
        <SeoIndicator label="Meta-Descripción" value={metaDescripcion} ideal={[120, 155]} warn={[100, 160]} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ gap: 6, padding: '8px 18px' }}
        >
          {saving ? 'Guardando...' : saved ? '✓ Guardado' : <><Save size={14} /> Guardar SEO</>}
        </button>
        {saved && <span style={{ color: '#15803d', fontSize: '0.8125rem', fontWeight: 600 }}>✅ Cambios guardados</span>}
        {error && <span style={{ color: '#b91c1c', fontSize: '0.8125rem' }}>{error}</span>}
      </div>
    </div>
  );
};

// ─── SEO Score chip ──────────────────────────────────────
const SeoScore = ({ p }) => {
  const score = [
    p.slug ? 1 : 0,
    p.metaTitulo && p.metaTitulo.length >= 45 ? 1 : 0,
    p.metaDescripcion && p.metaDescripcion.length >= 100 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const map = {
    0: { bg: '#fee2e2', color: '#b91c1c', label: 'Sin SEO' },
    1: { bg: '#fef9c3', color: '#854d0e', label: 'Básico' },
    2: { bg: '#dbeffe', color: '#1565cc', label: 'Parcial' },
    3: { bg: '#dcfce7', color: '#15803d', label: 'Completo' },
  };
  const s = map[score];

  return (
    <span style={{
      padding: '3px 10px', borderRadius: '99px',
      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.03em', background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
};

// ─── Main Page ───────────────────────────────────────────
const SeoPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [busqueda,  setBusqueda]  = useState('');
  const [expanded,  setExpanded]  = useState(null);
  const [masivo,    setMasivo]    = useState({ loading: false, msg: '' });

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/seo?limite=100');
      setProductos(res.data.data || []);
    } catch (e) {
      console.error('Error SEO', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  const handleSave = (id, data) => {
    setProductos(prev => prev.map(p => p.idProducto === id ? { ...p, ...data } : p));
  };

  const handleGenerarMasivo = async () => {
    setMasivo({ loading: true, msg: '' });
    try {
      const res = await apiClient.post('/admin/seo/generar-masivo');
      setMasivo({ loading: false, msg: res.data.message });
      fetchProductos();
    } catch (e) {
      setMasivo({ loading: false, msg: 'Error al generar slugs.' });
    }
  };

  const filtered = productos.filter(p => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return p.modelo?.toLowerCase().includes(q) || p.marca?.nombre?.toLowerCase().includes(q);
  });

  const sinSeo = productos.filter(p => !p.slug && !p.metaTitulo).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Gestión SEO — Catálogo</h1>
          <p className="page-subtitle">
            Optimiza slugs de URL, meta-títulos y meta-descripciones para mejorar el posicionamiento en Google.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleGenerarMasivo}
            disabled={masivo.loading}
            className="btn-secondary"
            style={{ gap: 6 }}
          >
            <Sparkles size={14} />
            {masivo.loading ? 'Generando...' : 'Auto-generar slugs'}
          </button>
          <button onClick={fetchProductos} className="btn-secondary" style={{ gap: 6 }}>
            <RefreshCw size={14} /> Actualizar
          </button>
        </div>
      </div>

      {masivo.msg && (
        <div style={{ padding: '11px 14px', background: '#dcfce7', borderRadius: '8px', color: '#15803d', fontSize: '0.875rem', fontWeight: 500, border: '1px solid #bbf7d0' }}>
          ✅ {masivo.msg}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total productos',    value: productos.length,                                  color: 'var(--gh-text-primary)' },
          { label: 'Con slug',           value: productos.filter(p => p.slug).length,              color: '#15803d' },
          { label: 'Con meta-título',    value: productos.filter(p => p.metaTitulo).length,        color: '#1565cc' },
          { label: 'Sin SEO',            value: sinSeo,                                            color: sinSeo > 0 ? '#b91c1c' : '#15803d' },
        ].map(s => (
          <div key={s.label} className="gh-card" style={{ padding: '14px 18px' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--gh-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, marginTop: '3px' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="gh-card" style={{ padding: '12px 16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gh-text-muted)' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por modelo o marca..."
            style={{
              width: '100%', paddingLeft: '36px', height: '38px',
              border: '1px solid var(--gh-border)', borderRadius: '8px',
              fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', color: 'var(--gh-text-primary)',
              background: 'var(--gh-surface-2)',
            }}
          />
        </div>
      </div>

      {/* Info banner */}
      <div style={{
        padding: '16px', background: '#eff8ff', border: '1px solid #bee3fc',
        borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <Info size={18} color="#1565cc" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.9rem', color: '#1565cc', margin: 0 }}>
            <strong>Guía SEO y Visibilidad en Buscadores:</strong>
          </p>
        </div>
        <ul style={{ fontSize: '0.85rem', color: '#1e3a8a', marginLeft: '28px', marginTop: 0, paddingLeft: '16px', lineHeight: '1.6' }}>
          <li><strong>Título ideal:</strong> 50–60 caracteres. Es lo primero que lee el cliente en Google.</li>
          <li><strong>Descripción ideal:</strong> 120–155 caracteres. Escribe algo atractivo que invite a hacer clic.</li>
          <li><strong>URL (Slug):</strong> Será el enlace directo al producto (ej. <i>gharasas.com/catalogo/tu-producto</i>).</li>
          <li><strong>Sitemap Automático:</strong> Todos los productos activos con URL se envían automáticamente a Google mediante el archivo <b>sitemap.xml</b> para forzar su indexación rápida en el buscador.</li>
        </ul>
      </div>

      {/* Table */}
      <div className="gh-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gh-text-muted)' }}>Cargando productos...</div>
        ) : (
          <>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 80px',
              padding: '10px 20px', borderBottom: '1px solid #f0f2f5',
              fontSize: '0.68rem', fontWeight: 600, color: 'var(--gh-text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              <span>PRODUCTO</span>
              <span>SLUG DE URL</span>
              <span>ESTADO SEO</span>
              <span style={{ textAlign: 'center' }}>EDITAR</span>
            </div>

            {filtered.map(p => (
              <div key={p.idProducto}>
                {/* Row */}
                <div
                  onClick={() => setExpanded(expanded === p.idProducto ? null : p.idProducto)}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 80px',
                    padding: '14px 20px', borderBottom: '1px solid #f9fafb',
                    cursor: 'pointer', transition: 'background 0.1s',
                    background: expanded === p.idProducto ? '#f8fafc' : '#fff',
                  }}
                  onMouseEnter={e => { if (expanded !== p.idProducto) e.currentTarget.style.background = '#fafbfd'; }}
                  onMouseLeave={e => { if (expanded !== p.idProducto) e.currentTarget.style.background = '#fff'; }}
                >
                  {/* Producto */}
                  <div>
                    <p style={{ fontWeight: 600, color: '#0d2137', fontSize: '0.9rem' }}>{p.modelo}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gh-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{p.marca?.nombre}</p>
                  </div>

                  {/* Slug */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {p.slug ? (
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--gh-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        /catalogo/{p.slug}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--gh-text-muted)', fontStyle: 'italic' }}>Sin slug asignado</span>
                    )}
                  </div>

                  {/* Score */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SeoScore p={p} />
                  </div>

                  {/* Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {expanded === p.idProducto
                      ? <ChevronUp size={18} color="#6b7280" />
                      : <ChevronDown size={18} color="#6b7280" />
                    }
                  </div>
                </div>

                {/* Edit panel */}
                {expanded === p.idProducto && (
                  <EditPanel producto={p} onSave={handleSave} />
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--gh-text-muted)' }}>
                <Globe size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p>No se encontraron productos.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SeoPage;
