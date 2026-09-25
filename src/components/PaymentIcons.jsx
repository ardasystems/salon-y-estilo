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

export const PlinBadge = ({ size = 'normal' }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
    border: '1px solid rgba(0, 180, 216, 0.5)',
    color: '#FFFFFF',
    padding: size === 'sm' ? '0.22rem 0.6rem' : '0.35rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: size === 'sm' ? '0.74rem' : '0.82rem',
    fontWeight: 900,
    boxShadow: '0 2px 8px rgba(0, 180, 216, 0.3)',
    userSelect: 'none'
  }}>
    <svg width={size === 'sm' ? "14" : "16"} height={size === 'sm' ? "14" : "16"} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="8" cy="12" r="5" fill="#FFFFFF" fillOpacity="0.95" />
      <circle cx="16" cy="12" r="5" fill="#FFFFFF" fillOpacity="0.65" />
    </svg>
    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900, letterSpacing: '0.04em' }}>
      plin
    </span>
  </div>
);

export const CulqiBadge = ({ size = 'normal' }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: '#1F1B18',
    border: '1px solid rgba(229, 192, 123, 0.4)',
    color: 'var(--accent-gold-light)',
    padding: size === 'sm' ? '0.22rem 0.55rem' : '0.35rem 0.8rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
    fontWeight: 800,
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
  }}>
    <span style={{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#FF5A36',
      display: 'inline-block'
    }}></span>
    <span>CULQI</span>
  </div>
);

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
