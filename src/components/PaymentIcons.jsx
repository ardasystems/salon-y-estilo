import React from 'react';

/**
 * Official Peruvian & Card Payment Badges
 * Authentic branding harmonized for Salon&Estilo dark luxury aesthetic.
 */

export const YapeBadge = ({ size = 'normal' }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'linear-gradient(135deg, #742284 0%, #4E1359 100%)',
    border: '1px solid rgba(168, 85, 247, 0.55)',
    color: '#FFFFFF',
    padding: size === 'sm' ? '0.22rem 0.6rem' : '0.35rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: size === 'sm' ? '0.74rem' : '0.82rem',
    fontWeight: 900,
    boxShadow: '0 2px 10px rgba(116, 34, 132, 0.4)',
    letterSpacing: '-0.01em',
    userSelect: 'none'
  }}>
    {/* Official Yape Iconography: Purple square with white stylized Y and signature cyan dot */}
    <svg width={size === 'sm' ? "15" : "17"} height={size === 'sm' ? "15" : "17"} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5.5" fill="#872391"/>
      <path d="M6.2 5.8L10.2 13V18.2H13.8V13L17.8 5.8H14.1L12 10.3L9.9 5.8H6.2Z" fill="#FFFFFF"/>
      <circle cx="18.5" cy="18.5" r="2.2" fill="#00D2C6"/>
    </svg>
    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900, textTransform: 'lowercase' }}>
      yape<span style={{ color: '#00D2C6', fontWeight: 900 }}>!</span>
    </span>
  </div>
);


export const MercadoPagoBadge = ({ size = 'normal' }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: 'linear-gradient(135deg, #009EE3 0%, #0077B6 100%)',
    border: '1px solid rgba(0, 158, 227, 0.55)',
    color: '#FFFFFF',
    padding: size === 'sm' ? '0.22rem 0.6rem' : '0.35rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: size === 'sm' ? '0.74rem' : '0.82rem',
    fontWeight: 900,
    boxShadow: '0 2px 10px rgba(0, 158, 227, 0.4)',
    letterSpacing: '-0.01em',
    userSelect: 'none'
  }}>
    {/* Mercado Pago Iconic Handshake / Card SVG */}
    <svg width={size === 'sm' ? "15" : "17"} height={size === 'sm' ? "15" : "17"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V8h18v10zm-10-7h8v2h-8z"/>
    </svg>
    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900, letterSpacing: '0.02em' }}>
      mercado<span style={{ color: '#FFE600' }}>pago</span>
    </span>
  </div>
);

export const PagoEfectivoBadge = ({ size = 'normal' }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: '#1D212A',
    border: '1px solid rgba(255, 204, 0, 0.45)',
    color: '#FFFFFF',
    padding: size === 'sm' ? '0.22rem 0.55rem' : '0.35rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: size === 'sm' ? '0.74rem' : '0.82rem',
    fontWeight: 900,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
    letterSpacing: '-0.01em',
    userSelect: 'none'
  }}>
    <span style={{
      background: '#FFCC00',
      color: '#1A1A1A',
      fontWeight: 900,
      padding: '0.08rem 0.35rem',
      borderRadius: '3px',
      fontSize: size === 'sm' ? '0.62rem' : '0.7rem',
      letterSpacing: '0.04em'
    }}>
      CIP
    </span>
    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 800 }}>
      pago<span style={{ color: '#FFCC00' }}>efectivo</span>
    </span>
  </div>
);

// Compatibility alias for any legacy usage
export const CulqiBadge = PagoEfectivoBadge;

export const CardsBadge = ({ size = 'normal' }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: '#181818',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    padding: size === 'sm' ? '0.22rem 0.55rem' : '0.35rem 0.8rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
    fontWeight: 700
  }}>
    {/* Minimalist Visa Mark */}
    <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontStyle: 'italic', letterSpacing: '0.08em', color: '#60A5FA' }}>VISA</span>
    {/* Minimalist Mastercard Dual Circles */}
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>
      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block', marginLeft: '-3px', opacity: 0.9 }}></span>
    </span>
  </div>
);

