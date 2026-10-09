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
    cartRawSubtotal,
    memberDiscountAmount,
    memberDiscountPercent,
    currentUser,
    settings,
    createOrder,
    showToast,
    setActiveMainTab,
    setQuickViewProduct
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

  // Filtrar Olva Courier y garantizar que Retiro en Salón sea siempre la primera opción (#1)
  const availableShippingOptions = (settings.shippingOptions || [])
    .filter(opt => opt && opt.id !== 'olva_peru' && !/olva/i.test(opt.title || ''))
    .sort((a, b) => {
      const isPickupA = a.id === 'salon_pickup' || /retiro/i.test(a.title || '');
      const isPickupB = b.id === 'salon_pickup' || /retiro/i.test(b.title || '');
      if (isPickupA && !isPickupB) return -1;
      if (!isPickupA && isPickupB) return 1;
      return 0;
    });

  const [selectedShipping, setSelectedShipping] = useState(() => {
    // Por defecto 'Retiro en Salón de Belleza (Gratis)' como primera opción
    const pickupOption = availableShippingOptions.find(o => o.id === 'salon_pickup' || /retiro/i.test(o.title || ''));
    return pickupOption || availableShippingOptions[0] || {
      id: "salon_pickup",
      title: "Retiro en Salón de Belleza (Gratis)",
      price: 0,
      description: "Visítanos en nuestro salón y recoge tu pedido sin costo de envío"
    };
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
    let cleanVal = value;
    if (field === 'phone') {
      cleanVal = value.replace(/\D/g, '');
    }
    setCustomer(prev => ({ ...prev, [field]: cleanVal }));
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
    if (!customer.phone || customer.phone.replace(/\D/g, '').length === 0) {
      errors.phone = "Por favor ingresa tu número de celular (solo números)";
    }
    // DNI y dirección SOLO cuando es para despacho / envío a domicilio o agencia
    if (!isPickup) {
      if (!customer.dni || customer.dni.trim().length < 6) {
        errors.dni = "Por favor ingresa tu DNI o CE para el despacho";
      }
      if (!customer.city || customer.city.trim().length < 2) {
        errors.city = "Por favor ingresa tu ciudad de destino";
      }
      if (!customer.address || customer.address.trim().length < 3) {
        errors.address = "Por favor ingresa tu dirección exacta o agencia Shalom";
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
          maxWidth: step === 'success' ? '560px' : '960px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 175, 55, 0.15)',
          border: '1px solid var(--accent-gold-border)',
          position: 'relative',
          padding: '1.25rem 1.6rem'
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

        {/* STEP 1: ULTRA-CLEAN ZERO-SCROLL FORM */}
        {step === 'form' && (
          <div>
            {/* Compact Header */}
            <div style={{
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
              paddingBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Checkout Express • Salón & Estilo
                </span>
                <h2 style={{ fontSize: '1.35rem', color: '#FFFFFF', margin: '0.1rem 0 0 0', fontFamily: 'var(--font-serif)' }}>
                  Finalizar Compra
                </h2>
              </div>

              {currentUser ? (
                <span style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  color: 'var(--accent-gold-light)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Sparkles size={12} />
                  <span>Club VIP: {currentUser.name.split(' ')[0]} (-{currentUser.discountPercent || settings.memberDiscountPercent || 10}%)</span>
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold-light)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={13} style={{ color: '#10B981' }} />
                  <span>Acreditación Automática con Mercado Pago</span>
                </span>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Left Column: Entrega & Datos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {/* 1. Modalidad de Despacho (Retiro en Salón #1) */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                    <Truck size={13} style={{ color: 'var(--accent-gold)' }} />
                    <span>1. Modalidad de Entrega</span>
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {availableShippingOptions.map((opt) => {
                      const isSel = selectedShipping?.id === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedShipping(opt)}
                          style={{
                            padding: '0.55rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSel ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: isSel ? 'rgba(212, 175, 55, 0.12)' : '#161210',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              border: isSel ? '4px solid var(--accent-gold)' : '2px solid rgba(255,255,255,0.25)',
                              background: '#0D0A09'
                            }} />
                            <div style={{ fontSize: '0.8rem', fontWeight: isSel ? 700 : 500, color: '#FFFFFF' }}>
                              {opt.title}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                            {opt.price === 0 ? 'GRATIS' : `S/ ${opt.price.toFixed(2)}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {isPickup && (
                    <div style={{
                      marginTop: '0.4rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-xs)',
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1px dashed rgba(212, 175, 55, 0.3)',
                      fontSize: '0.72rem',
                      color: '#E5E5E5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}>
                      <Store size={14} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                      <span>{settings.salonAddress || 'Av. Rivera del Mar / Calle San Martín, Chiclayo'}. ¡Listo de inmediato!</span>
                    </div>
                  )}
                </div>

                {/* 2. Tus Datos de Contacto */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                    <User size={13} style={{ color: 'var(--accent-gold)' }} />
                    <span>2. Datos de Contacto {isPickup ? '(Sin DNI)' : '(Para Despacho)'}</span>
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                    <div>
                      <input
                        type="text"
                        placeholder="Nombres y Apellidos *"
                        value={customer.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                          border: validationErrors.name ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                          background: validationErrors.name ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                          color: '#FFFFFF'
                        }}
                      />
                      {validationErrors.name && (
                        <span style={{ fontSize: '0.68rem', color: '#EF4444', display: 'block', marginTop: '0.15rem' }}>⚠️ {validationErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Celular / WhatsApp *"
                        value={customer.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                          border: validationErrors.phone ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                          background: validationErrors.phone ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                          color: '#FFFFFF'
                        }}
                      />
                      {validationErrors.phone && (
                        <span style={{ fontSize: '0.68rem', color: '#EF4444', display: 'block', marginTop: '0.15rem' }}>⚠️ {validationErrors.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Campos de envío SOLO si no es recojo */}
                  {!isPickup && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.55rem', paddingTop: '0.55rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                        <div>
                          <input
                            type="text"
                            placeholder="DNI o CE * (Para Courier)"
                            value={customer.dni}
                            onChange={(e) => handleInputChange('dni', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.82rem',
                              border: validationErrors.dni ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                              background: validationErrors.dni ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                              color: '#FFFFFF'
                            }}
                          />
                          {validationErrors.dni && (
                            <span style={{ fontSize: '0.68rem', color: '#EF4444', display: 'block' }}>⚠️ {validationErrors.dni}</span>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Ciudad de Destino *"
                            value={customer.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.82rem',
                              border: validationErrors.city ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                              background: validationErrors.city ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                              color: '#FFFFFF'
                            }}
                          />
                          {validationErrors.city && (
                            <span style={{ fontSize: '0.68rem', color: '#EF4444', display: 'block' }}>⚠️ {validationErrors.city}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Dirección exacta o Agencia Shalom *"
                          value={customer.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem',
                            border: validationErrors.address ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.15)',
                            background: validationErrors.address ? 'rgba(239, 68, 68, 0.08)' : '#161210',
                            color: '#FFFFFF'
                          }}
                        />
                        {validationErrors.address && (
                          <span style={{ fontSize: '0.68rem', color: '#EF4444', display: 'block' }}>⚠️ {validationErrors.address}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Tu Pedido, Desglose & Pago Seguro */}
              <div style={{
                background: '#120E0C',
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                {/* 1. Resumen de Productos con Link a Detalles */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Tu Pedido ({cart.length})
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Clic para ver detalles</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '135px', overflowY: 'auto', paddingRight: '0.2rem' }}>
                    {cart.map((item, idx) => {
                      const itemImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : (item.image || '');
                      return (
                        <div
                          key={`${item.id}-${idx}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            padding: '0.35rem 0.5rem',
                            borderRadius: 'var(--radius-xs)',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                            {itemImg ? (
                              <img src={itemImg} alt={item.name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#25201E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>📦</div>
                            )}
                            <button
                              type="button"
                              onClick={() => setQuickViewProduct(item)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                textAlign: 'left',
                                color: '#FFFFFF',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                textDecorationColor: 'rgba(212, 175, 55, 0.4)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '160px'
                              }}
                              title="Ver detalles completos del producto"
                            >
                              <span>{item.quantity}x {item.name}</span>
                            </button>
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold-light)', flexShrink: 0 }}>
                            S/ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Medios de Pago Disponibles (Fila Compacta) */}
                <div style={{
                  padding: '0.45rem 0.65rem',
                  background: '#161210',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.35rem'
                }}>
                  <span style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600 }}>Aceptamos:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.66rem', background: '#872391', color: '#FFF', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>YAPE</span>
                    <span style={{ fontSize: '0.66rem', background: '#1E293B', color: '#93C5FD', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>TARJETAS</span>
                    <span style={{ fontSize: '0.66rem', background: '#FFCC00', color: '#000', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>EFECTIVO CIP</span>
                    <span style={{ fontSize: '0.66rem', background: '#064E3B', color: '#6EE7B7', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>BANCA WEB</span>
                  </div>
                </div>

                {/* Error Banner si existe */}
                {paymentError && (
                  <div style={{ marginBottom: '0.65rem', padding: '0.55rem 0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-xs)', fontSize: '0.74rem', color: '#FCA5A5' }}>
                    ⚠️ {paymentError}
                  </div>
                )}

                {/* 3. Totales & Descuentos */}
                <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.15)', paddingTop: '0.65rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>Subtotal:</span>
                    <span>S/ {cartRawSubtotal.toFixed(2)}</span>
                  </div>

                  {memberDiscountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
                      <span>💎 Descuento Club VIP (-{memberDiscountPercent}%):</span>
                      <span style={{ fontWeight: 700 }}>-S/ {memberDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>Despacho:</span>
                    <span style={{ color: selectedShipping?.price === 0 ? 'var(--accent-gold)' : '#FFFFFF', fontWeight: 600 }}>
                      {selectedShipping?.price === 0 ? 'GRATIS' : `S/ ${selectedShipping?.price.toFixed(2)}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>Total a Pagar:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                      S/ {orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 4. Botón de Pago Principal */}
                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={isProcessingPayment || cart.length === 0}
                  className="btn-luxury-gold"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
                    cursor: isProcessingPayment ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isProcessingPayment ? (
                    <>
                      <span style={{ width: '16px', height: '16px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                      <span>Conectando pasarela segura...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={17} />
                      <span>Continuar al Pago Seguro • S/ {orderTotal.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <div style={{ fontSize: '0.68rem', color: '#94A3B8', textAlign: 'center', marginTop: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={13} style={{ color: '#34D399' }} />
                  <span>Pago oficial encriptado con Mercado Pago • Acreditación instantánea</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ZERO-SCROLL SUCCESS SCREEN */}
        {step === 'success' && completedOrder && (
          <div style={{ textAlign: 'center', padding: '0.4rem 0' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '2px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem auto',
              boxShadow: '0 0 25px rgba(212, 175, 55, 0.3)'
            }}>
              <CheckCircle size={24} />
            </div>

            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              ¡Orden Confirmada con Éxito!
            </span>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginTop: '0.1rem', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
              Gracias por tu compra, {completedOrder.customer.name.split(' ')[0]} ✨
            </h2>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 0.75rem auto', lineHeight: 1.45 }}>
              Código de seguimiento: <strong style={{ color: 'var(--accent-gold-light)' }}>#{completedOrder.id}</strong>.
              {completedOrder.shippingMethod.id.includes('chiclayo') || isPickup
                ? ' Prepararemos tu pedido inmediatamente en nuestro salón de Chiclayo.'
                : ' Te remitiremos el número de guía de Shalom apenas sea procesado.'}
            </p>

            <div style={{
              background: '#0D0A09',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              textAlign: 'left',
              marginBottom: '0.9rem',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Entrega:</span>
                <strong style={{ color: '#FFFFFF' }}>{completedOrder.shippingMethod.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cliente:</span>
                <strong style={{ color: '#FFFFFF' }}>{completedOrder.customer.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Destino:</span>
                <strong style={{ color: '#FFFFFF' }}>
                  {(/retiro/i.test(completedOrder.shippingMethod?.title || '') || completedOrder.shippingMethod?.id === 'salon_pickup')
                    ? `Retiro en Salón (${settings.salonAddress || 'Chiclayo'})`
                    : `${completedOrder.customer.city || ''} (${completedOrder.customer.address || ''})`}
                </strong>
              </div>

              {/* Lista de productos comprados */}
              <div style={{
                margin: '0.45rem 0',
                padding: '0.45rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '85px', overflowY: 'auto' }}>
                  {(completedOrder.items || []).map((it, idx) => {
                    const itImg = Array.isArray(it.images) && it.images.length > 0 ? it.images[0] : (it.image || '');
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                          {itImg ? (
                            <img src={itImg} alt={it.name} style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#25201E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>📦</div>
                          )}
                          <button
                            type="button"
                            onClick={() => setQuickViewProduct(it)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              color: '#FFFFFF',
                              textDecoration: 'underline',
                              textDecorationColor: 'rgba(212, 175, 55, 0.45)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              maxWidth: '220px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Ver detalles"
                          >
                            <span>{it.quantity}x {it.name}</span>
                            <ExternalLink size={10} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                          </button>
                        </div>
                        <span style={{ color: 'var(--accent-gold-light)', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                          S/ {((it.price || 0) * (it.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pago Acreditado Automáticamente */}
              {completedOrder.mercadopagoPaymentId && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  marginTop: '0.45rem',
                  padding: '0.4rem 0.65rem',
                  background: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid rgba(16, 185, 129, 0.4)'
                }}>
                  <CheckCircle size={15} style={{ color: '#10B981', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, fontSize: '0.72rem' }}>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>✓ Pago Acreditado Automáticamente</span>
                    <span style={{ color: '#ECE8E1', marginLeft: '0.35rem' }}>ID #{completedOrder.mercadopagoPaymentId}</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-gold-light)', marginTop: '0.5rem' }}>
                <span>Monto Total:</span>
                <span>S/ {completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleDownloadReceipt(completedOrder)}
                className="btn-luxury-gold"
                style={{ fontSize: '0.78rem', padding: '0.55rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Download size={14} />
                <span>Descargar Recibo (PDF)</span>
              </button>

              <button
                onClick={() => openWhatsAppConfirmation(completedOrder)}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 3px 12px rgba(37, 211, 102, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <MessageCircle size={14} />
                <span>Enviar a WhatsApp</span>
              </button>

              <button
                onClick={handleConfirmAbandon}
                className="btn-luxury-outline"
                style={{ fontSize: '0.78rem', padding: '0.55rem 1.15rem' }}
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
