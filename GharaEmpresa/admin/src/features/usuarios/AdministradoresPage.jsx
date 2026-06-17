import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { Plus, Edit2, Trash2, Shield, User } from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/usuarios`;
const API_ME  = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/usuarios/me/perfil`;

export default function AdministradoresPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [showModal, setShowModal]               = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData]   = useState({ nombre: '', email: '', password: '', rol: 'Asesor' });
  const [profileData, setProfileData] = useState({ nombre: '', password: '', currentPassword: '' });

  const token = Cookies.get('accessToken');
  let currentUser = null;
  if (token) {
    try { currentUser = JSON.parse(atob(token.split('.')[1])); } catch (_) {}
  }
  const isSuperAdmin = currentUser?.rol === 'SuperAdmin';
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const fetchUsuarios = async () => {
    if (!isSuperAdmin) { setLoading(false); return; }
    try {
      const res = await axios.get(API_URL);
      setUsuarios(res.data);
    } catch { setError('Error al cargar administradores'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingId(usuario.idAdmin);
      setFormData({ nombre: usuario.nombre, email: usuario.email, password: '', rol: usuario.rol });
    } else {
      setEditingId(null);
      setFormData({ nombre: '', email: '', password: '', rol: 'Asesor' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (!data.password) delete data.password;
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      setShowModal(false);
      fetchUsuarios();
    } catch (err) { Swal.fire({ icon: 'info', title: 'Aviso', text: err.response?.data?.message || 'Error al guardar', confirmButtonColor: '#1a3f6a' }); }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: '¿Estás seguro?', text: 'Seguro que deseas eliminar este usuario?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#1a3f6a', confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar' });
    if (!isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsuarios();
    } catch (err) { Swal.fire({ icon: 'info', title: 'Aviso', text: err.response?.data?.message || 'Error al eliminar', confirmButtonColor: '#1a3f6a' }); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const data = {};
      if (profileData.nombre && profileData.nombre.trim() !== '') {
        data.nombre = profileData.nombre.trim();
      }
      if (profileData.password) {
        data.password = profileData.password;
        data.currentPassword = profileData.currentPassword;
      }
      if (Object.keys(data).length === 0) {
        Swal.fire({ icon: 'info', title: 'Notificación', text: 'No hay cambios para guardar', confirmButtonColor: '#1a3f6a' });
        return;
      }
      await axios.put(API_ME, data);
      Swal.fire({ icon: 'info', title: 'Notificación', text: 'Perfil actualizado correctamente', confirmButtonColor: '#1a3f6a' });
      setShowProfileModal(false);
    } catch (err) { Swal.fire({ icon: 'info', title: 'Aviso', text: err.response?.data?.message || 'Error al actualizar perfil', confirmButtonColor: '#1a3f6a' }); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Cuentas y Accesos</h1>
          <p className="page-subtitle">Gestiona los miembros de tu equipo</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => {
            setProfileData({ nombre: currentUser?.nombre || '', password: '', currentPassword: '' });
            setShowProfileModal(true);
          }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium">
            <User size={16} /> Mi Perfil
          </button>
          {isSuperAdmin && (
            <button onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm">
              <Plus size={16} /> Nuevo Usuario
            </button>
          )}
        </div>
      </div>

      {!isSuperAdmin ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <Shield className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Acceso Restringido</h3>
          <p className="text-slate-500">Solo el SuperAdmin puede gestionar otros administradores.</p>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-slate-500">Cargando...</div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map(u => (
                <tr key={u.idAdmin} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{u.nombre}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.rol === 'SuperAdmin' ? 'bg-purple-100 text-purple-700' :
                      u.rol === 'Administrador' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>{u.rol}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(u)} className="text-blue-600 hover:text-blue-800 mx-2 p-1">
                      <Edit2 size={16} />
                    </button>
                    {u.idAdmin !== currentUser?.idAdmin && (
                      <button onClick={() => handleDelete(u.idAdmin)} className="text-red-500 hover:text-red-700 mx-2 p-1">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">x</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Correo</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={!!editingId} className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-100" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contrasena {editingId && <span className="text-xs text-slate-400 font-normal">(dejar en blanco para no cambiar)</span>}
                </label>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} className="w-full px-3 py-2 border rounded-lg" />
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Shield size={12} /> La contraseña debe tener al menos 12 caracteres.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="SuperAdmin">SuperAdmin</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Asesor">Asesor</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Mi Perfil</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">x</button>
            </div>
            <form onSubmit={handleProfileSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" value={profileData.nombre} onChange={e => setProfileData({...profileData, nombre: e.target.value})} placeholder="Solo si deseas cambiarlo" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Cambiar Contrasena</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Contrasena Actual</label>
                    <input type="password" value={profileData.currentPassword} onChange={e => setProfileData({...profileData, currentPassword: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Nueva Contrasena</label>
                    <input type="password" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Shield size={12} /> Min. 12 caracteres recomendados para seguridad.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowProfileModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
