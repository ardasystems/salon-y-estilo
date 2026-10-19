import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  GraduationCap, Award, BookOpen, Calendar, Clock, Users, 
  CheckCircle2, Sparkles, Building2, Briefcase, ArrowRight, 
  Phone, Search, ShieldCheck, ChevronRight, X, HeartHandshake,
  Star, FileText, BadgeCheck, HelpCircle, ChevronDown
} from 'lucide-react';

export const AprendeConmigoSection = () => {
  const {
    courses,
    filteredCourses,
    courseCategories,
    selectedCourseCategory,
    setSelectedCourseCategory,
    courseSearchQuery,
    setCourseSearchQuery,
    academyPartnerships,
    settings
  } = useStore();

  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const whatsappPhone = (settings.whatsappContact || "51920731163").replace(/\D/g, "");

  const handleOpenCourseWhatsApp = (course) => {
    const text = encodeURIComponent(
      `Hola Miluska, tengo interés en inscribirme en la capacitación "${course.title}" de Aprende Conmigo (Salón & Estilo). ¿Podrías brindarme los detalles para reservar mi vacante?`
    );
    window.open(`https://wa.me/${whatsappPhone}?text=${text}`, '_blank');
  };

  const handleGeneralInquiryWhatsApp = () => {
    const text = encodeURIComponent(
      settings.academyWhatsappMsg || 
      "Hola Miluska, deseo solicitar información sobre las capacitaciones y convenios de Aprende Conmigo en Salón&Estilo."
    );
    window.open(`https://wa.me/${whatsappPhone}?text=${text}`, '_blank');
  };

  const faqs = [
    {
      q: "¿Por qué las capacitaciones son en grupos reducidos de 4 a 6 alumnas?",
      a: "Porque la verdadera destreza en belleza no se aprende en auditorios masivos viendo una pantalla. En Salón & Estilo priorizamos la enseñanza personalizada: la instructora supervisa cada mechón, corrige tu postura de tijera, verifica tu cálculo de decoloración y te guía paso a paso. Así garantizamos que salgas con seguridad real."
    },
    {
      q: "¿Cómo funciona el convenio con el CETPRO del Estado para el título a Nombre de la Nación?",
      a: "Mantenemos un convenio de articulación formativa con un CETPRO (Centro de Educación Técnico-Productiva) estatal. Las horas cronológicas de capacitación práctica que realizas con nosotros se convalidan formalmente, permitiéndote presentar tu carpeta de evidencias ante el centro estatal y gestionar tu certificación oficial como 'Auxiliar Técnico a Nombre de la Nación', con validez oficial ante el Ministerio de Educación."
    },
    {
      q: "¿Cómo son las prácticas en los salones de belleza asociados?",
      a: "Contamos con una red de salones de belleza y spas aliados en Chiclayo, Santa Victoria y Pimentel. Las alumnas con asistencia destacada acceden a pasantías y horas de práctica supervisada atendiendo clientas reales bajo el protocolo de cada salón, lo que te permite ganar soltura, generar tu propio portafolio y abrir oportunidades laborales inmediatas."
    },
    {
      q: "¿Necesito experiencia previa para inscribirme?",
      a: "Depende de la capacitación: tenemos talleres de iniciación desde cero (como Peluquería Integral y Maquillaje Social) donde te formamos desde los cimientos; y especializaciones avanzadas (como Colorimetría & Balayage Signature) que aprovechan tanto principiantes decididas como estilistas en activo que buscan perfeccionar su técnica."
    },
    {
      q: "¿Entregan certificado a nombre de la empresa Salón & Estilo?",
      a: "Sí. Todas las egresadas reciben un Diploma / Certificado de Especialización emitido por Salón & Estilo firmado por Miluska Vidaurre, acreditando las horas prácticas cumplidas y las competencias adquiridas."
    },
    {
      q: "¿Puedo reservar mi cupo con anticipación?",
      a: "Sí. Debido a que las vacantes están estrictamente limitadas a 4 - 6 participantes por grupo para no saturar el espacio, los cupos se reservan con un adelanto. Puedes consultar los métodos de pago (Yape, transferencia o tarjeta) directamente por WhatsApp."
    }
  ];

  return (
    <div className="aprende-conmigo-root" style={{ background: 'var(--bg-canvas)', color: '#FFFFFF', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. HERO SECTION: ELEGANTE, ÍNTIMO & HONESTO */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212, 175, 55, 0.18) 0%, rgba(10, 10, 10, 0) 100%), #0A0A0A',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Glow ambient background element */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-100px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229, 192, 123, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Tagline Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
            }}>
              <GraduationCap size={16} style={{ color: 'var(--accent-gold)' }} />
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--accent-gold-light)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                {settings.academyHeroTag || "Aprende Conmigo • Capacitación Especializada"}
              </span>
            </div>

            {/* Main Title */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              letterSpacing: '-0.01em'
            }}>
              {settings.academyHeroTitle || "Educación Real en Belleza: Técnica, Práctica & Convenios Oficiales"}
            </h1>

            {/* Subtitle / Honest Value Proposition */}
            <p style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
              color: '#D1D5DB',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
              maxWidth: '760px',
              margin: '0 auto 2.5rem auto'
            }}>
              {settings.academyHeroSubtitle || "No creemos en clases multitudinarias donde apenas observas de lejos. En nuestro espacio íntimo aprendes haciendo con grupos reducidos de máximo 4 a 6 alumnas, práctica en modelos reales, certificado de Salón & Estilo y convenio oficial con CETPRO del Estado para tramitar tu título como Auxiliar Técnico a Nombre de la Nación."}
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <a
                href="#cursos-disponibles"
                className="btn-luxury-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.88rem',
                  textDecoration: 'none'
                }}
              >
                <BookOpen size={17} />
                <span>Explorar Cursos Vigentes</span>
              </a>

              <button
                type="button"
                onClick={handleGeneralInquiryWhatsApp}
                className="btn-luxury-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.88rem'
                }}
              >
                <Phone size={17} style={{ color: '#34D399' }} />
                <span>Asesoría Directa por WhatsApp</span>
              </button>
            </div>

            {/* 4 Feature Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginTop: '3.5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '0.6rem', borderRadius: '50%', color: 'var(--accent-gold)' }}>
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>Grupos de 4 a 6</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Atención personalizada 1 a 1</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '0.6rem', borderRadius: '50%', color: 'var(--accent-gold)' }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>Convenio CETPRO</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Título a Nombre de la Nación</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '0.6rem', borderRadius: '50%', color: 'var(--accent-gold)' }}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>Salones Aliados</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Prácticas con clientes reales</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '0.6rem', borderRadius: '50%', color: 'var(--accent-gold)' }}>
                  <Award size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>Certificado Oficial</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Avalado por Salón & Estilo</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LOS 3 PILARES DE RESPALDO (CONVENIOS, TITULACIÓN & SALONES) */}
      <section style={{ padding: '4.5rem 0', background: '#0D0D0D' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              Transparencia & Respaldo Real
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#FFFFFF', marginTop: '0.35rem' }}>
              ¿Por qué formarte en Salón & Estilo?
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#B3B3B3', lineHeight: 1.6, marginTop: '0.5rem' }}>
              Sabemos que buscas aprender un oficio rentable con seriedad. Por eso combinamos la enseñanza artesanal de alta gama con alianzas institucionales comprobadas.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem'
          }}>
            
            {/* Pilar 1: CETPRO Estatal */}
            <div style={{
              background: '#141414',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              padding: '2.2rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                Oficial del Estado
              </div>

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.05) 100%)',
                border: '1px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                marginBottom: '1.25rem'
              }}>
                <Building2 size={26} />
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>
                Convenio CETPRO del Estado
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#D1D5DB', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                Nuestras alumnas convalidan sus horas de formación práctica cursadas en Salón & Estilo para gestionar y tramitar en el CETPRO estatal su certificación como <strong>Auxiliar Técnico a Nombre de la Nación</strong>.
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.78rem',
                color: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <BadgeCheck size={16} style={{ flexShrink: 0 }} />
                <span>Reconocimiento oficial con valor para tu currículum formal.</span>
              </div>
            </div>

            {/* Pilar 2: Convenios con Salones de Belleza */}
            <div style={{
              background: '#141414',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              padding: '2.2rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--accent-gold)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                Prácticas Reales
              </div>

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.05) 100%)',
                border: '1px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                marginBottom: '1.25rem'
              }}>
                <Briefcase size={26} />
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>
                Convenios con Salones Aliados
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#D1D5DB', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                Alianzas de colaboración con reconocidos salones y centros de belleza de Chiclayo, Santa Victoria y Pimentel para que realices prácticas supervisadas con clientas reales y aceleres tu inserción laboral.
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.78rem',
                color: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <BadgeCheck size={16} style={{ flexShrink: 0 }} />
                <span>Experiencia directa con clientas, soltura de mano y velocidad.</span>
              </div>
            </div>

            {/* Pilar 3: Certificado Salón & Estilo & Grupos Reducidos */}
            <div style={{
              background: '#141414',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              padding: '2.2rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--accent-gold)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                Máx. 4 a 6
              </div>

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.05) 100%)',
                border: '1px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                marginBottom: '1.25rem'
              }}>
                <Award size={26} />
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>
                Certificado de la Marca & 1 a 1
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#D1D5DB', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                Diploma de culminación expedido a nombre de <strong>Salón & Estilo</strong>. La instrucción personalizada garantiza que Miluska Vidaurre evalúe tu avance de forma continua y personal en cada clase.
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.78rem',
                color: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <BadgeCheck size={16} style={{ flexShrink: 0 }} />
                <span>Asesoría continua post-curso para resolver casos de tus clientas.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CATÁLOGO DE CAPACITACIONES & CURSOS */}
      <section id="cursos-disponibles" style={{ padding: '5rem 0 3rem 0' }}>
        <div className="container">
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                Convocatoria Abierta • Chiclayo
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: '#FFFFFF', marginTop: '0.35rem' }}>
                Capacitaciones & Talleres
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#9CA3AF', marginTop: '0.35rem' }}>
                Selecciona la especialidad de tu interés y revisa fechas, horarios y cupos libres disponibles.
              </p>
            </div>

            {/* Buscador */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: '#161616',
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              width: '100%',
              maxWidth: '340px'
            }}>
              <Search size={16} style={{ color: 'var(--accent-gold)' }} />
              <input
                type="text"
                placeholder="Buscar por curso o técnica..."
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
              {courseSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCourseSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Categorías (Pills) */}
          <div style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2.5rem',
            scrollbarWidth: 'none'
          }}>
            {courseCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCourseCategory(cat)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: selectedCourseCategory === cat 
                    ? '1px solid var(--accent-gold)' 
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  background: selectedCourseCategory === cat 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.08) 100%)' 
                    : '#141414',
                  color: selectedCourseCategory === cat ? 'var(--accent-gold-light)' : '#CCCCCC',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Listado de Cursos */}
          {filteredCourses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              background: '#121212',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed rgba(255, 255, 255, 0.15)'
            }}>
              <BookOpen size={42} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem auto', opacity: 0.7 }} />
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>No se encontraron cursos para esta búsqueda</h3>
              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '0.35rem' }}>
                Prueba cambiando los filtros o escríbenos directamente para consultar próximas fechas personalizadas.
              </p>
              <button
                type="button"
                onClick={() => { setSelectedCourseCategory("Todos"); setCourseSearchQuery(""); }}
                className="btn-luxury-outline"
                style={{ marginTop: '1.25rem', fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem'
            }}>
              {filteredCourses.map(course => {
                const isSoldOut = course.status === 'agotado' || Number(course.availableSpots) <= 0;
                const isUpcoming = course.status === 'proximo';

                return (
                  <div
                    key={course.id}
                    style={{
                      background: '#141414',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                      transition: 'transform 0.25s ease, border-color 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.55)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    }}
                  >
                    {/* Header Image */}
                    <div style={{ position: 'relative', height: '210px', background: '#090909', overflow: 'hidden' }}>
                      <img
                        src={course.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"}
                        alt={course.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'brightness(0.9)'
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(20, 20, 20, 0.95) 0%, rgba(20, 20, 20, 0.1) 60%)'
                      }} />

                      {/* Status Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: isSoldOut ? 'rgba(239, 68, 68, 0.85)' : isUpcoming ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                      }}>
                        {isSoldOut ? 'Cupos Agotados' : isUpcoming ? 'Próximo Inicio' : 'Inscripciones Abiertas'}
                      </div>

                      {/* Spots Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0.85rem',
                        right: '1rem',
                        background: 'rgba(10, 10, 10, 0.85)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        color: 'var(--accent-gold-light)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        backdropFilter: 'blur(8px)'
                      }}>
                        {isSoldOut ? '0 cupos libres' : `${course.availableSpots || 2} de ${course.maxSpots || 5} cupos libres`}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                        {course.category}
                      </div>

                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        color: '#FFFFFF',
                        lineHeight: 1.3,
                        marginBottom: '0.5rem'
                      }}>
                        {course.title}
                      </h3>

                      <p style={{
                        fontSize: '0.82rem',
                        color: '#9CA3AF',
                        lineHeight: 1.5,
                        marginBottom: '1.25rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {course.subtitle || course.description}
                      </p>

                      {/* Meta List: Date, Schedule, Duration */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.45rem',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.78rem',
                        color: '#D1D5DB',
                        marginBottom: '1.25rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} style={{ color: 'var(--accent-gold)' }} />
                          <span><strong>Inicio:</strong> {course.startDate || "Coordinar fecha"}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} style={{ color: 'var(--accent-gold)' }} />
                          <span><strong>Horario:</strong> {course.schedule || course.duration}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Users size={14} style={{ color: 'var(--accent-gold)' }} />
                          <span><strong>Modalidad:</strong> {course.mode || "Presencial • Grupos Reducidos"}</span>
                        </div>
                      </div>

                      {/* Price & Savings */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                        paddingTop: '0.75rem',
                        marginBottom: '1.25rem',
                        borderTop: '1px dashed rgba(255,255,255,0.1)'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Inversión:</div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-gold-light)', fontFamily: 'var(--font-display)' }}>
                              S/ {Number(course.discountPrice || course.price || 0).toFixed(2)}
                            </span>
                            {course.discountPrice && course.discountPrice < course.price && (
                              <span style={{ fontSize: '0.85rem', color: '#6B7280', textDecoration: 'line-through' }}>
                                S/ {Number(course.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.68rem',
                          background: 'rgba(52, 211, 153, 0.12)',
                          color: '#34D399',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700
                        }}>
                          Facilidades de pago
                        </span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        <button
                          type="button"
                          onClick={() => setActiveCourseModal(course)}
                          className="btn-luxury-outline"
                          style={{
                            padding: '0.65rem 0.75rem',
                            fontSize: '0.76rem',
                            justifyContent: 'center'
                          }}
                        >
                          <FileText size={14} />
                          <span>Ver Temario</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenCourseWhatsApp(course)}
                          disabled={isSoldOut}
                          className={isSoldOut ? "btn-luxury-outline" : "btn-luxury-gold"}
                          style={{
                            padding: '0.65rem 0.75rem',
                            fontSize: '0.76rem',
                            justifyContent: 'center',
                            opacity: isSoldOut ? 0.5 : 1,
                            cursor: isSoldOut ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Phone size={14} />
                          <span>{isSoldOut ? 'Agotado' : 'Inscribirme'}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. RED DE CONVENIOS: CETPRO & SALONES DE BELLEZA */}
      <section style={{ padding: '4.5rem 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--accent-gold-light)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.75rem'
            }}>
              <HeartHandshake size={15} />
              <span>Alianzas Estratégicas</span>
            </div>
            
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#FFFFFF' }}>
              Nuestra Red de Prácticas & Convenios
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#A3A3A3', lineHeight: 1.6, marginTop: '0.5rem' }}>
              Conectamos tu formación con centros reales de trabajo. Conoce las instituciones y salones aliados donde nuestras alumnas consolidan su experiencia.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {academyPartnerships.map(partner => (
              <div
                key={partner.id}
                style={{
                  background: '#161616',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: partner.institutionType === 'cetpro' ? '#34D399' : 'var(--accent-gold)',
                    background: partner.institutionType === 'cetpro' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(212, 175, 55, 0.12)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px'
                  }}>
                    {partner.badge || (partner.institutionType === 'cetpro' ? 'Convenio Educativo' : 'Salón Aliado')}
                  </span>
                  
                  <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    {partner.location}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                  {partner.name}
                </h4>

                <p style={{ fontSize: '0.82rem', color: '#D1D5DB', lineHeight: 1.55 }}>
                  {partner.description}
                </p>

                {Array.isArray(partner.benefits) && partner.benefits.length > 0 && (
                  <div style={{
                    marginTop: '0.5rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px dashed rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}>
                    {partner.benefits.slice(0, 3).map((b, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: '#9CA3AF' }}>
                        <CheckCircle2 size={13} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. PREGUNTAS FRECUENTES (FAQ) */}
      <section style={{ padding: '4.5rem 0 2rem 0' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              Claridad & Honestidad
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: '#FFFFFF', marginTop: '0.35rem' }}>
              Preguntas Frecuentes
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#141414',
                    borderRadius: 'var(--radius-md)',
                    border: isOpen ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.15rem 1.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: 'var(--accent-gold)',
                        flexShrink: 0,
                        marginLeft: '0.5rem'
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 1.4rem 1.25rem 1.4rem',
                      fontSize: '0.85rem',
                      color: '#D1D5DB',
                      lineHeight: 1.65,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '0.9rem'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. BANNER FINAL CTA DE ADMISIONES */}
      <section style={{ padding: '3.5rem 0 1rem 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1A1612 0%, #0F0E0C 100%)',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            maxWidth: '920px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.75rem',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              color: 'var(--accent-gold)',
              marginBottom: '1rem'
            }}>
              <Sparkles size={28} />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: '#FFFFFF',
              marginBottom: '0.75rem'
            }}>
              ¿Deseas orientación sobre cuál especialidad elegir?
            </h3>

            <p style={{
              fontSize: '0.92rem',
              color: '#D1D5DB',
              maxWidth: '650px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.6
            }}>
              Escríbenos directamente a nuestro WhatsApp oficial. Te asesoramos según tu nivel actual, disponibilidad de horarios y objetivos profesionales.
            </p>

            <button
              type="button"
              onClick={handleGeneralInquiryWhatsApp}
              className="btn-luxury-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.9rem 2.2rem',
                fontSize: '0.9rem'
              }}
            >
              <Phone size={18} />
              <span>Chatear con Miluska Vidaurre</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. MODAL DETALLE DE TEMARIO & CURSO */}
      {activeCourseModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
          onClick={() => setActiveCourseModal(null)}
        >
          <div
            style={{
              background: '#161616',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              position: 'sticky',
              top: 0,
              background: '#161616',
              zIndex: 10
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Ficha Técnica & Temario • {activeCourseModal.category}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#FFFFFF', marginTop: '0.2rem' }}>
                  {activeCourseModal.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveCourseModal(null)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Resumen */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', fontWeight: 700 }}>
                  Descripción de la Formación
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#D1D5DB', lineHeight: 1.65 }}>
                  {activeCourseModal.description}
                </p>
              </div>

              {/* Ficha Rápida */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                background: '#0D0D0D',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.8rem'
              }}>
                <div>
                  <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.72rem' }}>Fecha de Inicio:</span>
                  <strong style={{ color: '#FFFFFF' }}>{activeCourseModal.startDate}</strong>
                </div>
                <div>
                  <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.72rem' }}>Horario & Duración:</span>
                  <strong style={{ color: '#FFFFFF' }}>{activeCourseModal.schedule || activeCourseModal.duration}</strong>
                </div>
                <div>
                  <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.72rem' }}>Capacidad:</span>
                  <strong style={{ color: 'var(--accent-gold-light)' }}>Máximo {activeCourseModal.maxSpots || 6} alumnas</strong>
                </div>
                <div>
                  <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.72rem' }}>Inversión:</span>
                  <strong style={{ color: '#34D399', fontSize: '0.95rem' }}>S/ {Number(activeCourseModal.discountPrice || activeCourseModal.price || 0).toFixed(2)}</strong>
                </div>
              </div>

              {/* Temario / Módulos */}
              {Array.isArray(activeCourseModal.syllabus) && activeCourseModal.syllabus.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', fontWeight: 700 }}>
                    Módulos & Contenido Paso a Paso
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activeCourseModal.syllabus.map((modulo, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          padding: '0.65rem 0.95rem',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '3px solid var(--accent-gold)',
                          fontSize: '0.82rem',
                          color: '#E5E7EB',
                          lineHeight: 1.5
                        }}
                      >
                        {modulo}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Qué incluye */}
              {Array.isArray(activeCourseModal.includes) && activeCourseModal.includes.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', fontWeight: 700 }}>
                    La Inscripción Incluye:
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
                    {activeCourseModal.includes.map((inc, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#D1D5DB' }}>
                        <CheckCircle2 size={15} style={{ color: '#34D399', flexShrink: 0, marginTop: '0.15rem' }} />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requisitos */}
              {activeCourseModal.requirements && (
                <div style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: '#E5E7EB'
                }}>
                  <strong style={{ color: 'var(--accent-gold)' }}>Requisitos: </strong>
                  <span>{activeCourseModal.requirements}</span>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              background: '#121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Inversión Final:</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                  S/ {Number(activeCourseModal.discountPrice || activeCourseModal.price || 0).toFixed(2)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const course = activeCourseModal;
                  setActiveCourseModal(null);
                  handleOpenCourseWhatsApp(course);
                }}
                className="btn-luxury-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.6rem',
                  fontSize: '0.85rem'
                }}
              >
                <Phone size={16} />
                <span>Reservar Vacante por WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
