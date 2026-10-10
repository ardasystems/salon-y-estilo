import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_SERVICES, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_COMPARISON_CASES, INITIAL_REGISTERED_USERS } from '../data/initialData';
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
  // Admin persistence across page reload
  const [isAdminView, setIsAdminView] = useState(() => {
    try {
      return localStorage.getItem('salonestilo_is_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('salonestilo_is_admin', isAdminView ? 'true' : 'false');
    } catch {}
  }, [isAdminView]);

  // Registered Users (Club VIP) State
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_registered_users');
      return saved ? JSON.parse(saved) : (INITIAL_REGISTERED_USERS || []);
    } catch {
      return INITIAL_REGISTERED_USERS || [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('salonestilo_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isUserAuthOpen, setIsUserAuthOpen] = useState(false);

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

  // Persistent Cart: local storage + registered user association
  useEffect(() => {
    try {
      localStorage.setItem('salonestilo_cart', JSON.stringify(cart));
      if (currentUser?.id) {
        localStorage.setItem(`salonestilo_cart_user_${currentUser.id}`, JSON.stringify(cart));
        // Back up cart in registered_users cloud record
        supabase
          .from('registered_users')
          .update({
            data: { ...currentUser, cart },
            updated_at: new Date().toISOString()
          })
          .eq('id', currentUser.id)
          .then(() => {})
          .catch(() => {});
      }
    } catch (e) {
      console.warn("Error saving cart", e);
    }
  }, [cart, currentUser]);

  // Restore registered user's cart on startup or account switch
  useEffect(() => {
    if (currentUser?.id) {
      try {
        const userSavedStr = localStorage.getItem(`salonestilo_cart_user_${currentUser.id}`);
        const userSavedCart = userSavedStr ? JSON.parse(userSavedStr) : (currentUser.cart || []);
        
        if (Array.isArray(userSavedCart) && userSavedCart.length > 0) {
          setCart(prev => {
            if (!prev || prev.length === 0) return userSavedCart;
            const merged = [...prev];
            userSavedCart.forEach(savedItem => {
              const idx = merged.findIndex(i => i.id === savedItem.id && i.selectedShade === savedItem.selectedShade);
              if (idx > -1) {
                merged[idx].quantity = Math.max(merged[idx].quantity, savedItem.quantity);
              } else {
                merged.push(savedItem);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.warn("Error restoring user cart:", err);
      }
    }
  }, [currentUser?.id]);

  useEffect(() => {
    localStorage.setItem('salonestilo_comparison_cases', JSON.stringify(comparisonCases));
  }, [comparisonCases]);

  useEffect(() => {
    try {
      localStorage.setItem('salonestilo_registered_users', JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('salonestilo_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('salonestilo_current_user');
      }
    } catch {}
  }, [currentUser]);

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

        // 7. Registered Users
        try {
          const { data: dbUsers, error: uErr } = await supabase
            .from('registered_users')
            .select('*')
            .order('registered_at', { ascending: false });

          if (dbUsers && dbUsers.length > 0 && !uErr) {
            const mapped = dbUsers.map(u => ({
              ...u.data,
              id: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone,
              role: u.role || 'vip',
              discountPercent: u.discount_percent !== null ? Number(u.discount_percent) : 10,
              registeredAt: u.registered_at,
              ordersCount: u.data?.ordersCount || 0
            }));
            setRegisteredUsers(mapped);
          }
        } catch {
          // fallback to local storage
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
        memberDiscountPercent: Number(product.memberDiscountPercent || 0),
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

  const cartRawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Descuento VIP calculado producto por producto para usuarios registrados
  const memberDiscountAmount = currentUser
    ? cart.reduce((sum, item) => {
        const catalogProd = products.find(p => p.id === item.id);
        const discountPct = Number(item.memberDiscountPercent ?? catalogProd?.memberDiscountPercent ?? 0);
        if (discountPct > 0) {
          return sum + ((item.price * item.quantity * discountPct) / 100);
        }
        return sum;
      }, 0)
    : 0;

  const cartSubtotal = Math.max(0, cartRawSubtotal - memberDiscountAmount);
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
    // Solo vaciar el carrito si la orden ya está confirmada como pagada
    if (fullOrder.paymentStatus === 'pagado' || fullOrder.paymentStatus === 'approved') {
      clearCart();
    }

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

  // ==========================================
  // Registered Users (Club VIP) CRUD & Auth
  // ==========================================
  const registerUser = async ({ name, email, phone, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '');

    if (!name || name.trim().length < 2) {
      throw new Error("Por favor ingresa tus nombres y apellidos.");
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error("Por favor ingresa un correo electrónico válido.");
    }

    const existing = registeredUsers.find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error("Este correo ya está registrado en el Club VIP. Inicia sesión con tu cuenta.");
    }

    const discount = Number(settings.memberDiscountPercent) || 0;
    const newUser = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password_hash: password ? btoa(password) : '',
      role: 'vip',
      discountPercent: discount,
      registeredAt: new Date().toISOString(),
      ordersCount: 0,
      cart: cart || []
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    try {
      localStorage.setItem(`salonestilo_cart_user_${newUser.id}`, JSON.stringify(cart || []));
    } catch {}

    showToast(`¡Bienvenida(o) ${newUser.name.split(' ')[0]}! Membresía Club VIP activa con descuentos exclusivos.`);

    try {
      await supabase.from('registered_users').insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password_hash: newUser.password_hash,
        role: newUser.role,
        discount_percent: newUser.discountPercent,
        data: newUser,
        registered_at: newUser.registeredAt
      });
    } catch (err) {
      console.warn("Error inserting registered user in Supabase:", err);
    }

    return newUser;
  };

  const loginUser = async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = registeredUsers.find(u => (u.email || '').toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error("No existe una cuenta registrada con este correo. Regístrate gratis.");
    }

    // Strict password verification
    const savedHash = user.password_hash || user.data?.password_hash;
    if (savedHash) {
      const inputHash = password ? btoa(password) : '';
      if (!password || inputHash !== savedHash) {
        throw new Error("Contraseña incorrecta. Por favor verifica tu contraseña o usa la opción de recuperación.");
      }
    }

    setCurrentUser(user);

    // Merge saved user cart from storage / profile
    try {
      const savedStr = localStorage.getItem(`salonestilo_cart_user_${user.id}`);
      const savedUserCart = savedStr ? JSON.parse(savedStr) : (user.cart || []);
      if (Array.isArray(savedUserCart) && savedUserCart.length > 0) {
        setCart(prev => {
          if (!prev || prev.length === 0) return savedUserCart;
          const merged = [...prev];
          savedUserCart.forEach(savedItem => {
            const idx = merged.findIndex(i => i.id === savedItem.id && i.selectedShade === savedItem.selectedShade);
            if (idx > -1) {
              merged[idx].quantity = Math.max(merged[idx].quantity, savedItem.quantity);
            } else {
              merged.push(savedItem);
            }
          });
          return merged;
        });
      }
    } catch {}

    showToast(`¡Hola de nuevo, ${user.name.split(' ')[0]}! Carrito conservado y Club VIP activo.`);
    return user;
  };

  const resetUserPassword = async ({ email, phone, newPassword }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '');

    const user = registeredUsers.find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error("No encontramos ninguna cuenta registrada con este correo.");
    }

    const userPhone = (user.phone || '').replace(/\D/g, '');
    if (userPhone && cleanPhone && userPhone !== cleanPhone) {
      throw new Error("El número celular ingresado no coincide con el registrado en esta cuenta.");
    }

    if (!newPassword || newPassword.length < 4) {
      throw new Error("La nueva contraseña debe tener al menos 4 caracteres.");
    }

    const newHash = btoa(newPassword);
    const updatedUser = {
      ...user,
      password_hash: newHash,
      data: {
        ...(user.data || {}),
        password_hash: newHash
      }
    };

    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    if (currentUser?.id === user.id) {
      setCurrentUser(updatedUser);
    }

    showToast("¡Contraseña restablecida con éxito! Ya puedes iniciar sesión con tu nueva clave.");

    try {
      await supabase.from('registered_users').update({
        password_hash: newHash,
        data: updatedUser.data,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
    } catch (err) {
      console.warn("Error updating password in Supabase:", err);
    }

    return updatedUser;
  };

  const adminResetUserPassword = async (userId, newPassword) => {
    const user = registeredUsers.find(u => u.id === userId);
    if (!user) throw new Error("Usuario no encontrado");

    const newHash = btoa(newPassword);
    const updatedUser = {
      ...user,
      password_hash: newHash,
      data: {
        ...(user.data || {}),
        password_hash: newHash
      }
    };

    setRegisteredUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    showToast(`Contraseña de ${user.name} restablecida a: ${newPassword}`);

    try {
      await supabase.from('registered_users').update({
        password_hash: newHash,
        data: updatedUser.data,
        updated_at: new Date().toISOString()
      }).eq('id', userId);
    } catch (err) {
      console.warn("Error resetting password from admin:", err);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast("Has cerrado tu sesión de usuario.");
  };

  const updateUserDiscount = async (userId, discountPercent) => {
    const num = Math.max(0, Math.min(100, Number(discountPercent) || 0));
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, discountPercent: num } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, discountPercent: num }));
    }
    showToast("Descuento de usuario actualizado");

    try {
      await supabase.from('registered_users').update({
        discount_percent: num,
        updated_at: new Date().toISOString()
      }).eq('id', userId);
    } catch (err) {
      console.warn("Error updating user discount in Supabase:", err);
    }
  };

  const deleteRegisteredUser = async (userId) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
    showToast("Usuario eliminado del registro");

    try {
      await supabase.from('registered_users').delete().eq('id', userId);
    } catch (err) {
      console.warn("Error deleting registered user in Supabase:", err);
    }
  };

  const normStr = (str) => (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  // Filtered & Sorted Products
  const filteredProducts = products.filter(product => {
    const pCat = product.category || "";
    const matchesCategory = selectedCategory === "Todos" || normStr(pCat) === normStr(selectedCategory);
    const query = normStr(searchQuery);
    if (query === "") return matchesCategory;

    const matchesKeywords = Array.isArray(product.keywords) 
      ? product.keywords.some(k => k && normStr(k).includes(query))
      : false;

    const matchesSearch = 
      normStr(product.name).includes(query) ||
      normStr(product.subtitle).includes(query) ||
      normStr(product.description).includes(query) ||
      normStr(product.category).includes(query) ||
      matchesKeywords;

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (productSortBy === 'precio-menor') return (a.price || 0) - (b.price || 0);
    if (productSortBy === 'precio-mayor') return (b.price || 0) - (a.price || 0);
    if (productSortBy === 'mas-comprados') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    if (productSortBy === 'recientes') return (b.id || '').localeCompare(a.id || '');
    return 0; // 'destacados'
  });

  const productCategories = ["Todos", ...Array.from(new Set(products.map(p => p.category?.trim()).filter(Boolean)))];

  // Filtered Services
  const filteredServices = services.filter(service => {
    const sCat = service.category || "";
    const matchesCategory = selectedServiceCategory === "Todos" || normStr(sCat) === normStr(selectedServiceCategory);
    const q = normStr(serviceSearchQuery);
    if (q === "") return matchesCategory;

    const matchesSearch = 
      normStr(service.name).includes(q) ||
      normStr(service.description).includes(q) ||
      normStr(service.category).includes(q);
    return matchesCategory && matchesSearch;
  });

  const serviceCategories = ["Todos", ...Array.from(new Set(services.map(s => s.category?.trim()).filter(Boolean)))];

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
      cartRawSubtotal,
      cartItemCount,
      memberDiscountAmount,

      // Registered Users & Club VIP
      registeredUsers,
      currentUser,
      registerUser,
      loginUser,
      logoutUser,
      resetUserPassword,
      adminResetUserPassword,
      updateUserDiscount,
      deleteRegisteredUser,
      isUserAuthOpen,
      setIsUserAuthOpen,

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
