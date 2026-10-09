import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  X, CheckCircle, ArrowRight, ShieldCheck, Copy, 
  QrCode, ExternalLink, Printer, Check, Zap, Truck, Store, Download, MapPin,
  FileText, MessageCircle, AlertCircle, CreditCard, Building2, Smartphone
} from 'lucide-react';
import { generateReceiptPDF } from '../utils/receiptGenerator';

// Helper to safely load persisted checkout data
const getSavedCheckout = () => {
  try {
    const saved = localStorage.getItem('salonestilo_active_checkout');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading saved checkout", e);
  }
  return null;
};

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    settings,
    createOrder,
    showToast,
    setActiveMainTab
  } = useStore();

  const savedCheckout = getSavedCheckout();

  const [step, setStep] = useState(() => savedCheckout?.step || 'form');
  const [completedOrder, setCompletedOrder] = useState(() => savedCheckout?.completedOrder || null);

  const [customer, setCustomer] = useState(() => savedCheckout?.customer || {
    name: '',
    dni: '',
    phone: '',
    email: '',
    city: 'Chiclayo',
    district: '',
    address: '',
    reference: '',
    notes: ''
  });

  const [selectedShipping, setSelectedShipping] = useState(() => {
    // Por defecto 'Retiro en Salón de Belleza (Gratis)' como primera opción
    const pickupOption = settings.shippingOptions?.find(o => o.id === 'salon_pickup' || /retiro/i.test(o.title));
    return pickupOption || settings.shippingOptions?.[0];
  });

  const [selectedPaymentOption, setSelectedPaymentOption] = useState('all');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isVerifyingReturn, setIsVerifyingReturn] = useState(false);
  const [receiptDownloaded, setReceiptDownloaded] = useState(() => savedCheckout?.receiptDownloaded || false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Synchronize state to localStorage so reloading NEVER loses user information
  useEffect(() => {
    if (isCheckoutOpen) {
      localStorage.setItem('salonestilo_active_checkout', JSON.stringify({
        isOpen: true,
        step,
        completedOrder,
        customer,
        selectedShipping,
        selectedPaymentOption,
        receiptDownloaded
      }));
    }
  }, [isCheckoutOpen, step, completedOrder, customer, selectedShipping, selectedPaymentOption, receiptDownloaded]);

  // Handle Return from Mercado Pago (Synchronous Redirect UX)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment');
      const provider = params.get('provider');
      const paymentId = params.get('payment_id') || params.get('data.id') || params.get('id');
      const orderId = params.get('order_id') || params.get('external_reference');

      if (provider === 'mercadopago' && paymentStatus) {
        setIsCheckoutOpen(true);

        if (paymentStatus === 'success') {
          setStep('success');
          triggerConfetti();

          const saved = getSavedCheckout();
          let targetOrder = saved?.completedOrder || (orderId ? {
            id: orderId,
            customer: saved?.customer || customer,
            items: cart,
            subtotal: cartSubtotal,
            shippingMethod: selectedShipping,
            total: orderTotal,
            paymentMethod: 'mercadopago',
            createdAt: new Date().toISOString()
          } : null);

          if (targetOrder) {
            targetOrder.paymentStatus = 'pagado';
            targetOrder.mercadopagoPaymentId = paymentId;
            setCompletedOrder({ ...targetOrder });
          }

          // Consultar endpoint de verificación inmediata
          if (paymentId) {
            setIsVerifyingReturn(true);
            fetch('/api/payments/mercadopago/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, orderId: orderId || targetOrder?.id })
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  showToast("¡Pago acreditado con éxito por Mercado Pago!");
                  if (targetOrder) {
                    targetOrder.paymentStatus = 'pagado';
                    targetOrder.mercadopagoPaymentId = paymentId;
                    setCompletedOrder({ ...targetOrder });
                  }
                }
              })
              .catch(err => console.error("Error verificando retorno MP:", err))
              .finally(() => setIsVerifyingReturn(false));
          }

          // Limpiar parámetros de la URL para evitar reprocesamientos si se recarga la página
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentStatus === 'failure') {
          showToast("El pago no pudo completarse", "error");
          setPaymentError("El proceso no se completó o fue rechazado. Puedes intentar nuevamente con Yape o con otra tarjeta.");
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentStatus === 'pending') {
          showToast("Tu pago en Mercado Pago está en proceso de validación bancaria", "info");
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (e) {
      console.error("Error procesando retorno de pasarela:", e);
    }
  }, []);

  if (!isCheckoutOpen) return null;

  const orderTotal = cartSubtotal + (selectedShipping ? selectedShipping.price : 0);

  const isPickup = selectedShipping?.id === 'salon_pickup' || 
                   selectedShipping?.id === 'chiclayo_pickup' || 
                   selectedShipping?.price === 0 || 
                   /retiro/i.test(selectedShipping?.title || '');

  const copyPhoneNumber = (phone) => {
    navigator.clipboard.writeText(phone.replace(/\s+/g, ''));
    setCopiedPhone(true);
    showToast("Número copiado al portapapeles");
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleInputChange = (field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  // Helper for Unified Payment Button
  const getButtonConfig = () => {
    return {
      label: `Continuar al Pago Seguro • S/ ${orderTotal.toFixed(2)}`,
      gradient: 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)',
      shadow: '0 6px 25px rgba(212, 175, 55, 0.4)',
      border: 'rgba(212, 175, 55, 0.8)'
    };
  };

  // Download PDF Receipt
  const handleDownloadReceipt = (orderObj = null) => {
    const targetOrder = orderObj || completedOrder || {
      id: `SE-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      items: cart,
      subtotal: cartSubtotal,
      shippingMethod: selectedShipping,
      total: orderTotal,
      paymentMethod: selectedPaymentOption,
      paymentStatus: 'pagado',
      createdAt: new Date().toISOString()
    };

    generateReceiptPDF(targetOrder, settings);
    setReceiptDownloaded(true);
    showToast("Constancia / Recibo Oficial (PDF) descargado");
  };

  // WhatsApp Message Generator (Notification)
  const openWhatsAppConfirmation = (orderToConfirm) => {
    const order = orderToConfirm || completedOrder;
    if (!order) return;

    const itemsList = order.items.map(i => `• ${i.quantity}x ${i.name} (S/ ${(i.price * i.quantity).toFixed(2)})`).join('\n');
    const paymentLabel = {
      yape: 'YAPE (Automático)',
      card: 'TARJETA DÉBITO / CRÉDITO',
      cash: 'PAGO EN EFECTIVO (Agentes PagoEfectivo)',
      bank_transfer: 'BANCA POR INTERNET (Transferencia CIP)'
    }[order.paymentOption || order.paymentMethod] || 'PAGO EN LÍNEA';
    
    const isPickupOrder = order.shippingMethod?.id === 'salon_pickup' || 
                         order.shippingMethod?.id === 'chiclayo_pickup' || 
                         order.shippingMethod?.price === 0 || 
                         /retiro/i.test(order.shippingMethod?.title || '');

    let dispatchText = '';
    if (isPickupOrder) {
      dispatchText = `*Modalidad:* Retiro en Salón de Belleza (Gratis)\n*Local Salón:* ${settings.salonAddress || 'Chiclayo'}`;
    } else {
      const destParts = [order.customer.address, order.customer.district, order.customer.city].filter(Boolean).join(', ');
      dispatchText = `*Modalidad:* ${order.shippingMethod.title}\n*Dirección de Entrega:* ${destParts || 'A coordinar'}`;
    }

    const txLine = order.mercadopagoPaymentId
      ? `*Transacción Oficial:* #${order.mercadopagoPaymentId} (Acreditado al 100%)`
      : `*Estado:* Acreditado`;

    const messageLines = [
      `✨ *CONFIRMACIÓN DE COMPRA ${(settings.storeName || 'SALÓN & ESTILO').toUpperCase()}*`,
      `*N° Pedido:* #${order.id}`,
      `*Cliente:* ${order.customer.name}`,
      order.customer.dni ? `*DNI/CE:* ${order.customer.dni}` : null,
      order.customer.phone ? `*Celular:* ${order.customer.phone}` : null,
      dispatchText,
      '',
      `*Productos:*`,
      itemsList,
      '',
      `*Subtotal:* S/ ${order.subtotal.toFixed(2)}`,
      `*Costo Despacho:* ${order.shippingMethod.price === 0 ? 'GRATIS' : `S/ ${order.shippingMethod.price.toFixed(2)}`}`,
      `*TOTAL:* S/ ${order.total.toFixed(2)}`,
      `*Método:* ${paymentLabel}`,
      txLine,
      '',
      `_Hola Salón & Estilo, acabo de registrar mi compra en la web. Por favor confirmar la preparación del pedido._`
    ].filter(line => line !== null).join('\n');

    const cleanPhone = (settings.whatsappContact || '51920731163').replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageLines)}`;
    window.open(waUrl, '_blank');
  };

  // Automated Payment Submit Handler
  const handlePaymentSubmit = async () => {
    const errors = {};
    if (!customer.name || customer.name.trim().length < 2) {
      errors.name = "Por favor ingresa tus nombres y apellidos";
    }
    if (!customer.phone || customer.phone.replace(/\D/g, '').length < 8) {
      errors.phone = "Por favor ingresa tu número de celular (9 dígitos)";
    }
    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errors.email = "Por favor ingresa un correo electrónico válido";
    }
    if (!isPickup) {
      if (!customer.city || customer.city.trim().length < 2) {
        errors.city = "Por favor ingresa tu ciudad de destino";
      }
      if (!customer.address || customer.address.trim().length < 3) {
        errors.address = "Por favor ingresa tu dirección exacta o agencia";
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("Por favor completa los campos obligatorios en rojo", "error");
      setPaymentError("Por favor completa los datos obligatorios marcados en rojo para continuar.");
      return;
    }

    if (cart.length === 0) {
      showToast("Tu carrito de compras está vacío", "error");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);
    setValidationErrors({});

    try {
      // 1. Registrar la orden preliminar en el estado y Supabase
      const orderData = {
        customer,
        items: cart,
        subtotal: cartSubtotal,
        shippingMethod: selectedShipping,
        total: orderTotal,
        paymentMethod: selectedPaymentOption,
        paymentOption: selectedPaymentOption,
        paymentStatus: 'pendiente_pago'
      };

      const newOrder = await createOrder(orderData);
      setCompletedOrder(newOrder);

      // Guardar respaldo local
      localStorage.setItem('salonestilo_active_checkout', JSON.stringify({
        isOpen: true,
        step: 'success',
        completedOrder: newOrder,
        customer,
        selectedShipping,
        selectedPaymentOption,
        receiptDownloaded: false
      }));

      // 2. Solicitar creación de preferencia
      const response = await fetch('/api/payments/mercadopago/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrder.id,
          items: cart,
          shippingMethod: selectedShipping,
          customer,
          orderTotal,
          paymentOption: selectedPaymentOption
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo conectar con la pasarela de pagos. Por favor intenta nuevamente.");
      }

      // 3. Determinar URL de redirección segura (Regla de Oro: usar initPoint sin bucles de cookies)
      const redirectUrl = data.initPoint || data.redirectUrl;

      if (!redirectUrl) {
        throw new Error("No se recibió la URL de pago de Mercado Pago");
      }

      // 4. Redirección automática inmediata
      window.location.href = redirectUrl;
    } catch (err) {
      console.error("Error iniciando pago:", err);
      const msg = err.message || "Error al conectar con la pasarela de pagos.";
      setPaymentError(msg);
      showToast(msg, "error");
      setIsProcessingPayment(false);
    }
  };

  const handleRequestClose = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmAbandon = () => {
    localStorage.removeItem('salonestilo_active_checkout');
    setStep('form');
    setCompletedOrder(null);
    setReceiptDownloaded(false);
    setShowExitConfirm(false);
    setIsCheckoutOpen(false);
    if (setActiveMainTab) {
      setActiveMainTab('salon');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1200,
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
          maxWidth: step === 'success' ? '600px' : '960px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 175, 55, 0.15)',
          border: '1px solid var(--accent-gold-border)',
          position: 'relative',
          padding: '2.2rem'
        }}
      >
        {/* Anuncio modal: confirmación si realmente desea abandonar */}
        {showExitConfirm && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(13, 10, 9, 0.96)',
            backdropFilter: 'blur(16px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={32} />
            </div>

            <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.65rem' }}>
              ¿Realmente deseas abandonar?
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#CCCCCC', maxWidth: '380px', marginBottom: '2rem', lineHeight: 1.55 }}>
              Si confirmas la salida, se cerrará el proceso actual y regresarás a la página inicial de Salón & Estilo.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleConfirmAbandon}
                style={{
                  background: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.55)',
                  color: '#FCA5A5',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Sí, abandonar y volver al inicio
              </button>
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="btn-luxury-gold"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.84rem' }}
              >
                Continuar con mi compra
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={handleRequestClose}
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
            border: '1px solid rgba(212, 175, 55, 0.2)',
            zIndex: 10,
            cursor: 'pointer'
          }}
          title="Cerrar"
        >
          <X size={18} />
        </button>

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <div>
            <div style={{ marginBottom: '1.8rem', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', paddingBottom: '1.1rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                Checkout Seguro • Salón & Estilo
              </span>
              <h2 style={{ fontSize: '1.9rem', color: '#FFFFFF', marginTop: '0.2rem', fontFamily: 'var(--font-serif)' }}>
                Destino de Envío & Métodos de Pago
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.2rem'
            }}>
              {/* Left Column: Customer & Shipping */}
              <div>
                {/* 1. Datos Personales y Entrega */}
                <div style={{ marginBottom: '1.8rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#0D0A09', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>1</span>
                    <span>Tus Datos de Contacto y Entrega</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Nombres */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Nombres y Apellidos *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Carolina Reátegui"
                        value={customer.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.88rem',
                          border: validationErrors.name ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                          background: validationErrors.name ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                          color: '#FFFFFF'
                        }}
                      />
                      {validationErrors.name && (
                        <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                          ⚠️ {validationErrors.name}
                        </span>
                      )}
                    </div>

                    {/* DNI & Celular */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          DNI o CE * (Para envío)
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="8 dígitos"
                          value={customer.dni}
                          onChange={(e) => handleInputChange('dni', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.9rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.88rem',
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: '#161210',
                            color: '#FFFFFF'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Celular / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          placeholder="9XXXXXXXX"
                          value={customer.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.9rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.88rem',
                            border: validationErrors.phone ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                            background: validationErrors.phone ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                            color: '#FFFFFF'
                          }}
                        />
                        {validationErrors.phone && (
                          <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                            ⚠️ {validationErrors.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Correo */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Correo Electrónico * (Para tu recibo digital y confirmación)
                      </label>
                      <input
                        type="email"
                        placeholder="tu-correo@ejemplo.com"
                        value={customer.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.88rem',
                          border: validationErrors.email ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                          background: validationErrors.email ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                          color: '#FFFFFF'
                        }}
                      />
                      {validationErrors.email && (
                        <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                          ⚠️ {validationErrors.email}
                        </span>
                      )}
                    </div>

                    {/* Campos de Dirección Integrados en Sección 1 */}
                    {!isPickup ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              Ciudad de destino *
                            </label>
                            <input
                              type="text"
                              value={customer.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="Chiclayo / Lima / Trujillo..."
                              style={{
                                width: '100%',
                                padding: '0.65rem 0.9rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.88rem',
                                border: validationErrors.city ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                                background: validationErrors.city ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                                color: '#FFFFFF'
                              }}
                            />
                            {validationErrors.city && (
                              <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                                ⚠️ {validationErrors.city}
                              </span>
                            )}
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              Distrito / Zona
                            </label>
                            <input
                              type="text"
                              value={customer.district}
                              onChange={(e) => handleInputChange('district', e.target.value)}
                              placeholder="Santa Victoria / La Victoria..."
                              style={{
                                width: '100%',
                                padding: '0.65rem 0.9rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.88rem',
                                border: '1px solid rgba(255,255,255,0.15)',
                                background: '#161210',
                                color: '#FFFFFF'
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            Dirección exacta o Agencia Shalom *
                          </label>
                          <input
                            type="text"
                            value={customer.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Calle, número, departamento o agencia Shalom"
                            style={{
                              width: '100%',
                              padding: '0.65rem 0.9rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.88rem',
                              border: validationErrors.address ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                              background: validationErrors.address ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                              color: '#FFFFFF'
                            }}
                          />
                          {validationErrors.address && (
                            <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                              ⚠️ {validationErrors.address}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        marginTop: '0.35rem',
                        background: 'rgba(212, 175, 55, 0.08)',
                        border: '1px dashed rgba(212, 175, 55, 0.4)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(212, 175, 55, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-gold)',
                          flexShrink: 0
                        }}>
                          <Store size={17} />
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#ECE8E1', lineHeight: 1.45 }}>
                          <strong style={{ color: 'var(--accent-gold-light)', display: 'block' }}>
                            Retiro en Salón de Belleza (Gratis)
                          </strong>
                          {settings.salonAddress || 'Chiclayo, Lambayeque - Perú'}. No requieres ingresar dirección; tu pedido se preparará inmediatamente para recojo en tienda.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Destino & Método de Entrega */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#0D0A09', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>2</span>
                    <span>Modalidad de Despacho (Chiclayo & Perú)</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {settings.shippingOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedShipping(opt)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: selectedShipping?.id === opt.id ? '2px solid var(--accent-gold)' : '1px solid rgba(212, 175, 55, 0.15)',
                          background: selectedShipping?.id === opt.id ? 'rgba(212, 175, 55, 0.1)' : '#191412',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: selectedShipping?.id === opt.id ? '5px solid var(--accent-gold)' : '2px solid rgba(255,255,255,0.2)',
                            background: '#0D0A09'
                          }} />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                              {opt.title}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {opt.description}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                            {opt.price === 0 ? 'GRATIS' : `S/ ${opt.price.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Payment & Totals */}
              <div style={{
                background: '#120E0C',
                padding: '1.6rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#0D0A09', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>3</span>
                  <span>Forma de Pago Segura</span>
                </h4>
                <p style={{ fontSize: '0.74rem', color: '#9CA3AF', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                  Aceptamos todos los medios de pago con acreditación instantánea y 0% comisión adicional:
                </p>

                {/* Showcase of Available Payment Methods */}
                <div style={{
                  background: '#161210',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  padding: '1rem 1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  {/* Yape */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #872391 0%, #4E1359 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 900, fontSize: '0.8rem' }}>
                        Y!
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>Yape</div>
                        <div style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>QR en pantalla o código directo desde tu app</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(168, 85, 247, 0.2)', color: '#D8B4FE', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                      Instantáneo
                    </span>
                  </div>

                  {/* Tarjetas */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
                        <CreditCard size={17} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>Tarjetas de Débito y Crédito</div>
                        <div style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>Visa, Mastercard, AMEX, Diners (hasta 12 cuotas)</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.2)', color: '#93C5FD', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                      Sin Recargo
                    </span>
                  </div>

                  {/* Agentes & Bodegas */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFCC00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A1A', fontWeight: 900, fontSize: '0.7rem' }}>
                        CIP
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>Efectivo en Agentes y Bodegas</div>
                        <div style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>PagoEfectivo: BCP, BBVA, Interbank, Tambo, KasNet</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                      En Efectivo
                    </span>
                  </div>

                  {/* Transferencia CIP */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#064E3B', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                        <Zap size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>Banca por Internet / Móvil</div>
                        <div style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>Transferencia bancaria con código CIP oficial</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                      Banca Web
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(212, 175, 55, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  fontSize: '0.74rem',
                  color: '#D4D4D4',
                  lineHeight: 1.45,
                  marginBottom: '1rem'
                }}>
                  ✨ <strong>Acreditación Automática:</strong> Al hacer clic en <em>Continuar al Pago Seguro</em>, se abrirá la pasarela segura donde eliges cómo pagar (Yape, Tarjeta o Efectivo). No necesitas subir comprobantes ni esperar verificaciones manuales.
                </div>

                {/* Error Banner */}
                {paymentError && (
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem', color: '#FCA5A5' }}>
                    ⚠️ {paymentError}
                  </div>
                )}

                {/* Totals Breakdown */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(212, 175, 55, 0.15)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Subtotal:</span>
                    <span>S/ {cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span>Envío ({selectedShipping?.title.split('(')[0]}):</span>
                    <span>{selectedShipping?.price === 0 ? 'GRATIS' : `S/ ${selectedShipping?.price.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                    <span>Total a Pagar:</span>
                    <span>S/ {orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Single Automated Action Button */}
                {(() => {
                  const btn = getButtonConfig();
                  return (
                    <div>
                      <button
                        type="button"
                        onClick={handlePaymentSubmit}
                        disabled={isProcessingPayment || cart.length === 0}
                        style={{
                          width: '100%',
                          padding: '1.05rem',
                          background: btn.gradient,
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.94rem',
                          borderRadius: 'var(--radius-full)',
                          border: `1px solid ${btn.border}`,
                          boxShadow: btn.shadow,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.65rem',
                          cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        {isProcessingPayment ? (
                          <>
                            <span style={{ width: '18px', height: '18px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                            <span>Conectando pasarela segura...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            <span>{btn.label}</span>
                          </>
                        )}
                      </button>

                      <div style={{ fontSize: '0.73rem', color: '#94A3B8', textAlign: 'center', marginTop: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                        <ShieldCheck size={14} style={{ color: '#34D399' }} />
                        <span>Pago 100% seguro con acreditación automática e inmediata</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SUCCESS */}
        {step === 'success' && completedOrder && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '2px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
            }}>
              <CheckCircle size={38} />
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              ¡Orden Confirmada con Éxito!
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginTop: '0.2rem', marginBottom: '0.6rem', fontFamily: 'var(--font-serif)' }}>
              Gracias por tu compra, {completedOrder.customer.name.split(' ')[0]} ✨
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.6rem auto', lineHeight: 1.55 }}>
              Tu código de seguimiento oficial es <strong>#{completedOrder.id}</strong>.
              {completedOrder.shippingMethod.id.includes('chiclayo')
                ? ' Nuestro equipo en Chiclayo ya inició la preparación prioritaria de tu paquete.'
                : ' Te remitiremos el número de guía de Olva/Shalom apenas sea procesado.'}
            </p>

            <div style={{
              background: '#0D0A09',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '1.6rem',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Método de Entrega:</span>
                <strong style={{ color: '#FFFFFF' }}>{completedOrder.shippingMethod.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>DNI / Cliente:</span>
                <strong style={{ color: '#FFFFFF' }}>{completedOrder.customer.dni} • {completedOrder.customer.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Destino:</span>
                <strong style={{ color: '#FFFFFF' }}>
                  {(/retiro/i.test(completedOrder.shippingMethod?.title || '') || completedOrder.shippingMethod?.id === 'salon_pickup')
                    ? `Retiro en Salón (${settings.salonAddress || 'Chiclayo'})`
                    : `${completedOrder.customer.city || ''} (${completedOrder.customer.address || ''})`}
                </strong>
              </div>

              {/* Pago Acreditado Automáticamente */}
              {completedOrder.mercadopagoPaymentId && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(16, 185, 129, 0.4)'
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}>
                    <CheckCircle size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.76rem', color: '#10B981', fontWeight: 800 }}>
                      ✓ Pago Acreditado Automáticamente
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#ECE8E1' }}>
                      ID Transacción Oficial: <strong>#{completedOrder.mercadopagoPaymentId}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginTop: '0.85rem' }}>
                <span>Monto Total:</span>
                <span>S/ {completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleDownloadReceipt(completedOrder)}
                className="btn-luxury-gold"
                style={{ fontSize: '0.85rem', padding: '0.75rem 1.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Download size={16} />
                <span>Descargar Recibo Oficial (PDF)</span>
              </button>

              <button
                onClick={() => openWhatsAppConfirmation(completedOrder)}
                style={{
                  fontSize: '0.85rem',
                  padding: '0.75rem 1.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <MessageCircle size={16} />
                <span>Enviar a WhatsApp</span>
              </button>

              <button
                onClick={handleConfirmAbandon}
                className="btn-luxury-outline"
                style={{ fontSize: '0.85rem', padding: '0.75rem 1.6rem' }}
              >
                <span>Continuar en la Tienda</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
