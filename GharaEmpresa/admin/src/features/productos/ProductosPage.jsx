import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Eye, Star, SlidersHorizontal,
  Download, MoreHorizontal, ChevronLeft, ChevronRight,
  Package, Activity, AlertTriangle, TrendingUp,
  X, Save, Loader2, Edit3, Trash2,
} from 'lucide-react';
import apiClient from '../../api/client';

// ─── Constantes ───────────────────────────────────────────
const TECNOLOGIAS = ['Inverter', 'Convencional', 'Inverter+'];
const ESTADOS_INVENTARIO = ['DISPONIBLES', 'AGOTADO', 'PRÓXIMAMENTE', 'DESCONTINUADO'];
const VOLTAJES = ['110V', '220V', '110V/220V'];
const CLASES_ENERGETICAS = ['A+++', 'A++', 'A+', 'A', 'B', 'C'];
const COLORES = ['Blanco', 'Negro', 'Gris', 'Silver', 'Dorado'];
const BTUS = [9000, 12000, 18000, 24000, 36000, 48000, 60000];

// ─── Mini KPI ────────────────────────────────────────────
const MiniKpi = ({ label, value, icon: Icon, iconColor }) => (
  <div className="gh-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
    <div style={{
      width: 38, height: 38, borderRadius: '10px',
      background: `${iconColor}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={18} color={iconColor} />
    </div>
    <div>
      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--gh-text-primary)', marginTop: '2px' }}>{value}</p>
    </div>
  </div>
);

// ─── Status badge ─────────────────────────────────────────
const StatusBadge = ({ active }) => (
  <span
    style={{
      padding: '4px 10px',
      borderRadius: '99px',
      fontSize: '0.68rem',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      background: active ? '#dcfce7' : '#f3f4f6',
      color: active ? '#15803d' : '#6b7280',
    }}
  >
    {active ? 'Activo' : 'Inactivo'}
  </span>
);

// ─── Toggle ───────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <label className="toggle" style={{ cursor: 'pointer' }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="toggle-slider" />
  </label>
);

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

const BRANDS_FILTER = ['Todos', 'HISENSE', 'MIDEA', 'MIRAGE', 'PANASONIC', 'MABE'];

// ─── Estilos del Modal ────────────────────────────────────
const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(13,33,55,0.55)',
  backdropFilter: 'blur(4px)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '20px',
};

const modalStyle = {
  background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '720px',
  maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
  boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
};

const inputStyle = {
  width: '100%', height: '40px', padding: '0 12px',
  border: '1px solid #e0e4ea', borderRadius: '8px',
  fontSize: '0.875rem', fontFamily: 'inherit', color: '#1f2937',
  background: 'var(--gh-surface-2)', outline: 'none', transition: 'border-color 0.15s',
};

const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'auto' };

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600,
  color: 'var(--gh-text-muted)', marginBottom: '5px', textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

// ─── Formulario Input ─────────────────────────────────────
const Field = ({ label, required, children, span }) => (
  <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
    <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
    {children}
  </div>
);

// ─── MODAL CREAR/EDITAR PRODUCTO ──────────────────────────
const ProductoModal = ({ producto, marcas, onClose, onSaved }) => {
  const isEdit = !!producto;

  const [form, setForm] = useState({
    idMarca: producto?.idMarca || '',
    modelo: producto?.modelo || '',
    tecnologia: producto?.tecnologia || 'Inverter',
    lineaSerie: producto?.lineaSerie || '',
    capacidadBtu: producto?.capacidadBtu || '',
    voltaje: producto?.voltaje || '220V',
    refrigerante: producto?.refrigerante || 'R-410A',
    seer: producto?.seer || '',
    claseEnergetica: producto?.claseEnergetica || '',
    tieneWifi: producto?.tieneWifi || false,
    color: producto?.color || 'Blanco',
    precioContado: producto?.precioContado || '',
    estadoInventario: producto?.estadoInventario || 'DISPONIBLES',
    imagenFiles: [],
    imagenPreviews: [],
    imagenesExistentes: producto?.imagenes || [],
    imagenesAEliminar: [],
    fichaFile: null,
    eliminarFicha: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRemoveExistingImage = (img) => {
    handleChange('imagenesAEliminar', [...form.imagenesAEliminar, img.idImagen]);
    handleChange('imagenesExistentes', form.imagenesExistentes.filter(i => i.idImagen !== img.idImagen));
  };

  const handleRemoveNewImage = (idx) => {
    const newFiles = [...form.imagenFiles];
    newFiles.splice(idx, 1);
    const newPreviews = [...form.imagenPreviews];
    newPreviews.splice(idx, 1);
    handleChange('imagenFiles', newFiles);
    handleChange('imagenPreviews', newPreviews);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    handleChange('imagenFiles', [...form.imagenFiles, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    handleChange('imagenPreviews', [...form.imagenPreviews, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.idMarca) return setError('Selecciona una marca.');
    if (!form.modelo.trim()) return setError('El modelo es obligatorio.');
    if (!form.capacidadBtu) return setError('La capacidad BTU es obligatoria.');
    if (!form.precioContado) return setError('El precio es obligatorio.');

    const payload = {
      idMarca: parseInt(form.idMarca),
      modelo: form.modelo.trim(),
      tecnologia: form.tecnologia,
      lineaSerie: form.lineaSerie.trim() || null,
      capacidadBtu: parseInt(form.capacidadBtu),
      voltaje: form.voltaje,
      refrigerante: form.refrigerante.trim() || null,
      seer: form.seer ? parseFloat(form.seer) : null,
      claseEnergetica: form.claseEnergetica || null,
      tieneWifi: form.tieneWifi,
      color: form.color,
      precioContado: parseFloat(form.precioContado),
      estadoInventario: form.estadoInventario,
    };

    try {
      setSaving(true);
      let newProductId;
      
      // 1. Crear o Actualizar Producto
      if (isEdit) {
        await apiClient.put(`/admin/productos/${producto.idProducto}`, payload);
        newProductId = producto.idProducto;
      } else {
        const res = await apiClient.post('/admin/productos', payload);
        newProductId = res.data.data.idProducto;
      }
      
      // 2. Eliminar imágenes marcadas (Solo en edición)
      if (form.imagenesAEliminar.length > 0) {
        await Promise.all(
          form.imagenesAEliminar.map(id => apiClient.delete(`/admin/imagenes/${id}`).catch(err => console.error("Error al borrar imagen", id)))
        );
      }

      // 3. Subir imágenes nuevas
      if (form.imagenFiles.length > 0) {
        const formData = new FormData();
        form.imagenFiles.forEach(file => formData.append('imagenes', file));
        await apiClient.post(`/admin/productos/${newProductId}/imagenes`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // 4. Eliminar Ficha Tecnica si aplica
      if (form.eliminarFicha && !form.fichaFile) {
        await apiClient.delete(`/admin/productos/${newProductId}/ficha`).catch(err => console.error("Error al borrar ficha", err));
      }

      // 5. Subir ficha técnica nueva si se seleccionó
      if (form.fichaFile) {
        const formData = new FormData();
        formData.append('ficha', form.fichaFile);
        await apiClient.post(`/admin/productos/${newProductId}/ficha`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error al guardar el producto.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  // Gallery Styles
  const dropzoneStyle = {
    border: '2px dashed var(--gh-border)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    background: 'var(--gh-surface-2)',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  };

  const imageCardStyle = {
    position: 'relative',
    width: '100px',
    height: '100px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--gh-border)',
    flexShrink: 0,
    group: 'image-card', // used for styling children
  };

  const overlayDeleteStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(220, 38, 38, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
    color: 'white',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={{ ...modalStyle, maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 32px', borderBottom: '1px solid var(--gh-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--gh-surface-1)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>
              {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--gh-text-muted)', marginTop: '4px' }}>
              {isEdit ? 'Actualiza la información y galería del producto.' : 'Completa la información para agregar al catálogo.'}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px', borderRadius: '8px', color: 'var(--gh-text-muted)',
          }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'auto', padding: '0', background: 'var(--gh-bg)' }}>
          
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Seccion 1: Info Basica */}
            <div className="gh-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--gh-border)', paddingBottom: '12px' }}>
                <Package size={18} color="var(--gh-accent)" /> Información Básica
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <Field label="Marca" required>
                  <select style={selectStyle} value={form.idMarca} onChange={e => handleChange('idMarca', e.target.value)}>
                    <option value="">Seleccionar marca…</option>
                    {marcas.map(m => <option key={m.idMarca} value={m.idMarca}>{m.nombre}</option>)}
                  </select>
                </Field>
                <Field label="Modelo" required span={2}>
                  <input style={inputStyle} value={form.modelo} onChange={e => handleChange('modelo', e.target.value)} placeholder="Ej: AS-12HR5FWETG" />
                </Field>
                <Field label="Línea / Serie">
                  <input style={inputStyle} value={form.lineaSerie} onChange={e => handleChange('lineaSerie', e.target.value)} placeholder="Ej: Perla, Life+" />
                </Field>
              </div>
            </div>

            {/* Seccion 2: Especificaciones */}
            <div className="gh-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--gh-border)', paddingBottom: '12px' }}>
                <SlidersHorizontal size={18} color="var(--gh-accent)" /> Especificaciones Técnicas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <Field label="Tecnología" required>
                  <select style={selectStyle} value={form.tecnologia} onChange={e => handleChange('tecnologia', e.target.value)}>
                    {TECNOLOGIAS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Capacidad BTU" required>
                  <select style={selectStyle} value={form.capacidadBtu} onChange={e => handleChange('capacidadBtu', e.target.value)}>
                    <option value="">Seleccionar…</option>
                    {BTUS.map(b => <option key={b} value={b}>{b.toLocaleString()} BTU</option>)}
                  </select>
                </Field>
                <Field label="Voltaje" required>
                  <select style={selectStyle} value={form.voltaje} onChange={e => handleChange('voltaje', e.target.value)}>
                    {VOLTAJES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Refrigerante">
                  <input style={inputStyle} value={form.refrigerante} onChange={e => handleChange('refrigerante', e.target.value)} placeholder="Ej: R-410A, R-32" />
                </Field>
                <Field label="SEER">
                  <input style={inputStyle} type="number" step="0.01" min="0" value={form.seer} onChange={e => handleChange('seer', e.target.value)} placeholder="Ej: 19.50" />
                </Field>
                <Field label="Clase Energética">
                  <select style={selectStyle} value={form.claseEnergetica} onChange={e => handleChange('claseEnergetica', e.target.value)}>
                    <option value="">Sin clasificar</option>
                    {CLASES_ENERGETICAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Color">
                  <select style={selectStyle} value={form.color} onChange={e => handleChange('color', e.target.value)}>
                    {COLORES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Seccion 3: Inventario */}
            <div className="gh-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--gh-border)', paddingBottom: '12px' }}>
                <Activity size={18} color="var(--gh-accent)" /> Comercial & Inventario
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <Field label="Precio Contado (COP)" required>
                  <input style={inputStyle} type="number" min="0" value={form.precioContado} onChange={e => handleChange('precioContado', e.target.value)} placeholder="Ej: 2350000" />
                </Field>
                <Field label="Estado Inventario">
                  <select style={selectStyle} value={form.estadoInventario} onChange={e => handleChange('estadoInventario', e.target.value)}>
                    {ESTADOS_INVENTARIO.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </Field>
                <Field label="WiFi Integrado">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--gh-text-primary)', height: '40px' }}>
                    <input type="checkbox" checked={form.tieneWifi} onChange={e => handleChange('tieneWifi', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--gh-accent)', cursor: 'pointer' }} />
                    {form.tieneWifi ? 'Sí — conectividad incluida' : 'No'}
                  </label>
                </Field>
              </div>
            </div>

            {/* Seccion 4: Multimedia */}
            <div className="gh-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--gh-border)', paddingBottom: '12px' }}>
                <Star size={18} color="var(--gh-accent)" /> Galería y Multimedia
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Visualización de Galería Unificada */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  
                  {/* Zona de Drop/Select */}
                  <label style={dropzoneStyle} title="Haz clic para seleccionar imágenes">
                    <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
                    <Plus size={28} color="var(--gh-text-muted)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--gh-text-muted)', fontWeight: 500, padding: '0 10px' }}>Añadir foto</span>
                  </label>

                  {/* Fotos Existentes */}
                  {form.imagenesExistentes.map((img, idx) => (
                    <div key={img.idImagen} style={imageCardStyle} className="img-gallery-item">
                      {img.esPrincipal && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--gh-accent)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '4px', textAlign: 'center', zIndex: 2 }}>
                          PRINCIPAL
                        </div>
                      )}
                      <img src={`${apiClient.defaults.baseURL?.replace('/api', '')}${img.rutaImagen}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Existente" />
                      <div className="img-overlay" style={overlayDeleteStyle} onClick={() => handleRemoveExistingImage(img)}>
                        <Trash2 size={24} />
                      </div>
                    </div>
                  ))}

                  {/* Fotos Nuevas */}
                  {form.imagenPreviews.map((src, idx) => (
                    <div key={`new-${idx}`} style={imageCardStyle} className="img-gallery-item">
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--gh-success)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '4px', textAlign: 'center', zIndex: 2 }}>
                        NUEVA
                      </div>
                      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Nueva" />
                      <div className="img-overlay" style={overlayDeleteStyle} onClick={() => handleRemoveNewImage(idx)}>
                        <Trash2 size={24} />
                      </div>
                    </div>
                  ))}
                  
                </div>

                <style>{`
                  .img-gallery-item:hover .img-overlay { opacity: 1 !important; }
                `}</style>

                {form.imagenesAEliminar.length > 0 && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gh-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} /> Se eliminarán {form.imagenesAEliminar.length} imagen(es) al guardar.
                  </div>
                )}

                {/* Ficha Tecnica */}
                <Field label="Ficha Técnica (PDF)" span={1}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {isEdit && producto?.fichaTecnica && !form.eliminarFicha && !form.fichaFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--gh-surface-2)', border: '1px solid var(--gh-border)', padding: '12px 16px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '6px', borderRadius: '6px', display: 'flex' }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gh-text-primary)' }}>Documento Ficha Técnica</p>
                            <a href={`${apiClient.defaults.baseURL?.replace('/api', '')}${producto.fichaTecnica}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--gh-accent)', textDecoration: 'none' }}>Ver PDF en nueva pestaña</a>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleChange('eliminarFicha', true)} style={{ background: '#fee2e2', border: '1px solid #fca5a5', cursor: 'pointer', color: '#ef4444', padding: '6px', borderRadius: '6px', transition: 'all 0.2s' }} title="Eliminar Ficha">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input 
                          type="file" 
                          accept="application/pdf"
                          onChange={e => handleChange('fichaFile', e.target.files[0])}
                          style={{ ...inputStyle, padding: '7px 12px' }}
                        />
                        {form.eliminarFicha && !form.fichaFile && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gh-danger)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <AlertTriangle size={14} /> La ficha se eliminará al guardar.
                            <button type="button" onClick={() => handleChange('eliminarFicha', false)} style={{ marginLeft: '6px', fontSize: '0.75rem', color: 'var(--gh-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                              Deshacer
                            </button>
                          </div>
                        )}
                        {form.fichaFile && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gh-success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Download size={14} /> Nueva ficha seleccionada (reemplazará la actual al guardar).
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Field>
              </div>
            </div>

          </div>

          {/* Error General */}
          {error && (
            <div style={{
              margin: '0 32px 24px', padding: '14px 20px', borderRadius: '8px',
              background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--gh-danger)',
              color: 'var(--gh-danger)', fontSize: '0.875rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <AlertTriangle size={18} /> {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div style={{
          padding: '20px 32px', borderTop: '1px solid var(--gh-border)',
          display: 'flex', justifyContent: 'flex-end', gap: '12px',
          background: 'var(--gh-surface-1)'
        }}>
          <button type="button" onClick={onClose} className="gh-btn-secondary" style={{ height: '42px', padding: '0 24px' }}>
            Descartar
          </button>
          <button onClick={handleSubmit} disabled={saving} className="gh-btn-primary"
            style={{ height: '42px', padding: '0 28px', gap: '8px', opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Guardando…' : isEdit ? 'Guardar Cambios' : 'Publicar Producto'}
          </button>
        </div>
      </div>
    </div>
  );
};
// ═════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL DE PRODUCTOS
// ═════════════════════════════════════════════════════════════

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [brand, setBrand]         = useState('Todos');
  const [status, setStatus]       = useState('Todos');
  const [stats, setStats]         = useState({ total: 0, activos: 0 });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      const res = await apiClient.get('/admin/marcas');
      setMarcas(res.data.data || []);
    } catch (e) {
      console.error('Error cargando marcas', e);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/productos');
      const data = res.data.data || [];
      setProductos(data);
      setStats({
        total: data.length,
        activos: data.filter(p => p.estadoRegistro).length,
      });
    } catch (e) {
      console.error('Error cargando productos', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const action = currentStatus ? 'inactivar' : 'activar';
      await apiClient.patch(`/admin/productos/${id}/${action}`);
      setProductos(prev =>
        prev.map(p => p.idProducto === id ? { ...p, estadoRegistro: !currentStatus } : p)
      );
    } catch (e) {
      console.error('Error cambiando estado', e);
      Swal.fire({ icon: 'info', title: 'Notificación', text: 'No se pudo cambiar el estado del producto.', confirmButtonColor: '#1a3f6a' });
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (producto) => {
    setEditingProduct(producto);
    setModalOpen(true);
  };

  const handleSaved = () => {
    fetchProductos();
  };

  // Filtros en cliente
  const filtered = productos.filter(p => {
    const matchSearch = !search ||
      p.modelo?.toLowerCase().includes(search.toLowerCase()) ||
      p.marca?.nombre?.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brand === 'Todos' || p.marca?.nombre === brand;
    const matchStatus =
      status === 'Todos' ||
      (status === 'Activo' && p.estadoRegistro) ||
      (status === 'Inactivo' && !p.estadoRegistro);
    return matchSearch && matchBrand && matchStatus;
  });

  // Imagen placeholder
  const getThumb = (p) => {
    if (p.imagenes?.length > 0) return `${apiClient.defaults.baseURL?.replace('/api', '')}${p.imagenes[0].rutaImagen}`;
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Breadcrumb + Header ── */}
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--gh-text-muted)', marginBottom: '6px' }}>
          Inventario &rsaquo; <span style={{ color: 'var(--gh-text-primary)' }}>Catálogo de Productos</span>
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Catálogo de Productos</h1>
            <p className="page-subtitle" style={{ maxWidth: '460px' }}>
              Administra tu inventario HVAC comercial, controla la visibilidad en el storefront y rastrea el engagement por producto.
            </p>
          </div>
          <button className="gh-btn-primary" style={{ gap: 8 }} onClick={handleOpenCreate}>
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* ── Mini KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <MiniKpi label="Total Productos"  value={stats.total.toLocaleString()}   icon={Package}       iconColor="#1565cc" />
        <MiniKpi label="Activos Visibles" value={stats.activos.toLocaleString()} icon={Eye}           iconColor="#15803d" />
        <MiniKpi label="Sin Imagen"       value={productos.filter(p => !p.imagenes?.length).length} icon={AlertTriangle} iconColor="#c2410c" />
        <MiniKpi label="Engagement Prom." value={stats.total > 0 ? `${Math.round((stats.activos/stats.total)*100)}%` : '—'} icon={TrendingUp} iconColor="#7c3aed" />
      </div>

      {/* ── Filters ── */}
      <div className="gh-card" style={{ padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gh-text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filtrar por modelo, marca o SKU..."
            style={{
              width: '100%', paddingLeft: '36px', paddingRight: '12px',
              height: '38px', border: '1px solid #e9ecf1', borderRadius: '8px',
              fontSize: '0.875rem', background: 'var(--gh-surface-2)', outline: 'none', fontFamily: 'inherit',
              color: 'var(--gh-text-primary)',
            }}
          />
        </div>

        {/* Brand filter */}
        <select
          value={brand}
          onChange={e => setBrand(e.target.value)}
          style={{
            height: '38px', padding: '0 36px 0 12px', border: '1px solid #e9ecf1',
            borderRadius: '8px', fontSize: '0.875rem', background: 'var(--gh-surface-2)', color: 'var(--gh-text-primary)',
            cursor: 'pointer', outline: 'none', fontFamily: 'inherit', minWidth: '130px',
            appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          }}
        >
          {BRANDS_FILTER.map(b => <option key={b} value={b}>{b === 'Todos' ? 'Todas las Marcas' : b}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{
            height: '38px', padding: '0 36px 0 12px', border: '1px solid #e9ecf1',
            borderRadius: '8px', fontSize: '0.875rem', background: 'var(--gh-surface-2)', color: 'var(--gh-text-primary)',
            cursor: 'pointer', outline: 'none', fontFamily: 'inherit', minWidth: '120px',
            appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          }}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Activo">Activos</option>
          <option value="Inactivo">Inactivos</option>
        </select>

        {/* Export */}
        <button className="gh-btn-secondary" style={{ height: '38px', padding: '0 12px', flexShrink: 0 }} title="Exportar">
          <Download size={15} />
        </button>
        <button className="gh-btn-secondary" style={{ height: '38px', padding: '0 12px', flexShrink: 0 }} title="Opciones">
          <MoreHorizontal size={15} />
        </button>
      </div>

      {/* ── Table ── */}
      <div className="gh-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gh-text-muted)', fontSize: '0.875rem' }}>
            Cargando productos...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gh-text-muted)' }}>
            <Package size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontWeight: 500, color: 'var(--gh-text-primary)', marginBottom: '4px' }}>No se encontraron productos</p>
            <p style={{ fontSize: '0.875rem' }}>Ajusta los filtros o agrega un nuevo producto.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '20px' }}>IMAGEN</th>
                  <th>MODELO Y MARCA</th>
                  <th>PRECIO (COP)</th>
                  <th>ENGAGEMENT</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const thumb = getThumb(p);
                  return (
                    <tr key={p.idProducto} style={!p.estadoRegistro ? { opacity: 0.55 } : {}}>
                      {/* Thumbnail */}
                      <td style={{ paddingLeft: '20px', width: '72px' }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: '10px',
                          background: thumb ? 'transparent' : '#f0f2f5',
                          border: '1px solid #e9ecf1',
                          overflow: 'hidden',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {thumb
                            ? <img src={thumb} alt={p.modelo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <Package size={20} color="#d1d5db" />
                          }
                        </div>
                      </td>

                      {/* Model + Brand */}
                      <td>
                        <p style={{ fontWeight: 600, color: '#1565cc', fontSize: '0.9rem', marginBottom: '2px' }}>
                          {p.modelo}
                        </p>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {p.marca?.nombre}
                        </p>
                        {p.capacidadBtu && (
                          <p style={{ fontSize: '0.72rem', color: 'var(--gh-text-muted)', marginTop: '1px' }}>
                            {p.capacidadBtu.toLocaleString()} BTU · {p.voltaje}
                          </p>
                        )}
                      </td>

                      {/* Price */}
                      <td>
                        <p style={{ fontWeight: 700, color: 'var(--gh-text-primary)', fontSize: '0.9375rem' }}>
                          {formatCOP(p.precioContado)}
                        </p>
                      </td>

                      {/* Engagement */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--gh-text-muted)' }}>
                            <Eye size={12} color="#6b7280" />
                            {(p._count?.leads || 0).toLocaleString()} leads
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#f59e0b' }}>
                            <Star size={12} fill="#f59e0b" color="#f59e0b" />
                            {p._count?.resenas > 0 ? `${p._count.resenas} reseñas` : 'Sin reseñas'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge active={p.estadoRegistro} />
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Editar"
                            style={{
                              background: '#f0f5ff', border: 'none', borderRadius: '8px',
                              width: '34px', height: '34px', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s',
                            }}
                          >
                            <Edit3 size={14} color="#1565cc" />
                          </button>
                          <Toggle
                            checked={p.estadoRegistro}
                            onChange={() => toggleStatus(p.idProducto, p.estadoRegistro)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {!loading && filtered.length > 0 && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid #f0f2f5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--gh-text-muted)' }}>
              Mostrando <strong style={{ color: 'var(--gh-text-primary)' }}>1–{filtered.length}</strong> de{' '}
              <strong style={{ color: 'var(--gh-text-primary)' }}>{filtered.length}</strong> resultados
            </p>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button className="gh-btn-secondary" style={{ padding: '5px 10px' }} disabled>
                <ChevronLeft size={14} />
              </button>
              <span style={{
                padding: '5px 10px', borderRadius: '6px',
                background: '#1a3f6a', color: '#fff',
                fontSize: '0.8125rem', fontWeight: 600,
              }}>1</span>
              <button className="gh-btn-secondary" style={{ padding: '5px 10px' }} disabled>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <ProductoModal
          producto={editingProduct}
          marcas={marcas}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default ProductosPage;
