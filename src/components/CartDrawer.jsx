import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ArrowRight, ShoppingCart, Truck, Zap } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 80.00;
  const progressToFree = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)'
    }}>
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} 
      />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        background: '#141414',
        borderLeft: '1px solid rgba(229, 192, 123, 0.35)',
        boxShadow: '-15px 0 50px rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        animation: 'slideDrawer 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingCart size={20} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
              Tu Carrito de Compras
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
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
            <X size={18} />
          </button>
        </div>

        {/* Free shipping bar */}
        <div style={{ padding: '1rem 1.5rem', background: '#0A0A0A', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.55rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={14} style={{ color: 'var(--accent-gold)' }} />
              {remainingForFree === 0 
                ? '¡Envío Express Bonificado en Chiclayo y alrededores!' 
                : `Añade S/ ${remainingForFree.toFixed(2)} más para Envío Gratis local`}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              width: `${progressToFree}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #E89B9E 0%, var(--accent-gold) 100%)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <ShoppingCart size={48} strokeWidth={1.5} style={{ color: 'var(--accent-gold)', marginBottom: '1rem', opacity: 0.8 }} />
              <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.3rem', fontFamily: 'var(--font-serif)' }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontSize: '0.88rem', maxWidth: '240px', marginBottom: '1.5rem', color: '#B3B3B3' }}>
                Explora los cosméticos y fórmulas profesionales de Salón & Estilo.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-luxury-gold"
                style={{ fontSize: '0.8rem', padding: '0.75rem 1.6rem' }}
              >
                Ver Catálogo de Productos
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.id}-${item.selectedShade || 'default'}-${index}`}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#1C1C1C',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  flexShrink: 0
                }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.2rem', lineHeight: 1.3 }}>
                    {item.name}
                  </h4>
                  {item.selectedShade && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.selectedShadeHex }} />
                      <span style={{ fontSize: '0.75rem', color: '#B3B3B3' }}>{item.selectedShade}</span>
                    </div>
                  )}
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.45rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.15rem 0.45rem',
                      background: '#0A0A0A'
                    }}>
                      <button
                        onClick={() => updateCartQuantity(index, -1)}
                        style={{ width: '22px', height: '22px', fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 0.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(index, 1)}
                        style={{ width: '22px', height: '22px', fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      style={{ color: '#888', display: 'flex', alignItems: 'center' }}
                      title="Eliminar del carrito"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '1.5rem',
            background: '#0A0A0A',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#A3A3A3', fontWeight: 600 }}>Subtotal:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                S/ {cartSubtotal.toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--accent-gold-light)', marginBottom: '1.25rem' }}>
              <Truck size={14} />
              <span>Envíos a todo el Perú (Olva Courier / Shalom) y Express local.</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="btn-luxury-gold"
              style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', gap: '0.6rem' }}
            >
              <span>Continuar al Pago</span>
              <ArrowRight size={16} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              marginTop: '1rem',
              fontSize: '0.75rem',
              color: '#B3B3B3'
            }}>
              <span style={{ fontWeight: 800, color: 'var(--yape-purple)' }}>YAPE</span>
              <span>•</span>
              <span style={{ fontWeight: 800, color: 'var(--plin-cyan)' }}>PLIN</span>
              <span>•</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>Culqi Tarjetas</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
