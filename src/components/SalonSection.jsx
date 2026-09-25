import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Clock, Sparkles, Scissors, ArrowRight, Star, CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { motion, AnimatePresence } from 'framer-motion';

const HAUTE_SALON_LOOKS = [
  {
    id: "balayage",
    title: "Balayage Miel & Colorimetría",
    tag: "Técnica Signature 2026",
    subtitle: "Luz cálida y degradé impecable sin maltratar la fibra capilar",
    image: "/images/salon_model_couture.jpg",
    highlight: "Rubio Miel & Morena Iluminada",
    badge: "100% Personalizado"
  },
  {
    id: "alisado",
    title: "Alisado Orgánico & Bótox Espejo",
    tag: "Tratamiento Cero Frizz",
    subtitle: "Brillo espejo y disciplina capilar ante la humedad de la costa norte",
    image: "/images/salon_model_gloss.jpg",
    highlight: "Cero Formol • Brillo Espejo",
    badge: "Efecto Seda 4-6 Meses"
  }
];

export const SalonSection = () => {
  const { setActiveMainTab, settings, setBookingService, services } = useStore();
  const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState("Todos");
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Gentle transition between signature salon looks (pauses once user manually clicks a look)
  useEffect(() => {
    if (hasInteracted) return;
    const timer = setInterval(() => {
      setHeroSlideIndex(prev => (prev + 1) % HAUTE_SALON_LOOKS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [hasInteracted]);



  const transformations = [
    {
      title: "Balayage Miel & Morena Iluminada",
      client: "Camila V., Chiclayo",
      category: "Colorimetría",
      tag: "Colorimetría de Alta Gama",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      desc: "Degradé suave sin marcas, aportando luz cálida sobre base castaña natural sin maltratar la fibra capilar."
    },
    {
      title: "Alisado Orgánico & Bótox Espejo",
      client: "Luciana R., Chiclayo",
      category: "Alisados",
      tag: "Tratamiento Anti-Humedad",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      desc: "Cero frizz frente a la humedad ambiental. Cabello disciplinado, sedoso y con movimiento natural."
    },
    {
      title: "Maquillaje de Novia & Piel Blindada",
      client: "Fiorella M., Chiclayo",
      category: "Maquillaje",
      tag: "Make Up Social Glam",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      desc: "Acabado radiante de larga duración resistente a la humedad y lágrimas de felicidad."
    },
    {
      title: "Rubio Beige Champán & Corrección",
      client: "Daniela G., La Victoria",
      category: "Colorimetría",
      tag: "Colorimetría de Alta Gama",
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
      desc: "Eliminación de reflejos cobrizos previos y matiz perlado con brillo gloss extremo."
    },
    {
      title: "Tratamiento Reestructurante Spa Capilar",
      client: "Mariana S., Chiclayo",
      category: "Alisados",
      tag: "Cuidado Intensivo",
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=800&q=80",
      desc: "Recuperación profunda de cutículas y cuero cabelludo en lavacabezas con ozono y nutrición intensiva."
    },
    {
      title: "Peinado de Gala & Ondas al Agua",
      client: "Andrea P., Santa Victoria",
      category: "Maquillaje",
      tag: "Estilismo de Gala",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
      desc: "Textura natural con fijación flexible que mantiene el volumen perfecto toda la noche."
    }
  ];

  const filteredTransformations = selectedPortfolioCategory === "Todos"
    ? transformations
    : transformations.filter(t => t.category === selectedPortfolioCategory);

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out', position: 'relative' }}>
      
      {/* Editorial Salon Hero with Automatic Gradual Image Crossfade */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4.5rem 0',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(94, 32, 52, 0.4) 0%, rgba(13, 10, 9, 0.98) 65%), #0D0A09',
        borderBottom: '1px solid rgba(229, 192, 123, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Animated background ambient lights */}
        <div 
          className="ambient-glow"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(229, 192, 123, 0.15) 0%, transparent 70%)',
            top: '-10%',
            left: '5%'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3.5rem'
          }}>
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.45rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(229, 192, 123, 0.08)',
                border: '1px solid var(--accent-gold-border)',
                color: 'var(--accent-gold-light)',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1.75rem',
                boxShadow: '0 0 20px rgba(229, 192, 123, 0.15)'
              }}>
                <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
                <span>Salón de Belleza Exclusivo</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.6rem, 5vw, 4.4rem)',
                lineHeight: 1.08,
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-serif)'
              }}>
                Salón & Estilo <br />
                <span style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  background: 'linear-gradient(135deg, #FFFFFF 10%, #F7E7C4 60%, #E5C07B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  Miluska Vidaurre
                </span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: '#E0E0E0',
                marginBottom: '2.2rem',
                maxWidth: '540px'
              }}>
                Un espacio íntimo y exclusivo de alta gama en Chiclayo. Especialistas en colorimetría personalizada, transformaciones balayage, alisados orgánicos libres de formol y maquillaje social.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${settings.whatsappContact}?text=Hola%20Miluska,%20deseo%20consultar%20disponibilidad%20para%20una%20cita%20en%20el%20salón.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxury-gold"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone size={16} />
                  <span>Reservar Cita por WhatsApp</span>
                </a>

                <button
                  onClick={() => setActiveMainTab('servicios')}
                  className="btn-luxury-outline"
                >
                  <span>Ver Carta de Servicios</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Mini details bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.8rem',
                marginTop: '2.5rem',
                paddingTop: '1.8rem',
                borderTop: '1px solid rgba(229, 192, 123, 0.2)',
                fontSize: '0.82rem',
                color: '#CCCCCC',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <MapPin size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>Chiclayo y costa norte</span>
                </div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Clock size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>Previa Cita Personalizada</span>
                </div>
              </div>
            </motion.div>

            {/* Right salon visual showcase: Stable, Hardware-Accelerated Haute Couture Silhouette */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                position: 'relative', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '0.5rem 0'
              }}
            >
              {/* Ambient Luxury Typography Watermark in Background */}
              <div 
                style={{
                  position: 'absolute',
                  top: '8%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(3.2rem, 7.5vw, 6rem)',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: 'rgba(229, 192, 123, 0.05)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 0,
                  userSelect: 'none'
                }}
              >
                HAUTE COIFFURE
              </div>

              {/* Ambient Golden Radial Halo */}
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '380px',
                  height: '380px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(229, 192, 123, 0.22) 0%, rgba(94, 32, 52, 0.16) 45%, transparent 72%)',
                  filter: 'blur(35px)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />

              {/* Interactive Haute Couture Look Selector Chips */}
              <div 
                style={{
                  position: 'relative',
                  zIndex: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(21, 17, 15, 0.92)',
                  backdropFilter: 'blur(16px)',
                  padding: '0.35rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(229, 192, 123, 0.35)',
                  marginBottom: '1.25rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.65)'
                }}
              >
                {HAUTE_SALON_LOOKS.map((look, idx) => {
                  const isActive = idx === heroSlideIndex;
                  return (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => {
                        setHeroSlideIndex(idx);
                        setHasInteracted(true);
                      }}
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, #E5C07B 0%, #C49746 100%)' 
                          : 'transparent',
                        color: isActive ? '#0D0A09' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.42rem 1.05rem',
                        fontSize: '0.76rem',
                        fontWeight: isActive ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Sparkles size={12} style={{ color: isActive ? '#0D0A09' : 'var(--accent-gold)' }} />
                      <span>{look.title.split('&')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Fixed Frame with Permanent Image Crossfade Stack (No unmounting, no blink, no missing image) */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                height: '470px',
                zIndex: 2,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
                {/* Image Stack: Both images remain in DOM, smoothly transitioning via pure opacity */}
                {HAUTE_SALON_LOOKS.map((look, idx) => {
                  const isActive = idx === heroSlideIndex;
                  return (
                    <img
                      key={look.id}
                      src={look.image}
                      alt={look.title}
                      loading="eager"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: '350px',
                        height: '470px',
                        objectFit: 'contain',
                        objectPosition: 'bottom center',
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: isActive ? 2 : 1,
                        pointerEvents: 'none',
                        willChange: 'opacity'
                      }}
                    />
                  );
                })}

                {/* Soft gradient bottom fade directly blending into page background */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '90px',
                  background: 'linear-gradient(to top, #0D0A09 0%, rgba(13, 10, 9, 0) 100%)',
                  pointerEvents: 'none',
                  zIndex: 3
                }} />

                {/* Floating Chiclayo VIP Badge (Top-Right) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '0.25rem',
                    background: 'rgba(21, 17, 15, 0.94)',
                    backdropFilter: 'blur(12px)',
                    padding: '0.6rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--accent-gold-border)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    zIndex: 5,
                    maxWidth: '190px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)', fontSize: '0.74rem', fontWeight: 800 }}>
                    <Star size={13} fill="var(--accent-gold)" />
                    <span>5.0 Excelencia Chiclayo</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#D4AF37' }}>
                    {HAUTE_SALON_LOOKS[heroSlideIndex].highlight}
                  </div>
                </div>

                {/* Floating Formula Badge (Left) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '5.5rem',
                    left: '0.25rem',
                    background: 'rgba(16, 12, 11, 0.94)',
                    backdropFilter: 'blur(12px)',
                    padding: '0.6rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(229, 192, 123, 0.35)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.85)',
                    zIndex: 5,
                    maxWidth: '185px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FFFFFF', fontSize: '0.73rem', fontWeight: 700 }}>
                    <ShieldCheck size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Fórmula Orgánica</span>
                  </div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Libre de formol • Brillo espejo
                  </div>
                </div>

                {/* Floating TikTok Reference Badge (Bottom) */}
                {Boolean(settings.tiktokUrl) && (
                  <a
                    href={settings.tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(21, 17, 15, 0.94)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.55rem 1.25rem',
                      border: '1px solid var(--accent-gold-border)',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.9), 0 0 20px rgba(229, 192, 123, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      zIndex: 6,
                      whiteSpace: 'nowrap',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#000000',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent-gold-light)' }}>@miluskavidaurre</span>
                      <span style={{ color: 'var(--text-muted)' }}>• TikTok Oficial</span>
                    </div>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upgraded Salon Pillars & Experience with Rich Gradient Backgrounds */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(180deg, #100C0A 0%, #16110F 50%, #0F0C0A 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.18em', display: 'block', marginBottom: '0.5rem' }}>
              La Experiencia Salón & Estilo
            </span>
            <h2 style={{ fontSize: '2.6rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
              Estilismo Personalizado de Alta Gama
            </h2>
            <p style={{ fontSize: '0.94rem', color: '#D4D4D4', lineHeight: 1.6 }}>
              Diseñamos cada color y corte analizando tu fisionomía, tono de piel y estilo de vida, con productos de grado profesional que protegen la salud de tu cabello.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '2.2rem'
          }}>
            {/* Card 1: Diagnóstico Capilar Previsto */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid rgba(229, 192, 123, 0.35)',
              borderTop: '3px solid var(--accent-gold)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(229, 192, 123, 0.1)',
              background: '#15110F'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(180deg, rgba(21, 17, 15, 0.82) 0%, rgba(13, 10, 9, 0.96) 65%, #0D0A09 100%), url('https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.95
              }} />

              <div style={{ position: 'relative', zIndex: 2, padding: '2.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(229, 192, 123, 0.25) 0%, rgba(194, 91, 100, 0.2) 100%)',
                    border: '1px solid var(--accent-gold-border)',
                    color: 'var(--accent-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(229, 192, 123, 0.25)'
                  }}>
                    <Scissors size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    padding: '0.3rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(229, 192, 123, 0.12)',
                    border: '1px solid var(--accent-gold-border)',
                    color: 'var(--accent-gold-light)',
                    textTransform: 'uppercase'
                  }}>
                    01 • ANÁLISIS
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.65rem' }}>
                  Diagnóstico Capilar Previsto
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#D4D4D4', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Evaluamos la resistencia y porosidad de tus hebras antes de aplicar cualquier químico de decoloración o alisado.
                </p>

                <div style={{ borderTop: '1px solid rgba(229, 192, 123, 0.18)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: '#CCCCCC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Test de mecha de seguridad sin costo</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Recomendación de tono según fisionomía</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Fórmulas de Cuidado Superior */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid rgba(229, 192, 123, 0.35)',
              borderTop: '3px solid var(--accent-gold)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(229, 192, 123, 0.1)',
              background: '#15110F'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(180deg, rgba(21, 17, 15, 0.82) 0%, rgba(13, 10, 9, 0.96) 65%, #0D0A09 100%), url('https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.95
              }} />

              <div style={{ position: 'relative', zIndex: 2, padding: '2.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(229, 192, 123, 0.25) 0%, rgba(194, 91, 100, 0.2) 100%)',
                    border: '1px solid var(--accent-gold-border)',
                    color: 'var(--accent-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(229, 192, 123, 0.25)'
                  }}>
                    <Sparkles size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    padding: '0.3rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(229, 192, 123, 0.12)',
                    border: '1px solid var(--accent-gold-border)',
                    color: 'var(--accent-gold-light)',
                    textTransform: 'uppercase'
                  }}>
                    02 • PROTECCIÓN PLEX
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.65rem' }}>
                  Fórmulas de Cuidado Superior
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#D4D4D4', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Trabajamos con protectores de puentes cistínicos (Plex) y tratamientos orgánicos sin formol que nutren en profundidad.
                </p>

                <div style={{ borderTop: '1px solid rgba(229, 192, 123, 0.18)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: '#CCCCCC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>0% Formol o químicos irritantes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Nutrición botánica y sellado espejo</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Privacidad & Relax en Pimentel */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid rgba(229, 192, 123, 0.35)',
              borderTop: '3px solid var(--accent-gold)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(229, 192, 123, 0.1)',
              background: '#15110F'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(180deg, rgba(21, 17, 15, 0.82) 0%, rgba(13, 10, 9, 0.96) 65%, #0D0A09 100%), url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.95
              }} />

              <div style={{ position: 'relative', zIndex: 2, padding: '2.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(229, 192, 123, 0.25) 0%, rgba(194, 91, 100, 0.2) 100%)',
                    border: '1px solid var(--accent-gold-border)',
                    color: 'var(--accent-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(229, 192, 123, 0.25)'
                  }}>
                    <MapPin size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    padding: '0.3rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(229, 192, 123, 0.12)',
                    border: '1px solid var(--accent-gold-border)',
                    color: 'var(--accent-gold-light)',
                    textTransform: 'uppercase'
                  }}>
                    03 • EXCLUSIVIDAD VIP
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.65rem' }}>
                  Privacidad & Confort Exclusivo
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#D4D4D4', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Ambiente relajante alejado del bullicio de la ciudad, con atención exclusiva uno a uno, música selecta y café de cortesía.
                </p>

                <div style={{ borderTop: '1px solid rgba(229, 192, 123, 0.18)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: '#CCCCCC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Atención privada con cita agendada</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Café de cortesía y música acústica</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW: Interactive Before & After Comparison Slider */}
      <BeforeAfterSlider />

      {/* Asesoría & Diagnóstico Capilar Profesional con Expertas (Versión compacta) */}
      <section style={{
        padding: '3rem 0',
        background: 'linear-gradient(180deg, #0A0A0A 0%, #15110F 50%, #0D0A09 100%)',
        borderTop: '1px solid rgba(229, 192, 123, 0.15)',
        borderBottom: '1px solid rgba(229, 192, 123, 0.15)'
      }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
            background: 'linear-gradient(135deg, rgba(28, 22, 19, 0.95) 0%, rgba(18, 14, 12, 0.98) 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(229, 192, 123, 0.35)',
            boxShadow: '0 15px 40px rgba(0,0,0,0.8), 0 0 25px rgba(229, 192, 123, 0.1)',
            padding: '2.2rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.5rem'
              }}>
                <ShieldCheck size={15} />
                <span>Salud Capilar & Honestidad Profesional</span>
              </div>
              <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.65rem', lineHeight: 1.2 }}>
                Tu cabello es único: consulta siempre con los expertos
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#D4D4D4', lineHeight: 1.55, marginBottom: '1.2rem' }}>
                Cada fibra tiene una historia y resistencia diferente. Realizamos un diagnóstico presencial y test de mecha personalizado antes de cualquier cambio para garantizar tu seguridad y un acabado impecable.
              </p>

              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.4rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#CCCCCC' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1F1A18', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(229, 192, 123, 0.25)' }}>
                  <CheckCircle size={13} style={{ color: 'var(--accent-gold)' }} />
                  Test de mecha sin costo
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1F1A18', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(229, 192, 123, 0.25)' }}>
                  <CheckCircle size={13} style={{ color: 'var(--accent-gold)' }} />
                  Atención personalizada 1 a 1
                </span>
              </div>

              <a
                href={`https://wa.me/${settings.whatsappContact}?text=Hola%20Miluska,%20deseo%20consultar%20con%20los%20expertos%20de%20Sal%C3%B3n%26Estilo%20para%20un%20diagnóstico%20y%20asesoría%20de%20mi%20cabello.`}
                target="_blank"
                rel="noreferrer"
                className="btn-luxury-gold"
                style={{ textDecoration: 'none', padding: '0.75rem 1.6rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Phone size={14} />
                <span>Consultar con los Expertos en WhatsApp</span>
              </a>
            </div>

            {/* Right aesthetic visual */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid rgba(229, 192, 123, 0.35)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                maxWidth: '360px',
                width: '100%'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=700&q=80"
                  alt="Miluska Vidaurre Salón & Estilo Asesoría Profesional"
                  style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13, 10, 9, 0.9) 0%, transparent 60%)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Miluska Vidaurre • Estilista Principal
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginTop: '0.15rem' }}>
                    «La belleza real comienza cuidando tu salud capilar».
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Transformations Gallery with Interactive Category Tabs */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-canvas)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.4rem' }}>
                Portafolio Exclusivo
              </span>
              <h2 style={{ fontSize: '2.5rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
                Transformaciones Recientes
              </h2>
            </div>
            
            {/* Interactive Category Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {["Todos", "Colorimetría", "Alisados", "Maquillaje"].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedPortfolioCategory(cat)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: selectedPortfolioCategory === cat ? 800 : 600,
                    background: selectedPortfolioCategory === cat ? 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)' : '#1C1C1C',
                    color: selectedPortfolioCategory === cat ? '#0A0A0A' : '#D4D4D4',
                    border: selectedPortfolioCategory === cat ? '1px solid rgba(229, 192, 123, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: selectedPortfolioCategory === cat ? '0 0 12px rgba(229, 192, 123, 0.35)' : 'none',
                    touchAction: 'manipulation'
                  }}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => setActiveMainTab('servicios')}
                className="btn-luxury-outline"
                style={{ fontSize: '0.78rem', padding: '0.45rem 1.1rem', marginLeft: '0.5rem' }}
              >
                <span>Ver Servicios</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.2rem'
          }}>
            {filteredTransformations.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: '#161210',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid rgba(229, 192, 123, 0.25)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                  <img
                    src={t.image}
                    alt={t.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(13, 10, 9, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--accent-gold-light)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--accent-gold-border)'
                  }}>
                    {t.tag}
                  </span>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.4rem' }}>
                    {t.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#CCCCCC', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {t.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(229, 192, 123, 0.15)', paddingTop: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>Cliente: {t.client}</span>
                    <a
                      href={`https://wa.me/${settings.whatsappContact}?text=Hola,%20me%20encantó%20el%20trabajo%20de%20${encodeURIComponent(t.title)}%20y%20deseo%20cotizar.`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                    >
                      <span>Cotizar similar</span>
                      <ArrowRight size={13} style={{ color: 'var(--accent-gold)' }} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Channels Showcase (TikTok, Instagram, YouTube) */}
      <section style={{ padding: '5rem 0', background: '#0F0C0A', borderTop: '1px solid rgba(229, 192, 123, 0.2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.18em', display: 'block', marginBottom: '0.5rem' }}>
              Comunidad & Contenido Digital
            </span>
            <h2 style={{ fontSize: '2.5rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
              Sigue a Miluska Vidaurre en Redes
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#CCCCCC', lineHeight: 1.6 }}>
              Tutoriales, cambios de look antes y después, y el detrás de escena de nuestro salón de belleza.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Facebook Card */}
            {Boolean(settings.facebookUrl) && (
              <div style={{
                background: '#161210',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(24, 119, 242, 0.35)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#1877F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: '#FFFFFF'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1877F2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Facebook • Salón & Estilo
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '0.4rem 0 0.65rem 0', fontFamily: 'var(--font-serif)' }}>
                  Comunidad & Novedades
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#B3B3B3', lineHeight: 1.55, marginBottom: '1.5rem', flex: 1 }}>
                  Entérate de nuestras promociones de temporada, opiniones de clientas y publicaciones de cuidado capilar profesional.
                </p>

                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxury-outline"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '0.65rem', textDecoration: 'none' }}
                >
                  <span>Seguir en Facebook</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            )}

            {/* TikTok Card */}
            {Boolean(settings.tiktokUrl) && (
              <div style={{
                background: '#161210',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: '#FFFFFF'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  TikTok • @miluskavidaurre
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '0.4rem 0 0.65rem 0', fontFamily: 'var(--font-serif)' }}>
                  Videos Virales & Tendencias
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#B3B3B3', lineHeight: 1.55, marginBottom: '1.5rem', flex: 1 }}>
                  Observa los procesos de decoloración en tiempo real, fórmulas de matizado y tips rápidos de cuidado para el cabello frente a la playa.
                </p>

                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxury-outline"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '0.65rem', textDecoration: 'none' }}
                >
                  <span>Seguir en TikTok</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            )}

            {/* Instagram Card */}
            {Boolean(settings.instagramUrl) && (
              <div style={{
                background: '#161210',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(229, 192, 123, 0.35)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E1306C 0%, #F56040 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: '#FFFFFF'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Instagram • @miluskavidaurre
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '0.4rem 0 0.65rem 0', fontFamily: 'var(--font-serif)' }}>
                  Portafolio HD & Historias Diarias
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#B3B3B3', lineHeight: 1.55, marginBottom: '1.5rem', flex: 1 }}>
                  Fotografías en alta resolución de nuestras clientas, testimonios reales, promociones del mes y disponibilidad de turnos en el salón.
                </p>

                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxury-gold"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '0.65rem', textDecoration: 'none' }}
                >
                  <span>Ver Portafolio Instagram</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            )}

            {/* YouTube Card */}
            {Boolean(settings.youtubeUrl) && (
              <div style={{
                background: '#161210',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#CC0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: '#FFFFFF'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  YouTube • @miluskavidaurre
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '0.4rem 0 0.65rem 0', fontFamily: 'var(--font-serif)' }}>
                  Tutoriales & Cuidado Capilar
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#B3B3B3', lineHeight: 1.55, marginBottom: '1.5rem', flex: 1 }}>
                  Tutoriales paso a paso de peinados, diagnóstico de hebras dañadas y guías profesionales para mantener tu alisado o color intacto.
                </p>

                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxury-outline"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '0.65rem', textDecoration: 'none' }}
                >
                  <span>Suscribirse en YouTube</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
