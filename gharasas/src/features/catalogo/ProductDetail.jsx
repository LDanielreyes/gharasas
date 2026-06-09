import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import client from '../../shared/api/client';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');
const NUMERO_GHARA = "573022326569";

// ─── Componentes utilitarios ───────────────────────────────

const StarRating = ({ value, max = 5, size = 18, onClick = null }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = onClick ? (hovered || value) >= star : value >= star;
        const halfFilled = !onClick && value >= star - 0.5 && value < star;
        return (
          <span
            key={star}
            onClick={() => onClick && onClick(star)}
            onMouseEnter={() => onClick && setHovered(star)}
            onMouseLeave={() => onClick && setHovered(0)}
            style={{
              fontSize: size,
              cursor: onClick ? 'pointer' : 'default',
              color: filled || halfFilled ? '#f59e0b' : '#d1d5db',
              transition: 'color 0.1s',
            }}
          >
            {halfFilled ? '★' : filled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
};

const Badge = ({ label, icon, color = 'var(--gh-brand-4)', bg = 'var(--gh-surface-2)' }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem',
    fontWeight: 500, color, background: bg,
  }}>
    
    {label}
  </span>
);

const RatingBar = ({ stars, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--gh-text-muted)', width: '14px', textAlign: 'right' }}>{stars}</span>
      <span style={{ fontSize: '0.78rem', color: '#f59e0b' }}>★</span>
      <div style={{ flex: 1, height: '6px', background: 'var(--gh-border)', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ height: '100%', background: '#F59E0B', borderRadius: '3px' }}
        />
      </div>
      <span style={{ fontSize: '0.72rem', color: 'var(--gh-text-muted)', width: '28px' }}>{count}</span>
    </div>
  );
};

