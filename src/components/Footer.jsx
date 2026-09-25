import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, MapPin, Phone, Sparkles, Lock, ExternalLink } from 'lucide-react';
import { YapeBadge, PlinBadge, CulqiBadge, CardsBadge } from './PaymentIcons';

export const Footer = () => {
  const { setIsLibroOpen, settings, setIsAdminAuthOpen } = useStore();

  return (
    <footer style={{
      background: '#090706',
      color: 'var(--text-muted)',
      padding: '4.5rem 0 2.5rem 0',
      borderTop: '1px solid rgba(212, 175, 55, 0.2)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand & Social Media */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                color: '#FFFFFF',
                letterSpacing: '0.1em',
                fontWeight: 700
              }}>
                SALÓN & ESTILO
              </span>
            </div>

            <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', color: 'var(--accent-gold)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem', fontWeight: 600 }}>
              Salón de Belleza • Servicios & Productos • Chiclayo & Envíos
            </span>

            <p style={{ fontSize: '0.84rem', color: '#B3B3B3', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Estilismo exclusivo de alta gama, transformaciones balayage, alisados y cosmética importada seleccionada por Miluska Vidaurre.
            </p>

            {/* Social Media Channels (Facebook, TikTok, Instagram, YouTube, WhatsApp) */}
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Facebook */}
              {Boolean(settings.facebookUrl) && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Salón & Estilo"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(24, 119, 242, 0.18)',
                    border: '1px solid rgba(24, 119, 242, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1877F2',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}

              {/* TikTok */}
              {Boolean(settings.tiktokUrl) && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="TikTok @miluskavidaurre"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#141414',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {Boolean(settings.instagramUrl) && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram @miluskavidaurre"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.2) 0%, rgba(245, 96, 64, 0.2) 100%)',
                    border: '1px solid rgba(225, 48, 108, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}

              {/* YouTube */}
              {Boolean(settings.youtubeUrl) && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube @miluskavidaurre"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(204, 0, 0, 0.15)',
                    border: '1px solid rgba(204, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}

              {/* WhatsApp */}
              {Boolean(settings.whatsappContact) && (
                <a
                  href={`https://wa.me/${settings.whatsappContact.replace(/\D/g, '')}?text=Hola%20Miluska,%20deseo%20hacer%20una%20consulta.`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp Citas y Consultas"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(37, 211, 102, 0.15)',
                    border: '1px solid rgba(37, 211, 102, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#25D366',
                    transition: 'all 0.2s'
                  }}
                >
                  <Phone size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Sede & Chiclayo Concierge */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: '#FFFFFF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: 600 }}>
              Sede & Envíos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <MapPin size={17} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span>Salón: Chiclayo & Zona de Atención (Lambayeque).</span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Phone size={17} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span>Atención: Martes a Domingo: 9:00 am - 8:30 pm (Previa Cita)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Sparkles size={17} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span>Motorizado Express en &lt; 2h en Chiclayo y alrededores | Olva & Shalom a nivel nacional.</span>
              </div>
            </div>
          </div>

          {/* Medios de Pago Peruanos */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: '#FFFFFF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: 600 }}>
              Pagos en Soles
            </h4>
            <p style={{ fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.5, color: '#CCCCCC' }}>
              Aceptamos los principales métodos de pago de Perú sin comisiones ocultas:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <YapeBadge size="sm" />
              <PlinBadge size="sm" />
              <CulqiBadge size="sm" />
              <CardsBadge size="sm" />
            </div>
          </div>

          {/* Legal & Libro de Reclamaciones */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: '#FFFFFF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: 600 }}>
              Garantía & Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem' }}>
              <span>Dermatológicamente Testeado & Cruelty-Free</span>
              <span>Políticas de Envío y Devolución</span>

              <button
                onClick={() => setIsLibroOpen(true)}
                style={{
                  marginTop: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.7rem 1.1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(229, 192, 123, 0.1)',
                  border: '1px solid var(--accent-gold-border)',
                  color: 'var(--accent-gold-light)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <BookOpen size={16} style={{ color: 'var(--accent-gold)' }} />
                <span>Libro de Reclamaciones Virtual</span>
              </button>
              <span style={{ fontSize: '0.7rem', color: '#737373' }}>
                Conforme a ley - INDECOPI Perú
              </span>
            </div>
          </div>
        </div>

        {/* Promotional Badge: Arda Systems (Compact, slim height, official logo) */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(10, 15, 29, 0.96) 0%, rgba(18, 26, 45, 0.92) 100%)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.55rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 4px 18px rgba(0, 229, 255, 0.08)',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src="/images/arda-systems-logo.jpg"
              alt="Arda Systems"
              style={{
                height: '28px',
                width: 'auto',
                borderRadius: '4px',
                background: '#FFFFFF',
                padding: '1px',
                objectFit: 'contain',
                boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)'
              }}
            />
            <div>
              <div style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Sitio desarrollado por</span>
                <span style={{ color: '#00E5FF', fontWeight: 800 }}>Arda Systems</span>
                <span style={{ color: '#555', fontSize: '0.7rem' }}>•</span>
                <span style={{ color: '#9BB0C7', fontSize: '0.72rem', fontWeight: 500 }}>Un Mundo de Conexiones</span>
              </div>
            </div>
          </div>

          <a
            href="https://ardasys.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#0A0F1D',
              background: '#00E5FF',
              textDecoration: 'none',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.4)',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
            <span>ardasys.com</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Bottom bar with discreet Admin login trigger */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.76rem',
          color: '#737373'
        }}>
          <div>
            © {new Date().getFullYear()} Salón & Estilo. Todos los derechos reservados. Chiclayo, Perú.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Privacidad</span>
            <span>Términos</span>
            {/* Discreet Admin Login Button at footer */}
            <button
              type="button"
              onClick={() => setIsAdminAuthOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#666666',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.72rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
              title="Panel Administrativo Salón & Estilo"
            >
              <Lock size={12} />
              <span>Acceso Salón</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
