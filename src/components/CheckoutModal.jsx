import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  X, CheckCircle, ArrowRight, ShieldCheck, Copy, 
  QrCode, ExternalLink, Printer, Check, Zap, Truck, Store, Download, MapPin,
  Camera, UploadCloud, FileText, MessageCircle, AlertCircle
} from 'lucide-react';
import { generateReceiptPDF } from '../utils/receiptGenerator';
import { compressImage } from '../utils/imageCompressor';
import { uploadToSalonAssets } from '../lib/supabase';

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
    if (savedCheckout?.selectedShipping) {
      return savedCheckout.selectedShipping;
    }
    return settings.shippingOptions[0];
  });

  const [paymentMethod, setPaymentMethod] = useState(() => savedCheckout?.paymentMethod || 'yape_direct');
  const [culqiSubMethod, setCulqiSubMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    exp: '',
    cvv: ''
  });
  const [yapeOtp, setYapeOtp] = useState('');
  const [isProcessingCulqi, setIsProcessingCulqi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Voucher / Payment Proof Upload State
  const [paymentProof, setPaymentProof] = useState(() => savedCheckout?.paymentProof || null);
  const [paymentProofName, setPaymentProofName] = useState(() => savedCheckout?.paymentProofName || '');
  const [isUploadingProof, setIsUploadingProof] = useState(false);
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
        paymentMethod,
        paymentProof,
        paymentProofName,
        receiptDownloaded
      }));
    }
  }, [isCheckoutOpen, step, completedOrder, customer, selectedShipping, paymentMethod, paymentProof, paymentProofName, receiptDownloaded]);

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

  // Upload and compress voucher image with structured customer-associated filename
  const handleProofUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsUploadingProof(true);
    try {
      const compressed = await compressImage(file, 1000, 1000, 0.82);
      const cleanName = (customer.name || 'Cliente').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const cleanDni = customer.dni ? `_DNI_${customer.dni.trim()}` : '';
      const timeCode = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const fileName = `COMPROBANTE_${cleanName}${cleanDni}_${timeCode}.jpg`;

      const uploadedUrl = await uploadToSalonAssets(compressed, 'vouchers');
      setPaymentProof(uploadedUrl || compressed);
      setPaymentProofName(fileName);
      showToast("Constancia de pago cargada con éxito");
    } catch (err) {
      console.error(err);
      showToast("Error al procesar la foto de constancia", "error");
    } finally {
      setIsUploadingProof(false);
    }
  };

  // Download PDF Receipt
  const handleDownloadReceipt = (orderObj = null) => {
    const targetOrder = orderObj || completedOrder || {
      id: `SE-PROV-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      items: cart,
      subtotal: cartSubtotal,
      shippingMethod: selectedShipping,
      total: orderTotal,
      paymentMethod,
      paymentProof,
      paymentProofName,
      paymentStatus: paymentProof ? 'comprobante_adjunto' : 'pendiente',
      createdAt: new Date().toISOString()
    };

    generateReceiptPDF(targetOrder, settings);
    setReceiptDownloaded(true);
    showToast("Constancia / Recibo Oficial (PDF) descargado");
  };

  // WhatsApp Message Generator
  const openWhatsAppConfirmation = (orderToConfirm) => {
    const order = orderToConfirm || completedOrder;
    if (!order) return;

    const itemsList = order.items.map(i => `• ${i.quantity}x ${i.name} (S/ ${(i.price * i.quantity).toFixed(2)})`).join('\n');
    const paymentLabel = order.paymentMethod.includes('yape') ? 'YAPE' : (order.paymentMethod.includes('plin') ? 'PLIN' : order.paymentMethod.toUpperCase());
    
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

    const proofLine = order.paymentProofName 
      ? `*Constancia Adjunta:* ${order.paymentProofName} (Cargada en sistema)`
      : `*Constancia:* Adjuntando captura por este chat de WhatsApp`;

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
      proofLine,
      `*Recibo Descargado:* ${receiptDownloaded ? 'Sí (PDF Oficial)' : 'Disponible'}`,
      '',
      `_Hola Salón & Estilo, acabo de registrar mi compra en la web y adjunto mi constancia de pago para validar el despacho._`
    ].filter(line => line !== null).join('\n');

    const cleanPhone = (settings.whatsappContact || '51920731163').replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageLines)}`;
    window.open(waUrl, '_blank');
  };

  const handleDirectPaymentSubmit = (method) => {
    if (!customer.name || !customer.phone) {
      alert("Por favor completa al menos tu nombre y celular para coordinar.");
      return;
    }

    if (!isPickup && (!customer.address || !customer.city)) {
      alert("Por favor ingresa tu ciudad y dirección de entrega.");
      return;
    }

    if (!paymentProof) {
      alert("Por favor adjunta o toma una foto del comprobante de pago para habilitar la confirmación.");
      return;
    }

    const orderData = {
      customer,
      items: cart,
      subtotal: cartSubtotal,
      shippingMethod: selectedShipping,
      total: orderTotal,
      paymentMethod: method,
      paymentProof: paymentProof || null,
      paymentProofName: paymentProofName || null,
      paymentStatus: 'comprobante_adjunto'
    };

    const newOrder = createOrder(orderData);
    setCompletedOrder(newOrder);
    setStep('success');
    triggerConfetti();

    // Persist immediately
    localStorage.setItem('salonestilo_active_checkout', JSON.stringify({
      isOpen: true,
      step: 'success',
      completedOrder: newOrder,
      customer,
      selectedShipping,
      paymentMethod: method,
      paymentProof: paymentProof || null,
      paymentProofName: paymentProofName || null,
      receiptDownloaded
    }));

    // Notification toast: user can now download receipt and send via WhatsApp from success screen
    showToast("¡Pedido registrado! Descarga tu recibo o envíalo a WhatsApp.");
  };

  const handleCulqiSubmit = () => {
    if (!customer.name || !customer.dni || !customer.phone) {
      alert("Por favor completa tus datos personales.");
      return;
    }

    if (culqiSubMethod === 'card' && (!cardData.number || !cardData.cvv || !cardData.exp)) {
      alert("Por favor completa los datos de tu tarjeta.");
      return;
    }

    if (culqiSubMethod === 'yape_otp' && yapeOtp.length < 6) {
      alert("Ingresa el código OTP de 6 dígitos de Yape.");
      return;
    }

    setIsProcessingCulqi(true);

    setTimeout(() => {
      setIsProcessingCulqi(false);
      const orderData = {
        customer,
        items: cart,
        subtotal: cartSubtotal,
        shippingMethod: selectedShipping,
        total: orderTotal,
        paymentMethod: culqiSubMethod === 'card' ? 'culqi_card' : 'culqi_yape',
        paymentStatus: 'pagado',
        culqiTransactionId: `CULQI-TXN-${Date.now().toString().slice(-6)}`,
        paymentProof: paymentProof || null,
        paymentProofName: paymentProofName || null
      };

      const newOrder = createOrder(orderData);
      setCompletedOrder(newOrder);
      setStep('success');
      triggerConfetti();

      localStorage.setItem('salonestilo_active_checkout', JSON.stringify({
        isOpen: true,
        step: 'success',
        completedOrder: newOrder,
        customer,
        selectedShipping,
        paymentMethod: 'culqi',
        paymentProof: paymentProof || null,
        paymentProofName: paymentProofName || null,
        receiptDownloaded
      }));
    }, 1800);
  };

  const handleRequestClose = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmAbandon = () => {
    localStorage.removeItem('salonestilo_active_checkout');
    setStep('form');
    setCompletedOrder(null);
    setPaymentProof(null);
    setPaymentProofName('');
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
                {/* 1. Datos Personales */}
                <div style={{ marginBottom: '1.8rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#0D0A09', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>1</span>
                    <span>Tus Datos de Contacto</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Nombres y Apellidos *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Carolina Reátegui"
                        value={customer.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}
                      />
                    </div>

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
                          style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}
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
                          style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>

                    {/*
                      ===========================================================
                      OPCIÓN DE COMPROBANTE DE PAGO (BOLETA / FACTURA ELECTRÓNICA)
                      Dejado comentado según requerimiento del cliente:
                      "Aún tengo que revisar temas de boletas y facturas, creo que no dar esa opción por ahora, dejarlo comentado"
                      ===========================================================
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Tipo de Comprobante</label>
                        <select style={{ width: '100%', padding: '0.65rem' }}>
                          <option value="boleta">Boleta de Venta</option>
                          <option value="factura">Factura (Requiere RUC y Razón Social)</option>
                        </select>
                      </div>
                    */}
                  </div>
                </div>

                {/* 2. Destino & Método de Entrega */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#0D0A09', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>2</span>
                    <span>Modalidad de Despacho (Chiclayo & Perú)</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
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

                  {/* Dirección solo si NO es recojo en salón */}
                  {!isPickup ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Ciudad de destino *</label>
                          <input
                            type="text"
                            value={customer.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Chiclayo / Lima / Trujillo..."
                            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Distrito / Zona</label>
                          <input
                            type="text"
                            value={customer.district}
                            onChange={(e) => handleInputChange('district', e.target.value)}
                            placeholder="Santa Victoria / La Victoria..."
                            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Dirección exacta o Agencia Shalom *</label>
                        <input
                          type="text"
                          value={customer.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Calle, número, departamento o agencia"
                          style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: 'rgba(229, 192, 123, 0.08)',
                      border: '1px dashed rgba(229, 192, 123, 0.45)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(229, 192, 123, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-gold)',
                        flexShrink: 0
                      }}>
                        <Store size={18} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#ECE8E1', lineHeight: 1.45 }}>
                        <strong style={{ color: 'var(--accent-gold-light)', display: 'block', marginBottom: '0.2rem' }}>
                          Punto de Recojo en Salón de Belleza
                        </strong>
                        {settings.salonAddress || 'Chiclayo, Lambayeque - Perú'}. No requieres ingresar dirección; tu pedido se preparará para recojo inmediato sin costo de despacho.
                      </div>
                    </div>
                  )}
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
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-gold)', color: '#0D0A09', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>3</span>
                  <span>Forma de Pago Local</span>
                </h4>

                {/* Payment Tabs Selector */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.4rem',
                  background: '#1A1412',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  marginBottom: '1.25rem'
                }}>
                  <button
                    onClick={() => setPaymentMethod('yape_direct')}
                    style={{
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      background: paymentMethod === 'yape_direct' ? 'var(--yape-purple)' : 'transparent',
                      color: paymentMethod === 'yape_direct' ? '#FFFFFF' : 'var(--text-muted)',
                      boxShadow: paymentMethod === 'yape_direct' ? '0 0 15px rgba(139, 44, 158, 0.4)' : 'none'
                    }}
                  >
                    YAPE
                  </button>

                  <button
                    onClick={() => setPaymentMethod('plin_direct')}
                    style={{
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      background: paymentMethod === 'plin_direct' ? 'var(--plin-cyan)' : 'transparent',
                      color: paymentMethod === 'plin_direct' ? '#0D0A09' : 'var(--text-muted)',
                      boxShadow: paymentMethod === 'plin_direct' ? '0 0 15px rgba(0, 194, 232, 0.4)' : 'none'
                    }}
                  >
                    PLIN
                  </button>

                  <button
                    onClick={() => setPaymentMethod('culqi')}
                    style={{
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: paymentMethod === 'culqi' ? 'var(--accent-gold)' : 'transparent',
                      color: paymentMethod === 'culqi' ? '#0D0A09' : 'var(--text-muted)',
                      boxShadow: paymentMethod === 'culqi' ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
                    }}
                  >
                    TARJETA
                  </button>
                </div>

                {/* YAPE DIRECT */}
                {paymentMethod === 'yape_direct' && (
                  <div style={{
                    background: '#191412',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(139, 44, 158, 0.4)',
                    marginBottom: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#E9A6F5', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem' }}>
                      <QrCode size={18} />
                      <span>Pago Instantáneo Yape (0% Comisión)</span>
                    </div>

                    <div style={{
                      width: '160px',
                      height: '160px',
                      margin: '0 auto 0.85rem auto',
                      padding: '0.45rem',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 0 20px rgba(139, 44, 158, 0.35)',
                      border: '2px solid var(--yape-purple)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {settings.yapeQrImage ? (
                        <img
                          src={settings.yapeQrImage}
                          alt="Código QR Yape"
                          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
                        />
                      ) : (
                        <>
                          <svg viewBox="0 0 100 100" width="100%" height="85%">
                            <rect width="100" height="100" fill="#FFF" />
                            <rect x="10" y="10" width="30" height="30" fill="#742284" />
                            <rect x="15" y="15" width="20" height="20" fill="#FFF" />
                            <rect x="20" y="20" width="10" height="10" fill="#742284" />
                            <rect x="60" y="10" width="30" height="30" fill="#742284" />
                            <rect x="65" y="15" width="20" height="20" fill="#FFF" />
                            <rect x="70" y="20" width="10" height="10" fill="#742284" />
                            <rect x="10" y="60" width="30" height="30" fill="#742284" />
                            <rect x="15" y="65" width="20" height="20" fill="#FFF" />
                            <rect x="20" y="70" width="10" height="10" fill="#742284" />
                            <rect x="45" y="15" width="8" height="8" fill="#742284" />
                            <rect x="50" y="45" width="12" height="12" fill="#742284" />
                            <rect x="70" y="65" width="15" height="15" fill="#742284" />
                          </svg>
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--yape-purple)' }}>
                            YAPE S/ {orderTotal.toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#FFFFFF', marginBottom: '0.25rem' }}>
                      Número: <strong>{settings.yapePhone}</strong>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                      Titular: <strong>{settings.yapeOwner}</strong>
                    </div>

                    <button
                      onClick={() => copyPhoneNumber(settings.yapePhone)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(139, 44, 158, 0.2)',
                        color: '#E9A6F5',
                        border: '1px solid rgba(139, 44, 158, 0.4)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '0.75rem'
                      }}
                    >
                      {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedPhone ? '¡Copiado!' : 'Copiar número'}</span>
                    </button>
                  </div>
                )}

                {/* PLIN DIRECT */}
                {paymentMethod === 'plin_direct' && (
                  <div style={{
                    background: '#191412',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(0, 194, 232, 0.4)',
                    marginBottom: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--plin-cyan)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem' }}>
                      <QrCode size={18} />
                      <span>Pago Instantáneo Plin (Interbank, BBVA, Scotiabank)</span>
                    </div>

                    <div style={{
                      width: '160px',
                      height: '160px',
                      margin: '0 auto 0.85rem auto',
                      padding: '0.45rem',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 0 20px rgba(0, 194, 232, 0.35)',
                      border: '2px solid var(--plin-cyan)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {settings.plinQrImage ? (
                        <img
                          src={settings.plinQrImage}
                          alt="Código QR Plin"
                          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
                        />
                      ) : (
                        <>
                          <svg viewBox="0 0 100 100" width="100%" height="85%">
                            <rect width="100" height="100" fill="#FFF" />
                            <rect x="10" y="10" width="30" height="30" fill="#00B4D8" />
                            <rect x="15" y="15" width="20" height="20" fill="#FFF" />
                            <rect x="20" y="20" width="10" height="10" fill="#00B4D8" />
                            <rect x="60" y="10" width="30" height="30" fill="#00B4D8" />
                            <rect x="65" y="15" width="20" height="20" fill="#FFF" />
                            <rect x="70" y="20" width="10" height="10" fill="#00B4D8" />
                            <rect x="10" y="60" width="30" height="30" fill="#00B4D8" />
                            <rect x="15" y="65" width="20" height="20" fill="#FFF" />
                            <rect x="20" y="70" width="10" height="10" fill="#00B4D8" />
                            <rect x="45" y="25" width="10" height="10" fill="#00B4D8" />
                            <rect x="55" y="55" width="12" height="12" fill="#00B4D8" />
                          </svg>
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--plin-cyan)' }}>
                            PLIN S/ {orderTotal.toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#FFFFFF', marginBottom: '0.25rem' }}>
                      Número: <strong>{settings.plinPhone}</strong>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                      Titular: <strong>{settings.plinOwner}</strong>
                    </div>

                    <button
                      onClick={() => copyPhoneNumber(settings.plinPhone)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(0, 194, 232, 0.15)',
                        color: 'var(--plin-cyan)',
                        border: '1px solid rgba(0, 194, 232, 0.4)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '0.75rem'
                      }}
                    >
                      {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedPhone ? '¡Copiado!' : 'Copiar número'}</span>
                    </button>
                  </div>
                )}

                {/* CULQI */}
                {paymentMethod === 'culqi' && (
                  <div style={{
                    background: '#191412',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                        Pasarela Culqi Perú
                      </span>
                      <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                        256-bit SSL
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <button
                        onClick={() => setCulqiSubMethod('card')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          border: culqiSubMethod === 'card' ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                          background: culqiSubMethod === 'card' ? 'rgba(212, 175, 55, 0.15)' : '#0D0A09',
                          color: culqiSubMethod === 'card' ? '#FFFFFF' : 'var(--text-muted)'
                        }}
                      >
                        💳 Tarjetas Perú
                      </button>
                      <button
                        onClick={() => setCulqiSubMethod('yape_otp')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          border: culqiSubMethod === 'yape_otp' ? '1px solid var(--yape-purple)' : '1px solid rgba(255,255,255,0.1)',
                          background: culqiSubMethod === 'yape_otp' ? 'rgba(139, 44, 158, 0.2)' : '#0D0A09',
                          color: culqiSubMethod === 'yape_otp' ? '#E9A6F5' : 'var(--text-muted)'
                        }}
                      >
                        📱 Yape con Código
                      </button>
                    </div>

                    {culqiSubMethod === 'card' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Número de Tarjeta</label>
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="4557 •••• •••• 8912"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vencimiento (MM/AA)</label>
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="12/28"
                              value={cardData.exp}
                              onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                              style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="•••"
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                              style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          En tu app Yape pulsa <em>"Código de aprobación"</em> y escribe el número de 6 dígitos:
                        </p>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="849201"
                          value={yapeOtp}
                          onChange={(e) => setYapeOtp(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.65rem',
                            textAlign: 'center',
                            letterSpacing: '0.25em',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            border: '2px solid var(--yape-purple)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ADJUNTAR CONSTANCIA DE PAGO (CÁMARA / GALERÍA) */}
                <div style={{
                  background: '#191412',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentProof ? '1px solid rgba(52, 211, 153, 0.45)' : '1px dashed rgba(212, 175, 55, 0.35)',
                  marginBottom: '1.25rem',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: paymentProof ? '#34D399' : 'var(--accent-gold-light)', fontWeight: 700, fontSize: '0.85rem' }}>
                      <UploadCloud size={17} />
                      <span>{paymentProof ? 'Constancia Adjuntada en el Sistema' : 'Adjuntar Constancia o Captura de Pago'}</span>
                    </div>
                    {paymentProof && (
                      <span style={{ fontSize: '0.68rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                        ✓ Listo
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                    Sube una foto o captura de tu pago Yape/Plin (desde tu cámara o galería). Se asociará a tus datos y podrás descargar tu constancia.
                  </p>

                  {!paymentProof ? (
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--accent-gold-light)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}>
                      <Camera size={16} />
                      <span>{isUploadingProof ? 'Comprimiendo y cargando...' : 'Tomar Foto o Seleccionar de Galería'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofUpload}
                        disabled={isUploadingProof}
                        style={{ display: 'none' }}
                      />
                    </label>
                  ) : (
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        background: '#0D0A09',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        marginBottom: '0.75rem'
                      }}>
                        <img
                          src={paymentProof}
                          alt="Constancia de Pago"
                          style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {paymentProofName}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                            <Check size={12} />
                            <span>Voucher verificado y comprimido</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentProof(null);
                            setPaymentProofName('');
                            setReceiptDownloaded(false);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#F87171',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Eliminar o cambiar foto"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Botón Habilitado para Descargar Constancia / Recibo en PDF tras adjuntar */}
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt()}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(212, 175, 55, 0.15)',
                          border: '1px solid var(--accent-gold)',
                          color: 'var(--accent-gold-light)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Download size={15} />
                        <span>{receiptDownloaded ? '✓ Recibo / Constancia Oficial Descargada' : 'Descargar Constancia Oficial (PDF)'}</span>
                      </button>
                    </div>
                  )}
                </div>

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

                {/* Final Button */}
                {paymentMethod === 'culqi' ? (
                  <button
                    onClick={handleCulqiSubmit}
                    disabled={isProcessingCulqi}
                    className="btn-luxury-gold"
                    style={{ width: '100%', padding: '1rem', fontSize: '0.88rem' }}
                  >
                    {isProcessingCulqi ? 'Conectando con Culqi...' : `Pagar S/ ${orderTotal.toFixed(2)} con Culqi`}
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <button
                      onClick={() => handleDirectPaymentSubmit(paymentMethod)}
                      disabled={!paymentProof || isUploadingProof}
                      style={{
                        width: '100%',
                        padding: '1.05rem',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        borderRadius: 'var(--radius-full)',
                        color: !paymentProof ? 'rgba(255, 255, 255, 0.55)' : (paymentMethod === 'yape_direct' ? '#FFFFFF' : '#0D0A09'),
                        background: !paymentProof 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : (paymentMethod === 'yape_direct' 
                              ? 'linear-gradient(135deg, #A033B6 0%, #8B2C9E 100%)' 
                              : 'linear-gradient(135deg, #38BDF8 0%, #00C2E8 100%)'),
                        boxShadow: !paymentProof 
                          ? 'none' 
                          : (paymentMethod === 'yape_direct'
                              ? '0 6px 25px rgba(139, 44, 158, 0.45)'
                              : '0 6px 25px rgba(0, 194, 232, 0.45)'),
                        cursor: !paymentProof ? 'not-allowed' : 'pointer',
                        border: !paymentProof ? '1px dashed rgba(255, 255, 255, 0.25)' : 'none',
                        opacity: !paymentProof ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.65rem',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <CheckCircle size={18} />
                      <span>
                        {paymentProof 
                          ? 'Confirmar Pedido' 
                          : 'Adjunta tu comprobante para confirmar pedido'}
                      </span>
                    </button>

                    {!paymentProof && (
                      <p style={{
                        fontSize: '0.74rem',
                        color: 'var(--accent-gold-light)',
                        textAlign: 'center',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.2rem 0'
                      }}>
                        <AlertCircle size={14} style={{ color: 'var(--accent-gold)' }} />
                        <span>Sube o toma la foto de tu constancia de pago para habilitar la confirmación.</span>
                      </p>
                    )}
                  </div>
                )}
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

              {/* Constancia Adjunta en la Orden */}
              {completedOrder.paymentProof && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  background: '#161210',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(52, 211, 153, 0.3)'
                }}>
                  <img
                    src={completedOrder.paymentProof}
                    alt="Constancia Adjunta"
                    style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 700 }}>
                      ✓ Constancia de Pago Vinculada
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {completedOrder.paymentProofName || 'Voucher Registrado'}
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
