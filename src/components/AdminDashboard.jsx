import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Package, ShoppingCart, Settings, Plus, Edit2, Trash2, 
  DollarSign, TrendingUp, Phone, BookOpen, X, Upload, Image as ImageIcon, 
  Lock, KeyRound, Truck, Eye, EyeOff, Scissors, RotateCcw, Clock, Sparkles, QrCode,
  Download, Database, ShieldCheck
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import { uploadToSalonAssets } from '../lib/supabase';

export const AdminDashboard = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    services,
    addService,
    updateService,
    deleteService,
    comparisonCases,
    updateComparisonCase,
    orders,
    updateOrderStatus,
    resetMetrics,
    settings,
    updateSettings,
    complaints,
    setIsAdminView,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('products');
  
  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: '',
    category: 'Skincare',
    keywordsText: '',
    price: '',
    originalPrice: '',
    stock: '',
    volume: '30 ml',
    isBestseller: false,
    isNew: true,
    description: '',
    benefitsText: '',
    imageUrl: ''
  });

  // Service Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Colorimetría',
    duration: '2 - 3 horas',
    priceFrom: '',
    description: '',
    includesText: '',
    image: ''
  });

  // Comparison Cases Modal State (Antes y Después)
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [editingComparisonCase, setEditingComparisonCase] = useState(null);
  const [comparisonForm, setComparisonForm] = useState({
    id: '',
    title: '',
    serviceCategory: '',
    duration: '',
    stat: '',
    beforeLabel: '',
    beforeDesc: '',
    beforeImage: '',
    afterLabel: '',
    afterDesc: '',
    afterImage: ''
  });

  const [settingsForm, setSettingsForm] = useState(settings);
  const [showPassword, setShowPassword] = useState(false);

  // Sync form when settings change from Supabase or another device
  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  // Compression & Storage Handlers (Persists to Supabase Storage with base64 fallback)
  const handleProductImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 900, 900, 0.8);
        const uploadedUrl = await uploadToSalonAssets(compressed, 'products');
        setProductForm(prev => ({ ...prev, imageUrl: uploadedUrl || compressed }));
        showToast("Imagen de producto cargada con éxito");
      } catch (err) {
        showToast("Error al procesar imagen de producto", "error");
      }
    }
  };

  const handleServiceImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 900, 900, 0.8);
        const uploadedUrl = await uploadToSalonAssets(compressed, 'services');
        setServiceForm(prev => ({ ...prev, image: uploadedUrl || compressed }));
        showToast("Imagen de servicio cargada con éxito");
      } catch (err) {
        showToast("Error al procesar imagen de servicio", "error");
      }
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        showToast("Subiendo logotipo a la nube...", "info");
        const compressed = await compressImage(file, 400, 400, 0.85);
        const uploadedUrl = await uploadToSalonAssets(compressed, 'logos');
        setSettingsForm(prev => ({ ...prev, logoUrl: uploadedUrl || compressed }));
        showToast("Logotipo listo. Haz clic en 'Guardar Cambios' para sincronizar con todos los dispositivos");
      } catch (err) {
        console.error(err);
        showToast("Error al procesar logotipo", "error");
      }
    }
  };

  const handleYapeQrUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 600, 0.85);
        const uploadedUrl = await uploadToSalonAssets(compressed, 'qr');
        setSettingsForm(prev => ({ ...prev, yapeQrImage: uploadedUrl || compressed }));
        showToast("Código QR de Yape cargado con éxito");
      } catch (err) {
        showToast("Error al procesar QR de Yape", "error");
      }
    }
  };

  const handlePlinQrUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 600, 0.85);
        const uploadedUrl = await uploadToSalonAssets(compressed, 'qr');
        setSettingsForm(prev => ({ ...prev, plinQrImage: uploadedUrl || compressed }));
        showToast("Código QR de Plin cargado con éxito");
      } catch (err) {
        showToast("Error al procesar QR de Plin", "error");
      }
    }
  };

  const handleBeforeImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1000, 1000, 0.82);
        const uploadedUrl = await uploadToSalonAssets(compressed, 'comparisons');
        setComparisonForm(prev => ({ ...prev, beforeImage: uploadedUrl || compressed }));
        showToast("Foto 'Antes' cargada con éxito");
      } catch (err) {
        showToast("Error al procesar imagen", "error");
      }
    }
  };

  const handleAfterImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1000, 1000, 0.82);
        const uploadedUrl = await uploadToSalonAssets(compressed, 'comparisons');
        setComparisonForm(prev => ({ ...prev, afterImage: uploadedUrl || compressed }));
        showToast("Foto 'Después' cargada con éxito");
      } catch (err) {
        showToast("Error al procesar imagen", "error");
      }
    }
  };

  const handleOpenEditComparison = (caseItem) => {
    setEditingComparisonCase(caseItem);
    setComparisonForm({
      id: caseItem.id,
      title: caseItem.title || '',
      serviceCategory: caseItem.serviceCategory || '',
      duration: caseItem.duration || '',
      stat: caseItem.stat || '',
      beforeLabel: caseItem.beforeLabel || '',
      beforeDesc: caseItem.beforeDesc || '',
      beforeImage: caseItem.beforeImage || '',
      afterLabel: caseItem.afterLabel || '',
      afterDesc: caseItem.afterDesc || '',
      afterImage: caseItem.afterImage || ''
    });
    setComparisonModalOpen(true);
  };

  const handleSaveComparison = (e) => {
    e.preventDefault();
    if (!editingComparisonCase) return;
    updateComparisonCase(editingComparisonCase.id, comparisonForm);
    setComparisonModalOpen(false);
  };

  // Metrics
  const totalSales = orders
    .filter(o => o.paymentStatus !== 'cancelado')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.paymentStatus === 'pendiente').length;
  const averageTicket = orders.length > 0 ? (totalSales / orders.length) : 0;

  // PRODUCT ACTIONS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      subtitle: '',
      category: 'Skincare',
      keywordsText: 'belleza, cuidado, cabello, rostro, nutrición',
      price: '',
      originalPrice: '',
      stock: '20',
      volume: '30 ml',
      isBestseller: false,
      isNew: true,
      description: '',
      benefitsText: 'Control de luminosidad y cuidado facial\nTextura ligera de rápida absorción\nIdeal para todo tipo de clima y piel',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      subtitle: product.subtitle || '',
      category: product.category,
      keywordsText: product.keywords ? product.keywords.join(', ') : '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      stock: product.stock.toString(),
      volume: product.volume || '30 ml',
      isBestseller: product.isBestseller || false,
      isNew: product.isNew || false,
      description: product.description,
      benefitsText: product.benefits ? product.benefits.join('\n') : '',
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : ''
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const keywordsList = productForm.keywordsText
      ? productForm.keywordsText.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    const productPayload = {
      name: productForm.name,
      subtitle: productForm.subtitle,
      category: productForm.category,
      keywords: keywordsList,
      price: parseFloat(productForm.price) || 0,
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
      stock: parseInt(productForm.stock, 10) || 0,
      volume: productForm.volume,
      isBestseller: productForm.isBestseller,
      isNew: productForm.isNew,
      description: productForm.description,
      benefits: productForm.benefitsText.split('\n').filter(b => b.trim() !== ''),
      images: [productForm.imageUrl]
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productPayload });
    } else {
      addProduct(productPayload);
    }
    setProductModalOpen(false);
  };

  // SERVICE ACTIONS
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      category: 'Colorimetría',
      duration: '2.5 - 3 horas',
      priceFrom: '150.00',
      description: '',
      includesText: 'Diagnóstico capilar previo personalizado\nLavado purificante y nutrición profunda\nBrushing de finalizado glam',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      duration: service.duration,
      priceFrom: service.priceFrom.toString(),
      description: service.description,
      includesText: service.includes ? service.includes.join('\n') : '',
      image: service.image || ''
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    const servicePayload = {
      name: serviceForm.name,
      category: serviceForm.category,
      duration: serviceForm.duration,
      priceFrom: parseFloat(serviceForm.priceFrom) || 0,
      description: serviceForm.description,
      includes: serviceForm.includesText.split('\n').filter(i => i.trim() !== ''),
      image: serviceForm.image
    };

    if (editingService) {
      updateService({ ...editingService, ...servicePayload });
    } else {
      addService(servicePayload);
    }
    setServiceModalOpen(false);
  };

  // SETTINGS ACTIONS
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const currentOptions = settingsForm.shippingOptions || settings.shippingOptions || [];
    const updatedShippingOptions = currentOptions.map(opt => {
      if (opt.id === 'pimentel_chiclayo_express') {
        return {
          ...opt,
          deliveryTime: settingsForm.expressTime || opt.deliveryTime,
          price: settingsForm.expressPrice !== undefined ? parseFloat(settingsForm.expressPrice) : opt.price
        };
      }
      if (opt.id === 'olva_peru') {
        return {
          ...opt,
          deliveryTime: settingsForm.olvaTime || opt.deliveryTime,
          price: settingsForm.olvaPrice !== undefined ? parseFloat(settingsForm.olvaPrice) : opt.price
        };
      }
      if (opt.id === 'shalom_peru') {
        return {
          ...opt,
          deliveryTime: settingsForm.shalomTime || opt.deliveryTime,
          price: settingsForm.shalomPrice !== undefined ? parseFloat(settingsForm.shalomPrice) : opt.price
        };
      }
      return opt;
    });

    const payload = {
      ...settingsForm,
      shippingOptions: updatedShippingOptions
    };
    updateSettings(payload);
  };

  // LOCAL BACKUP & RESTORE ACTIONS
  const handleExportBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        version: '2.5.0',
        meta: {
          storeName: settingsForm.storeName || settings.storeName || 'Salón & Estilo',
          salonAddress: settingsForm.salonAddress || settings.salonAddress || 'Chiclayo, Perú',
        },
        settings: settingsForm || settings,
        products,
        services,
        comparisonCases,
        orders,
        complaints
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `backup_salon_estilo_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Copia de seguridad descargada exitosamente");
    } catch (err) {
      console.error(err);
      showToast("Error al generar copia de seguridad", "error");
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.settings) {
          updateSettings(parsed.settings);
          setSettingsForm(parsed.settings);
          showToast("Ajustes restaurados y sincronizados en la nube");
        } else {
          showToast("El archivo no contiene un formato de respaldo válido", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Error al procesar archivo de respaldo", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="admin-dashboard-root" style={{ minHeight: '90vh', background: 'var(--bg-canvas)' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          paddingBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              Gestión Integral • Salón & Estilo
            </span>
            <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginTop: '0.2rem', fontFamily: 'var(--font-serif)' }}>
              Panel de Control Administrativo
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Gestiona el catálogo de productos y servicios, casos de antes y después, pedidos, logo de la empresa y credenciales.
            </p>
          </div>

          <button
            onClick={() => setIsAdminView(false)}
            className="btn-luxury-outline"
            style={{ fontSize: '0.8rem', padding: '0.7rem 1.6rem' }}
          >
            ← Volver al Portal Público
          </button>
        </div>

        {/* Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1rem'
        }}>
          <div style={{ background: '#161210', padding: '1.6rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              <span>Ventas Acumuladas</span>
              <DollarSign size={18} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
              S/ {totalSales.toFixed(2)}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 600 }}>En Soles Peruanos</span>
          </div>

          <div style={{ background: '#161210', padding: '1.6rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              <span>Pedidos Totales</span>
              <ShoppingCart size={18} style={{ color: 'var(--yape-purple)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FFFFFF' }}>
              {orders.length}
            </div>
            <span style={{ fontSize: '0.72rem', color: pendingOrders > 0 ? '#FBBF24' : '#34D399', fontWeight: 600 }}>
              {pendingOrders} órdenes pendientes
            </span>
          </div>

          <div style={{ background: '#161210', padding: '1.6rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              <span>Ticket Promedio</span>
              <TrendingUp size={18} style={{ color: 'var(--plin-cyan)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FFFFFF' }}>
              S/ {averageTicket.toFixed(2)}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Por cliente</span>
          </div>

          <div style={{ background: '#161210', padding: '1.6rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              <span>Catálogo Activo</span>
              <Package size={18} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
              {products.length} prod. / {services.length} serv.
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Salón & Estilo</span>
          </div>
        </div>

        {/* Reset Indicators Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Estás seguro de restablecer los indicadores a cero? Esto vaciará las órdenes y métricas de prueba.")) {
                resetMetrics();
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: '#1F1513',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <RotateCcw size={13} />
            <span>Restablecer Indicadores a Cero (Reset)</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid rgba(212, 175, 55, 0.15)',
          marginBottom: '2rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'products', label: `Productos (${products.length})`, icon: <Package size={16} /> },
            { id: 'services', label: `Servicios del Salón (${services.length})`, icon: <Scissors size={16} /> },
            { id: 'comparison', label: `Antes & Después (${comparisonCases ? comparisonCases.length : 0})`, icon: <Sparkles size={16} /> },
            { id: 'orders', label: `Órdenes Recibidas (${orders.length})`, icon: <ShoppingCart size={16} /> },
            { id: 'settings', label: 'Ajustes de Tienda & Logo', icon: <Settings size={16} /> },
            { id: 'complaints', label: `Libro de Reclamaciones (${complaints.length})`, icon: <BookOpen size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: activeTab === tab.id ? 'var(--accent-gold-light)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '3px solid var(--accent-gold)' : '3px solid transparent',
                marginBottom: '-2px',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>Productos en Catálogo</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Crea, modifica fotos comprimidas, precios en Soles o actualiza stock.</p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="btn-luxury-gold"
                style={{ fontSize: '0.8rem', padding: '0.75rem 1.5rem' }}
              >
                <Plus size={16} />
                <span>Nuevo Producto</span>
              </button>
            </div>

            <div style={{
              background: '#161210',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#0D0A09', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', color: 'var(--accent-gold)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <th style={{ padding: '1rem' }}>Producto</th>
                      <th style={{ padding: '1rem' }}>Categoría</th>
                      <th style={{ padding: '1rem' }}>Precio</th>
                      <th style={{ padding: '1rem' }}>Stock</th>
                      <th style={{ padding: '1rem' }}>Estado</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={p.images && p.images[0] ? p.images[0] : ''}
                            alt={p.name}
                            style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{p.name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{p.volume || 'Cosmético'}</div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold-light)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                          S/ {p.price.toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: p.stock > 10 ? 'rgba(16, 185, 129, 0.15)' : (p.stock > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                            color: p.stock > 10 ? '#34D399' : (p.stock > 0 ? '#FBBF24' : '#F87171')
                          }}>
                            {p.stock > 0 ? `${p.stock} unid.` : 'Agotado'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            {p.isBestseller && (
                              <span style={{ fontSize: '0.65rem', background: 'var(--accent-gold)', color: '#0D0A09', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                                Bestseller
                              </span>
                            )}
                            {p.isNew && (
                              <span style={{ fontSize: '0.65rem', background: 'var(--accent-rose)', color: '#FFF', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)' }}>
                                Nuevo
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              style={{ padding: '0.4rem', color: 'var(--accent-gold)' }}
                              title="Editar producto"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de eliminar "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              style={{ padding: '0.4rem', color: '#F87171' }}
                              title="Eliminar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES (NEW: FULL SERVICES CRUD) */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>Carta de Servicios del Salón</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Administra los servicios de estilismo, colorimetría, alisados y tratamientos del salón.</p>
              </div>
              <button
                onClick={handleOpenAddService}
                className="btn-luxury-gold"
                style={{ fontSize: '0.8rem', padding: '0.75rem 1.5rem' }}
              >
                <Plus size={16} />
                <span>Nuevo Servicio</span>
              </button>
            </div>

            <div style={{
              background: '#161210',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#0D0A09', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', color: 'var(--accent-gold)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <th style={{ padding: '1rem' }}>Servicio</th>
                      <th style={{ padding: '1rem' }}>Categoría</th>
                      <th style={{ padding: '1rem' }}>Duración</th>
                      <th style={{ padding: '1rem' }}>Inversión</th>
                      <th style={{ padding: '1rem' }}>Detalles</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={s.image || ''}
                            alt={s.name}
                            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{s.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {s.description}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold-light)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                            {s.category}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#D4D4D4' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={13} style={{ color: 'var(--accent-gold)' }} />
                            <span>{s.duration}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                          Desde S/ {s.priceFrom.toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {s.includes ? `${s.includes.length} ítems incluidos` : 'Estándar'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEditService(s)}
                              style={{ padding: '0.4rem', color: 'var(--accent-gold)' }}
                              title="Editar servicio"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de eliminar el servicio "${s.name}"?`)) {
                                  deleteService(s.id);
                                }
                              }}
                              style={{ padding: '0.4rem', color: '#F87171' }}
                              title="Eliminar servicio"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BEFORE & AFTER COMPARISON (INTERACTIVE SLIDER) */}
        {activeTab === 'comparison' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
                Casos del Comparador Interactivo (Antes & Después)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Personaliza las fotografías de antes y después, títulos, tiempos de sesión y porcentajes de resultados comprobados.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {(comparisonCases || []).map(item => (
                <div
                  key={item.id}
                  style={{
                    background: '#161210',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    padding: '1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
                  }}
                >
                  <div>
                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: 'var(--accent-gold)',
                        background: 'rgba(212, 175, 55, 0.1)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(212, 175, 55, 0.25)'
                      }}>
                        {item.serviceCategory}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Clock size={12} /> {item.duration}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.35rem' }}>
                      {item.title}
                    </h4>

                    {item.stat && (
                      <div style={{
                        fontSize: '0.72rem',
                        color: '#34D399',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <Sparkles size={13} /> {item.stat}
                      </div>
                    )}

                    {/* Mini Thumbnails Before & After */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      background: '#0D0A09',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#F87171', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Antes
                        </div>
                        <img
                          src={item.beforeImage}
                          alt="Antes"
                          style={{
                            width: '100%',
                            height: '110px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                          }}
                        />
                        <div style={{ fontSize: '0.7rem', color: '#CBD5E1', marginTop: '0.3rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.beforeLabel}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-gold-light)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Después
                        </div>
                        <img
                          src={item.afterImage}
                          alt="Después"
                          style={{
                            width: '100%',
                            height: '110px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid rgba(212, 175, 55, 0.4)'
                          }}
                        />
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold-light)', marginTop: '0.3rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.afterLabel}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEditComparison(item)}
                    className="btn-luxury-gold"
                    style={{ width: '100%', fontSize: '0.78rem', padding: '0.65rem', justifyContent: 'center' }}
                  >
                    <Edit2 size={14} />
                    <span>Editar Caso & Fotos</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>Órdenes de Compra</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Revisa los pedidos de Chiclayo y provincias con su comprobante de Yape/Plin o pasarela Culqi.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders.map(order => (
                <div
                  key={order.id}
                  style={{
                    background: '#161210',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    padding: '1.5rem',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                        #{order.id}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 800,
                        background: order.paymentMethod.includes('yape') ? 'rgba(139, 44, 158, 0.2)' : (order.paymentMethod.includes('plin') ? 'rgba(0, 194, 232, 0.2)' : 'rgba(212, 175, 55, 0.2)'),
                        color: order.paymentMethod.includes('yape') ? '#E9A6F5' : (order.paymentMethod.includes('plin') ? 'var(--plin-cyan)' : 'var(--accent-gold-light)')
                      }}>
                        {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleString('es-PE')}
                      </span>

                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: '#0D0A09',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          color: order.paymentStatus === 'pagado' || order.paymentStatus === 'entregado' ? '#34D399' : '#FBBF24'
                        }}
                      >
                        <option value="pendiente">Pendiente de Verificación</option>
                        <option value="pagado">Pago Confirmado</option>
                        <option value="en_camino">En Camino (Motorizado/Courier)</option>
                        <option value="entregado">Entregado al Cliente</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1.5rem',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.35rem' }}>Cliente:</div>
                      <div style={{ color: 'var(--text-muted)' }}>Nombre: <strong style={{ color: '#FFF' }}>{order.customer.name}</strong></div>
                      <div style={{ color: 'var(--text-muted)' }}>DNI: <strong style={{ color: '#FFF' }}>{order.customer.dni}</strong></div>
                      <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                        <span>WhatsApp: {order.customer.phone}</span>
                        <a
                          href={`https://wa.me/51${order.customer.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#34D399', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'underline' }}
                        >
                          <Phone size={13} /> Chat
                        </a>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.35rem' }}>Despacho:</div>
                      <div style={{ color: 'var(--text-muted)' }}>Método: <strong style={{ color: '#FFF' }}>{order.shippingMethod.title}</strong></div>
                      <div style={{ color: 'var(--text-muted)' }}>Ciudad: <strong style={{ color: '#FFF' }}>{order.customer.city}</strong></div>
                      <div style={{ color: 'var(--text-muted)' }}>Dirección: {order.customer.address || 'Retiro en Salón'}</div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.35rem' }}>Items:</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)' }}>
                        {order.items.map((it, idx) => (
                          <li key={idx} style={{ marginBottom: '0.2rem' }}>
                            {it.quantity}x {it.name} — S/ {(it.price * it.quantity).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                      <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-gold-light)' }}>
                        Total: S/ {order.total.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '0.35rem' }}>Constancia de Pago:</div>
                      {order.paymentProof ? (
                        <div style={{ background: '#0D0A09', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img
                              src={order.paymentProof}
                              alt="Comprobante"
                              style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                              onClick={() => {
                                const w = window.open('');
                                if (w) {
                                  w.document.write(`<body style="background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;"><img src="${order.paymentProof}" style="max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 0 30px rgba(0,0,0,0.8);" /></body>`);
                                }
                              }}
                              title="Click para ampliar"
                            />
                            <div style={{ fontSize: '0.72rem', overflow: 'hidden' }}>
                              <div style={{ color: '#FFFFFF', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {order.paymentProofName || 'Voucher Registrado'}
                              </div>
                              <a
                                href={order.paymentProof}
                                download={order.paymentProofName || 'Comprobante.jpg'}
                                style={{ color: 'var(--accent-gold)', textDecoration: 'underline', fontSize: '0.7rem', display: 'inline-block', marginTop: '0.2rem' }}
                              >
                                Descargar Archivo
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', background: '#0D0A09', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                          Sin comprobante web adjunto (validar por WhatsApp o pasarela Culqi)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS (LOGO, SLOGAN, PASSWORD, CONTACTS, SHIPPING) */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '750px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>Ajustes de Tienda & Logo</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Configura el logotipo, nombre de la marca, eslogan, contraseña, números de pago y logística.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="admin-settings-card" style={{ background: '#161210', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* 1. Brand Identity, Logo & Slogan */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>1. Identidad de Marca, Logotipo & Eslogan</span>
                </h4>

                {/* Logo Upload / URL */}
                <div style={{ background: '#0F0C0A', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.76rem', color: '#FFFFFF', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                    Logotipo del Salón (Se muestra en la cabecera y pie de página)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: settingsForm.logoShape === 'circle' ? '50%' : 'var(--radius-sm)',
                      background: '#1A1A1A',
                      border: '1px solid var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                      transition: 'border-radius 0.25s ease'
                    }}>
                      {settingsForm.logoUrl ? (
                        <img 
                          src={settingsForm.logoUrl} 
                          alt="Logo" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: settingsForm.logoShape === 'circle' ? 'cover' : 'contain' 
                          }} 
                        />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.4rem' }}>S</span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'rgba(229, 192, 123, 0.15)',
                          border: '1px solid var(--accent-gold)',
                          color: 'var(--accent-gold-light)',
                          padding: '0.4rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}>
                          <Upload size={13} />
                          <span>Subir logo desde este dispositivo</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                        </label>

                        {settingsForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                            style={{
                              padding: '0.4rem 0.8rem',
                              borderRadius: 'var(--radius-sm)',
                              background: '#2A201E',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#D4D4D4',
                              fontSize: '0.72rem'
                            }}
                          >
                            Usar Monograma "S" por defecto
                          </button>
                        )}
                      </div>

                      {/* Selector de silueta del logo: Cuadrado o Circular */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Silueta del Logo:</span>
                        <div style={{ display: 'inline-flex', background: '#0D0A09', padding: '0.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, logoShape: 'square' })}
                            style={{
                              padding: '0.3rem 0.8rem',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                              background: settingsForm.logoShape !== 'circle' ? 'var(--accent-gold)' : 'transparent',
                              color: settingsForm.logoShape !== 'circle' ? '#0D0A09' : 'var(--text-muted)',
                              transition: 'all 0.2s'
                            }}
                          >
                            ⏹️ Cuadrado
                          </button>
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, logoShape: 'circle' })}
                            style={{
                              padding: '0.3rem 0.8rem',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                              background: settingsForm.logoShape === 'circle' ? 'var(--accent-gold)' : 'transparent',
                              color: settingsForm.logoShape === 'circle' ? '#0D0A09' : 'var(--text-muted)',
                              transition: 'all 0.2s'
                            }}
                          >
                            ⚪ Circular
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="O pega aquí la URL de la imagen del logotipo"
                        value={settingsForm.logoUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', marginTop: '0.2rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Brand Name & Slogan Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Nombre de la Empresa</label>
                    <input
                      type="text"
                      value={settingsForm.storeName || 'Salón & Estilo'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Subtítulo / Eslogan Principal</label>
                    <input
                      type="text"
                      value={settingsForm.brandSubtitle || 'Salón de Belleza Miluska Vidaurre'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, brandSubtitle: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Lema / Tagline Ampliado</label>
                  <input
                    type="text"
                    value={settingsForm.tagline || 'Estilismo Exclusivo de Alta Gama, Servicios de Salón & Cosmética Seleccionada'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* 2. Security & Access Password */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Lock size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>2. Clave de Acceso Administrativo</span>
                </h4>
                <div style={{ maxWidth: '380px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Contraseña para ingresar al Panel de Administración
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={settingsForm.adminPassword || 'salon&estilo2620'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 2.4rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#A3A3A3' }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem', display: 'block' }}>
                    Clave actual configurada: <strong>salon&estilo2620</strong>
                  </span>
                </div>
              </div>

              {/* 3. Contact Phones & Yape / Plin */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Phone size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>3. Celulares de Contacto & Pagos Digitales</span>
                </h4>
                
                {/* WhatsApp & Salon Address */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>WhatsApp Comercial / Citas (51...)</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappContact || '51920731163'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappContact: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Dirección / Sede Salón</label>
                    <input
                      type="text"
                      value={settingsForm.salonAddress || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, salonAddress: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* YAPE CONFIGURATION (PHONE, OWNER & QR IMAGE) */}
                <div style={{ background: '#110D0B', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(139, 44, 158, 0.3)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E9A6F5', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <QrCode size={16} />
                    <span>Configuración de Pagos Yape</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Número de Celular Yape</label>
                      <input
                        type="text"
                        value={settingsForm.yapePhone || '920 731 163'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, yapePhone: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Titular de la Cuenta Yape</label>
                      <input
                        type="text"
                        value={settingsForm.yapeOwner || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, yapeOwner: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#FFFFFF', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                      Imagen del Código QR Yape (Para escanear en Checkout)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#FFF',
                        border: '1.5px solid var(--yape-purple)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {settingsForm.yapeQrImage ? (
                          <img src={settingsForm.yapeQrImage} alt="QR Yape" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <QrCode size={28} style={{ color: 'var(--yape-purple)' }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <label style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'rgba(139, 44, 158, 0.2)',
                            border: '1px solid rgba(139, 44, 158, 0.5)',
                            color: '#E9A6F5',
                            padding: '0.4rem 0.8rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}>
                            <Upload size={13} />
                            <span>Subir QR Yape</span>
                            <input type="file" accept="image/*" onChange={handleYapeQrUpload} style={{ display: 'none' }} />
                          </label>

                          {settingsForm.yapeQrImage && (
                            <button
                              type="button"
                              onClick={() => setSettingsForm({ ...settingsForm, yapeQrImage: '' })}
                              style={{
                                padding: '0.4rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: '#261715',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#D4D4D4',
                                fontSize: '0.72rem'
                              }}
                            >
                              Restablecer a QR Vectorial
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="O pega aquí la URL de la imagen de tu QR Yape"
                          value={settingsForm.yapeQrImage || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, yapeQrImage: e.target.value })}
                          style={{ width: '100%', padding: '0.45rem 0.7rem', borderRadius: 'var(--radius-xs)', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* PLIN CONFIGURATION (PHONE, OWNER & QR IMAGE) */}
                <div style={{ background: '#110D0B', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0, 194, 232, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--plin-cyan)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <QrCode size={16} />
                    <span>Configuración de Pagos Plin</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Número de Celular Plin</label>
                      <input
                        type="text"
                        value={settingsForm.plinPhone || '920 731 163'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, plinPhone: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Titular de la Cuenta Plin</label>
                      <input
                        type="text"
                        value={settingsForm.plinOwner || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, plinOwner: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#FFFFFF', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                      Imagen del Código QR Plin (Para escanear en Checkout)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#FFF',
                        border: '1.5px solid var(--plin-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {settingsForm.plinQrImage ? (
                          <img src={settingsForm.plinQrImage} alt="QR Plin" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <QrCode size={28} style={{ color: 'var(--plin-cyan)' }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <label style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'rgba(0, 194, 232, 0.15)',
                            border: '1px solid rgba(0, 194, 232, 0.4)',
                            color: 'var(--plin-cyan)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}>
                            <Upload size={13} />
                            <span>Subir QR Plin</span>
                            <input type="file" accept="image/*" onChange={handlePlinQrUpload} style={{ display: 'none' }} />
                          </label>

                          {settingsForm.plinQrImage && (
                            <button
                              type="button"
                              onClick={() => setSettingsForm({ ...settingsForm, plinQrImage: '' })}
                              style={{
                                padding: '0.4rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: '#261715',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#D4D4D4',
                                fontSize: '0.72rem'
                              }}
                            >
                              Restablecer a QR Vectorial
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="O pega aquí la URL de la imagen de tu QR Plin"
                          value={settingsForm.plinQrImage || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, plinQrImage: e.target.value })}
                          style={{ width: '100%', padding: '0.45rem 0.7rem', borderRadius: 'var(--radius-xs)', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Social Media Links */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span>4. Redes Sociales Oficiales</span>
                </h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Si dejas un campo en blanco, su icono se ocultará automáticamente en toda la web.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Facebook */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#1877F2', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                      Enlace de Facebook (ej: https://www.facebook.com/miluskavidaurresalon)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.facebook.com/tu-pagina (deja vacío para ocultar)"
                      value={settingsForm.facebookUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* TikTok */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Enlace de TikTok (deja vacío para ocultar)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.tiktok.com/@tu-cuenta"
                      value={settingsForm.tiktokUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Enlace de Instagram (deja vacío para ocultar)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/tu-cuenta"
                      value={settingsForm.instagramUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Enlace de YouTube (deja vacío para ocultar)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/@tu-canal"
                      value={settingsForm.youtubeUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* 5. Logistics & Shipping Times / Costs */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Truck size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>5. Logística, Tiempos de Entrega & Envíos</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Express Chiclayo */}
                  <div style={{ background: '#110D0B', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                      🏍️ Motorizado Express (Chiclayo y alrededores)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A3A3A3', display: 'block', marginBottom: '0.2rem' }}>Tiempo estimado</label>
                        <input
                          type="text"
                          value={settingsForm.expressTime || 'Menos de 2 horas'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, expressTime: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A3A3A3', display: 'block', marginBottom: '0.2rem' }}>Costo (S/.)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={settingsForm.expressPrice !== undefined ? settingsForm.expressPrice : 6.00}
                          onChange={(e) => setSettingsForm({ ...settingsForm, expressPrice: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Olva Courier Nacional */}
                  <div style={{ background: '#110D0B', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                      📦 Olva Courier Domicilio (Nivel Nacional / Provincias)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A3A3A3', display: 'block', marginBottom: '0.2rem' }}>Tiempo estimado</label>
                        <input
                          type="text"
                          value={settingsForm.olvaTime || '24 a 72 horas'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, olvaTime: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A3A3A3', display: 'block', marginBottom: '0.2rem' }}>Costo (S/.)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={settingsForm.olvaPrice !== undefined ? settingsForm.olvaPrice : 14.00}
                          onChange={(e) => setSettingsForm({ ...settingsForm, olvaPrice: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shalom Agencia Nacional */}
                  <div style={{ background: '#110D0B', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                      🏢 Shalom Agencia (Nivel Nacional)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A3A3A3', display: 'block', marginBottom: '0.2rem' }}>Tiempo estimado</label>
                        <input
                          type="text"
                          value={settingsForm.shalomTime || '24 a 48 horas'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, shalomTime: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A3A3A3', display: 'block', marginBottom: '0.2rem' }}>Costo (S/.)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={settingsForm.shalomPrice !== undefined ? settingsForm.shalomPrice : 9.00}
                          onChange={(e) => setSettingsForm({ ...settingsForm, shalomPrice: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Products Banner Message */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.85rem' }}>
                  6. Texto de la Franja de Envíos en Catálogo de Productos
                </h4>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Mensaje visible al entrar a la sección de productos
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.productsBannerText || "📦 ENVÍOS A NIVEL NACIONAL (Olva & Shalom a todo el Perú) • Express < 2h en Chiclayo y alrededores • Citas Salón: 920 731 163"}
                    onChange={(e) => setSettingsForm({ ...settingsForm, productsBannerText: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* 7. Culqi Gateway */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.65rem' }}>
                  7. Pasarela de Tarjetas Culqi
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="culqiToggle"
                    checked={settingsForm.culqiEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, culqiEnabled: e.target.checked })}
                  />
                  <label htmlFor="culqiToggle" style={{ fontSize: '0.85rem', color: '#FFF' }}>
                    Activar pagos con Tarjetas (Visa / Mastercard) vía Culqi
                  </label>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Llave Pública de Culqi</label>
                  <input
                    type="text"
                    value={settingsForm.culqiPublicKey || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, culqiPublicKey: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* 8. Local Backup & Future Hosting Migration */}
              <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.3)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Database size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>8. Copia de Seguridad Local & Migración de Hosting</span>
                </h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Guarda un archivo de respaldo instantáneo en tu computadora con todos los ajustes, productos, servicios, casos y órdenes. Así siempre tendrás una copia física de tu información lista para migrar a cualquier hosting de pago propio sin depender de ningún proveedor externo.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="btn-luxury-outline"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.82rem',
                      borderColor: 'var(--accent-gold)',
                      color: 'var(--accent-gold-light)'
                    }}
                  >
                    <Download size={15} />
                    <span>Descargar Respaldo Completo (.JSON)</span>
                  </button>

                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.82rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#E5E5E5',
                      cursor: 'pointer'
                    }}
                  >
                    <ShieldCheck size={15} style={{ color: '#10B981' }} />
                    <span>Restaurar desde Archivo (.JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', background: 'rgba(212, 175, 55, 0.08)', borderRadius: 'var(--radius-xs)', borderLeft: '3px solid var(--accent-gold)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#D4AF37', display: 'block' }}>
                    💡 <strong>Archivos en tu repositorio Git:</strong> El esquema SQL de base de datos está guardado en <code style={{ color: '#FFF' }}>database/schema.sql</code> (PostgreSQL) y <code style={{ color: '#FFF' }}>database/schema_mysql.sql</code> (MySQL / cPanel), y puedes generar respaldos automáticos desde terminal ejecutando <code style={{ color: '#FFF' }}>npm run db:backup</code>.
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
                <button type="submit" className="btn-luxury-gold admin-save-btn" style={{ padding: '0.85rem 2.4rem', fontSize: '0.84rem' }}>
                  Guardar Todos los Ajustes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>Libro de Reclamaciones Virtual</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Atención formal según INDECOPI.
              </p>
            </div>

            {complaints.length === 0 ? (
              <div style={{ background: '#161210', padding: '3rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <BookOpen size={40} style={{ opacity: 0.5, marginBottom: '0.75rem', color: 'var(--accent-gold)' }} />
                <p>No hay reclamaciones registradas actualmente.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {complaints.map((c, i) => (
                  <div key={i} style={{ background: '#161210', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{c.correlative} • {c.type}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(c.filedAt).toLocaleString('es-PE')}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}><strong style={{ color: '#FFF' }}>Consumidor:</strong> {c.fullName} (DNI: {c.dni})</div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}><strong style={{ color: '#FFF' }}>Detalle:</strong> {c.description}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)' }}><strong style={{ color: '#FFF' }}>Pedido:</strong> {c.consumerRequest}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL 1: ADD / EDIT PRODUCT (WITH AUTO IMAGE COMPRESSION) */}
        {productModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(5, 4, 3, 0.88)',
            backdropFilter: 'blur(10px)'
          }}>
            <div 
              className="animate-modal"
              style={{
                background: '#15110F',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.2rem',
                border: '1px solid var(--accent-gold-border)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setProductModalOpen(false)}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--accent-gold-light)' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.65rem', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                {editingProduct ? 'Editar Cosmético' : 'Nuevo Cosmético Seleccionado'}
              </h2>

              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Categoría *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    >
                      <option value="Skincare">Skincare</option>
                      <option value="Labios">Labios</option>
                      <option value="Rostro">Rostro</option>
                      <option value="Ojos">Ojos</option>
                      <option value="Protección Solar">Protección Solar</option>
                      <option value="Accesorios">Accesorios</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Volumen / Gramaje</label>
                    <input
                      type="text"
                      placeholder="Ej. 30 ml / 10 g"
                      value={productForm.volume}
                      onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Precio (S/.) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Precio Anterior (S/.)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Stock Disponible *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Compressed Image Section */}
                <div style={{
                  background: '#0D0A09',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(229, 192, 123, 0.3)'
                }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                    Fotografía del Producto * (Se comprime automáticamente para no saturar memoria)
                  </label>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#1C1C1C',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {productForm.imageUrl ? (
                        <img
                          src={productForm.imageUrl}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <ImageIcon size={24} style={{ color: '#666' }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div>
                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          background: 'rgba(229, 192, 123, 0.15)',
                          border: '1px solid var(--accent-gold)',
                          color: 'var(--accent-gold-light)',
                          padding: '0.45rem 0.95rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}>
                          <Upload size={14} />
                          <span>Subir foto comprimida (PC/Celular)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProductImageUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        placeholder="O escribe/pega la URL de la imagen (https://...)"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Descripción</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Beneficios (uno por línea)</label>
                  <textarea
                    rows={3}
                    value={productForm.benefitsText}
                    onChange={(e) => setProductForm({ ...productForm, benefitsText: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Palabras Clave de Búsqueda (separadas por comas)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. labial, brillo, hidratación, antiarrugas, serum, chiclayo"
                    value={productForm.keywordsText}
                    onChange={(e) => setProductForm({ ...productForm, keywordsText: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                    Agrega varias palabras clave. El buscador de productos coincidirá tanto con el nombre y descripción como con estas palabras clave.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', margin: '0.5rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', color: '#FFF' }}>
                    <input
                      type="checkbox"
                      checked={productForm.isBestseller}
                      onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                    />
                    <span>Destacar Bestseller</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', color: '#FFF' }}>
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    />
                    <span>Etiqueta Nuevo</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="btn-luxury-outline"
                    style={{ fontSize: '0.8rem', padding: '0.65rem 1.4rem' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-luxury-gold"
                    style={{ fontSize: '0.8rem', padding: '0.65rem 1.8rem' }}
                  >
                    {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD / EDIT SERVICE (WITH AUTO IMAGE COMPRESSION) */}
        {serviceModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(5, 4, 3, 0.88)',
            backdropFilter: 'blur(10px)'
          }}>
            <div 
              className="animate-modal"
              style={{
                background: '#15110F',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.2rem',
                border: '1px solid var(--accent-gold-border)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setServiceModalOpen(false)}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--accent-gold-light)' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.65rem', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                {editingService ? 'Editar Servicio del Salón' : 'Nuevo Servicio de Estilismo'}
              </h2>

              <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Nombre del Servicio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Balayage Signature & Morena Iluminada"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Categoría *</label>
                    <input
                      type="text"
                      required
                      placeholder="Colorimetría, Alisados..."
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Duración aprox. *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 2 - 3 horas"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Inversión (Desde S/.) *</label>
                    <input
                      type="number"
                      step="1"
                      required
                      placeholder="180.00"
                      value={serviceForm.priceFrom}
                      onChange={(e) => setServiceForm({ ...serviceForm, priceFrom: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Service Compressed Image */}
                <div style={{
                  background: '#0D0A09',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(229, 192, 123, 0.3)'
                }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                    Fotografía del Servicio * (Se comprime automáticamente para no saturar memoria)
                  </label>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#1C1C1C',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {serviceForm.image ? (
                        <img
                          src={serviceForm.image}
                          alt="Service Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <ImageIcon size={24} style={{ color: '#666' }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div>
                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          background: 'rgba(229, 192, 123, 0.15)',
                          border: '1px solid var(--accent-gold)',
                          color: 'var(--accent-gold-light)',
                          padding: '0.45rem 0.95rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}>
                          <Upload size={14} />
                          <span>Subir foto comprimida (PC/Celular)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleServiceImageUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        placeholder="O escribe/pega la URL de la imagen del servicio"
                        value={serviceForm.image}
                        onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Descripción Detallada</label>
                  <textarea
                    rows={3}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>¿Qué incluye en el salón? (Uno por línea)</label>
                  <textarea
                    rows={3}
                    placeholder="Diagnóstico capilar previo&#10;Tratamiento plex protector&#10;Lavado y peinado final"
                    value={serviceForm.includesText}
                    onChange={(e) => setServiceForm({ ...serviceForm, includesText: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="btn-luxury-outline"
                    style={{ fontSize: '0.8rem', padding: '0.65rem 1.4rem' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-luxury-gold"
                    style={{ fontSize: '0.8rem', padding: '0.65rem 1.8rem' }}
                  >
                    {editingService ? 'Actualizar Servicio' : 'Guardar Servicio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: EDIT COMPARISON CASE (ANTES & DESPUÉS) */}
        {comparisonModalOpen && editingComparisonCase && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(5, 4, 3, 0.88)',
            backdropFilter: 'blur(10px)'
          }}>
            <div 
              className="animate-modal"
              style={{
                background: '#15110F',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '720px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.2rem',
                border: '1px solid var(--accent-gold-border)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setComparisonModalOpen(false)}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--accent-gold-light)' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                Editar Caso: {comparisonForm.title || 'Antes y Después'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.4rem' }}>
                Actualiza las fotos de antes/después (con compresión automática) y las descripciones del procedimiento.
              </p>

              <form onSubmit={handleSaveComparison} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* General Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Título del Procedimiento *
                    </label>
                    <input
                      type="text"
                      required
                      value={comparisonForm.title}
                      onChange={(e) => setComparisonForm({ ...comparisonForm, title: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={comparisonForm.serviceCategory}
                      onChange={(e) => setComparisonForm({ ...comparisonForm, serviceCategory: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Duración de la Sesión
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 3 a 4 horas"
                      value={comparisonForm.duration}
                      onChange={(e) => setComparisonForm({ ...comparisonForm, duration: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Insignia / Resultado Destacado
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 100% Sin maltratar la fibra"
                      value={comparisonForm.stat}
                      onChange={(e) => setComparisonForm({ ...comparisonForm, stat: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Section ANTES */}
                <div style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.1rem'
                }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#F87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                    1. Estado Inicial ("ANTES")
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                        Etiqueta Antes
                      </label>
                      <input
                        type="text"
                        value={comparisonForm.beforeLabel}
                        onChange={(e) => setComparisonForm({ ...comparisonForm, beforeLabel: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                        Diagnóstico / Descripción de Antes
                      </label>
                      <textarea
                        rows={2}
                        value={comparisonForm.beforeDesc}
                        onChange={(e) => setComparisonForm({ ...comparisonForm, beforeDesc: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Fotografía de Antes * (Se comprime automáticamente)
                      </label>
                      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', background: '#111', border: '1px solid rgba(239,68,68,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {comparisonForm.beforeImage ? (
                            <img src={comparisonForm.beforeImage} alt="Antes Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={20} style={{ color: '#666' }} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#FCA5A5',
                            padding: '0.4rem 0.85rem',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            width: 'fit-content'
                          }}>
                            <Upload size={13} />
                            <span>Subir foto comprimida de ANTES</span>
                            <input type="file" accept="image/*" onChange={handleBeforeImageUpload} style={{ display: 'none' }} />
                          </label>
                          <input
                            type="text"
                            placeholder="O escribe/pega URL de la imagen de Antes"
                            value={comparisonForm.beforeImage}
                            onChange={(e) => setComparisonForm({ ...comparisonForm, beforeImage: e.target.value })}
                            style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-xs)', fontSize: '0.78rem' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section DESPUES */}
                <div style={{
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.1rem'
                }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                    2. Resultado Final ("DESPUÉS")
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                        Etiqueta Después
                      </label>
                      <input
                        type="text"
                        value={comparisonForm.afterLabel}
                        onChange={(e) => setComparisonForm({ ...comparisonForm, afterLabel: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                        Resultado / Descripción de Después
                      </label>
                      <textarea
                        rows={2}
                        value={comparisonForm.afterDesc}
                        onChange={(e) => setComparisonForm({ ...comparisonForm, afterDesc: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Fotografía de Después * (Se comprime automáticamente)
                      </label>
                      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', background: '#111', border: '1px solid rgba(212,175,55,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {comparisonForm.afterImage ? (
                            <img src={comparisonForm.afterImage} alt="Después Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={20} style={{ color: '#666' }} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'rgba(212, 175, 55, 0.15)',
                            border: '1px solid var(--accent-gold)',
                            color: 'var(--accent-gold-light)',
                            padding: '0.4rem 0.85rem',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            width: 'fit-content'
                          }}>
                            <Upload size={13} />
                            <span>Subir foto comprimida de DESPUÉS</span>
                            <input type="file" accept="image/*" onChange={handleAfterImageUpload} style={{ display: 'none' }} />
                          </label>
                          <input
                            type="text"
                            placeholder="O escribe/pega URL de la imagen de Después"
                            value={comparisonForm.afterImage}
                            onChange={(e) => setComparisonForm({ ...comparisonForm, afterImage: e.target.value })}
                            style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-xs)', fontSize: '0.78rem' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setComparisonModalOpen(false)}
                    className="btn-luxury-outline"
                    style={{ fontSize: '0.8rem', padding: '0.65rem 1.4rem' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-luxury-gold"
                    style={{ fontSize: '0.8rem', padding: '0.65rem 1.8rem' }}
                  >
                    Guardar Cambios del Caso
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
