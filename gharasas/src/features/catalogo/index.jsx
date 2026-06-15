import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../../shared/api/client';
import ProductDetail from './ProductDetail';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api$/, '');

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

const Stars = ({ rating = 0, size = 11 }) => (
  <span style={{ display: 'inline-flex', gap: '1px' }}>
    {[1,2,3,4,5].map(s => (
      <svg key={s} width={size} height={size} viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? '#F59E0B' : 'none'}
        stroke={s <= Math.round(rating) ? '#F59E0B' : 'var(--gh-text-muted)'}
        strokeWidth="1.5">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ))}
  </span>
);

const SkeletonCard = () => (
  <div style={{
    background: 'var(--gh-surface-1)', border: '1px solid rgba(240,238,232,0.07)',
    borderRadius: '16px', overflow: 'hidden',
  }}>
    <div style={{ height: '220px', background: 'var(--gh-bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--gh-brand-4)',
        animation: 'ghara-shimmer 1.4s infinite',
      }} />
    </div>
    <div style={{ padding: '20px' }}>
      {[70, 50, 40].map((w, i) => (
        <div key={i} style={{
          height: '10px', width: `${w}%`, background: '#1E2130',
          borderRadius: '4px', marginBottom: i < 2 ? '10px' : 0,
        }} />
      ))}
    </div>
  </div>
);

const ProductCard = ({ product, onSelect, index }) => {
  const [imgError, setImgError] = useState(false);
  const isInverter = product.tecnologia === 'Inverter';
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.32, delay: index * 0.05, ease: [0.0, 0, 0.2, 1] }}
      onClick={() => onSelect(product)}
      style={{
        background: 'var(--gh-surface-1)', border: '1px solid rgba(240,238,232,0.07)',
        borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}
      whileHover={{ borderColor: 'rgba(45, 196, 196,0.35)', y: -4, transition: { duration: 0.2 } }}
    >
      <div style={{
        position: 'relative', height: '220px', background: 'var(--gh-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', flexShrink: 0,
      }}>
        {product.categoria && (
          <span style={{
            position: 'absolute', top: '12px', left: '12px', zIndex: 2,
            background: 'rgba(45, 196, 196,0.1)', border: '1px solid rgba(45, 196, 196,0.25)',
            color: 'var(--gh-accent)', fontSize: '0.6rem', fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: '4px',
            fontFamily: 'var(--font-body)',
          }}>
            {product.categoria}
          </span>
        )}
        {product.imagenPrincipal && !imgError ? (
          <img
            src={`${API_BASE}${product.imagenPrincipal}`}
            alt={product.nombre}
            onError={() => setImgError(true)}
            style={{
              width: '75%', height: '75%', objectFit: 'contain',
              filter: 'drop-shadow(0 8px 20px rgba(45, 196, 196,0.12))',
            }}
          />
        ) : (
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#52566A" strokeWidth="1" opacity="0.4">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
        )}
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500,
          color: 'var(--gh-text-primary)', letterSpacing: '-0.01em', lineHeight: 1.3, margin: 0,
        }}>
          {product.nombre}
        </h3>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {product.capacidadBtu && (
            <span style={{
              background: 'rgba(240,238,232,0.04)', border: '1px solid rgba(240,238,232,0.08)',
              color: 'var(--gh-text-muted)', fontSize: '0.65rem', fontWeight: 500,
              padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-body)',
              letterSpacing: '0.05em',
            }}>
              {product.capacidadBtu.toLocaleString()} BTU
            </span>
          )}
          {product.seerValue && (
            <span style={{
              background: 'rgba(240,238,232,0.04)', border: '1px solid rgba(240,238,232,0.08)',
              color: 'var(--gh-text-muted)', fontSize: '0.65rem', fontWeight: 500,
              padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-body)',
              letterSpacing: '0.05em',
            }}>
              SEER {product.seerValue}
            </span>
          )}
          {product.tecnologia && (
            <span style={{
              background: isInverter ? 'rgba(45, 196, 196,0.07)' : 'rgba(240,238,232,0.04)',
              border: `1px solid ${isInverter ? 'rgba(45, 196, 196,0.2)' : 'var(--gh-border)'}`,
              color: isInverter ? 'var(--gh-accent)' : 'var(--gh-text-muted)', fontSize: '0.65rem', fontWeight: 500,
              padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-body)',
              letterSpacing: '0.05em',
            }}>
              {product.tecnologia}
            </span>
          )}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 'auto', paddingTop: '8px',
          borderTop: '1px solid rgba(240,238,232,0.06)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 500,
            color: 'var(--gh-text-primary)', letterSpacing: '-0.02em',
          }}>
            {formatCOP(product.precio)}
          </span>
          <button
            style={{
              background: 'var(--gh-accent)', color: 'var(--gh-bg)', border: 'none',
              borderRadius: '7px', padding: '7px 14px',
              fontSize: '0.7rem', fontWeight: 500,
              fontFamily: 'var(--font-body)', letterSpacing: '0.07em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}
            onClick={e => { e.stopPropagation(); onSelect(product); }}
          >
            Ver más
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? 'var(--gh-accent)' : 'rgba(240,238,232,0.05)',
      border: `1px solid ${active ? 'var(--gh-accent)' : 'var(--gh-border)'}`,
      color: active ? 'var(--gh-bg)' : 'var(--gh-text-muted)',
      padding: '7px 16px', borderRadius: '6px',
      fontSize: '0.72rem', fontWeight: 500,
      fontFamily: 'var(--font-body)',
      letterSpacing: '0.07em', textTransform: 'uppercase',
      cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
      transition: 'all 0.15s',
    }}
  >
    {label}
  </button>
);

