import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Scissors, Store, HeartHandshake, ArrowLeft, User, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const {
    activeMainTab,
    setActiveMainTab,
    cartItemCount,
    setIsCartOpen,
    isAdminView,
    setIsAdminView,
    settings,
    currentUser,
    setIsUserAuthOpen
  } = useStore();

  const handleTabClick = (tabKey) => {
    setIsAdminView(false);
    setActiveMainTab(tabKey);
    // Instant jump to top to avoid animation fighting DOM layout changes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <header 
      className="main-navbar-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(10, 10, 10, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      <div className="container navbar-inner-container">
        {/* Main Row: Logo, Tabs (Desktop), and Cart */}
        <div className="header-main-row" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => handleTabClick('salon')} 
            className="navbar-brand-container"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0, minWidth: 0 }}
          >
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName || "Salón & Estilo"}
                className="navbar-brand-logo"
                style={{
                  height: '38px',
                  width: settings?.logoShape === 'circle' ? '38px' : 'auto',
                  maxHeight: '38px',
                  borderRadius: settings?.logoShape === 'circle' ? '50%' : 'var(--radius-sm)',
                  objectFit: settings?.logoShape === 'circle' ? 'cover' : 'contain',
                  border: '1px solid var(--accent-gold)',
                  flexShrink: 0
                }}
              />
            ) : (
              <div 
                className="navbar-brand-logo"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: settings?.logoShape === 'circle' ? '50%' : 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, rgba(229, 192, 123, 0.35) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  border: '1px solid var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)',
                  flexShrink: 0
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>S</span>
              </div>
            )}

            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="navbar-brand-title" style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.08em',
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {settings?.storeName ? settings.storeName.toUpperCase() : "SALÓN & ESTILO"}
                </span>
              </div>
              <div className="navbar-brand-subtitle" style={{ 
                fontSize: '0.65rem', 
                color: '#B3B3B3', 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase', 
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {settings?.brandSubtitle || "Salón de Belleza Miluska Vidaurre"}
              </div>
            </div>
          </div>

          {/* THREE MAIN TABS (Desktop Center Display) */}
          {!isAdminView && (
            <div 
              className="desktop-tabs-container mobile-hide"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#161616',
                padding: '0.25rem 0.35rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}
            >
              {/* Tab 1: El Salón */}
              <button
                type="button"
                onClick={() => handleTabClick('salon')}
                className={`nav-tab-pill ${activeMainTab === 'salon' ? 'active' : 'inactive'}`}
              >
                <HeartHandshake size={14} />
                <span>El Salón</span>
              </button>

              {/* Tab 2: Catálogo de Servicios */}
              <button
                type="button"
                onClick={() => handleTabClick('servicios')}
                className={`nav-tab-pill ${activeMainTab === 'servicios' ? 'active' : 'inactive'}`}
              >
                <Scissors size={14} />
                <span>Servicios</span>
              </button>

              {/* Tab 3: Catálogo de Productos */}
              <button
                type="button"
                onClick={() => handleTabClick('productos')}
                className={`nav-tab-pill ${activeMainTab === 'productos' ? 'active' : 'inactive'}`}
              >
                <Store size={14} />
                <span>Productos</span>
              </button>
            </div>
          )}

          {/* Right Action: Desktop Carrito Button or Exit Admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {isAdminView ? (
              <button
                onClick={() => {
                  setIsAdminView(false);
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className="btn-luxury-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}
              >
                <ArrowLeft size={14} />
                <span>Salir del Admin</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsUserAuthOpen(true)}
                  className="navbar-user-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: currentUser ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    border: currentUser ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: currentUser ? 'var(--accent-gold-light)' : '#ECE8E1',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    letterSpacing: '0.02em',
                    flexShrink: 0
                  }}
                  title={currentUser ? `Miembro Club VIP: ${currentUser.name} (Descuentos en productos seleccionados)` : "Club VIP: Promociones y descuentos en productos seleccionados"}
                >
                  {currentUser ? (
                    <>
                      <Sparkles size={13} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                      <span className="navbar-user-name" style={{ maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentUser.name.split(' ')[0]}
                      </span>
                      <span className="navbar-vip-pill" style={{ fontSize: '0.64rem', background: 'rgba(212, 175, 55, 0.25)', padding: '0.1rem 0.35rem', borderRadius: '8px', color: 'var(--accent-gold-light)', fontWeight: 800, flexShrink: 0 }}>
                        VIP
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                      <span>Club VIP</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                className="desktop-cart-btn"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 50%, #C49B49 100%)',
                  color: '#0A0A0A',
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  boxShadow: '0 4px 15px rgba(229, 192, 123, 0.4)',
                  touchAction: 'manipulation'
                }}
                aria-label="Ver Carrito de Compras"
              >
                <ShoppingCart size={16} strokeWidth={2.4} />
                <span>Carrito</span>
                {cartItemCount > 0 && (
                  <span style={{
                    background: '#0A0A0A',
                    color: 'var(--accent-gold-light)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    marginLeft: '0.15rem'
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </button>
            </>
            )}
          </div>
        </div>

        {/* Mobile Dedicated Segmented Tab Bar (Spans full width, centered) */}
        {!isAdminView && (
          <div 
            style={{
              display: 'none',
              marginTop: '0.65rem',
              width: '100%',
              maxWidth: '460px',
              marginLeft: 'auto',
              marginRight: 'auto',
              background: '#141414',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '0.22rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
            }}
            className="mobile-tabs-bar"
          >
            <button
              type="button"
              onClick={() => handleTabClick('salon')}
              className={`nav-tab-pill ${activeMainTab === 'salon' ? 'active' : 'inactive'}`}
              style={{ flex: 1, minHeight: '38px', justifyContent: 'center' }}
            >
              <HeartHandshake size={14} />
              <span>El Salón</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('servicios')}
              className={`nav-tab-pill ${activeMainTab === 'servicios' ? 'active' : 'inactive'}`}
              style={{ flex: 1, minHeight: '38px', justifyContent: 'center' }}
            >
              <Scissors size={14} />
              <span>Servicios</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('productos')}
              className={`nav-tab-pill ${activeMainTab === 'productos' ? 'active' : 'inactive'}`}
              style={{ flex: 1, minHeight: '38px', justifyContent: 'center' }}
            >
              <Store size={14} />
              <span>Productos</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .navbar-inner-container {
          padding: 0.75rem 1.25rem;
        }
        @media (max-width: 768px) {
          .main-navbar-header {
            padding-top: calc(0.5rem + env(safe-area-inset-top, 0px)) !important;
            padding-bottom: 0.5rem !important;
          }
          .navbar-inner-container {
            padding: 0 0.65rem !important;
          }
          .header-main-row {
            justify-content: space-between !important;
            gap: 0.4rem !important;
          }
          .navbar-brand-container {
            margin: 0 !important;
            justify-content: flex-start !important;
            gap: 0.45rem !important;
            max-width: calc(100% - 110px) !important;
          }
          .navbar-brand-logo {
            width: 32px !important;
            height: 32px !important;
            max-height: 32px !important;
            flex-shrink: 0 !important;
          }
          .navbar-brand-title {
            font-size: 0.95rem !important;
            letter-spacing: 0.05em !important;
          }
          .navbar-brand-subtitle {
            font-size: 0.55rem !important;
            letter-spacing: 0.05em !important;
          }
          .navbar-user-btn {
            padding: 0.32rem 0.55rem !important;
            font-size: 0.72rem !important;
          }
          .desktop-tabs-container {
            display: none !important;
          }
          .desktop-cart-btn {
            display: none !important;
          }
          .mobile-tabs-bar {
            display: flex !important;
            margin-top: 0.65rem !important;
          }
        }
        @media (max-width: 380px) {
          .navbar-brand-container {
            max-width: calc(100% - 95px) !important;
          }
          .navbar-brand-title {
            font-size: 0.88rem !important;
          }
          .navbar-brand-subtitle {
            display: none !important;
          }
          .navbar-vip-pill {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
