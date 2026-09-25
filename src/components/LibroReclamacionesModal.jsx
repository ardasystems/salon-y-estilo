import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, BookOpen, CheckCircle, Printer } from 'lucide-react';

export const LibroReclamacionesModal = () => {
  const { isLibroOpen, setIsLibroOpen, submitComplaint, settings } = useStore();
  const [submittedRecord, setSubmittedRecord] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    dni: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chiclayo',
    orderNumber: '',
    type: 'Reclamo',
    amount: '',
    description: '',
    consumerRequest: ''
  });

  if (!isLibroOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.dni || !form.description || !form.consumerRequest) {
      alert("Por favor completa los campos obligatorios (*).");
      return;
    }

    const record = submitComplaint(form);
    setSubmittedRecord(record);
  };

  const handleClose = () => {
    setIsLibroOpen(false);
    setSubmittedRecord(null);
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
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 175, 55, 0.15)',
          border: '1px solid var(--accent-gold-border)',
          position: 'relative',
          padding: '2.4rem'
        }}
      >
        <button
          onClick={handleClose}
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
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}
        >
          <X size={18} />
        </button>

        {!submittedRecord ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', paddingBottom: '1.1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--accent-gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)'
              }}>
                <BookOpen size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
                  Libro de Reclamaciones Virtual
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Conforme a la Ley N° 29571 (Código de Protección al Consumidor - INDECOPI Perú).
                </p>
              </div>
            </div>

            <div style={{
              background: '#0D0A09',
              padding: '0.9rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div><strong style={{ color: '#FFF' }}>Razón Comercial:</strong> {settings.storeName}</div>
              <div><strong style={{ color: '#FFF' }}>Sede:</strong> Chiclayo, Lambayeque - Perú</div>
              <div><strong style={{ color: '#FFF' }}>Dirección:</strong> Calle San José 742, Chiclayo</div>
            </div>

            {/* SECCIÓN 1: DATOS */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                1. Identificación del Consumidor
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Nombre y Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>DNI / CE *</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={form.dni}
                    onChange={(e) => setForm({ ...form, dni: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Celular *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Dirección de Domicilio y Ciudad</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Ej. Urb. Santa Victoria, Chiclayo"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: BIEN CONTRATADO */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                2. Bien Contratado
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>N° Pedido (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. AB-CHIC-1042"
                    value={form.orderNumber}
                    onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Monto Reclamado (S/.)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="S/ 0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: DETALLE */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                3. Detalle de la Reclamación
              </h4>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#FFF' }}>
                  <input
                    type="radio"
                    name="type"
                    checked={form.type === 'Reclamo'}
                    onChange={() => setForm({ ...form, type: 'Reclamo' })}
                  />
                  <span><strong>Reclamo:</strong> Disconformidad con producto o servicio.</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#FFF' }}>
                  <input
                    type="radio"
                    name="type"
                    checked={form.type === 'Queja'}
                    onChange={() => setForm({ ...form, type: 'Queja' })}
                  />
                  <span><strong>Queja:</strong> Disconformidad con la atención recibida.</span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Detalle de los hechos *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe claramente los hechos ocurridos..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Pedido Concreto del Consumidor *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="¿Cuál es tu solicitud o solución esperada?"
                    value={form.consumerRequest}
                    onChange={(e) => setForm({ ...form, consumerRequest: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                * Plazo máximo de respuesta legal: 15 días hábiles.
              </span>
              <button
                type="submit"
                className="btn-luxury-gold"
                style={{ padding: '0.75rem 1.8rem', fontSize: '0.82rem' }}
              >
                Enviar Hoja de Reclamación
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '2px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <CheckCircle size={32} />
            </div>

            <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
              Reclamación Registrada
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Se ha emitido tu Hoja de Reclamación Virtual conforme a ley.
            </p>

            <div style={{
              background: '#0D0A09',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
              border: '1px dashed var(--accent-gold)',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                <span>N° CORRELATIVO:</span>
                <span style={{ color: 'var(--accent-gold)' }}>{submittedRecord.correlative}</span>
              </div>
              <div><strong style={{ color: '#FFF' }}>Fecha:</strong> {new Date(submittedRecord.filedAt).toLocaleString('es-PE')}</div>
              <div><strong style={{ color: '#FFF' }}>Consumidor:</strong> {submittedRecord.fullName} (DNI: {submittedRecord.dni})</div>
              <div><strong style={{ color: '#FFF' }}>Tipo:</strong> {submittedRecord.type}</div>
              <div><strong style={{ color: '#FFF' }}>Detalle:</strong> {submittedRecord.description}</div>
              <div><strong style={{ color: '#FFF' }}>Pedido:</strong> {submittedRecord.consumerRequest}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.print()}
                className="btn-luxury-outline"
                style={{ fontSize: '0.8rem', padding: '0.65rem 1.4rem' }}
              >
                <Printer size={15} />
                <span>Imprimir Hoja</span>
              </button>
              <button
                onClick={handleClose}
                className="btn-luxury-gold"
                style={{ fontSize: '0.8rem', padding: '0.65rem 1.6rem' }}
              >
                <span>Aceptar y Cerrar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
