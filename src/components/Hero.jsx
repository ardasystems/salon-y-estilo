import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Zap, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
  const { setSelectedCategory } = useStore();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '5rem 0 4.5rem 0',
      background: 'radial-gradient(ellipse at 75% 25%, rgba(94, 32, 52, 0.35) 0%, rgba(13, 10, 9, 0.95) 60%), var(--bg-canvas)'
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '10%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '5%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 88, 98, 0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '4rem'
        }}>
          {/* Left: Haute Editorial Typography */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ zIndex: 2 }}
          >
            
            {/* Chiclayo Exclusive Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.45rem 1.2rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid var(--accent-gold-border)',
              color: 'var(--accent-gold-light)',
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1.8rem',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.12)'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-gold)', boxShadow: '0 0 10px var(--accent-gold)' }} />
              <span>Chiclayo Concierge: Despacho en &lt; 2 Horas</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
              lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Arte en <br />
              <span style={{
                fontStyle: 'italic',
                fontWeight: 300,
                background: 'linear-gradient(135deg, #FFF 20%, #F4E8C1 60%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                Belleza Capilar.
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.65,
              color: 'var(--text-muted)',
              marginBottom: '2.5rem',
              maxWidth: '520px'
            }}>
              Descubre tu mejor versión con nuestros servicios de colorimetría, balayage y tratamientos orgánicos. Fórmulas exclusivas y atención personalizada para realzar tu estilo.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <button 
                onClick={scrollToCatalog}
                className="btn-luxury-gold"
              >
                <span>Explorar Colección</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("Skincare");
                  scrollToCatalog();
                }}
                className="btn-luxury-outline"
              >
                <span>Skincare Seleccionado</span>
              </button>
            </div>

            {/* Dark Luxury Trust Mini Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.6rem',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(212, 175, 55, 0.15)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ color: 'var(--yape-purple)', fontWeight: 800 }}>YAPE</span>
                <span style={{ opacity: 0.5 }}>/</span>
                <span style={{ color: 'var(--plin-cyan)', fontWeight: 800 }}>PLIN</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>0% Comisión</span>
              </div>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
              <div>Retiro Gratis Showroom</div>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
              <div>Olva & Shalom Nacional</div>
            </div>
          </motion.div>

          {/* Right: Dramatic Portrait with Ambient Light */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '430px',
              borderRadius: '240px 240px 24px 24px',
              overflow: 'hidden',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(138, 46, 70, 0.25)',
              border: '2px solid rgba(212, 175, 55, 0.35)',
              background: '#1A1412'
            }}>
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85"
                alt="Salón & Estilo Boutique - Haute Cosmétique"
                style={{
                  width: '100%',
                  height: '540px',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'contrast(1.04) brightness(0.95)'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13, 10, 9, 0.85) 0%, rgba(13, 10, 9, 0.1) 45%, transparent 100%)'
              }} />
            </div>

            {/* Floating Dark Glass Review */}
            <div className="glass-panel-dark" style={{
              position: 'absolute',
              bottom: '2rem',
              left: '-1rem',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem 1.4rem',
              maxWidth: '260px',
              border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--accent-gold)', marginBottom: '0.4rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="var(--accent-gold)" />
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#F7F3EE', fontStyle: 'italic', marginBottom: '0.45rem', lineHeight: 1.45 }}>
                "La presentación en caja sellada con lacre y la rapidez en Chiclayo es de otro nivel."
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                — Mariana C., Santa Victoria
              </span>
            </div>

            {/* Floating Chiclayo Stock Seal */}
            <div style={{
              position: 'absolute',
              top: '2.5rem',
              right: '-0.5rem',
              background: 'rgba(21, 17, 15, 0.92)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.15rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              border: '1px solid var(--accent-gold-border)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                Stock en Chiclayo
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
