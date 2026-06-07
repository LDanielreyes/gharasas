import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import apiClient from '../../api/client';

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ idFaq: null, categoria: 'Instalación', pregunta: '', respuesta: '', ordenVisualizacion: 0, estadoPublicacion: true });

  const fetchFaqs = async () => {
    try {
      const res = await apiClient.get('/admin/faq');
      setFaqs(res.data.data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const openModal = (faq = null) => {
    if (faq) setForm({ ...faq });
    else setForm({ idFaq: null, categoria: 'Instalación', pregunta: '', respuesta: '', ordenVisualizacion: 0, estadoPublicacion: true });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (form.idFaq) await apiClient.put(`/admin/faq/${form.idFaq}`, form);
      else await apiClient.post('/admin/faq', form);
      setShowModal(false);
      fetchFaqs();
    } catch (e) { Swal.fire({ icon: 'info', title: 'Notificación', text: 'Error al guardar FAQ', confirmButtonColor: '#1a3f6a' }); }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: '¿Estás seguro?', text: '¿Seguro que deseas eliminar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#1a3f6a', confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar' });
    if (!isConfirmed) return;
    try {
      await apiClient.delete(`/admin/faq/${id}`);
      fetchFaqs();
    } catch (e) { Swal.fire({ icon: 'info', title: 'Notificación', text: 'Error al eliminar FAQ', confirmButtonColor: '#1a3f6a' }); }
  };

  if (loading) return <div style={{ padding: 40 }}>Cargando FAQs...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Preguntas Frecuentes (FAQ)</h1>
          <p className="page-subtitle">Gestiona las respuestas comunes para tus clientes.</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}><Plus size={16}/> Nueva FAQ</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Pregunta</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map(f => (
              <tr key={f.idFaq}>
                <td style={{ fontWeight: 600, color: '#1a3f6a' }}>{f.categoria}</td>
                <td>{f.pregunta}</td>
                <td>{f.estadoPublicacion ? 'Público' : 'Oculto'}</td>
                <td style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => openModal(f)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(f.idFaq)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: '100%', maxWidth: 550, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: '#0f172a' }}>{form.idFaq ? 'Editar Pregunta Frecuente' : 'Nueva Pregunta Frecuente'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>Categoría</label>
                <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, outline: 'none', color: '#0f172a' }}>
                  <option value="General">General</option>
                  <option value="Productos">Productos</option>
                  <option value="Instalación">Instalación</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Garantía">Garantía</option>
                  <option value="Pagos">Pagos</option>
                  <option value="Envíos">Envíos</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>Pregunta</label>
                <input placeholder="Ej. ¿Cómo realizo el mantenimiento?" value={form.pregunta} onChange={e => setForm({...form, pregunta: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, outline: 'none', color: '#0f172a' }}/>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>Respuesta</label>
                <textarea placeholder="Explica detalladamente la respuesta..." rows={5} value={form.respuesta} onChange={e => setForm({...form, respuesta: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, outline: 'none', resize: 'vertical', color: '#0f172a' }}/>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <input type="checkbox" id="publicar" checked={form.estadoPublicacion} onChange={e => setForm({...form, estadoPublicacion: e.target.checked})} style={{ width: 18, height: 18 }} />
                <label htmlFor="publicar" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>Publicar inmediatamente en el portal web</label>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#fff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSave} style={{ padding: '10px 20px', background: '#0c4d89', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
