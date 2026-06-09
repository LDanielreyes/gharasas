import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { Plus, Edit2, Trash2, FileText, Link as LinkIcon, UploadCloud } from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/descargables`;

export default function DescargablesPage() {
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', categoria: 'ficha-tecnica', version: '2026', tags: '' });
  const [fileToUpload, setFileToUpload] = useState(null);

  const token = Cookies.get('accessToken');
  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  const fetchArchivos = async () => {
    try {
      const res = await axios.get(API_URL);
      setArchivos(res.data);
    } catch { setError('Error al cargar archivos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArchivos(); }, []);

  const handleOpenModal = (archivo = null) => {
    if (archivo) {
      setEditingId(archivo.idDescargable);
      setFormData({ titulo: archivo.titulo, descripcion: archivo.descripcion || '', categoria: archivo.categoria, version: archivo.version, tags: archivo.tags || '' });
    } else {
      setEditingId(null);
      setFormData({ titulo: '', descripcion: '', categoria: 'ficha-tecnica', version: '2026', tags: '' });
    }
    setFileToUpload(null);
    setShowModal(true);
  };

  const handleBulkSave = async (e) => {
    e.preventDefault();
    if (bulkFiles.length === 0) return Swal.fire({ icon: 'info', title: 'Notificación', text: 'Selecciona al menos un archivo', confirmButtonColor: '#1a3f6a' });
    try {
      const data = new FormData();
      data.append('categoria', formData.categoria);
      data.append('version', formData.version);
      if (formData.tags) data.append('tags', formData.tags);
      
      Array.from(bulkFiles).forEach(file => {
        data.append('archivos', file);
      });
      
      const headers = { ...authHeader(), 'Content-Type': 'multipart/form-data' };
      await axios.post(`${API_URL}/bulk`, data, { headers });
      
      setShowBulkModal(false);
      setBulkFiles([]);
      fetchArchivos();
    } catch (err) { Swal.fire({ icon: 'error', title: 'Aviso', text: err.response?.data?.message || 'Error en carga masiva', confirmButtonColor: '#1a3f6a' }); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingId && !fileToUpload) return Swal.fire({ icon: 'info', title: 'Notificación', text: 'Debes seleccionar un archivo', confirmButtonColor: '#1a3f6a' });
    try {
      const data = new FormData();
      data.append('titulo', formData.titulo);
      data.append('categoria', formData.categoria);
      data.append('version', formData.version);
      if (formData.descripcion) data.append('descripcion', formData.descripcion);
      if (formData.tags) data.append('tags', formData.tags);
      if (fileToUpload) data.append('archivo', fileToUpload);
      const headers = { ...authHeader(), 'Content-Type': 'multipart/form-data' };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data, { headers });
      } else {
        await axios.post(API_URL, data, { headers });
      }
      setShowModal(false);
      fetchArchivos();
    } catch (err) { Swal.fire({ icon: 'error', title: 'Aviso', text: err.response?.data?.message || 'Error al guardar', confirmButtonColor: '#1a3f6a' }); }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: '¿Estás seguro?', text: 'Seguro que deseas eliminar este archivo?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#1a3f6a', confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar' });
    if (!isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchArchivos();
    } catch (err) { Swal.fire({ icon: 'error', title: 'Aviso', text: err.response?.data?.message || 'Error al eliminar', confirmButtonColor: '#1a3f6a' }); }
  };

  // COMMON STYLES
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--gh-border)',
    borderRadius: '8px',
    backgroundColor: 'var(--gh-surface-2)',
    color: 'var(--gh-text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: 'var(--gh-text-secondary)',
    marginBottom: '6px'
  };

  const modalOverlayStyle = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyItems: 'center', zIndex: 1000,
    padding: '24px', overflowY: 'auto'
  };

  return (
    <div style={{ padding: '0 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--gh-text-primary)', margin: 0 }}>Centro de Descargables</h1>
          <p style={{ color: 'var(--gh-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Gestiona los manuales, fichas técnicas y recursos de la plataforma.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => {
              setFormData({ titulo: '', descripcion: '', categoria: 'ficha-tecnica', version: '2026', tags: '' });
              setBulkFiles([]);
              setShowBulkModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--gh-surface-2)', color: 'var(--gh-text-primary)', border: '1px solid var(--gh-border)', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--gh-accent)' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--gh-border)' }}
          >
            <UploadCloud size={16} /> Carga Masiva
          </button>
          <button onClick={() => handleOpenModal()} className="gh-button-primary">
            <Plus size={16} /> Subir Archivo
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gh-text-muted)' }}>Cargando documentos...</div>
      ) : error ? (
        <div style={{ padding: '20px', color: 'var(--gh-danger)', backgroundColor: '#fef2f2', borderRadius: '8px' }}>{error}</div>
      ) : (
        <div className="gh-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', color: 'var(--gh-text-secondary)' }}>
            <thead style={{ backgroundColor: 'var(--gh-surface-2)', borderBottom: '1px solid var(--gh-border)' }}>
              <tr>
                <th style={{ padding: '14px 24px', fontWeight: '600', color: 'var(--gh-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Archivo</th>
                <th style={{ padding: '14px 24px', fontWeight: '600', color: 'var(--gh-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Categoría</th>
                <th style={{ padding: '14px 24px', fontWeight: '600', color: 'var(--gh-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Tamaño</th>
                <th style={{ padding: '14px 24px', fontWeight: '600', color: 'var(--gh-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {archivos.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--gh-text-muted)' }}>No hay archivos subidos en el sistema.</td></tr>
              ) : archivos.map(a => (
                <tr key={a.idDescargable} style={{ borderBottom: '1px solid var(--gh-border)', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='var(--gh-surface-2)'} onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--gh-brand-1)', opacity: 0.1, position: 'absolute' }}></div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gh-accent)', position: 'relative' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--gh-text-primary)' }}>{a.titulo}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gh-text-muted)' }}>{a.tipoArchivo} • Versión {a.version}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'var(--gh-surface-2)', color: 'var(--gh-text-primary)', border: '1px solid var(--gh-border)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {a.categoria.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--gh-text-muted)' }}>{a.pesoArchivo}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <a href={`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:3001'}${a.rutaArchivo}`} target="_blank" rel="noreferrer" style={{ color: 'var(--gh-text-muted)', margin: '0 8px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--gh-accent)'} onMouseOut={e => e.currentTarget.style.color='var(--gh-text-muted)'}>
                      <LinkIcon size={18} />
                    </a>
                    <button onClick={() => handleOpenModal(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gh-text-muted)', margin: '0 8px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--gh-accent)'} onMouseOut={e => e.currentTarget.style.color='var(--gh-text-muted)'}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(a.idDescargable)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gh-text-muted)', margin: '0 8px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--gh-danger)'} onMouseOut={e => e.currentTarget.style.color='var(--gh-text-muted)'}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={modalOverlayStyle}>
          <div className="gh-card" style={{ width: '100%', maxWidth: '500px', padding: 0, margin: 'auto', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gh-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--gh-surface-2)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, color: 'var(--gh-text-primary)' }}>{editingId ? 'Editar Archivo' : 'Subir Documento'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--gh-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Título del Documento</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required style={inputStyle} onFocus={e => e.target.style.borderColor='var(--gh-accent)'} onBlur={e => e.target.style.borderColor='var(--gh-border)'} />
              </div>
              <div>
                <label style={labelStyle}>Categoría</label>
                <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor='var(--gh-accent)'} onBlur={e => e.target.style.borderColor='var(--gh-border)'}>
                  <option value="ficha-tecnica">Ficha Técnica</option>
                  <option value="manual">Manual de Usuario</option>
                  <option value="codigo-error">Código de Error</option>
                  <option value="catalogo">Catálogo</option>
                  <option value="firmware">Firmware / Software</option>
                  <option value="esquema">Esquemas Eléctricos</option>
                  <option value="legal">Documentos Legales</option>
                  <option value="politicas">Políticas de Tratamiento de Datos</option>
                  <option value="autorizaciones">Autorizaciones de Tratamiento de Datos</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Año / Versión</label>
                <input type="number" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor='var(--gh-accent)'} onBlur={e => e.target.style.borderColor='var(--gh-border)'} />
              </div>
              <div>
                <label style={labelStyle}>Descripción (opcional)</label>
                <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} rows={3} style={{...inputStyle, resize: 'none'}} onFocus={e => e.target.style.borderColor='var(--gh-accent)'} onBlur={e => e.target.style.borderColor='var(--gh-border)'} />
              </div>
              <div>
                <label style={labelStyle}>
                  Archivo a subir {editingId && <span style={{ color: 'var(--gh-text-muted)', fontWeight: 'normal' }}>(selecciona solo para reemplazar)</span>}
                </label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFileToUpload(e.target.files[0])} style={{...inputStyle, padding: '10px'}} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', background: 'var(--gh-surface-2)', border: '1px solid var(--gh-border)', borderRadius: '8px', color: 'var(--gh-text-primary)', fontWeight: '500', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" className="gh-button-primary">Guardar Documento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div style={modalOverlayStyle}>
          <div className="gh-card" style={{ width: '100%', maxWidth: '540px', padding: 0, margin: 'auto', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gh-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--gh-surface-2)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, color: 'var(--gh-text-primary)' }}>Carga Masiva de Archivos</h2>
              <button onClick={() => setShowBulkModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--gh-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleBulkSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--gh-surface-2)', borderLeft: '4px solid var(--gh-accent)', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '0.8125rem', color: 'var(--gh-text-secondary)', lineHeight: 1.5 }}>
                Todos los archivos seleccionados usarán esta categoría y año automáticamente. El título individual de cada registro será su nombre de archivo original.
              </div>
              <div>
                <label style={labelStyle}>Categoría Global</label>
                <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor='var(--gh-accent)'} onBlur={e => e.target.style.borderColor='var(--gh-border)'}>
                  <option value="ficha-tecnica">Ficha Técnica</option>
                  <option value="manual">Manual de Usuario</option>
                  <option value="codigo-error">Código de Error</option>
                  <option value="catalogo">Catálogo</option>
                  <option value="firmware">Firmware / Software</option>
                  <option value="esquema">Esquemas Eléctricos</option>
                  <option value="legal">Documentos Legales</option>
                  <option value="politicas">Políticas de Tratamiento de Datos</option>
                  <option value="autorizaciones">Autorizaciones de Tratamiento de Datos</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Año / Versión Global</label>
                <input type="number" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} style={inputStyle} onFocus={e => e.target.style.borderColor='var(--gh-accent)'} onBlur={e => e.target.style.borderColor='var(--gh-border)'} />
              </div>
              <div>
                <label style={labelStyle}>Seleccionar Archivos (Máx 20 recomendados)</label>
                <input type="file" multiple accept=".pdf,.doc,.docx" onChange={e => setBulkFiles(e.target.files)} style={{...inputStyle, padding: '10px'}} />
                {bulkFiles.length > 0 && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gh-success)', marginTop: '8px', fontWeight: '500' }}>{bulkFiles.length} archivos seleccionados listos para subir.</p>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowBulkModal(false)} style={{ padding: '10px 16px', background: 'var(--gh-surface-2)', border: '1px solid var(--gh-border)', borderRadius: '8px', color: 'var(--gh-text-primary)', fontWeight: '500', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" className="gh-button-primary">
                  Subir {bulkFiles.length > 0 ? bulkFiles.length : ''} Archivos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
