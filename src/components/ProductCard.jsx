import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Eye, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, setQuickViewProduct } = useStore();
  const [selectedShade, setSelectedShade] = useState(product.shades ? product.shades[0] : null);
  const [isHovered, setIsHovered] = useState(false);

  const isLowStock = product.stock > 0 && product.stock <= 15;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#141414',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: isHovered ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isHovered 
          ? '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(229, 192, 123, 0.2)' 
          : '0 8px 25px rgba(0, 0, 0, 0.5)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
      }}
    >
      {/* Badges */}
      <div style={{
        position: 'absolute',
        top: '0.85rem',
        left: '0.85rem',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        {product.isBestseller && (
          <span style={{
            background: 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)',
            color: '#0A0A0A',
            fontSize: '0.66rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase',
            boxShadow: '0 4px 12px rgba(229, 192, 123, 0.3)'
          }}>
            Bestseller
          </span>
        )}
        {product.isNew && (
          <span style={{
            background: 'linear-gradient(135deg, #E89B9E 0%, #C25B64 100%)',
            color: '#FFFFFF',
            fontSize: '0.66rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase'
          }}>
            Nuevo
          </span>
        )}
      </div>

      {/* Image container - Clickable to open full details */}
      <div 
        onClick={() => setQuickViewProduct(product)}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '110%',
          overflow: 'hidden',
          backgroundColor: '#1E1E1E',
          cursor: 'pointer'
        }}
        title="Toca la foto para ampliar y ver detalles del producto"
      >
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : ''}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)'
          }}
        />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(20, 20, 20, 0.95) 0%, transparent 40%)'
        }} />

        {/* Quick View Pill / Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(20, 20, 20, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(229, 192, 123, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold-light)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
            opacity: 0.95,
            transition: 'all 0.2s ease'
          }}
          title="Ampliar y ver detalles completos"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Content with high contrast */}
      <div 
        className="product-card-body" 
        style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', flex: 1, background: '#141414' }}
      >
        {/* Category & Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--accent-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {product.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.76rem', color: '#D4D4D4' }}>
            <Star size={12} fill="var(--accent-gold)" color="var(--accent-gold)" />
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{product.rating}</span>
            <span style={{ color: '#A3A3A3' }}>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 
          className="product-card-title"
          onClick={() => setQuickViewProduct(product)}
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.25,
            color: '#FFFFFF',
            marginBottom: '0.4rem',
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            cursor: 'pointer'
          }}
        >
          {product.name}
        </h3>

        {/* Subtitle / Description */}
        <p 
          className="product-card-desc"
          style={{
            fontSize: '0.84rem',
            color: '#D4D4D4',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.subtitle || product.description}
        </p>

        {/* Color Shades Swatches */}
        {product.shades && product.shades.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {product.shades.map((shade, i) => (
              <button
                key={i}
                onClick={() => setSelectedShade(shade)}
                title={shade.name}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: shade.hex,
                  border: selectedShade?.name === shade.name ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.3)',
                  boxShadow: selectedShade?.name === shade.name ? '0 0 8px rgba(229, 192, 123, 0.6)' : 'none',
                  transform: selectedShade?.name === shade.name ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
            <span style={{ fontSize: '0.68rem', color: '#B3B3B3', marginLeft: '0.2rem', fontWeight: 600 }}>
              {selectedShade ? selectedShade.name : `${product.shades.length} tonos`}
            </span>
          </div>
        )}

        {/* Stock warning */}
        {isLowStock && (
          <div style={{ fontSize: '0.72rem', color: '#FCD34D', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>⚡ Últimas {product.stock} u.</span>
          </div>
        )}

        {/* Bottom row: Price & Carrito button */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          {/* Price */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span className="product-card-price-main" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.01em' }}>
                S/ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '0.75rem', color: '#888', textDecoration: 'line-through' }}>
                  S/ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.64rem', color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Envíos Perú
            </span>
          </div>

          {/* Add to Carrito button */}
          <button
            onClick={() => addToCart(product, 1, selectedShade)}
            disabled={isOutOfStock}
            className="product-card-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              background: isOutOfStock 
                ? '#2E2E2E' 
                : 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 50%, #C49B49 100%)',
              color: isOutOfStock ? '#888' : '#0A0A0A',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease',
              boxShadow: isOutOfStock ? 'none' : '0 4px 15px rgba(229, 192, 123, 0.3)',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={14} strokeWidth={2.4} />
            <span className="product-card-btn-text">{isOutOfStock ? 'Agotado' : 'Carrito'}</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .product-card-body {
            padding: 0.85rem 0.65rem !important;
          }
          .product-card-title {
            font-size: 0.95rem !important;
            line-height: 1.25 !important;
            margin-bottom: 0.25rem !important;
          }
          .product-card-desc {
            display: none !important;
          }
          .product-card-price-main {
            font-size: 1.05rem !important;
          }
          .product-card-btn {
            padding: 0.45rem 0.65rem !important;
            font-size: 0.72rem !important;
          }
          .product-card-btn-text {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
