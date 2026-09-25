import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_SERVICES, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_COMPARISON_CASES } from '../data/initialData';
import { supabase } from '../lib/supabase';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  // Products (with version check for fallback)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Services
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  // Interactive Comparison Cases (Antes y Después)
  const [comparisonCases, setComparisonCases] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_comparison_cases');
      return saved ? JSON.parse(saved) : INITIAL_COMPARISON_CASES;
    } catch {
      return INITIAL_COMPARISON_CASES;
    }
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_settings');
      let loaded = saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
      if (loaded.brandSubtitle && /atelier|boutique/i.test(loaded.brandSubtitle)) {
        loaded.brandSubtitle = INITIAL_SETTINGS.brandSubtitle;
      }
      if (loaded.storeName && (/boutique/i.test(loaded.storeName) || loaded.storeName === 'Salon&Estilo' || loaded.storeName === 'Salon & Estilo')) {
        loaded.storeName = INITIAL_SETTINGS.storeName;
      }
      if (loaded.tagline && /autor|atelier/i.test(loaded.tagline)) {
        loaded.tagline = INITIAL_SETTINGS.tagline;
      }
      return loaded;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Complaints
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_complaints');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart (Local to user/client session)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Main Navigation Tabs: 'salon' (Presentación / Nosotros) | 'servicios' (Servicios del salón) | 'productos' (Boutique de productos)
  const [activeMainTab, setActiveMainTab] = useState('salon');

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_active_checkout');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isOpen) return true;
      }
    } catch {
      // ignore
    }
    return false;
  });
  const [isLibroOpen, setIsLibroOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [bookingService, setBookingService] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  // Products filtering, search & sorting
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [productSortBy, setProductSortBy] = useState("destacados");

  // Services filtering & search
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("Todos");
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");

  const [notification, setNotification] = useState(null);

  // Toast
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2200);
  };

  // Sync to LocalStorage as instant local cache
  useEffect(() => {
    localStorage.setItem('salonestilo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('salonestilo_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('salonestilo_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('salonestilo_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('salonestilo_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('salonestilo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('salonestilo_comparison_cases', JSON.stringify(comparisonCases));
  }, [comparisonCases]);

  // ==========================================
  // SUPABASE: Fetch fresh data on application load
  // ==========================================
  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        // 1. Settings
        const { data: settingsRow, error: sErr } = await supabase
          .from('store_settings')
          .select('data')
          .eq('id', 'current')
          .maybeSingle();

        if (settingsRow && settingsRow.data && !sErr) {
          setSettings(prev => ({
            ...INITIAL_SETTINGS,
            ...prev,
            ...settingsRow.data
          }));
        }

        // 2. Products
        const { data: dbProducts, error: pErr } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbProducts && dbProducts.length > 0 && !pErr) {
          const mapped = dbProducts.map(p => ({
            ...p.data,
            id: p.id,
            name: p.name || p.data?.name,
            category: p.category || p.data?.category,
            price: p.price !== null ? Number(p.price) : p.data?.price,
            stock: p.stock !== null ? Number(p.stock) : p.data?.stock,
          }));
          setProducts(mapped);
        }

        // 3. Services
        const { data: dbServices, error: srvErr } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });

        if (dbServices && dbServices.length > 0 && !srvErr) {
          const mapped = dbServices.map(s => ({
            ...s.data,
            id: s.id,
            name: s.name || s.data?.name,
            category: s.category || s.data?.category,
            price: s.price !== null ? Number(s.price) : s.data?.price,
          }));
          setServices(mapped);
        }

        // 4. Comparison Cases
        const { data: dbCases, error: cErr } = await supabase
          .from('comparison_cases')
          .select('*');

        if (dbCases && dbCases.length > 0 && !cErr) {
          const mapped = dbCases.map(c => ({
            ...c.data,
            id: c.id
          }));
          setComparisonCases(mapped);
        }

        // 5. Orders
        const { data: dbOrders, error: oErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbOrders && !oErr) {
          const mapped = dbOrders.map(o => ({
            ...o.data,
            id: o.id,
            total: o.total !== null ? Number(o.total) : o.data?.total,
            paymentStatus: o.payment_status || o.data?.paymentStatus,
            createdAt: o.created_at || o.data?.createdAt
          }));
          setOrders(mapped);
        }

        // 6. Complaints
        const { data: dbComplaints, error: compErr } = await supabase
          .from('complaints')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbComplaints && !compErr) {
          const mapped = dbComplaints.map(c => ({
            ...c.data,
            id: c.id,
            correlative: c.correlative || c.data?.correlative,
            filedAt: c.created_at || c.data?.filedAt
          }));
          setComplaints(mapped);
        }

      } catch (err) {
        console.warn('Initial cloud sync error (falling back to cache):', err);
      }
    };

    fetchCloudData();
  }, []);

  // ==========================================
  // SUPABASE: Realtime multi-device synchronization
  // ==========================================
  useEffect(() => {
    const channel = supabase
      .channel('salon_store_realtime')
      // Settings change
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, (payload) => {
        if (payload.new && payload.new.data) {
          setSettings(prev => ({ ...prev, ...payload.new.data }));
        }
      })
      // Products changes
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = { ...payload.new.data, id: payload.new.id };
          setProducts(prev => [item, ...prev.filter(p => p.id !== item.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const item = { ...payload.new.data, id: payload.new.id };
          setProducts(prev => prev.map(p => p.id === item.id ? item : p));
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      // Services changes
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = { ...payload.new.data, id: payload.new.id };
          setServices(prev => [item, ...prev.filter(s => s.id !== item.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const item = { ...payload.new.data, id: payload.new.id };
          setServices(prev => prev.map(s => s.id === item.id ? item : s));
        } else if (payload.eventType === 'DELETE') {
          setServices(prev => prev.filter(s => s.id !== payload.old.id));
        }
      })
      // Comparison cases changes
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comparison_cases' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const item = { ...payload.new.data, id: payload.new.id };
          setComparisonCases(prev => prev.map(c => c.id === item.id ? item : c));
        }
      })
      // Orders changes
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = { ...payload.new.data, id: payload.new.id, paymentStatus: payload.new.payment_status || payload.new.data?.paymentStatus };
          setOrders(prev => [item, ...prev.filter(o => o.id !== item.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const item = { ...payload.new.data, id: payload.new.id, paymentStatus: payload.new.payment_status || payload.new.data?.paymentStatus };
          setOrders(prev => prev.map(o => o.id === item.id ? item : o));
        } else if (payload.eventType === 'DELETE') {
          setOrders(prev => prev.filter(o => o.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ==========================================
  // Comparison Cases CRUD
  // ==========================================
  const updateComparisonCase = async (id, updatedData) => {
    const updated = { ...updatedData, id };
    setComparisonCases(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    showToast("Caso de Antes & Después actualizado");
    try {
      await supabase.from('comparison_cases').upsert({
        id,
        title: updated.title,
        category: updated.serviceCategory,
        data: updated,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Error updating comparison case to cloud:", err);
    }
  };

  // ==========================================
  // Cart (Local Session)
  // ==========================================
  const addToCart = (product, quantity = 1, shade = null) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedShade === shade?.name);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images ? product.images[0] : '',
        quantity,
        selectedShade: shade ? shade.name : null,
        selectedShadeHex: shade ? shade.hex : null,
        stock: product.stock
      }];
    });
    showToast(`"${product.name}" añadido a tu bolsa`);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ==========================================
  // Products CRUD (Synchronized with Supabase)
  // ==========================================
  const addProduct = async (newProduct) => {
    const created = {
      ...newProduct,
      id: `prod-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts(prev => [created, ...prev]);
    showToast("Producto agregado al catálogo");
    try {
      await supabase.from('products').insert({
        id: created.id,
        name: created.name,
        category: created.category,
        price: created.price,
        stock: created.stock || 0,
        data: created,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Error inserting product in Supabase:", err);
    }
  };

  const updateProduct = async (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast("Producto actualizado");
    try {
      await supabase.from('products').upsert({
        id: updatedProduct.id,
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
        stock: updatedProduct.stock || 0,
        data: updatedProduct,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Error updating product in Supabase:", err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Producto eliminado");
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn("Error deleting product in Supabase:", err);
    }
  };

  // ==========================================
  // Services CRUD (Synchronized with Supabase)
  // ==========================================
  const addService = async (newService) => {
    const created = {
      ...newService,
      id: `srv-${Date.now().toString().slice(-4)}`
    };
    setServices(prev => [created, ...prev]);
    showToast("Servicio agregado");
    try {
      await supabase.from('services').insert({
        id: created.id,
        name: created.name,
        category: created.category,
        price: created.price || 0,
        data: created,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Error adding service in Supabase:", err);
    }
  };

  const updateService = async (updatedService) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    showToast("Servicio actualizado");
    try {
      await supabase.from('services').upsert({
        id: updatedService.id,
        name: updatedService.name,
        category: updatedService.category,
        price: updatedService.price || 0,
        data: updatedService,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Error updating service in Supabase:", err);
    }
  };

  const deleteService = async (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast("Servicio eliminado");
    try {
      await supabase.from('services').delete().eq('id', id);
    } catch (err) {
      console.warn("Error deleting service in Supabase:", err);
    }
  };

  // ==========================================
  // Orders CRUD (Synchronized with Supabase)
  // ==========================================
  const createOrder = async (orderData) => {
    const originSuffix = orderData.customer?.city?.toLowerCase().includes("pimentel") ? "PIM" : "CHIC";
    const orderId = `SE-${originSuffix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [fullOrder, ...prev]);
    clearCart();

    try {
      await supabase.from('orders').insert({
        id: orderId,
        customer: fullOrder.customer,
        items: fullOrder.items,
        total: fullOrder.total,
        payment_status: fullOrder.paymentStatus || 'pendiente',
        data: fullOrder,
        created_at: fullOrder.createdAt
      });
    } catch (err) {
      console.warn("Error creating order in Supabase:", err);
    }

    return fullOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    showToast(`Estado de orden #${orderId} actualizado`);
    try {
      await supabase.from('orders').update({
        payment_status: newStatus,
        data: {
          ...orders.find(o => o.id === orderId),
          paymentStatus: newStatus
        }
      }).eq('id', orderId);
    } catch (err) {
      console.warn("Error updating order status in Supabase:", err);
    }
  };

  const resetMetrics = async () => {
    setOrders([]);
    showToast("Indicadores de ventas y pedidos restablecidos");
    try {
      await supabase.from('orders').delete().neq('id', 'placeholder_keep_empty');
    } catch (err) {
      console.warn("Error resetting orders in Supabase:", err);
    }
  };

  // ==========================================
  // Complaints (Libro de Reclamaciones)
  // ==========================================
  const submitComplaint = async (complaintData) => {
    const correlative = `LRV-2026-${String(complaints.length + 1).padStart(4, '0')}`;
    const record = {
      ...complaintData,
      correlative,
      filedAt: new Date().toISOString(),
      status: "Recibido"
    };
    setComplaints(prev => [record, ...prev]);
    try {
      await supabase.from('complaints').insert({
        id: correlative,
        correlative,
        data: record,
        created_at: record.filedAt
      });
    } catch (err) {
      console.warn("Error saving complaint to Supabase:", err);
    }
    return record;
  };

  // ==========================================
  // Settings (Synchronized with Supabase)
  // ==========================================
  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    showToast("Guardando ajustes en la nube...");

    try {
      const { error } = await supabase.from('store_settings').upsert({
        id: 'current',
        data: merged,
        updated_at: new Date().toISOString()
      });

      if (error) {
        throw error;
      }
      showToast("Ajustes sincronizados en todos los dispositivos");
    } catch (err) {
      console.error("Error saving settings to Supabase:", err);
      showToast("Ajustes guardados localmente", "warning");
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (query === "") return matchesCategory;

    const matchesKeywords = Array.isArray(product.keywords) 
      ? product.keywords.some(k => k && k.toLowerCase().includes(query))
      : false;

    const matchesSearch = 
      (product.name && product.name.toLowerCase().includes(query)) ||
      (product.subtitle && product.subtitle.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.category && product.category.toLowerCase().includes(query)) ||
      matchesKeywords;

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (productSortBy === 'precio-menor') return a.price - b.price;
    if (productSortBy === 'precio-mayor') return b.price - a.price;
    if (productSortBy === 'mas-comprados') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    if (productSortBy === 'recientes') return (b.id || '').localeCompare(a.id || '');
    return 0; // 'destacados'
  });

  const productCategories = ["Todos", ...new Set(products.map(p => p.category))];

  // Filtered Services
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedServiceCategory === "Todos" || service.category === selectedServiceCategory;
    const matchesSearch = serviceSearchQuery === "" || 
      service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(serviceSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const serviceCategories = ["Todos", ...new Set(services.map(s => s.category))];

  return (
    <StoreContext.Provider value={{
      // Tab Navigation
      activeMainTab,
      setActiveMainTab,

      // Products
      products,
      filteredProducts,
      productCategories,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      productSortBy,
      setProductSortBy,
      addProduct,
      updateProduct,
      deleteProduct,

      // Services
      services,
      filteredServices,
      serviceCategories,
      selectedServiceCategory,
      setSelectedServiceCategory,
      serviceSearchQuery,
      setServiceSearchQuery,
      bookingService,
      setBookingService,
      addService,
      updateService,
      deleteService,

      // Comparison Cases (Antes y Después)
      comparisonCases,
      updateComparisonCase,

      // Settings & Orders
      settings,
      updateSettings,
      orders,
      createOrder,
      updateOrderStatus,
      resetMetrics,
      complaints,
      submitComplaint,

      // Cart
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartItemCount,

      // Modals
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isLibroOpen,
      setIsLibroOpen,
      quickViewProduct,
      setQuickViewProduct,
      isAdminView,
      setIsAdminView,
      isAdminAuthOpen,
      setIsAdminAuthOpen,
      notification,
      showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