const SidebarLabel = ({ children }) => (
  <p style={{
    fontFamily: 'var(--font-body)',
    fontSize: '0.62rem', fontWeight: 500,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--gh-text-muted)', marginBottom: '10px', marginTop: 0,
  }}>
    {children}
  </p>
);

const Divider = () => (
  <div style={{ height: '1px', background: 'var(--gh-border)', margin: '22px 0' }} />
);

const CatalogoPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedSeer, setSelectedSeer] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const CATEGORIES = ['Todos', 'Residencial', 'Comercial', 'Industrial', 'Portables'];

  const fetchCatalog = useCallback(async () => {
    setLoading(true); setHasError(false);
    try {
      const params = { pagina: page, limite: 12 };
      if (selectedCategory !== 'Todos') params.categoria = selectedCategory;
      if (searchTerm) params.busqueda = searchTerm;
      if (priceMin) params.precioMin = priceMin;
      if (priceMax) params.precioMax = priceMax;
      if (selectedSeer.length > 0) params.seer = selectedSeer.join(',');
      const res = await client.get('/productos', { params });
      setProducts(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
      setTotal(res.data?.pagination?.total || 0);
    } catch {
      setHasError(true); setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, priceMin, priceMax, selectedSeer, page]);

  useEffect(() => {
    const id = setTimeout(fetchCatalog, 300);
    return () => clearTimeout(id);
  }, [fetchCatalog]);

  const handleSeerToggle = (val) => {
    setPage(1);
    setSelectedSeer(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);
  };

  const hasActiveFilters = searchTerm || priceMin || priceMax || selectedSeer.length > 0 || selectedCategory !== 'Todos';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        @keyframes ghara-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        :focus-visible {
          outline: 2px solid #00B5D8;
          outline-offset: 3px;
          border-radius: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        @media (min-width: 900px) {
          .ghara-mobile-filter-btn { display: none !important; }
        }
        @media (max-width: 900px) {
          .ghara-catalog-grid { grid-template-columns: 1fr !important; }
          .ghara-catalog-sidebar { display: none !important; }
        }
        @media (max-width: 899px) {
          .ghara-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .ghara-product-grid article > div:first-child {
            height: 150px !important;
          }
          .ghara-product-grid article > div:last-child {
            padding: 10px 12px !important;
            gap: 6px !important;
          }
          .ghara-product-grid article h3 {
            font-size: 0.78rem !important;
            line-height: 1.25 !important;
          }
          .ghara-product-grid article button {
            padding: 5px 8px !important;
            font-size: 0.6rem !important;
          }
        }
        @media (max-width: 380px) {
          .ghara-product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: 'var(--gh-bg)',
        paddingTop: '72px', paddingBottom: '60px',
        fontFamily: 'var(--font-body)',
      }}>
        {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 16px' }} className="catalog-outer">

          {/* Header */}
          <header style={{ marginBottom: '16px', paddingTop: '8px' }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'var(--gh-accent)', marginBottom: '8px', margin: '0 0 8px 0',
            }}>
              Catálogo Técnico — Ghara SAS
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 6vw, 5rem)',
              fontWeight: 500, color: 'var(--gh-text-primary)',
              lineHeight: 0.95, letterSpacing: '-0.035em',
              margin: '0 0 10px 0',
            }}>
              Equipos de{' '}
              <span style={{ color: 'var(--gh-text-muted)' }}>Climatización</span>
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem', color: 'var(--gh-text-muted)',
              maxWidth: '460px', lineHeight: 1.5, margin: 0,
            }}>
              Alta eficiencia HVAC para proyectos residenciales y comerciales.
              {total > 0 && <>&nbsp;<span style={{ color: 'var(--gh-accent)', fontWeight: 500 }}>{total} equipos.</span></>}
            </p>
          </header>

          {/* Mobile Filters Toggle Button */}
          <div style={{ marginBottom: '16px' }} className="ghara-mobile-filter-btn">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--gh-surface-1)', border: '1px solid rgba(240,238,232,0.1)',
                borderRadius: '10px', padding: '12px 16px', cursor: 'pointer',
                color: 'var(--gh-text-primary)', fontFamily: 'var(--font-body)',
                fontSize: '0.85rem', fontWeight: 500,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filtros
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gh-text-muted)" strokeWidth="2" style={{ transform: mobileFiltersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {mobileFiltersOpen && (
              <div style={{
                marginTop: '8px', background: 'var(--gh-surface-1)',
                border: '1px solid rgba(240,238,232,0.07)', borderRadius: '12px', padding: '20px',
              }}>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#52566A" strokeWidth="2"
                    style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text" placeholder="Buscar modelo o marca…" value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    style={{
                      width: '100%', background: 'var(--gh-bg)',
                      border: '1px solid rgba(240,238,232,0.08)', borderRadius: '8px',
                      padding: '9px 10px 9px 33px', color: 'var(--gh-text-primary)',
                      fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gh-text-muted)', marginBottom: '10px' }}>Eficiencia SEER</p>
                {['SEER 11-15', 'SEER 16-19', 'SEER 20+'].map(seer => (
                  <label key={seer} style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedSeer.includes(seer)} onChange={() => handleSeerToggle(seer)} style={{ accentColor: 'var(--gh-accent)', width: '14px', height: '14px', cursor: 'pointer' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: selectedSeer.includes(seer) ? 'var(--gh-text-primary)' : 'var(--gh-text-muted)' }}>{seer}</span>
                  </label>
                ))}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gh-text-muted)', marginBottom: '10px', marginTop: '16px' }}>Precio COP</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[{ p: 'Mín', v: priceMin, s: setPriceMin }, { p: 'Máx', v: priceMax, s: setPriceMax }].map(({ p, v, s }) => (
                    <input key={p} type="number" placeholder={p} value={v}
                      onChange={e => { s(e.target.value); setPage(1); }}
                      style={{ background: 'var(--gh-bg)', border: '1px solid rgba(240,238,232,0.08)', borderRadius: '8px', padding: '8px 10px', color: 'var(--gh-text-primary)', fontSize: '0.8rem', fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    />
                  ))}
                </div>
                {hasActiveFilters && (
                  <button onClick={() => { setSearchTerm(''); setPriceMin(''); setPriceMax(''); setSelectedSeer([]); setSelectedCategory('Todos'); setPage(1); }}
                    style={{ marginTop: '12px', width: '100%', background: 'transparent', border: '1px solid rgba(240,238,232,0.1)', borderRadius: '8px', padding: '8px', color: 'var(--gh-text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Layout */}
          <div className="ghara-catalog-grid" style={{ display: 'grid', gridTemplateColumns: '256px 1fr', gap: '32px', alignItems: 'start' }}>

            {/* Sidebar */}
            <aside className="ghara-catalog-sidebar" style={{ position: 'sticky', top: '108px' }}>
              <div style={{
                background: 'var(--gh-surface-1)', border: '1px solid rgba(240,238,232,0.07)',
                borderRadius: '16px', padding: '22px',
              }}>
                <SidebarLabel>Buscar</SidebarLabel>
                <div style={{ position: 'relative', marginBottom: '0' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#52566A" strokeWidth="2"
                    style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text" placeholder="Modelo o marca…" value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    style={{
                      width: '100%', background: 'var(--gh-bg)',
                      border: '1px solid rgba(240,238,232,0.08)', borderRadius: '8px',
                      padding: '9px 10px 9px 33px', color: 'var(--gh-text-primary)',
                      fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(45, 196, 196,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'var(--gh-border)'}
                  />
                </div>

                <Divider />
                <SidebarLabel>Eficiencia SEER</SidebarLabel>
                {['SEER 11-15', 'SEER 16-19', 'SEER 20+'].map(seer => (
                  <label key={seer} style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox" checked={selectedSeer.includes(seer)}
                      onChange={() => handleSeerToggle(seer)}
                      style={{ accentColor: 'var(--gh-accent)', width: '14px', height: '14px', cursor: 'pointer' }}
                    />
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                      color: selectedSeer.includes(seer) ? 'var(--gh-text-primary)' : 'var(--gh-text-muted)',
                      transition: 'color 0.15s',
                    }}>{seer}</span>
                  </label>
                ))}

                <Divider />
                <SidebarLabel>Precio COP</SidebarLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[{ p: 'Mín', v: priceMin, s: setPriceMin }, { p: 'Máx', v: priceMax, s: setPriceMax }].map(({ p, v, s }) => (
                    <input
                      key={p} type="number" placeholder={p} value={v}
                      onChange={e => { s(e.target.value); setPage(1); }}
                      style={{
                        background: 'var(--gh-bg)', border: '1px solid rgba(240,238,232,0.08)',
                        borderRadius: '8px', padding: '8px 10px', color: 'var(--gh-text-primary)',
                        fontSize: '0.8rem', fontFamily: 'var(--font-body)',
                        outline: 'none', width: '100%', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(45, 196, 196,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'var(--gh-border)'}
                    />
                  ))}
                </div>

                {hasActiveFilters && (
                  <>
                    <Divider />
                    <button
                      onClick={() => { setSearchTerm(''); setPriceMin(''); setPriceMax(''); setSelectedSeer([]); setSelectedCategory('Todos'); setPage(1); }}
                      style={{
                        width: '100%', background: 'transparent',
                        border: '1px solid rgba(240,238,232,0.1)', borderRadius: '8px',
                        padding: '8px', color: 'var(--gh-text-muted)', fontSize: '0.72rem',
                        fontFamily: 'var(--font-body)', fontWeight: 500,
                        letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--gh-text-primary)'; e.currentTarget.style.borderColor = 'rgba(240,238,232,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--gh-text-muted)'; e.currentTarget.style.borderColor = 'var(--gh-border)'; }}
                    >
                      Limpiar filtros
                    </button>
                  </>
                )}
              </div>
            </aside>

            {/* Main */}
            <main>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '6px', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                {CATEGORIES.map(cat => (
                  <FilterChip key={cat} label={cat} active={selectedCategory === cat}
                    onClick={() => { setSelectedCategory(cat); setPage(1); }} />
                ))}
              </div>

              {hasError ? (
                <div style={{ background: 'var(--gh-surface-1)', border: '1px solid rgba(240,238,232,0.07)', borderRadius: '16px', padding: '64px 32px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--gh-text-primary)', fontFamily: 'var(--font-display)', fontWeight: 500, marginBottom: '8px' }}>Sin conexión al catálogo</p>
                  <p style={{ color: 'var(--gh-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>Verifica tu conexión e intenta de nuevo.</p>
                  <button onClick={fetchCatalog} style={{ background: 'var(--gh-accent)', color: 'var(--gh-bg)', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    Reintentar
                  </button>
                </div>
              ) : loading ? (
                <div className="ghara-product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                  {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div style={{ background: 'var(--gh-surface-1)', border: '1px solid rgba(240,238,232,0.07)', borderRadius: '16px', padding: '64px 32px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--gh-text-primary)', fontFamily: 'var(--font-display)', fontWeight: 500, marginBottom: '8px' }}>Sin resultados</p>
                  <p style={{ color: 'var(--gh-text-muted)', fontSize: '0.875rem' }}>Ajusta los filtros para ver más equipos.</p>
                </div>
              ) : (
                <>
                  <motion.div layout className="ghara-product-grid"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                    <AnimatePresence mode="popLayout">
                      {products.map((product, i) => (
                        <ProductCard key={product.idProducto} product={product} onSelect={setSelectedProduct} index={i} />
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
                      {[
                        { disabled: page === 1, onClick: () => setPage(p => p - 1), label: 'Anterior', icon: '<' },
                      ].map(btn => (
                        <button key={btn.label} disabled={btn.disabled} onClick={btn.onClick} aria-label={btn.label}
                          style={{ width: '36px', height: '36px', background: 'rgba(240,238,232,0.05)', border: '1px solid rgba(240,238,232,0.1)', borderRadius: '8px', color: 'var(--gh-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: btn.disabled ? 'not-allowed' : 'pointer', opacity: btn.disabled ? 0.4 : 1 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>
                        </button>
                      ))}
                      {[...Array(Math.min(totalPages, 7))].map((_, i) => (
                        <button key={i+1} onClick={() => setPage(i+1)}
                          style={{ width: '36px', height: '36px', background: page === i+1 ? 'var(--gh-accent)' : 'rgba(240,238,232,0.05)', border: `1px solid ${page === i+1 ? 'var(--gh-accent)' : 'var(--gh-border)'}`, borderRadius: '8px', color: page === i+1 ? 'var(--gh-bg)' : 'var(--gh-text-muted)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          {i+1}
                        </button>
                      ))}
                      <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} aria-label="Siguiente"
                        style={{ width: '36px', height: '36px', background: 'rgba(240,238,232,0.05)', border: '1px solid rgba(240,238,232,0.1)', borderRadius: '8px', color: 'var(--gh-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogoPage;