// ─── Galería de Imágenes ───────────────────────────────────
const ImageGallery = ({ imagenes }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const imgs = imagenes?.length > 0 ? imagenes : [{ rutaImagen: null }];
  const activeImg = imgs[activeIdx];

  const prev = () => setActiveIdx(i => (i === 0 ? imgs.length - 1 : i - 1));
  const next = () => setActiveIdx(i => (i === imgs.length - 1 ? 0 : i + 1));

  return (
    <div>
      {/* Imagen principal */}
      <div style={{
        position: 'relative', background: 'var(--gh-bg)',
        borderRadius: '20px', overflow: 'hidden', aspectRatio: '1/1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(240,238,232,0.07)',
      }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={activeImg.rutaImagen ? `${API_BASE}${activeImg.rutaImagen}` : '/placeholder.png'}
            alt="Producto"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{ width: '85%', height: '85%', objectFit: 'contain', display: 'block' }}
            onError={e => { e.target.src = '/placeholder.png'; }}
          />
        </AnimatePresence>

        {/* Navegación si hay más de 1 imagen */}
        {imgs.length > 1 && (
          <>
            <button onClick={prev} style={{
              position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(22,25,32,0.9)', border: '1px solid rgba(240,238,232,0.1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', color: 'var(--gh-text-primary)',
            }}>‹</button>
            <button onClick={next} style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(22,25,32,0.9)', border: '1px solid rgba(240,238,232,0.1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', color: 'var(--gh-text-primary)',
            }}>›</button>
          </>
        )}

        {/* Dots */}
        {imgs.length > 1 && (
          <div style={{
            position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '6px',
          }}>
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                width: i === activeIdx ? '20px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: i === activeIdx ? 'var(--gh-accent)' : 'var(--gh-text-muted)',
                transition: 'all 0.2s',
                padding: 0,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {imgs.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setActiveIdx(i)} style={{
              flexShrink: 0, width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden',
              border: `2px solid ${i === activeIdx ? 'var(--gh-accent)' : 'var(--gh-border)'}`,
              cursor: 'pointer', background: 'var(--gh-bg)', padding: 0,
              transition: 'border-color 0.15s',
            }}>
              <img
                src={img.rutaImagen ? `${API_BASE}${img.rutaImagen}` : '/placeholder.png'}
                alt={`Vista ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={e => { e.target.src = '/placeholder.png'; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Formulario de Reseña ─────────────────────────────────
const ReviewForm = ({ idProducto, onReviewSubmitted }) => {
  const [form, setForm] = useState({ aliasAutor: '', calificacion: 0, comentario: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.calificacion === 0) {
      Swal.fire({ icon: 'warning', title: 'Calificación requerida', text: 'Por favor selecciona una calificación de 1 a 5 estrellas.', confirmButtonColor: 'var(--gh-brand-4)' });
      return;
    }
    setSubmitting(true);
    try {
      await client.post('/resenas', { idProducto, aliasAutor: form.aliasAutor, calificacion: form.calificacion, comentario: form.comentario });
      setDone(true);
      setTimeout(() => { setDone(false); setForm({ aliasAutor: '', calificacion: 0, comentario: '' }); }, 4000);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar tu reseña. Intenta nuevamente.', confirmButtonColor: 'var(--gh-brand-4)' });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div style={{ background: 'rgba(45, 196, 196,0.06)', border: '1px solid rgba(45, 196, 196,0.2)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
      
      <p style={{ fontWeight: 500, color: 'var(--gh-accent)', margin: 0, fontFamily: 'var(--font-display)' }}>¡Gracias por tu reseña!</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--gh-text-muted)', margin: '4px 0 0', fontFamily: 'var(--font-body)' }}>Será revisada antes de publicarse.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'var(--gh-text-primary)', fontFamily: 'var(--font-display)' }}>Deja tu reseña</h4>
      <div>
        <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: 'var(--gh-text-muted)', fontWeight: 500, fontFamily: 'var(--font-body)', letterSpacing: '0.06em' }}>Tu calificación *</p>
        <StarRating value={form.calificacion} size={28} onClick={star => setForm(f => ({ ...f, calificacion: star }))} />
      </div>
      <input required placeholder="Tu nombre o alias *" value={form.aliasAutor}
          onChange={e => setForm(f => ({ ...f, aliasAutor: e.target.value }))}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(240,238,232,0.1)', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-body)', width: '100%', boxSizing: 'border-box', background: 'var(--gh-bg)', color: 'var(--gh-text-primary)' }} />
      <textarea required placeholder="Comparte tu experiencia con este producto *" value={form.comentario} rows={3}
        onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
        style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(240,238,232,0.1)', fontSize: '0.875rem', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-body)', background: 'var(--gh-bg)', color: 'var(--gh-text-primary)', width: '100%' }} />
      <button type="submit" disabled={submitting} style={{
        background: 'var(--gh-accent)', color: 'var(--gh-bg)', border: 'none', borderRadius: '8px',
        padding: '11px 24px', fontWeight: 500, fontSize: '0.8rem', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', letterSpacing: '0.07em', textTransform: 'uppercase',
        opacity: submitting ? 0.7 : 1, transition: 'all 0.2s',
      }}>
        {submitting ? 'Enviando...' : 'Publicar Reseña'}
      </button>
    </form>
  );
};

// ─── Componente principal ─────────────────────────────────
const ProductDetail = ({ product: productCard, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [cotizando, setCotizando] = useState(false);
  const [formCot, setFormCot] = useState({ nombreCliente: '', telefono: '', email: '' });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await client.get(`/productos/${productCard.idProducto}`);
        setProduct(res.data.data);
      } catch {
        setProduct(productCard); // fallback a datos de tarjeta
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [productCard]);

  const handleWhatsApp = async (e) => {
    e.preventDefault();
    const nombre = formCot.nombreCliente || 'Cliente';
    const productoNombre = product?.nombre || productCard.nombre;

    // 1. Guardar lead completo en la BD (sin bloquear la experiencia)
    client.post('/leads', {
      idProducto: product?.idProducto || productCard.idProducto,
      nombreCliente: formCot.nombreCliente || null,
      telefono: formCot.telefono || null,
      email: formCot.email || null,
      canalContacto: 'WhatsApp_Catalogo',
      productosInteres: `Cotización: ${productoNombre}`,
    }).catch(err => console.log('Error registrando lead:', err));

    // 2. Construir mensaje y abrir WhatsApp
    const msg = `¡Hola Ghara! \n\nSoy *${nombre}*\nEstoy interesado/a en cotizar:\n\n *Equipo:* ${productoNombre}\n *Tecnología:* ${product?.tecnologia || productCard.tecnologia}\n *Capacidad:* ${product?.capacidadBtu || productCard.capacidadBtu} BTU\n *Precio referencia:* $${(product?.precio || productCard.precio || 0).toLocaleString()} COP\n\nMi WhatsApp: ${formCot.telefono || 'No especificado'}\nMi correo: ${formCot.email || 'No especificado'}\n\n¿Me pueden dar más información?`;
    window.open(`https://wa.me/${NUMERO_GHARA}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  const formatPrice = (p) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p || 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '20px', overflowY: 'auto',
        }}
      >
        <motion.div
          initial={{ scale: 0.94, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 30 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--gh-surface-1)', borderRadius: '20px', width: '100%', maxWidth: '1000px',
            overflow: 'hidden', border: '1px solid rgba(240,238,232,0.08)',
            marginTop: '10px', marginBottom: '10px',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px', borderBottom: '1px solid rgba(240,238,232,0.07)',
            background: 'var(--gh-bg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--gh-accent)', fontSize: '1.5rem' }}></span>
              <div>
                <p style={{ margin: 0, fontSize: '0.62rem', color: 'var(--gh-accent)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
                  Catálogo Ghara SAS
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gh-text-primary)', fontWeight: 500, fontFamily: 'var(--font-display)' }}>
                  {loading ? 'Cargando...' : (product?.nombre || productCard.nombre)}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'var(--gh-border)', border: '1px solid rgba(240,238,232,0.1)', borderRadius: '8px',
              width: '36px', height: '36px', cursor: 'pointer', color: 'var(--gh-text-muted)',
              fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}>✕</button>
          </div>

          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--gh-text-muted)', fontFamily: 'var(--font-body)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--gh-text-muted)', marginBottom: '12px' }}></div>
              Cargando detalles del producto...
            </div>
          ) : (
            <>
              {/* Body principal — dos columnas */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
                gap: '28px', padding: '24px 28px',
              }} className="product-detail-grid">
                {/* Columna izq — galería */}
                <div>
                  <ImageGallery imagenes={product?.imagenes || []} />
                  {/* Badges técnicos bajo galería */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                    {product?.tecnologia && <Badge label={product.tecnologia} color="#00B5D8" bg="rgba(45, 196, 196,0.08)" />}
                    {product?.seerValue && <Badge label={`SEER ${product.seerValue}`} color="#52566A" bg="rgba(240,238,232,0.06)" />}
                    {product?.claseEnergetica && <Badge label={`Clase ${product.claseEnergetica}`} color="#52566A" bg="rgba(240,238,232,0.06)" />}
                    {product?.tieneWifi && <Badge label="WiFi" color="#52566A" bg="rgba(240,238,232,0.06)" />}
                    {product?.estadoInventario === 'Disponible' && <Badge label="En Stock" color="#52566A" bg="rgba(240,238,232,0.06)" />}
                  </div>
                </div>

                {/* Columna der — info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Marca + modelo */}
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '0.62rem', fontWeight: 500, color: 'var(--gh-accent)', textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'var(--font-body)' }}>
                      {product?.marca}
                    </p>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 500, color: 'var(--gh-text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                      {product?.nombre}
                    </h1>
                    {product?.categoria && (
                      <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--gh-text-muted)', fontFamily: 'var(--font-body)' }}>
                        {product.categoria} • Modelo: {product.modelo}
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  {product?.ratingPromedio && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <StarRating value={product.ratingPromedio} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gh-text-primary)', fontFamily: 'var(--font-body)' }}>
                        {product.ratingPromedio.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gh-text-muted)', fontFamily: 'var(--font-body)' }}>
                        ({product.totalResenas} {product.totalResenas === 1 ? 'reseña' : 'reseñas'})
                      </span>
                    </div>
                  )}

                  {/* Precio */}
                  <div style={{ background: 'var(--gh-bg)', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(240,238,232,0.07)' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '0.62rem', color: 'var(--gh-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-body)' }}>
                      Precio de referencia
                    </p>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 500, color: 'var(--gh-text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
                      {formatPrice(product?.precio)}
                    </p>
                    {product?.promociones?.length > 0 && (
                      <span style={{ display: 'inline-block', marginTop: '6px', background: 'rgba(45, 196, 196,0.1)', color: 'var(--gh-accent)', fontWeight: 500, fontSize: '0.7rem', padding: '3px 10px', borderRadius: '4px', fontFamily: 'var(--font-body)', letterSpacing: '0.06em' }}>
                        {product.promociones[0].descripcion}
                      </span>
                    )}
                  </div>

                  {/* Ficha técnica rápida */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { label: 'Capacidad', value: product?.capacidadBtu ? `${product.capacidadBtu.toLocaleString()} BTU` : null },
                      { label: 'Tecnología', value: product?.tecnologia },
                      { label: 'Voltaje', value: product?.voltaje },
                      { label: 'Refrigerante', value: product?.refrigerante },
                    ].filter(f => f.value).map(({ label, value }) => (
                      <div key={label} style={{
                        background: 'var(--gh-bg)', borderRadius: '8px', padding: '10px 14px',
                        border: '1px solid rgba(240,238,232,0.07)',
                      }}>
                        <p style={{ margin: '0 0 2px', fontSize: '0.62rem', color: 'var(--gh-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>{label}</p>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--gh-text-primary)', fontFamily: 'var(--font-body)' }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Formulario de cotización WhatsApp */}
                  <div style={{ background: 'var(--gh-bg)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(45, 196, 196,0.15)' }}>
                    <p style={{ margin: '0 0 10px', fontWeight: 500, fontSize: '0.8rem', color: 'var(--gh-accent)', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Cotizar por WhatsApp
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input placeholder="Tu nombre *" value={formCot.nombreCliente}
                        onChange={e => setFormCot(f => ({ ...f, nombreCliente: e.target.value }))}
                        style={{ padding: '9px 12px', borderRadius: '7px', border: '1px solid rgba(240,238,232,0.1)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--gh-surface-1)', color: 'var(--gh-text-primary)', width: '100%', boxSizing: 'border-box' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input placeholder="Tu WhatsApp" value={formCot.telefono}
                          onChange={e => setFormCot(f => ({ ...f, telefono: e.target.value }))}
                          style={{ padding: '9px 12px', borderRadius: '7px', border: '1px solid rgba(240,238,232,0.1)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--gh-surface-1)', color: 'var(--gh-text-primary)', width: '100%', boxSizing: 'border-box' }} />
                        <input placeholder="Email (opcional)" value={formCot.email}
                          onChange={e => setFormCot(f => ({ ...f, email: e.target.value }))}
                          style={{ padding: '9px 12px', borderRadius: '7px', border: '1px solid rgba(240,238,232,0.1)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--gh-surface-1)', color: 'var(--gh-text-primary)', width: '100%', boxSizing: 'border-box' }} />
                      </div>
                      <button onClick={handleWhatsApp} style={{
                        background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px',
                        padding: '11px', fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontFamily: 'var(--font-body)', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#128C7E'}
                        onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Abrir WhatsApp y Cotizar
                      </button>
                    </div>
                  </div>

                  {/* Ficha Técnica descargable */}
                  {product?.fichaTecnica && (
                    <a href={`${API_BASE}${product.fichaTecnica}`} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '11px', background: 'var(--gh-bg)', border: '1px solid rgba(240,238,232,0.1)',
                        borderRadius: '8px', textDecoration: 'none', color: 'var(--gh-text-muted)',
                        fontWeight: 500, fontSize: '0.8rem', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                      }}
                    >
                      Descargar Ficha Técnica PDF</a>
                  )}
                </div>
              </div>

              {/* Tabs: Especificaciones + Reseñas */}
              <div style={{ borderTop: '1px solid rgba(240,238,232,0.07)' }}>
                <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(240,238,232,0.07)', padding: '0 28px' }}>
                  {['info', 'resenas'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                      padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
                      fontWeight: 500, fontSize: '0.78rem', fontFamily: 'var(--font-body)', letterSpacing: '0.07em', textTransform: 'uppercase',
                      color: activeTab === tab ? 'var(--gh-accent)' : 'var(--gh-text-muted)',
                      borderBottom: `2px solid ${activeTab === tab ? 'var(--gh-accent)' : 'transparent'}`,
                      transition: 'all 0.15s', marginBottom: '-1px',
                    }}>
                      {tab === 'info' ? 'Especificaciones' : `Reseñas (${product?.totalResenas || 0})`}
                    </button>
                  ))}
                </div>

                <div style={{ padding: '24px 28px 28px' }}>
                  {activeTab === 'info' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                      {[
                        { label: 'Modelo', value: product?.modelo },
                        { label: 'Marca', value: product?.marca },
                        { label: 'Línea / Serie', value: product?.categoria },
                        { label: 'Tecnología', value: product?.tecnologia },
                        { label: 'Capacidad', value: product?.capacidadBtu ? `${product.capacidadBtu.toLocaleString()} BTU` : null },
                        { label: 'SEER', value: product?.seerValue },
                        { label: 'Voltaje', value: product?.voltaje },
                        { label: 'Refrigerante', value: product?.refrigerante },
                        { label: 'Clase Energética', value: product?.claseEnergetica },
                        { label: 'Color', value: product?.color },
                        { label: 'WiFi', value: product?.tieneWifi ? 'Sí' : product?.tieneWifi === false ? 'No' : null },
                        { label: 'Estado', value: product?.estadoInventario },
                      ].filter(f => f.value !== null && f.value !== undefined && f.value !== '').map(({ label, value }) => (
                        <div key={label} style={{ background: 'var(--gh-surface-2)', borderRadius: '10px', padding: '12px 16px', border: '1px solid var(--gh-border)' }}>
                          <p style={{ margin: '0 0 3px', fontSize: '0.7rem', color: 'var(--gh-text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>{label}</p>
                          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--gh-text-primary)' }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px' }} className="reviews-grid">
                      {/* Resumen de rating */}
                      <div>
                        {product?.totalResenas > 0 ? (
                          <>
                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                              <p style={{ margin: '0', fontSize: '3.5rem', fontWeight: 500, color: 'var(--gh-text-primary)', lineHeight: 1 }}>
                                {product.ratingPromedio?.toFixed(1)}
                              </p>
                              <StarRating value={product.ratingPromedio} size={22} />
                              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--gh-text-muted)' }}>
                                {product.totalResenas} {product.totalResenas === 1 ? 'reseña' : 'reseñas'}
                              </p>
                            </div>
                            {product.ratingDistrib?.map(({ stars, count }) => (
                              <RatingBar key={stars} stars={stars} count={count} total={product.totalResenas} />
                            ))}
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--gh-text-muted)' }}>
                            <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>☆</p>
                            <p style={{ margin: 0, fontSize: '0.85rem' }}>Sé el primero en opinar</p>
                          </div>
                        )}
                      </div>

                      {/* Lista de reseñas + formulario */}
                      <div>
                        {/* Reseñas existentes */}
                        {product?.resenas?.length > 0 ? (
                          <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                            {product.resenas.map((r) => (
                              <div key={r.idResena} style={{ paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                  <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'var(--gh-brand-4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 500, fontSize: '0.9rem', flexShrink: 0,
                                  }}>
                                    {(r.aliasAutor || 'A')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem', color: 'var(--gh-text-primary)' }}>
                                      {r.aliasAutor || 'Anónimo'}
                                    </p>
                                    <StarRating value={r.calificacion} size={13} />
                                  </div>
                                  <p style={{ margin: '0 0 0 auto', fontSize: '0.72rem', color: 'var(--gh-text-muted)' }}>
                                    {new Date(r.fechaResena).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                                {r.comentario && (
                                  <p style={{ margin: '0 0 0 46px', fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                                    {r.comentario}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {/* Formulario nueva reseña */}
                        <ReviewForm idProducto={product?.idProducto} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetail;
