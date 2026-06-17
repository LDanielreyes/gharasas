import React, { useState, useEffect } from 'react';
import { User, Lock, Shield, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../../api/client';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const cardStyle = {
  background: 'var(--gh-surface-1)',
  border: '1px solid var(--gh-border)',
  borderRadius: '16px',
  padding: '28px',
  marginBottom: '20px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--gh-border)',
  borderRadius: '10px',
  background: 'var(--gh-surface-2)',
  color: 'var(--gh-text-primary)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'var(--gh-text-muted)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--gh-border)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(45,196,196,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gh-accent)' }}>
        <Icon size={18} />
      </div>
      <div>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gh-text-muted)', marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ type }) => {
  const config = {
    success: { bg: 'rgba(14,158,110,0.1)', color: 'var(--gh-success)', icon: CheckCircle, label: 'Activo' },
    warning: { bg: 'rgba(217,119,6,0.1)', color: 'var(--gh-warning)', icon: AlertCircle, label: 'Pendiente' },
  }[type];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: '20px', background: config.bg, color: config.color, fontSize: '0.75rem', fontWeight: 600 }}>
      <config.icon size={12} /> {config.label}
    </span>
  );
};

const PasswordField = ({ label, value, onChange, name }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          style={{ ...inputStyle, paddingRight: '44px' }}
          onFocus={e => e.target.style.borderColor = 'var(--gh-accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--gh-border)'}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gh-text-muted)' }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
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

  // In a real implementation these come from the API
  useEffect(() => {
    apiClient.get('/admin/perfil').then(res => {
      if (res?.data?.data) setProfile(prev => ({ ...prev, ...res.data.data }));
    }).catch(() => {/* use default */});
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put('/admin/perfil', profile);
      Swal.fire({ icon: 'success', title: 'Guardado', text: 'Tu perfil fue actualizado correctamente.', confirmButtonColor: 'var(--gh-accent)', timer: 2000, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el perfil.', confirmButtonColor: 'var(--gh-accent)' });
    } finally { setSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.nueva !== passwords.confirmar) {
      Swal.fire({ icon: 'warning', title: 'Contraseñas no coinciden', confirmButtonColor: 'var(--gh-accent)' });
      return;
    }
    if (passwords.nueva.length < 8) {
      Swal.fire({ icon: 'warning', title: 'Mínimo 8 caracteres', confirmButtonColor: 'var(--gh-accent)' });
      return;
    }
    setSavingPwd(true);
    try {
      await apiClient.put('/admin/perfil/contrasena', { actual: passwords.actual, nueva: passwords.nueva });
      Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 2000, showConfirmButton: false });
      setPasswords({ actual: '', nueva: '', confirmar: '' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Contraseña actual incorrecta.', confirmButtonColor: 'var(--gh-accent)' });
    } finally { setSavingPwd(false); }
  };

  const initials = profile.nombre?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'AG';

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>

      {/* Avatar hero */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 24, background: 'linear-gradient(135deg, var(--gh-surface-1) 0%, var(--gh-surface-2) 100%)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '20px', background: 'linear-gradient(135deg, var(--gh-brand-1), var(--gh-brand-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.6rem', flexShrink: 0, boxShadow: '0 8px 24px rgba(45,196,196,0.25)' }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--gh-text-primary)' }}>{profile.nombre}</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--gh-text-muted)' }}>{profile.email}</p>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <StatusBadge type="success" />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: '20px', background: 'rgba(45,196,196,0.08)', color: 'var(--gh-accent)', fontSize: '0.75rem', fontWeight: 600 }}>
              <Shield size={11} /> {profile.cargo}
            </span>
          </div>
        </div>
      </div>

      {/* Info form */}
      <div style={cardStyle}>
        <SectionTitle icon={User} title="Información Personal" subtitle="Actualiza tu nombre, cargo y datos de contacto" />
        <form onSubmit={handleProfileSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>Nombre Completo</label>
              <input style={inputStyle} value={profile.nombre} onChange={e => setProfile(p => ({ ...p, nombre: e.target.value }))} onFocus={e => e.target.style.borderColor = 'var(--gh-accent)'} onBlur={e => e.target.style.borderColor = 'var(--gh-border)'} />
            </div>
            <div>
              <label style={labelStyle}>Correo Electrónico</label>
              <input type="email" style={inputStyle} value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} onFocus={e => e.target.style.borderColor = 'var(--gh-accent)'} onBlur={e => e.target.style.borderColor = 'var(--gh-border)'} />
            </div>
            <div>
              <label style={labelStyle}>Cargo / Rol</label>
              <input style={inputStyle} value={profile.cargo} onChange={e => setProfile(p => ({ ...p, cargo: e.target.value }))} onFocus={e => e.target.style.borderColor = 'var(--gh-accent)'} onBlur={e => e.target.style.borderColor = 'var(--gh-border)'} />
            </div>
            <div>
              <label style={labelStyle}>Teléfono (opcional)</label>
              <input style={inputStyle} value={profile.telefono} onChange={e => setProfile(p => ({ ...p, telefono: e.target.value }))} onFocus={e => e.target.style.borderColor = 'var(--gh-accent)'} onBlur={e => e.target.style.borderColor = 'var(--gh-border)'} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: saving ? 'var(--gh-border)' : 'var(--gh-accent)', color: saving ? 'var(--gh-text-muted)' : '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
              <Save size={15} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Password form */}
      <div style={cardStyle}>
        <SectionTitle icon={Lock} title="Cambiar Contraseña" subtitle="Usa al menos 8 caracteres con letras y números" />
        <form onSubmit={handlePasswordSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <PasswordField label="Contraseña Actual" name="actual" value={passwords.actual} onChange={e => setPasswords(p => ({ ...p, actual: e.target.value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordField label="Nueva Contraseña" name="nueva" value={passwords.nueva} onChange={e => setPasswords(p => ({ ...p, nueva: e.target.value }))} />
              <PasswordField label="Confirmar Contraseña" name="confirmar" value={passwords.confirmar} onChange={e => setPasswords(p => ({ ...p, confirmar: e.target.value }))} />
            </div>

            {/* Password strength bar */}
            {passwords.nueva && (
              <div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4].map(i => {
                    const strength = (() => {
                      let s = 0;
                      if (passwords.nueva.length >= 8) s++;
                      if (/[A-Z]/.test(passwords.nueva)) s++;
                      if (/[0-9]/.test(passwords.nueva)) s++;
                      if (/[^A-Za-z0-9]/.test(passwords.nueva)) s++;
                      return s;
                    })();
                    const colors = ['var(--gh-danger)', 'var(--gh-warning)', 'var(--gh-accent)', 'var(--gh-success)'];
                    return <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= strength ? colors[strength - 1] : 'var(--gh-border)', transition: 'background 0.3s' }} />;
                  })}
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: 'var(--gh-text-muted)' }}>
                  Seguridad: {(() => { let s=0; if(passwords.nueva.length>=8)s++; if(/[A-Z]/.test(passwords.nueva))s++; if(/[0-9]/.test(passwords.nueva))s++; if(/[^A-Za-z0-9]/.test(passwords.nueva))s++; return ['Muy débil','Débil','Aceptable','Fuerte'][s-1] || 'Muy débil'; })()}
                </p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={savingPwd || !passwords.actual || !passwords.nueva} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: (savingPwd || !passwords.actual) ? 'var(--gh-border)' : 'var(--gh-accent)', color: (savingPwd || !passwords.actual) ? 'var(--gh-text-muted)' : '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: (savingPwd || !passwords.actual) ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
              <Lock size={14} /> {savingPwd ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>

      {/* Account info */}
      <div style={cardStyle}>
        <SectionTitle icon={Shield} title="Información de Cuenta" subtitle="Datos de seguridad y sesión" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Tipo de Cuenta', value: 'System Admin' },
            { label: 'Estado', value: 'Activo' },
            { label: 'Último acceso', value: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '16px', background: 'var(--gh-surface-2)', borderRadius: '12px', border: '1px solid var(--gh-border)' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, color: 'var(--gh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <p style={{ margin: '6px 0 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--gh-text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
