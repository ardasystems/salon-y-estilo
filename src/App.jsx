import React from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { SalonSection } from './components/SalonSection';
import { ServicesSection } from './components/ServicesSection';
import { ProductsSection } from './components/ProductsSection';
import { ProductQuickView } from './components/ProductQuickView';
import { BookingModal } from './components/BookingModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LibroReclamacionesModal } from './components/LibroReclamacionesModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { CheckCircle, ShoppingCart } from 'lucide-react';

export const MainApp = () => {
  const {
    activeMainTab,
    isAdminView,
    isAdminAuthOpen,
    setIsAdminAuthOpen,
    settings,
    notification,
    cartItemCount,
    setIsCartOpen
  } = useStore();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
      {/* Toast Notification */}
      {notification && (
        <div className="toast-floating">
          <CheckCircle size={18} style={{ color: 'var(--accent-gold)' }} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main Switcher between Admin and 3 Public Sections */}
      {isAdminView ? (
        <main style={{ flex: 1 }}>
          <AdminDashboard />
        </main>
      ) : (
        <main style={{ flex: 1 }}>
          {activeMainTab === 'salon' && <SalonSection />}
          {activeMainTab === 'servicios' && <ServicesSection />}
          {activeMainTab === 'productos' && <ProductsSection />}
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Overlays & Modals */}
      <CartDrawer />
      <ProductQuickView />
      <BookingModal />
      <CheckoutModal />
      <LibroReclamacionesModal />
      <AdminAuthModal isOpen={isAdminAuthOpen} onClose={() => setIsAdminAuthOpen(false)} />

      {/* Floating Shopping Cart for Mobile (Bottom Left at same height as WhatsApp) */}
      {!isAdminView && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="mobile-floating-cart-btn"
          aria-label="Ver Carrito de Compras"
          title="Ver Carrito de Compras"
        >
          <ShoppingCart size={20} strokeWidth={2.4} />
          <span>Carrito</span>
          {cartItemCount > 0 && (
            <span className="cart-count-badge">
              {cartItemCount}
            </span>
          )}
        </button>
      )}

      {/* Floating WhatsApp Concierge Button (Bottom Right) */}
      <a
        href={`https://wa.me/${settings.whatsappContact || '51920731163'}?text=Hola%20Miluska,%20deseo%20hacer%20una%20consulta%20sobre%20Sal%C3%B3n%26Estilo.`}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp-btn"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 900,
          background: 'linear-gradient(135deg, #1B5E41 0%, #0F3826 100%)',
          border: '1.5px solid rgba(52, 211, 153, 0.45)',
          color: '#E6F4EA',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 18px rgba(16, 185, 129, 0.25)',
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="Chatear por WhatsApp con Miluska Vidaurre"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      <style>{`
        .mobile-floating-cart-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-floating-cart-btn {
            display: inline-flex !important;
            position: fixed !important;
            bottom: 2rem !important;
            left: 1.5rem !important;
            z-index: 900 !important;
            background: linear-gradient(135deg, #F7E7C4 0%, #E5C07B 50%, #C49B49 100%) !important;
            color: #0A0A0A !important;
            height: 54px !important;
            padding: 0 1.25rem !important;
            border-radius: 9999px !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.5rem !important;
            font-size: 0.86rem !important;
            font-weight: 800 !important;
            letter-spacing: 0.03em !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 18px rgba(229, 192, 123, 0.45) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.4) !important;
            cursor: pointer !important;
            transition: transform 0.2s ease !important;
            touch-action: manipulation !important;
          }
          .mobile-floating-cart-btn:active {
            transform: scale(0.95) !important;
          }
          .cart-count-badge {
            background: #0A0A0A !important;
            color: #F7E7C4 !important;
            min-width: 22px !important;
            height: 22px !important;
            padding: 0 6px !important;
            border-radius: 11px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 0.75rem !important;
            font-weight: 900 !important;
          }
          .floating-whatsapp-btn {
            bottom: 2rem !important;
            right: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};
