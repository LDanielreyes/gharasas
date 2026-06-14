import Swal from 'sweetalert2';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Edit, Upload, X, Image, Megaphone } from 'lucide-react';
import apiClient from '../../api/client';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api$/, '');

const statusBadge = (promo) => {
  const now = new Date();
  const start = new Date(promo.fechaInicio);
  const end = new Date(promo.fechaFin);
  if (!promo.activa) return <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>Inactiva</span>;
  if (end < now) return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>Caducada</span>;
  if (start > now) return <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>Programada</span>;
  return <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>Activa</span>;
};

const emptyForm = { titulo: '', descripcion: '', tipoDescuento: 'BANNER', valorDescuento: '', linkDestino: '', colorFondo: '#0C4D89', fechaInicio: '', fechaFin: '', orden: 0, productosIds: [] };

export default function PromocionesPage() {
  const [promos, setPromos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const fetchPromos = async () => {
    try {
      const { data } = await apiClient.get('/admin/promociones');
      setPromos(data.promociones || []);
    } catch (e) { console.error('Error cargando promociones', e); }
    setLoading(false);
  };

  const fetchProductos = async () => {
    try {
      const { data } = await apiClient.get('/admin/productos');
      setProductos(data.productos || []);
    } catch (e) { console.error('Error cargando productos', e); }
  };

  useEffect(() => { fetchPromos(); fetchProductos(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, fechaInicio: new Date().toISOString().slice(0, 16), fechaFin: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16) });
    setBannerFile(null); setPreview(null); setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      titulo: p.titulo, descripcion: p.descripcion || '', tipoDescuento: p.tipoDescuento,
      valorDescuento: p.valorDescuento || '', linkDestino: p.linkDestino || '',
      colorFondo: p.colorFondo || '#0C4D89',
      fechaInicio: new Date(p.fechaInicio).toISOString().slice(0, 16),
      fechaFin: new Date(p.fechaFin).toISOString().slice(0, 16),
      orden: p.orden || 0,
      productosIds: p.productos?.map(pp => pp.producto?.idProducto || pp.idProducto) || [],
    });
    setBannerFile(null);
    setPreview(p.imagenBanner ? `${API_BASE}${p.imagenBanner}` : null);
    setShowModal(true);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBannerFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'productosIds') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (bannerFile) fd.append('imagenBanner', bannerFile);

      if (editing) {
        await apiClient.put(`/admin/promociones/${editing.idPromocion}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await apiClient.post('/admin/promociones', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchPromos();
    } catch (e) { alert('Error guardando: ' + (e.response?.data?.message || e.message)); }
    setSaving(false);
  };

  const handleToggle = async (id) => {
    await apiClient.patch(`/admin/promociones/${id}/toggle`);
    fetchPromos();
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: '¿Estás seguro?', text: '¿Eliminar esta promoción?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#1a3f6a', confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar' });
    if (!isConfirmed) return;
    await apiClient.delete(`/admin/promociones/${id}`);
    fetchPromos();
  };

  const toggleProduct = (id) => {
    setForm(f => ({
      ...f,
      productosIds: f.productosIds.includes(id) ? f.productosIds.filter(x => x !== id) : [...f.productosIds, id]
    }));
  };

  // ── Banner Creator Preview ──
  const BannerPreview = () => {
    if (preview) return <img src={preview} alt="Banner" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 }} />;
    // Auto-generated banner preview
    return (
      <div style={{
        width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', position: 'relative',
        background: `linear-gradient(135deg, ${form.colorFondo || '#0C4D89'}, ${form.colorFondo ? form.colorFondo + '99' : '#2678A4'})`,
        display: 'flex', alignItems: 'center', padding: '0 32px', color: '#fff',
      }}>
        <div style={{ flex: 1, zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, letterSpacing: 1 }}>
            {form.tipoDescuento === 'PORCENTAJE' ? '% Descuento' : form.tipoDescuento === 'MONTO_FIJO' ? '$ Descuento' : 'Promoción'}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginTop: 4 }}>{form.titulo || 'Título de la Promoción'}</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{form.descripcion || 'Descripción breve...'}</div>
          {form.valorDescuento && (
            <div style={{ marginTop: 8, background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '4px 14px', borderRadius: 99, fontWeight: 800, fontSize: 16 }}>
              {form.tipoDescuento === 'PORCENTAJE' ? `-${form.valorDescuento}%` : form.tipoDescuento === 'MONTO_FIJO' ? `-$${Number(form.valorDescuento).toLocaleString()}` : ''}
            </div>
          )}
        </div>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      </div>
    );
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Cargando promociones...</div>;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d2137', margin: 0 }}>Promociones y Publicidad</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '4px 0 0' }}>Gestiona banners y ofertas del catálogo</p>
        </div>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: '#0C4D89', color: '#fff',
          border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}>
          <Plus size={18} /> Nueva Promoción
        </button>
      </div>

      {/* Table */}
      {promos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#f8fafc', borderRadius: 16, border: '1.5px dashed #e2e8f0' }}>
          <Megaphone size={48} style={{ color: '#cbd5e1', marginBottom: 12 }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>No hay promociones creadas</p>
          <p style={{ color: '#9ca3af', fontSize: 13 }}>Crea tu primera promoción para mostrarla en el catálogo</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>Banner</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>Título</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>Tipo</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>Estado</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>Vigencia</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: 12, textTransform: 'uppercase' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promos.map(p => (
                <tr key={p.idPromocion} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 16px' }}>
                    {p.imagenBanner ? (
                      <img src={`${API_BASE}${p.imagenBanner}`} alt="" style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 80, height: 45, borderRadius: 8, background: p.colorFondo || '#0C4D89', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image size={18} color="#fff" />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0d2137' }}>
                    {p.titulo}
                    {p.productos?.length > 0 && <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{p.productos.length} producto(s)</span>}
                  </td>
                  <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 13 }}>
                    {p.tipoDescuento === 'PORCENTAJE' ? `${p.valorDescuento}% OFF` : p.tipoDescuento === 'MONTO_FIJO' ? `$${Number(p.valorDescuento).toLocaleString()} OFF` : 'Banner'}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>{statusBadge(p)}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#64748b' }}>
                    {new Date(p.fechaInicio).toLocaleDateString()} — {new Date(p.fechaFin).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => openEdit(p)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer' }}><Edit size={16} color="#64748b" /></button>
                      <button onClick={() => handleToggle(p.idPromocion)} style={{ background: p.activa ? '#dcfce7' : '#f1f5f9', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer' }}>
                        {p.activa ? <ToggleRight size={16} color="#16a34a" /> : <ToggleLeft size={16} color="#9ca3af" />}
                      </button>
                      <button onClick={() => handleDelete(p.idPromocion)} style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer' }}><Trash2 size={16} color="#dc2626" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 720, maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0d2137', margin: 0 }}>
                {editing ? 'Editar Promoción' : 'Nueva Promoción'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#9ca3af" /></button>
            </div>

            {/* Banner Preview */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Vista previa del banner</label>
              <div style={{ marginTop: 8 }}><BannerPreview /></div>
            </div>

            {/* Banner Upload */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Imagen del banner (opcional)</label>
              <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => fileRef.current?.click()} style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1px dashed #cbd5e1',
                  borderRadius: 10, padding: '8px 16px', fontSize: 13, cursor: 'pointer', color: '#64748b',
                }}>
                  <Upload size={16} /> {bannerFile ? bannerFile.name : 'Subir imagen'}
                </button>
                {preview && <button onClick={() => { setBannerFile(null); setPreview(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 12 }}>Quitar</button>}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </div>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Si no subes imagen, se genera un banner automático con el color y texto</p>
            </div>

            {/* Form Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Título *</label>
                <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Temporada de Descuentos" style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción breve..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>Tipo de descuento</label>
                <select value={form.tipoDescuento} onChange={e => setForm({ ...form, tipoDescuento: e.target.value })} style={inputStyle}>
                  <option value="BANNER">Solo Banner (publicidad)</option>
                  <option value="PORCENTAJE">Porcentaje (%)</option>
                  <option value="MONTO_FIJO">Monto Fijo ($)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Valor del descuento</label>
                <input type="number" value={form.valorDescuento} onChange={e => setForm({ ...form, valorDescuento: e.target.value })} placeholder={form.tipoDescuento === 'PORCENTAJE' ? 'Ej: 20' : 'Ej: 500000'} disabled={form.tipoDescuento === 'BANNER'} style={{ ...inputStyle, opacity: form.tipoDescuento === 'BANNER' ? 0.5 : 1 }} />
              </div>
              <div>
                <label style={labelStyle}>Fecha inicio</label>
                <input type="datetime-local" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Fecha fin</label>
                <input type="datetime-local" value={form.fechaFin} onChange={e => setForm({ ...form, fechaFin: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Color de fondo</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={form.colorFondo} onChange={e => setForm({ ...form, colorFondo: e.target.value })} style={{ width: 40, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                  <input value={form.colorFondo} onChange={e => setForm({ ...form, colorFondo: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Orden</label>
                <input type="number" value={form.orden} onChange={e => setForm({ ...form, orden: parseInt(e.target.value) || 0 })} style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Link destino (opcional)</label>
                <input value={form.linkDestino} onChange={e => setForm({ ...form, linkDestino: e.target.value })} placeholder="Ej: /catalogo o https://wa.me/573022326569" style={inputStyle} />
              </div>
            </div>

            {/* Productos vinculados */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Productos vinculados (opcional)</label>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 8px' }}>Los productos seleccionados mostrarán un badge de oferta en el catálogo</p>
              <div style={{ maxHeight: 150, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8 }}>
                {productos.map(p => (
                  <label key={p.idProducto} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 13, background: form.productosIds.includes(p.idProducto) ? '#eff6ff' : 'transparent' }}>
                    <input type="checkbox" checked={form.productosIds.includes(p.idProducto)} onChange={() => toggleProduct(p.idProducto)} />
                    <span style={{ fontWeight: 500 }}>{p.marca?.nombre || ''} {p.modelo}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14, color: '#64748b' }}>Cancelar</button>
              <button onClick={handleSave} disabled={saving || !form.titulo || !form.fechaInicio || !form.fechaFin} style={{
                padding: '10px 24px', borderRadius: 10, border: 'none', background: '#0C4D89', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Promoción'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
