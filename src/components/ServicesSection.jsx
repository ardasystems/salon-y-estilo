import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Clock, Sparkles, Check, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ServicesSection = () => {
  const {
    filteredServices,
    serviceCategories,
    selectedServiceCategory,
    setSelectedServiceCategory,
    serviceSearchQuery,
    setServiceSearchQuery,
    setBookingService
  } = useStore();

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out', padding: '4rem 0 6rem 0', background: 'var(--bg-canvas)' }}>
      <div className="container">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem auto' }}
        >
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--accent-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Carta de Servicios Exclusivos
          </span>
          <h2 style={{ fontSize: '2.6rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.85rem' }}>
            Estilismo & Belleza de Alta Gama
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
            Desde balayage con matices personalizados hasta alisados orgánicos de máxima duración. Reserva tu turno de atención con asesoría personalizada.
          </p>
        </motion.div>

        {/* Dedicated Search & Filters for Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
          background: '#161210',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '1.25rem 1.5rem',
          marginBottom: '3rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
            <input
              type="text"
              placeholder="Buscar servicio (ej. balayage, alisado orgánico, uñas soft gel, maquillaje)..."
              value={serviceSearchQuery}
              onChange={(e) => setServiceSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Category filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.2rem', scrollbarWidth: 'none' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '0.4rem', flexShrink: 0 }}>
              Categoría:
            </span>
            {serviceCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedServiceCategory(cat)}
                style={{
                  padding: '0.4rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: selectedServiceCategory === cat ? 700 : 500,
                  whiteSpace: 'nowrap',
                  background: selectedServiceCategory === cat ? 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)' : 'rgba(212, 175, 55, 0.08)',
                  color: selectedServiceCategory === cat ? '#0D0A09' : 'var(--text-muted)',
                  border: selectedServiceCategory === cat ? 'none' : '1px solid rgba(212, 175, 55, 0.18)',
                  boxShadow: selectedServiceCategory === cat ? '0 0 15px rgba(212, 175, 55, 0.35)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4.5rem 1.5rem',
            background: '#161210',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(212, 175, 55, 0.15)'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
              No encontramos servicios con ese criterio de búsqueda.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Prueba buscando por "balayage", "alisado", "maquillaje" o restablece los filtros.
            </p>
            <button
              onClick={() => {
                setSelectedServiceCategory('Todos');
                setServiceSearchQuery('');
              }}
              className="btn-luxury-gold"
              style={{ fontSize: '0.8rem', padding: '0.75rem 1.8rem' }}
            >
              Ver Todos los Servicios
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem'
          }}>
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{
                  background: '#161210',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={service.image}
                    alt={service.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(22, 18, 16, 0.95) 0%, transparent 60%)'
                  }} />
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
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                    <Clock size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Duración aprox: {service.duration}</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem', lineHeight: 1.25 }}>
                    {service.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {service.description}
                  </p>

                  {/* What it includes */}
                  {service.includes && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
                        Incluye en el salón:
                      </span>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {service.includes.map((inc, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Check size={13} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bottom: Price & Booking Button */}
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(212, 175, 55, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Inversión:</span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                        Desde S/ {service.priceFrom.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => setBookingService(service)}
                      className="btn-luxury-gold"
                      style={{ padding: '0.75rem 1.4rem', fontSize: '0.78rem', gap: '0.45rem' }}
                    >
                      <Calendar size={14} />
                      <span>Agendar Cita</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
