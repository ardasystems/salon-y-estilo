import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_SERVICES, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_COMPARISON_CASES } from '../data/initialData';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  // Products (with version check to ensure fresh curated imagery & keywords)
  const [products, setProducts] = useState(() => {
    try {
      const version = localStorage.getItem('salonestilo_catalog_v');
      if (version !== '2.3') {
        localStorage.setItem('salonestilo_catalog_v', '2.3');
        localStorage.setItem('salonestilo_products', JSON.stringify(INITIAL_PRODUCTS));
        localStorage.setItem('salonestilo_services', JSON.stringify(INITIAL_SERVICES));
        localStorage.setItem('salonestilo_comparison_cases', JSON.stringify(INITIAL_COMPARISON_CASES));
        return INITIAL_PRODUCTS;
      }
      const saved = localStorage.getItem('salonestilo_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Services
  const [services, setServices] = useState(() => {
    try {
      const version = localStorage.getItem('salonestilo_catalog_v');
      if (version !== '2.3') {
        return INITIAL_SERVICES;
      }
      const saved = localStorage.getItem('salonestilo_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  // Interactive Comparison Cases (Antes y Después)
  const [comparisonCases, setComparisonCases] = useState(() => {
    try {
      const version = localStorage.getItem('salonestilo_catalog_v');
      if (version !== '2.3') {
        return INITIAL_COMPARISON_CASES;
      }
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

  // Cart
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
  const [bookingService, setBookingService] = useState(null); // Service selected for appointment
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

  // Sync with LocalStorage
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

  // Comparison Cases CRUD
  const updateComparisonCase = (id, updatedData) => {
    setComparisonCases(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    showToast("Caso de Antes & Después actualizado");
  };

  // Toast
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 1800);
  };

  // Cart
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

  // Products CRUD
  const addProduct = (newProduct) => {
    const created = {
      ...newProduct,
      id: `prod-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts(prev => [created, ...prev]);
    showToast("Producto agregado al catálogo");
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast("Producto actualizado");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Producto eliminado");
  };

  // Services CRUD
  const addService = (newService) => {
    const created = {
      ...newService,
      id: `srv-${Date.now().toString().slice(-4)}`
    };
    setServices(prev => [created, ...prev]);
    showToast("Servicio agregado");
  };

  const updateService = (updatedService) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    showToast("Servicio actualizado");
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast("Servicio eliminado");
  };

  // Orders CRUD
  const createOrder = (orderData) => {
    const originSuffix = orderData.customer.city.toLowerCase().includes("pimentel") ? "PIM" : "CHIC";
    const orderId = `SE-${originSuffix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [fullOrder, ...prev]);
    clearCart();
    return fullOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    showToast(`Estado de orden #${orderId} actualizado`);
  };

  const resetMetrics = () => {
    setOrders([]);
    showToast("Indicadores de ventas y pedidos restablecidos a cero");
  };

  // Complaints
  const submitComplaint = (complaintData) => {
    const correlative = `LRV-2026-${String(complaints.length + 1).padStart(4, '0')}`;
    const record = {
      ...complaintData,
      correlative,
      filedAt: new Date().toISOString(),
      status: "Recibido"
    };
    setComplaints(prev => [record, ...prev]);
    return record;
  };

  // Settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Ajustes actualizados");
  };

  // Filtered & Sorted Products (Matches name, subtitle, description, category AND keywords array)
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
