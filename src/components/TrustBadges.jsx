import React from 'react';
import { Zap, Smartphone, PackageCheck, Store } from 'lucide-react';

export const TrustBadges = () => {
  const items = [
    {
      icon: <Zap size={22} style={{ color: 'var(--accent-gold)' }} />,
      title: "Chiclayo Concierge < 2h",
      desc: "Motorizado prioritario en Chiclayo, La Victoria, Santa Victoria y distritos aledaños."
    },
    {
      icon: <Smartphone size={22} style={{ color: 'var(--yape-purple)' }} />,
      title: "Yape & Plin Directo",
      desc: "Transfiere seguro y sin comisiones intermediarias. QR automático al instante."
    },
    {
      icon: <Store size={22} style={{ color: 'var(--accent-rose)' }} />,
      title: "Retiro Privado en Boutique",
      desc: "S/ 0 en movilidad retirando tu pedido en nuestro showroom en Calle San José."
    },
    {
      icon: <PackageCheck size={22} style={{ color: 'var(--plin-cyan)' }} />,
      title: "Envíos a Todo el Perú",
      desc: "Despachos seguros vía Olva Courier a tu puerta o Shalom a tu agencia."
    }
  ];

  return (
    <section style={{
      borderTop: '1px solid rgba(212, 175, 55, 0.15)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
      background: 'rgba(21, 17, 15, 0.65)',
      backdropFilter: 'blur(16px)',
      padding: '2.8rem 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem'
        }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(212, 175, 55, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid var(--accent-gold-border)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
              }}>
                {item.icon}
              </div>
              <div>
                <h4 style={{
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginBottom: '0.3rem',
                  letterSpacing: '0.02em'
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
