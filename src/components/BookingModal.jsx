import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Calendar, Clock, Phone, Sparkles, ExternalLink, Check, Sun, Moon } from 'lucide-react';

export const BookingModal = () => {
  const { bookingService, setBookingService, settings, showToast } = useStore();

  // Helper date generators
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDateVal = (d) => d.toISOString().split('T')[0];
  const formatDateDisplay = (d) => d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });

  const QUICK_DATES = [
    { label: 'Hoy', value: `Hoy (${formatDateDisplay(today)})`, isoDate: formatDateVal(today) },
    { label: 'Mañana', value: `Mañana (${formatDateDisplay(tomorrow)})`, isoDate: formatDateVal(tomorrow) },
    { label: 'Pasado Mañana', value: formatDateDisplay(dayAfter), isoDate: formatDateVal(dayAfter) }
  ];

  const MORNING_SLOTS = ['09:30 AM', '11:00 AM', '12:30 PM'];
  const AFTERNOON_SLOTS = ['03:30 PM', '05:00 PM', '06:30 PM'];

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    dateOption: 'Mañana',
    customDate: '',
    time: '11:00 AM',
    shift: 'Turno Mañana',
    notes: ''
  });

  const [showCustomDate, setShowCustomDate] = useState(false);

  if (!bookingService) return null;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      alert("Por favor ingresa tu Nombre y Celular.");
      return;
    }

    const finalDate = showCustomDate && bookingForm.customDate
      ? bookingForm.customDate
      : (QUICK_DATES.find(d => d.label === bookingForm.dateOption)?.value || bookingForm.dateOption);

    const rawPhone = (settings.whatsappContact || '51920731163').toString().replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('51') ? rawPhone : `51${rawPhone}`;

    const messageLines = [
      "🌸 *SOLICITUD DE CITA - SALÓN & ESTILO*",
      "",
      `*Servicio:* ${bookingService.name}`,
      `*Categoría:* ${bookingService.category}`,
      `*Inversión referencial:* Desde S/ ${bookingService.priceFrom.toFixed(2)} (${bookingService.duration})`,
      "",
      "👤 *DATOS DE LA CLIENTA:*",
      `• *Nombre:* ${bookingForm.name}`,
      `• *WhatsApp:* ${bookingForm.phone}`,
      "",
      "📅 *HORARIO TENTATIVO SOLICITADO:*",
      `• *Fecha propuesta:* ${finalDate}`,
      `• *Hora tentativa:* ${bookingForm.time} (${bookingForm.shift})`,
      bookingForm.notes ? `• *Historial / Notas:* ${bookingForm.notes}` : null,
      "",
      "⚠️ *ESTADO:* Pendiente de confirmación de disponibilidad según agenda del salón.",
      "",
      "_Hola Miluska, envío esta solicitud para consultar la disponibilidad en este horario para mi cita en el salón. ¡Quedo atenta a tu confirmación!_"
    ].filter(line => line !== null).join("\n");

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageLines)}`;
    window.open(waUrl, '_blank');

    showToast(`Solicitud de cita para "${bookingService.name}" enviada`);
    setBookingService(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(5, 4, 3, 0.88)',
      backdropFilter: 'blur(14px)'
    }}>
      <div 
        className="animate-modal"
        style={{
          background: '#15110F',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '580px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(229, 192, 123, 0.18)',
          border: '1px solid var(--accent-gold-border)',
          position: 'relative',
          padding: '2.2rem'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setBookingService(null)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold-light)',
            background: 'rgba(28, 22, 20, 0.8)',
            border: '1px solid rgba(229, 192, 123, 0.2)'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid rgba(229, 192, 123, 0.2)', paddingBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            Agendar Turno • Salón de Belleza
          </span>
          <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginTop: '0.2rem', fontFamily: 'var(--font-serif)' }}>
            Reserva de Cita Personalizada
          </h2>
        </div>

        {/* Selected Service Box */}
        <div style={{
          background: '#0D0A09',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(229, 192, 123, 0.3)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <img
            src={bookingService.image}
            alt={bookingService.name}
            style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
              {bookingService.category}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
              {bookingService.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#B3B3B3', marginTop: '0.15rem' }}>
              Desde S/ {bookingService.priceFrom.toFixed(2)} • {bookingService.duration}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Client Details Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#CCCCCC', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                Tu Nombre Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Valeria Mendoza"
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#CCCCCC', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                Celular / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="9XXXXXXXX"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Selector Rápido de Fecha Tentativa */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.76rem', color: 'var(--accent-gold-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Calendar size={14} style={{ color: 'var(--accent-gold)' }} />
                <span>¿Para qué día deseas tu cita?</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCustomDate(!showCustomDate)}
                style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', textDecoration: 'underline' }}
              >
                {showCustomDate ? 'Opciones rápidas' : 'Elegir otra fecha'}
              </button>
            </div>

            {!showCustomDate ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {QUICK_DATES.map(q => {
                  const isSelected = bookingForm.dateOption === q.label;
                  return (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, dateOption: q.label })}
                      style={{
                        padding: '0.55rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 800 : 600,
                        background: isSelected ? 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)' : '#1C1C1C',
                        color: isSelected ? '#0A0A0A' : '#D4D4D4',
                        border: isSelected ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: isSelected ? '0 0 12px rgba(229, 192, 123, 0.35)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <span style={{ fontSize: '0.82rem' }}>{q.label}</span>
                      <span style={{ fontSize: '0.68rem', opacity: isSelected ? 0.9 : 0.65 }}>
                        {q.isoDate.split('-').slice(1).join('/')}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="date"
                value={bookingForm.customDate}
                onChange={(e) => setBookingForm({ ...bookingForm, customDate: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
              />
            )}
          </div>

          {/* Selector Rápido de Horario Tentativo */}
          <div>
            <label style={{ fontSize: '0.76rem', color: 'var(--accent-gold-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Clock size={14} style={{ color: 'var(--accent-gold)' }} />
              <span>Horario Tentativo Sugerido</span>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* Turno Mañana */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#B3B3B3', marginBottom: '0.3rem' }}>
                  <Sun size={12} style={{ color: 'var(--accent-gold)' }} />
                  <span>Turno Mañana (Luz natural óptima para color)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                  {MORNING_SLOTS.map(slot => {
                    const isSelected = bookingForm.time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, time: slot, shift: 'Turno Mañana' })}
                        style={{
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 800 : 600,
                          background: isSelected ? 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)' : '#1C1C1C',
                          color: isSelected ? '#0A0A0A' : '#D4D4D4',
                          border: isSelected ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.15)',
                          boxShadow: isSelected ? '0 0 10px rgba(229, 192, 123, 0.35)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Turno Tarde */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#B3B3B3', marginBottom: '0.3rem' }}>
                  <Moon size={12} style={{ color: 'var(--accent-rose)' }} />
                  <span>Turno Tarde / Atardecer en el balneario</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                  {AFTERNOON_SLOTS.map(slot => {
                    const isSelected = bookingForm.time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, time: slot, shift: 'Turno Tarde' })}
                        style={{
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 800 : 600,
                          background: isSelected ? 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)' : '#1C1C1C',
                          color: isSelected ? '#0A0A0A' : '#D4D4D4',
                          border: isSelected ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.15)',
                          boxShadow: isSelected ? '0 0 10px rgba(229, 192, 123, 0.35)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#CCCCCC', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
              Notas o Historial Capilar Previo (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Tengo tinte negro previo, me gustaría saber si podemos llegar a un balayage miel..."
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <div style={{
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.74rem',
              color: 'var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.85rem',
              lineHeight: 1.45
            }}>
              <span style={{ fontSize: '0.95rem' }}>ℹ️</span>
              <span><strong>Aviso de agenda:</strong> El horario seleccionado es tentativo. Al enviar el mensaje a WhatsApp se coordinará y confirmará la disponibilidad inmediata en el salón.</span>
            </div>

            <button
              type="submit"
              className="btn-luxury-gold"
              style={{ width: '100%', padding: '0.95rem', fontSize: '0.88rem' }}
            >
              <span>Consultar Disponibilidad por WhatsApp</span>
              <ExternalLink size={16} />
            </button>
            <span style={{ display: 'block', textAlign: 'center', fontSize: '0.72rem', color: '#A3A3A3', marginTop: '0.6rem' }}>
              Atención directa con Miluska Vidaurre • Reserva sujeta a confirmación de disponibilidad
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
