import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import apiClient from '../../api/client';
import { Eye, EyeOff, Shield } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Email corporativo inválido'),
  password: z.string().min(12, 'Mínimo 12 caracteres'),
  remember: z.boolean().optional(),
});

// Logo SVG inline (blanco)
const GharaLogoWhite = () => (
  <svg viewBox="0 0 425 359" style={{ height: '44px', width: 'auto' }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M122.21 136.65L218.91 54.06 332.21 151.12 315.62 165.24 220.68 82.65 122.21 162.76 122.21 136.65z" fill="var(--gh-brand-4)"/>
    <path d="M160.68 152.88L160.68 179.5 217.85 131.71 271.5 177.59 302.85 177.59 218.91 103.47 160.68 152.88z" fill="var(--gh-brand-4)"/>
    <path d="M124.5,181.47v18.7c0,.32-.03.63-.11.94-.26,1.07-1.06,3.27-3.37,3.15-1.77-.09-3.2-1.49-3.52-3.23-1.05-5.76-5.46-22.19-21.58-23.79,0,0-31.24-5.47-35.47,47.47,0,0-1.94,43.06,31.24,42.53,0,0,9.18-.18,13.76-7.41v-25.76s-.81-4.89-8.71-5.27c-.99-.05-1.94-.5-2.53-1.29-.5-.66-.78-1.55-.13-2.6s1.86-1.61,3.09-1.61h28.99c1.03,0,2.06.37,2.74,1.13.83.92,1.17,2.33-1.58,3.99,0,0-3.35,1.94-3.35,8.12v26.47s-8.36,11.09-30.63,11.96c-.61.02-1.21.05-1.82.1-6.18.53-52.01,2.64-53.49-50.19,0,0-.87-28.84,20.86-45.83,7.63-5.96,16.98-9.24,26.63-10,11.13-.88,27.91.26,38.98,12.42Z" fill="var(--gh-brand-4)"/>
    <path d="M133.32,178.65s4.68.18,4.41,6v76.24s.44,4.68-7.41,8.82c0,0-1.94,2.65,1.24,2.65h29.12s4.5,0,1.94-3.23c-.7-.89-7.06-2.41-7.24-8.24v-37.25c0-2.59,1-5.1,2.84-6.92,1.39-1.38,3.37-2.76,6.1-3.54,3.47-.99,7.21-.72,10.53.7,1.23.53,2.52,1.25,3.63,2.26,1.38,1.24,2.13,3.03,2.13,4.88v41.3s-.77,4.75-5.16,5.97c-.93.26-1.75.86-2.12,1.75-.35.84-.31,1.81,1.28,2.34h29.65s3.5-1.68,0-3.76c0,0-4.76-2.24-6.35-7v-43.33c0-4.38-1.64-8.66-4.75-11.75s-8.56-5.91-17.31-5.28c0,0-10.41.53-21.18,11.29v-35.65s.53-5.65-5.47-5.12c0,0-19.47,3.88-15.88,6.88Z" fill="var(--gh-brand-4)"/>
    <path d="M272.72,263.25c-.72-.31-1.53-.38-2.31-.29-1.69.19-5.09.28-4.73-2.26.18-1.24,0-45.18,0-45.18,0,0-1.24-12.88-18.35-14.29,0,0-28.59-4.59-36,14.82,0,0-2.47,10.41,4.76,11.47,0,0,9.18,1.24,10.24-7.41,1.06-8.65,4.59-12.35,11.65-12,0,0,9-.88,10.06,7.59v12.71l-24.71,9.35s-21.18,7.24-14.12,25.76c0,0,4.41,13.94,24.18,8.82,0,0,7.24-2.82,15.35-9.71,0,0,2.47,12.32,10.94,10.83,0,0,5.97.27,13.57-5.34.72-.53,1.23-1.33,1.31-2.22.08-.91-.24-1.98-1.84-2.67ZM248.03,255.59s-11.12,12.53-18.71,6.71c-7.59-5.82-1.06-17.12-1.06-17.12,0,0,4.59-6.53,19.76-10.94v21.35Z" fill="var(--gh-brand-4)"/>
    <path d="M395.78,263.25c-.72-.31-1.53-.38-2.31-.29-1.69.19-5.09.28-4.73-2.26.18-1.24,0-45.18,0-45.18,0,0-1.24-12.88-18.35-14.29,0,0-23.52-3.77-33.42,10.01-2.12,2.95-3.29,6.54-2.91,10.16.29,2.74,1.48,5.6,5.1,6.13,0,0,9.18,1.24,10.24-7.41,1.06-8.65,4.59-12.35,11.65-12,0,0,9-.88,10.06,7.59v12.71l-24.71,9.35s-21.18,7.24-14.12,25.76c0,0,3.92,12.38,20.92,9.52,2.2-.37,4.32-1.1,6.31-2.12,2.86-1.47,7.42-4.14,12.31-8.28,0,0,2.47,12.32,10.94,10.83,0,0,5.97.27,13.57-5.34.72-.53,1.23-1.33,1.31-2.22.08-.91-.24-1.98-1.84-2.67ZM371.09,255.59s-11.12,12.53-18.71,6.71c-7.59-5.82-1.06-17.12-1.06-17.12,0,0,4.59-6.53,19.76-10.94v21.35Z" fill="var(--gh-brand-4)"/>
  </svg>
);

const LoginPage = () => {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', data);
      const { accessToken, refreshToken, admin } = response.data.data;

      const opts = { secure: location.protocol === 'https:', sameSite: 'strict' };
      if (data.remember) {
        Cookies.set('accessToken', accessToken, { ...opts, expires: 1 });
        Cookies.set('refreshToken', refreshToken, { ...opts, expires: 7 });
      } else {
        Cookies.set('accessToken', accessToken, opts);
        Cookies.set('refreshToken', refreshToken, opts);
      }
      localStorage.setItem('adminUser', JSON.stringify(admin));
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Credenciales incorrectas o servidor no disponible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT panel ── */}
      <div className="hidden lg:flex flex-col justify-end relative overflow-hidden p-12 w-[48%] shrink-0">
        {/* Background image */}
        <img
          src="/media/centro-de-distribucion.webp"
          alt="Ghara instalaciones"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <GharaLogoWhite />
          <div style={{ marginTop: '36px' }}>
            <h1 style={{ color: '#fff', fontSize: '2.25rem', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Gestiona con Precisión
            </h1>
            <h2 style={{ color: 'var(--gh-accent)', fontSize: '2.25rem', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Cada Operación
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9375rem', marginTop: '16px', lineHeight: 1.6, maxWidth: '340px' }}>
              El portal ejecutivo para supervisión HVAC, analytics operacionales y gestión comercial centralizada.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '48px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '28px' }}>
            <div>
              <p style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 500 }}>99.9%</p>
              <p style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                UPTIME SISTEMA
              </p>
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 500 }}>20+</p>
              <p style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                AÑOS DE EXPERIENCIA
              </p>
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 500 }}>5</p>
              <p style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                MARCAS PREMIUM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10" style={{ background: 'var(--gh-surface-1)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <p style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--gh-type)' }}>Ghara HVAC</p>
          </div>

          <h2 style={{ fontSize: '1.625rem', fontWeight: 500,  color: 'var(--gh-type)', letterSpacing: '-0.02em' }}>
            Portal Ejecutivo
          </h2>
          <p style={{ color: 'var(--gh-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Ingresa tus credenciales administrativas para continuar.
          </p>

          {/* Error */}
          {serverError && (
            <div style={{
              marginTop: '20px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(220,38,38,0.1)',
              borderLeft: '4px solid var(--gh-danger)',
              color: 'var(--gh-danger)',
              fontSize: '0.875rem',
            }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--gh-type-2)', marginBottom: '6px' }}>
                Email Corporativo
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@gharasas.com"
                className="gh-input"
                style={errors.email ? { borderColor: 'var(--gh-danger)' } : {}}
              />
              {errors.email && (
                <p style={{ color: 'var(--gh-danger)', fontSize: '0.78rem', marginTop: '4px' }}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--gh-type-2)' }}>
                  Contraseña de Acceso
                </label>
                <button
                  type="button"
                  style={{ fontSize: '0.75rem', color: 'var(--gh-accent)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', }}
                >
                  ¿Olvidaste tus credenciales?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="gh-input"
                  style={{ paddingRight: '44px', ...(errors.password ? { borderColor: 'var(--gh-danger)' } : {}) }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gh-muted)', padding: '2px',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: 'var(--gh-danger)', fontSize: '0.78rem', marginTop: '4px' }}>{errors.password.message}</p>
              )}
              <p style={{ color: 'var(--gh-muted)', fontSize: '0.72rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                 La contraseña debe tener al menos 12 caracteres.
              </p>
            </div>

            {/* Remember me */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--gh-type-2)' }}>
              <input
                {...register('remember')}
                type="checkbox"
                style={{ width: '15px', height: '15px', accentColor: '#1a3f6a' }}
              />
              Mantener sesión activa por 24 horas
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="gh-btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '0.9375rem', borderRadius: '9px', marginTop: '4px' }}
            >
              {loading ? 'Autenticando...' : 'Autorizar Acceso'}
            </button>
          </form>

          {/* Security notice */}
          <div style={{
            marginTop: '28px',
            padding: '14px',
            background: 'var(--gh-surface)',
            borderRadius: '8px',
            border: '1px solid var(--gh-border)',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
          }}>
            <Shield size={15} style={{ color: 'var(--gh-muted)', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--gh-muted)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--gh-type-2)' }}>Aviso de Seguridad:</strong> El acceso no autorizado está estrictamente prohibido y sujeto a acción legal. Todas las actividades son monitoreadas por el SOC de Ghara.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
