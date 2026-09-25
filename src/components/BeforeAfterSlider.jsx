import React, { useState, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Scissors, ShieldCheck, Heart } from 'lucide-react';

const COMPARISON_CASES = [
  {
    id: 'balayage',
    title: 'Balayage Miel & Morena Iluminada',
    serviceCategory: 'Colorimetría de Alta Gama',
    duration: '3.5 a 4.5 horas',
    beforeLabel: 'Antes: Tono plano y frizz',
    beforeDesc: 'Base castaña apagada, desgaste solar disparejo y porosidad media en puntas.',
    afterLabel: 'Después: Luz y movimiento',
    afterDesc: 'Degradé tridimensional en tono caramelo miel, brillo gloss y nutrición con Plex.',
    beforeImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
    stat: '100% Sin maltratar la fibra'
  },
  {
    id: 'alisado',
    title: 'Alisado Orgánico Cero Formol',
    serviceCategory: 'Tratamiento Disciplinante',
    duration: '2.5 a 3.5 horas',
    beforeLabel: 'Antes: Frizz y ondas rebeldes',
    beforeDesc: 'Volumen incontrolable por la humedad, ondas quebradizas y sin caída.',
    afterLabel: 'Después: Lacio espejo impecable',
    afterDesc: 'Efecto seda ultra lacio, hebras selladas y resistencia total a la humedad.',
    beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    stat: 'Durabilidad de 4 a 6 meses'
  },
  {
    id: 'botox',
    title: 'Bótox Capilar & Reestructuración',
    serviceCategory: 'Terapia Intensiva',
    duration: '1.5 a 2 horas',
    beforeLabel: 'Antes: Puntas abiertas y opacidad',
    beforeDesc: 'Cabello desvitalizado por calor excesivo, textura áspera y pérdida de queratina.',
    afterLabel: 'Después: Blindaje gloss y suavidad',
    afterDesc: 'Cutículas completamente compactadas, reflejos de luz de alto impacto y tacto aterciopelado.',
    beforeImage: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80',
    stat: 'Recuperación capilar visible'
  }
];

export const BeforeAfterSlider = () => {
  const { settings, setActiveMainTab, comparisonCases } = useStore();
  const cases = comparisonCases && comparisonCases.length > 0 ? comparisonCases : COMPARISON_CASES;
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const activeCase = cases[activeCaseIndex] || cases[0];

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 3) percentage = 3;
    if (percentage > 97) percentage = 97;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section style={{
      padding: '5rem 0',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #120E0C 50%, #0A0A0A 100%)',
      borderTop: '1px solid rgba(229, 192, 123, 0.15)',
      borderBottom: '1px solid rgba(229, 192, 123, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle ambient light orb */}
      <div 
        className="ambient-glow"
        style={{
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(229, 192, 123, 0.12) 0%, transparent 70%)',
          top: '20%',
          right: '-5%'
        }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.2rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(229, 192, 123, 0.08)',
            border: '1px solid var(--accent-gold-border)',
            color: 'var(--accent-gold-light)',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
            <span>Resultados Comprobados • Clientes Reales</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-serif)',
            marginBottom: '0.75rem',
            lineHeight: 1.15
          }}>
            Comparador Interactivo <br />
            <span style={{
              background: 'linear-gradient(135deg, #FFFFFF 20%, #F7E7C4 60%, #E5C07B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
              fontWeight: 400
            }}>
              "Antes & Después"
            </span>
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#D4D4D4', lineHeight: 1.6 }}>
            Desliza el divisor central para comprobar la precisión de color, control de frizz y salud capilar de nuestras transformaciones reales en el salón.
          </p>
        </div>

        {/* Transformation Case Selector Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}>
          {cases.map((item, idx) => {
            const isActive = idx === activeCaseIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveCaseIndex(idx);
                  setSliderPosition(50);
                }}
                style={{
                  padding: '0.65rem 1.3rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  transition: 'all 0.25s ease',
                  background: isActive
                    ? 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)'
                    : '#181412',
                  color: isActive ? '#0A0A0A' : '#D4D4D4',
                  border: isActive
                    ? '1px solid rgba(229, 192, 123, 0.9)'
                    : '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: isActive ? '0 0 16px rgba(229, 192, 123, 0.4)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  touchAction: 'manipulation'
                }}
              >
                {isActive && <Sparkles size={14} />}
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Comparison Component Box */}
        <div style={{
          maxWidth: '920px',
          margin: '0 auto',
          background: '#15110F',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(229, 192, 123, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(229, 192, 123, 0.15)',
          overflow: 'hidden'
        }}>
          {/* Main Visual Comparison Frame */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={(e) => handleMove(e.clientX)}
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(340px, 50vw, 540px)',
              overflow: 'hidden',
              cursor: 'ew-resize',
              userSelect: 'none',
              touchAction: 'none'
            }}
          >
            {/* 1. After Image (Full background) */}
            <img
              src={activeCase.afterImage}
              alt={`${activeCase.title} - Después`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />

            {/* 2. Before Image (Clipped with polygon according to sliderPosition) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                pointerEvents: 'none'
              }}
            >
              <img
                src={activeCase.beforeImage}
                alt={`${activeCase.title} - Antes`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Floating Tags */}
            {/* ANTES Tag */}
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.25rem',
              background: 'rgba(10, 8, 7, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
              <span>ANTES</span>
            </div>

            {/* DESPUÉS Tag */}
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(10, 8, 7, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1px solid var(--accent-gold-border)',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              <span>DESPUÉS</span>
            </div>

            {/* Vertical Divider Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sliderPosition}%`,
                width: '3px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #E5C07B 50%, #C49B49 100%)',
                boxShadow: '0 0 15px rgba(229, 192, 123, 0.8)',
                transform: 'translateX(-50%)',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              {/* Central Draggable Handle */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)',
                  boxShadow: '0 0 25px rgba(229, 192, 123, 0.7), 0 8px 20px rgba(0,0,0,0.8)',
                  border: '3px solid #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0A0A0A',
                  fontWeight: 900,
                  fontSize: '0.95rem'
                }}
              >
                <span>❮ ❯</span>
              </div>
            </div>

            {/* Bottom Floating Hint */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(10, 8, 7, 0.82)',
              backdropFilter: 'blur(10px)',
              color: 'var(--accent-gold-light)',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              pointerEvents: 'none',
              border: '1px solid rgba(229, 192, 123, 0.3)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <span>Desliza para comparar el resultado</span>
            </div>
          </div>

          {/* Details & CTA Footer */}
          <div style={{
            padding: '1.75rem 2rem',
            background: '#181311',
            borderTop: '1px solid rgba(229, 192, 123, 0.2)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {activeCase.serviceCategory} • {activeCase.duration}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 600
                }}>
                  {activeCase.stat}
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.35rem' }}>
                {activeCase.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#B3B3B3', lineHeight: 1.5 }}>
                {activeCase.afterDesc}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/${settings.whatsappContact}?text=Hola%20Miluska,%20estuve%20viendo%20el%20antes%20y%20despu%C3%A9s%20de%20*${encodeURIComponent(activeCase.title)}*%20y%20deseo%20saber%20disponibilidad%20para%20una%20evaluaci%C3%B3n.`}
                target="_blank"
                rel="noreferrer"
                className="btn-luxury-gold"
                style={{ textDecoration: 'none', padding: '0.75rem 1.6rem', fontSize: '0.82rem' }}
              >
                <Sparkles size={15} />
                <span>Quiero este resultado</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveMainTab('servicios')}
                className="btn-luxury-outline"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.82rem' }}
              >
                <span>Ver Servicios</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
