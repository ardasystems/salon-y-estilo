import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Phone, Lock, LogIn, UserPlus, LogOut, CheckCircle, ShieldCheck, KeyRound, MessageCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const UserAuthModal = () => {
  const {
    isUserAuthOpen,
    setIsUserAuthOpen,
    currentUser,
    registerUser,
    loginUser,
    logoutUser,
    resetUserPassword,
    settings,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'login' | 'recover'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);

  // Clear password and lock field to avoid browser prefilled autofill
  React.useEffect(() => {
    if (isUserAuthOpen) {
      setFormData(prev => ({ ...prev, password: '' }));
      setErrorMsg('');
      setPasswordReadOnly(true);
    }
  }, [isUserAuthOpen, activeTab]);

  if (!isUserAuthOpen) return null;

  const handlePhoneChange = (val) => {
    // Solo números, sin límite artificial de caracteres
    const numericOnly = val.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: numericOnly }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (activeTab === 'register') {
        if (!formData.name.trim()) throw new Error('Por favor ingresa tus nombres y apellidos');
        if (!formData.email.trim() || !formData.email.includes('@')) throw new Error('Por favor ingresa un correo electrónico válido');
        if (!formData.phone.trim()) throw new Error('Por favor ingresa tu número celular (solo números)');
        if (!formData.password || formData.password.length < 4) throw new Error('Por favor ingresa una contraseña de al menos 4 caracteres');

        await registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
        setIsUserAuthOpen(false);
      } else if (activeTab === 'login') {
        if (!formData.email.trim()) throw new Error('Por favor ingresa tu correo electrónico');
        if (!formData.password) throw new Error('Por favor ingresa tu contraseña');
        await loginUser({
          email: formData.email,
          password: formData.password
        });
        setIsUserAuthOpen(false);
      } else if (activeTab === 'recover') {
        if (!formData.email.trim()) throw new Error('Por favor ingresa tu correo electrónico registrado');
        if (!formData.phone.trim()) throw new Error('Por favor ingresa el número celular registrado');
        if (!formData.password || formData.password.length < 4) throw new Error('Ingresa una nueva contraseña de al menos 4 caracteres');

        await resetUserPassword({
          email: formData.email,
          phone: formData.phone,
          newPassword: formData.password
        });
        setActiveTab('login');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        background: '#120E0C',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212, 175, 55, 0.15)',
        width: '100%',
        maxWidth: '460px',
        position: 'relative',
        padding: '2rem 1.8rem',
        color: '#FFFFFF'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsUserAuthOpen(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D4D4D4',
            cursor: 'pointer'
          }}
          title="Cerrar"
        >
          <X size={16} />
        </button>

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.05) 100%)',
                border: '2px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold-light)',
                margin: '0 auto 0.75rem auto'
              }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: '#FFFFFF', marginBottom: '0.25rem' }}>
                ¡Hola, {currentUser.name}!
              </h3>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.74rem',
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--accent-gold-light)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700
              }}>
                💎 Miembro Club VIP • Descuentos en Productos Seleccionados
              </span>
            </div>

            <div style={{
              background: '#191412',
              borderRadius: 'var(--radius-md)',
              padding: '1.1rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.5rem',
              fontSize: '0.84rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Correo:</span>
                <strong>{currentUser.email}</strong>
              </div>
              {currentUser.phone && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Celular:</span>
                  <strong>{currentUser.phone}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Beneficio activo:</span>
                <span style={{ color: 'var(--accent-gold-light)', fontWeight: 700 }}>
                  Precios y promociones VIP en productos seleccionados
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                logoutUser();
                setIsUserAuthOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#FCA5A5',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          /* GUEST: LOGIN / REGISTER VIEW */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Club VIP • Salón & Estilo
              </span>
              <h3 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-serif)', color: '#FFFFFF', marginTop: '0.2rem', marginBottom: '0.4rem' }}>
                {activeTab === 'register' && 'Únete al Club VIP'}
                {activeTab === 'login' && 'Iniciar Sesión'}
                {activeTab === 'recover' && 'Recuperar Contraseña'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#B3B3B3', lineHeight: 1.45, maxWidth: '340px', margin: '0 auto' }}>
                {activeTab === 'register' && 'Regístrate gratis para acceder a promociones exclusivas y descuentos en productos seleccionados.'}
                {activeTab === 'login' && 'Ingresa a tu cuenta para activar tus precios y beneficios VIP en productos seleccionados.'}
                {activeTab === 'recover' && 'Ingresa tu correo y número celular registrado para crear tu nueva contraseña al instante.'}
              </p>
            </div>

            {/* Tabs (Hidden in recover mode) */}
            {activeTab !== 'recover' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
                background: '#191412',
                padding: '0.25rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                  style={{
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'register' ? 'var(--accent-gold)' : 'transparent',
                    color: activeTab === 'register' ? '#0D0A09' : '#B3B3B3',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <UserPlus size={14} />
                  <span>Registrarme</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                  style={{
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'login' ? 'var(--accent-gold)' : 'transparent',
                    color: activeTab === 'login' ? '#0D0A09' : '#B3B3B3',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <LogIn size={14} />
                  <span>Ya tengo cuenta</span>
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-gold-light)',
                    fontSize: '0.78rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    padding: '0.2rem 0'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Volver a Iniciar Sesión</span>
                </button>
              </div>
            )}

            {errorMsg && (
              <div style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                color: '#FCA5A5',
                marginBottom: '1rem'
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activeTab === 'register' && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Nombres y Apellidos *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Mariana Valdivia"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem 0.65rem 2.3rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        background: '#191412',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF'
                      }}
                    />
                    <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Correo Electrónico *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="tucorreo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.3rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      background: '#191412',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF'
                    }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {(activeTab === 'register' || activeTab === 'recover') && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    {activeTab === 'recover' ? 'Número Celular Registrado * (Para validación)' : 'Celular / WhatsApp * (Solo números)'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      placeholder="9XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem 0.65rem 2.3rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        background: '#191412',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF'
                      }}
                    />
                    <Phone size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  {activeTab === 'recover' ? 'Nueva Contraseña * (Mínimo 4 caracteres)' : (activeTab === 'register' ? 'Contraseña * (Mínimo 4 caracteres)' : 'Contraseña')}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    id="user-auth-password"
                    name="vip_account_auth_field"
                    readOnly={passwordReadOnly}
                    onFocus={() => setPasswordReadOnly(false)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.3rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      background: '#191412',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF'
                    }}
                  />
                  <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
                {activeTab === 'login' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('recover'); setErrorMsg(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-gold-light)',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline'
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}
              </div>

              {activeTab === 'register' && (
                <div style={{
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(212, 175, 55, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed rgba(212, 175, 55, 0.35)',
                  fontSize: '0.72rem',
                  color: 'var(--accent-gold-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  lineHeight: 1.4
                }}>
                  <Sparkles size={16} style={{ flexShrink: 0, color: 'var(--accent-gold)' }} />
                  <span>
                    El registro es 100% gratuito y opcional. Accede inmediatamente a promociones y descuentos exclusivos en productos seleccionados.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-luxury-gold"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  marginTop: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Procesando...' : (
                  activeTab === 'register'
                    ? 'Crear Cuenta Club VIP'
                    : (activeTab === 'recover' ? 'Guardar Nueva Contraseña' : 'Ingresar a mi Cuenta')
                )}
              </button>

              {activeTab === 'recover' && (
                <div style={{ textAlign: 'center', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                  <a
                    href={`https://wa.me/${settings.whatsappContact || '51920731163'}?text=Hola%20Miluska%2C%20necesito%20ayuda%20para%20restablecer%20mi%20contrase%C3%B1a%20del%20Club%20VIP%20en%20Sal%C3%B3n%20%26%20Estilo.`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.76rem',
                      color: '#34D399',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageCircle size={14} />
                    <span>¿Prefieres ayuda directa? Escríbenos por WhatsApp</span>
                  </a>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
