import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

export const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(5, 4, 3, 0.88)', backdropFilter: 'blur(14px)' }}>
      <div className="animate-modal" style={{ background: '#15110F', borderRadius: 'var(--radius-lg)', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', border: '1px solid var(--accent-gold-border)', position: 'relative', padding: '2rem' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={20} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '1rem' }}>
          <ShieldCheck size={28} style={{ color: 'var(--accent-gold)' }} />
          <h2 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0, fontFamily: 'var(--font-serif)' }}>Políticas de Privacidad</h2>
        </div>
        <div style={{ color: '#CCC', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <p>En Salón & Estilo, respetamos su privacidad y nos comprometemos a proteger la información personal que nos proporcione.</p>
          <h3 style={{ color: '#FFF', marginTop: '1rem' }}>1. Uso de la Información</h3>
          <p>Los datos recopilados (nombre, teléfono, correo) se utilizan exclusivamente para procesar sus pedidos, agendar citas y contactarle respecto a nuestros servicios.</p>
          <h3 style={{ color: '#FFF', marginTop: '1rem' }}>2. Pasarela de Pagos</h3>
          <p>Los pagos son procesados a través de Mercado Pago. Salón & Estilo no almacena números de tarjetas de crédito ni datos financieros sensibles.</p>
          <h3 style={{ color: '#FFF', marginTop: '1rem' }}>3. Compartir Información</h3>
          <p>No vendemos, alquilamos ni compartimos su información personal con terceros, salvo con servicios de mensajería (Courier) necesarios para la entrega de sus productos.</p>
        </div>
        <button onClick={onClose} className="btn-luxury-gold" style={{ marginTop: '2rem', width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>Entendido</button>
      </div>
    </div>
  );
};

export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(5, 4, 3, 0.88)', backdropFilter: 'blur(14px)' }}>
      <div className="animate-modal" style={{ background: '#15110F', borderRadius: 'var(--radius-lg)', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', border: '1px solid var(--accent-gold-border)', position: 'relative', padding: '2rem' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={20} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '1rem' }}>
          <FileText size={28} style={{ color: 'var(--accent-gold)' }} />
          <h2 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0, fontFamily: 'var(--font-serif)' }}>Términos y Condiciones</h2>
        </div>
        <div style={{ color: '#CCC', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <p>Bienvenido a Salón & Estilo. Al utilizar nuestro sitio web y servicios, acepta los siguientes términos:</p>
          <h3 style={{ color: '#FFF', marginTop: '1rem' }}>1. Compras y Entregas</h3>
          <p>Todos los pedidos están sujetos a disponibilidad. Los envíos a nivel nacional se realizan a través de Shalom y el tiempo de entrega depende de la agencia. Las opciones express solo aplican para Chiclayo y alrededores.</p>
          <h3 style={{ color: '#FFF', marginTop: '1rem' }}>2. Citas y Servicios</h3>
          <p>Las citas para el salón deben ser confirmadas previamente. Se solicita puntualidad; un retraso considerable podría requerir la reprogramación de su cita.</p>
          <h3 style={{ color: '#FFF', marginTop: '1rem' }}>3. Devoluciones</h3>
          <p>Debido a la naturaleza de los productos cosméticos, no aceptamos devoluciones si el producto ha sido abierto o manipulado, salvo por defectos de fábrica reportados en las primeras 24 horas tras la recepción.</p>
        </div>
        <button onClick={onClose} className="btn-luxury-gold" style={{ marginTop: '2rem', width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>Aceptar Términos</button>
      </div>
    </div>
  );
};
