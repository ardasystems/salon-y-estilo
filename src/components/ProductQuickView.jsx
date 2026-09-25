import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingCart, Truck, Sparkles } from 'lucide-react';

export const ProductQuickView = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedShade, setSelectedShade] = useState(
    quickViewProduct?.shades ? quickViewProduct.shades[0] : null
  );

  if (!quickViewProduct) return null;

  const handleAdd = () => {
    addToCart(quickViewProduct, quantity, selectedShade);
    setQuickViewProduct(null);
  };

  const images = quickViewProduct.images && quickViewProduct.images.length > 0 
    ? quickViewProduct.images 
    : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="quickview-backdrop" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div 
        className="animate-modal quickview-modal"
        style={{
          background: '#141414',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(229, 192, 123, 0.15)',
          border: '1px solid var(--accent-gold-border)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 20,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#242424',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
          }}
        >
          <X size={18} />
        </button>

        {/* Gallery */}
        <div className="quickview-gallery" style={{
          padding: '2rem',
          background: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1/1',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            background: '#1C1C1C',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <img
              src={images[selectedImageIndex]}
              alt={quickViewProduct.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: selectedImageIndex === idx ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.15)',
                    opacity: selectedImageIndex === idx ? 1 : 0.5,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={img} alt="Miniatura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="quickview-info" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--accent-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em'
            }}>
              {quickViewProduct.category}
            </span>
            {quickViewProduct.isBestseller && (
              <span style={{
                background: 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)',
                color: '#0A0A0A',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase'
              }}>
                Bestseller
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '1.9rem', color: '#FFFFFF', marginBottom: '0.4rem', lineHeight: 1.2, fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            {quickViewProduct.name}
          </h2>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.1rem', color: 'var(--accent-gold)' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="var(--accent-gold)" />
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{quickViewProduct.rating}</span>
            <span style={{ fontSize: '0.82rem', color: '#A3A3A3' }}>({quickViewProduct.reviewsCount} reseñas)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
              S/ {quickViewProduct.price.toFixed(2)}
            </span>
            {quickViewProduct.originalPrice && (
              <span style={{ fontSize: '1.05rem', color: '#888', textDecoration: 'line-through' }}>
                S/ {quickViewProduct.originalPrice.toFixed(2)}
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
              {quickViewProduct.volume}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.92rem', color: '#D4D4D4', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {quickViewProduct.description}
          </p>

          {/* Shades Picker */}
          {quickViewProduct.shades && quickViewProduct.shades.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem', color: '#FFFFFF' }}>
                Tono: <span style={{ color: 'var(--accent-gold)' }}>{selectedShade?.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {quickViewProduct.shades.map((shade, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedShade(shade)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: shade.hex,
                      border: selectedShade?.name === shade.name ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.3)',
                      boxShadow: selectedShade?.name === shade.name ? '0 0 12px rgba(229, 192, 123, 0.7)' : 'none',
                      transform: selectedShade?.name === shade.name ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Key Benefits */}
          {quickViewProduct.benefits && (
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold-light)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Beneficios clave:
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {quickViewProduct.benefits.map((benefit, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#E5E5E5' }}>
                    <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & CTA */}
          <div style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.65rem',
              background: '#0A0A0A'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '28px', height: '28px', fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}
              >
                -
              </button>
              <span style={{ padding: '0 0.85rem', fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: '28px', height: '28px', fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="btn-luxury-gold"
              style={{ flex: 1, padding: '0.9rem 1.5rem', fontSize: '0.85rem', gap: '0.5rem' }}
            >
              <ShoppingCart size={16} strokeWidth={2.4} />
              <span>Añadir al Carrito • S/ {(quickViewProduct.price * quantity).toFixed(2)}</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            marginTop: '1.1rem',
            fontSize: '0.8rem',
            color: '#B3B3B3'
          }}>
            <Truck size={15} style={{ color: 'var(--accent-gold)' }} />
            <span>Envíos asegurados a todo el Perú (Olva/Shalom) | Express &lt; 2h en Chiclayo.</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .quickview-backdrop {
            padding: 0.75rem 0.5rem !important;
          }
          .quickview-modal {
            max-height: 94vh !important;
            grid-template-columns: 1fr !important;
            border-radius: var(--radius-md) !important;
          }
          .quickview-gallery {
            padding: 1.25rem 1rem !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
          }
          .quickview-info {
            padding: 1.25rem 1rem 2rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
