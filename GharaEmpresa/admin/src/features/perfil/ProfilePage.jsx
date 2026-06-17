import React, { useState, useEffect } from 'react';
import { Lock, Save, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../api/client';
import Swal from 'sweetalert2';

const PasswordInput = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="gh-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="gh-input"
          style={{ paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gh-text-muted)', padding: 4 }}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    nombre: 'Admin Ghara',
    email: 'admin@ghara.com.co',
    cargo: 'System Admin',
    telefono: '',
  });
  const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    apiClient.get('/admin/perfil').then(res => {
      if (res?.data?.data) setProfile(prev => ({ ...prev, ...res.data.data }));
    }).catch(() => {});
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put('/admin/perfil', profile);
      Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1800, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.', confirmButtonColor: 'var(--gh-accent)' });
    } finally { setSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.nueva !== passwords.confirmar) {
      return Swal.fire({ icon: 'warning', title: 'Las contraseñas no coinciden', confirmButtonColor: 'var(--gh-accent)' });
    }
    if (passwords.nueva.length < 8) {
      return Swal.fire({ icon: 'warning', title: 'Mínimo 8 caracteres', confirmButtonColor: 'var(--gh-accent)' });
    }
    setSavingPwd(true);
    try {
      await apiClient.put('/admin/perfil/contrasena', { actual: passwords.actual, nueva: passwords.nueva });
      Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 1800, showConfirmButton: false });
      setPasswords({ actual: '', nueva: '', confirmar: '' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Contraseña actual incorrecta.', confirmButtonColor: 'var(--gh-accent)' });
    } finally { setSavingPwd(false); }
  };

  const initials = profile.nombre?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'A';

  const pwdStrength = (() => {
    let s = 0;
    if (passwords.nueva.length >= 8) s++;
    if (/[A-Z]/.test(passwords.nueva)) s++;
    if (/[0-9]/.test(passwords.nueva)) s++;
    if (/[^A-Za-z0-9]/.test(passwords.nueva)) s++;
    return s;
  })();
  const strengthColors = ['var(--gh-danger)', 'var(--gh-warning)', 'var(--gh-accent)', 'var(--gh-success)'];
  const strengthLabels = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte'];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>

      {/* ── Card 1: Cuenta ── */}
      <div className="gh-card" style={{ marginBottom: 20 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 20, borderBottom: '1px solid var(--gh-border)', marginBottom: 20 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '8px', flexShrink: 0,
            background: 'var(--gh-surface-2)', border: '1px solid var(--gh-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gh-brand-1)', fontWeight: 600, fontSize: '0.85rem',
          }}>
            {initials}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>
              {profile.nombre}
            </h1>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--gh-text-muted)' }}>
              {profile.cargo} · {profile.email}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleProfileSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
            <div>
              <label className="gh-label">Nombre</label>
              <input className="gh-input" value={profile.nombre} onChange={e => setProfile(p => ({ ...p, nombre: e.target.value }))} />
            </div>
            <div>
              <label className="gh-label">Correo Electrónico</label>
              <input className="gh-input" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="gh-label">Cargo</label>
              <input className="gh-input" value={profile.cargo} onChange={e => setProfile(p => ({ ...p, cargo: e.target.value }))} />
            </div>
            <div>
              <label className="gh-label">Teléfono</label>
              <input className="gh-input" value={profile.telefono} onChange={e => setProfile(p => ({ ...p, telefono: e.target.value }))} placeholder="Opcional" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              className="gh-btn-primary"
            >
              <Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Card 2: Seguridad ── */}
      <div className="gh-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 20, borderBottom: '1px solid var(--gh-border)', marginBottom: 20 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '8px', flexShrink: 0,
            background: 'var(--gh-surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gh-accent)',
          }}>
            <Lock size={16} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>
              Cambiar Contraseña
            </h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gh-text-muted)' }}>
              Mínimo 8 caracteres con letras y números
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
            <PasswordInput label="Contraseña actual" value={passwords.actual} onChange={e => setPasswords(p => ({ ...p, actual: e.target.value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput label="Nueva contraseña" value={passwords.nueva} onChange={e => setPasswords(p => ({ ...p, nueva: e.target.value }))} />
              <PasswordInput label="Confirmar" value={passwords.confirmar} onChange={e => setPasswords(p => ({ ...p, confirmar: e.target.value }))} />
            </div>

            {passwords.nueva && (
              <div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: i <= pwdStrength ? strengthColors[pwdStrength - 1] : 'var(--gh-border)',
                      transition: 'background 0.25s',
                    }} />
                  ))}
                </div>
                <p style={{ margin: '5px 0 0', fontSize: '0.7rem', color: 'var(--gh-text-muted)' }}>
                  {strengthLabels[pwdStrength - 1] || 'Muy débil'}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={savingPwd || !passwords.actual || !passwords.nueva}
              className="gh-btn-primary"
              style={(!passwords.actual || !passwords.nueva) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <Lock size={13} /> {savingPwd ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .gh-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--gh-text-muted);
          margin-bottom: 5px;
        }
        .gh-input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--gh-border);
          border-radius: 8px;
          background: var(--gh-surface-2);
          color: var(--gh-text-primary);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .gh-input:focus { border-color: var(--gh-accent); }
        .gh-input::placeholder { color: var(--gh-text-muted); opacity: 0.6; }
        .gh-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: var(--gh-accent);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .gh-btn-primary:hover { opacity: 0.9; }
        .gh-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
