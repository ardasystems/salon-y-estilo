import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, KeyRound, ShieldAlert } from 'lucide-react';

export const AdminAuthModal = ({ isOpen, onClose }) => {
  const { settings, setIsAdminView, showToast } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = (settings.adminPassword && settings.adminPassword !== 'admin123') 
      ? settings.adminPassword 
      : 'salon&estilo2620';
    if (password === correctPassword) {
      setError(false);
      setPassword('');
      onClose();
      setIsAdminView(true);
      window.scrollTo(0, 0);
      showToast("Acceso concedido al Panel de Administración");
    } else {
      setError(true);
      showToast("Contraseña incorrecta", "error");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)'
    }}>
      <div 
        className="animate-modal"
        style={{
          background: '#141414',
          borderRadius: 'var(--radius-md)',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(229, 192, 123, 0.2)',
          border: '1px solid rgba(229, 192, 123, 0.35)',
          padding: '2rem',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            background: '#242424'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(229, 192, 123, 0.15)',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Lock size={24} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.35rem' }}>
            Acceso Administrativo
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#A3A3A3' }}>
            Ingresa la contraseña de seguridad para gestionar catálogo, pedidos y configuración.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
              <input
                type="password"
                required
                placeholder="Contraseña de administrador"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            {error && (
              <span style={{ fontSize: '0.75rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem' }}>
                <ShieldAlert size={14} /> Contraseña no válida. Intenta de nuevo.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-luxury-gold"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.85rem' }}
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
};
