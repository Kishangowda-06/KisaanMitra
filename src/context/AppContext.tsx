import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  CartItem,
  Order,
  OrderStatus,
  ProductReview,
  AIDiagnosis,
  AppNotification,
  UserRole
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_DIAGNOSES,
  SAMPLE_CROP_TEMPLATES
} from '../data/mockData';
import {
  saveOrderToSupabase,
  saveProductToSupabase,
  saveUserToSupabase,
  fetchUsersFromSupabase,
  testSupabaseConnection,
  SUPABASE_PROJECT_ID
} from '../services/supabase';

export type ActiveView =
  | 'home'
  | 'ai-assistant'
  | 'marketplace'
  | 'farmers'
  | 'farmer-profile'
  | 'farmer-dashboard'
  | 'customer-orders'
  | 'admin-dashboard';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  // Auth & Registration
  users: User[];
  switchToPersona: (userId: string) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  registerUser: (user: User) => Promise<boolean>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  authModalRole: UserRole;
  setAuthModalRole: (role: UserRole) => void;
  openAuthModal: (mode?: 'login' | 'register', role?: UserRole) => void;
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  loadStarterCropsForFarmer: (farmer: User) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  // Selected Farmer
  selectedFarmerId: string | null;
  setSelectedFarmerId: (id: string | null) => void;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  // Checkout
  checkoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'status'>) => Order;
  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  // Reviews
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
  // Farmer verification (Admin)
  updateFarmerVerification: (farmerId: string, status: 'verified' | 'pending' | 'rejected') => void;
  // AI Diagnoses
  diagnoses: AIDiagnosis[];
  saveDiagnosis: (diag: Omit<AIDiagnosis, 'id' | 'createdAt'>) => AIDiagnosis;
  deleteDiagnosis: (id: string) => void;
  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
  unreadNotificationsCount: number;
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Server & Supabase Health
  backendStatus: {
    online: boolean;
    hasGeminiKey: boolean;
    demoMode: boolean;
  };
  supabaseStatus: {
    connected: boolean;
    projectId: string;
    message: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registered users in the system (starts clean, populated when farmers/consumers register)
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('km_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current session user (null until user logs in or registers)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('km_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalRole, setAuthModalRole] = useState<UserRole>('farmer');

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Products listed by registered farmers
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('km_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('km_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('km_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);
  const [diagnoses, setDiagnoses] = useState<AIDiagnosis[]>(INITIAL_DIAGNOSES);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [backendStatus, setBackendStatus] = useState({
    online: true,
    hasGeminiKey: false,
    demoMode: true
  });
  const [supabaseStatus, setSupabaseStatus] = useState({
    connected: true,
    projectId: SUPABASE_PROJECT_ID,
    message: `Connected to Supabase (${SUPABASE_PROJECT_ID})`
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Persist data locally
  useEffect(() => {
    try {
      localStorage.setItem('km_users', JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('km_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('km_current_user');
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('km_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('km_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('km_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Check backend server status & Supabase connectivity and load remote users if available
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus({
          online: true,
          hasGeminiKey: !!data.hasGeminiKey,
          demoMode: !!data.demoMode
        });
      })
      .catch(() => {
        setBackendStatus({
          online: false,
          hasGeminiKey: false,
          demoMode: true
        });
      });

    // Check Supabase connection
    testSupabaseConnection()
      .then(res => {
        setSupabaseStatus({
          connected: res.connected,
          projectId: SUPABASE_PROJECT_ID,
          message: res.message
        });
      })
      .catch(err => {
        setSupabaseStatus({
          connected: false,
          projectId: SUPABASE_PROJECT_ID,
          message: err?.message || 'Connection error'
        });
      });

    // Attempt to sync users from Supabase profiles table
    fetchUsersFromSupabase().then(remoteUsers => {
      if (remoteUsers && remoteUsers.length > 0) {
        setUsers(prev => {
          const merged = [...prev];
          for (const ru of remoteUsers) {
            if (!merged.some(u => u.id === ru.id || u.email === ru.email)) {
              merged.push(ru);
            }
          }
          return merged;
        });
      }
    });
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login', role: UserRole = 'farmer') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const switchToPersona = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`Switched account to ${found.name} (${found.role.toUpperCase()})`, 'info');
      if (found.role === 'farmer') {
        setActiveView('farmer-dashboard');
      } else if (found.role === 'admin') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('marketplace');
      }
    }
  };

  const registerUser = async (newUser: User): Promise<boolean> => {
    // Add to local state & users collection
    setUsers(prev => {
      const existsIndex = prev.findIndex(u => u.id === newUser.id || u.email.toLowerCase() === newUser.email.toLowerCase());
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newUser;
        return copy;
      }
      return [...prev, newUser];
    });

    setCurrentUser(newUser);
    setAuthModalOpen(false);

    // Save to Supabase backend database
    saveUserToSupabase(newUser)
      .then(res => {
        if (res.success) {
          console.log(`User profile synced to Supabase (${res.table}).`);
        } else {
          console.warn('Supabase profile sync note:', res.error);
        }
      })
      .catch(e => console.warn('Supabase profile sync network err:', e));

    showToast(`Welcome to Kisan Mitra AI, ${newUser.name}!`, 'success');

    // Route user directly to their primary view
    if (newUser.role === 'farmer') {
      setActiveView('farmer-dashboard');
    } else if (newUser.role === 'admin') {
      setActiveView('admin-dashboard');
    } else {
      setActiveView('marketplace');
    }

    return true;
  };

  const loginUser = (user: User) => {
    setUsers(prev => {
      const exists = prev.find(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      return exists ? prev.map(u => (u.id === user.id ? user : u)) : [...prev, user];
    });
    setCurrentUser(user);
    setAuthModalOpen(false);
    showToast(`Welcome back, ${user.name}!`, 'success');

    if (user.role === 'farmer') {
      setActiveView('farmer-dashboard');
    } else if (user.role === 'admin') {
      setActiveView('admin-dashboard');
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  // Helper for farmers to add sample produce in 1 click to their farm
  const loadStarterCropsForFarmer = (farmer: User) => {
    if (!farmer || farmer.role !== 'farmer') return;

    const farmName = farmer.farmerProfile?.farmName || `${farmer.name}'s Farm`;
    const farmLocation = farmer.farmerProfile?.location || 'Nashik, Maharashtra';

    const starterProducts: Product[] = SAMPLE_CROP_TEMPLATES.map((tmpl, idx) => ({
      ...tmpl,
      id: `prod-${Date.now()}-${idx}`,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmName,
      farmLocation,
      farmerVerified: farmer.farmerProfile?.verificationStatus === 'verified',
      farmerRating: farmer.farmerProfile?.rating || 4.9,
      reviewCount: 0,
      rating: 5.0,
      featured: true,
      createdAt: new Date().toISOString().split('T')[0]
    }));

    setProducts(prev => [...starterProducts, ...prev]);

    // Sync to Supabase
    starterProducts.forEach(prod => {
      saveProductToSupabase(prod).catch(() => {});
    });

    showToast(`Added ${starterProducts.length} starter crops to ${farmName}!`, 'success');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity} ${product.unit} of ${product.name} to cart!`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Removed item from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" listed on marketplace successfully!`, 'success');

    // Automatically sync product to Supabase database
    saveProductToSupabase(newProduct)
      .then(syncRes => {
        if (syncRes.success) {
          console.log(`Product "${newProduct.name}" synced to Supabase.`);
        } else {
          console.warn('Supabase product sync notice:', syncRes.error);
        }
      })
      .catch(err => console.warn('Supabase product sync error:', err));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const updatedList = prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          saveProductToSupabase(updated).catch(() => {});
          return updated;
        }
        return p;
      });
      return updatedList;
    });
    showToast('Product details updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed from marketplace', 'info');
  };

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'status'>) => {
    const newId = `KM-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'Order Placed',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleString(),
          note: `Order placed via ${orderData.paymentMethod}`
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setCheckoutModalOpen(false);
    showToast(`Order #${newId} placed successfully!`, 'success');

    // Automatically sync customer order & sales data to Supabase database
    saveOrderToSupabase(newOrder)
      .then(syncResult => {
        if (syncResult.success) {
          showToast(`Order #${newId} recorded in Supabase (${syncResult.table || 'orders'})!`, 'success');
        } else {
          console.warn('Supabase order sync advisory:', syncResult.error);
        }
      })
      .catch(err => {
        console.warn('Supabase network error:', err);
      });

    // Notify farmer
    const firstFarmerId = orderData.items[0]?.farmerId;
    if (firstFarmerId) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: firstFarmerId,
          title: `New Order #${newId}`,
          message: `${orderData.customerName} placed an order for ₹${orderData.finalAmount}.`,
          type: 'order',
          read: false,
          createdAt: 'Just now',
          link: 'orders'
        },
        ...prev
      ]);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            status,
            timeline: [
              ...ord.timeline,
              {
                status,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                note: note || `Status updated to ${status}`
              }
            ]
          };
          saveOrderToSupabase(updated).catch(() => {});
          return updated;
        }
        return ord;
      })
    );
    showToast(`Order #${orderId} marked as ${status}`, 'success');
  };

  const addReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Today'
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('Review submitted successfully!', 'success');
  };

  const updateFarmerVerification = (farmerId: string, status: 'verified' | 'pending' | 'rejected') => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === farmerId && u.farmerProfile) {
          const updatedUser: User = {
            ...u,
            farmerProfile: {
              ...u.farmerProfile,
              verificationStatus: status
            }
          };
          saveUserToSupabase(updatedUser).catch(() => {});
          return updatedUser;
        }
        return u;
      })
    );

    // Also update products verification badge for this farmer
    setProducts(prev =>
      prev.map(p => (p.farmerId === farmerId ? { ...p, farmerVerified: status === 'verified' } : p))
    );

    showToast(`Farmer verification updated to ${status.toUpperCase()}`, 'info');
  };

  const saveDiagnosis = (diagData: Omit<AIDiagnosis, 'id' | 'createdAt'>) => {
    const newDiag: AIDiagnosis = {
      ...diagData,
      id: `diag-${Date.now()}`,
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    };
    setDiagnoses(prev => [newDiag, ...prev]);
    showToast('Crop diagnostic report saved to your record!', 'success');
    return newDiag;
  };

  const deleteDiagnosis = (id: string) => {
    setDiagnoses(prev => prev.filter(d => d.id !== id));
    showToast('Diagnostic report removed', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeView,
        setActiveView,
        users,
        switchToPersona,
        loginUser,
        logoutUser,
        registerUser,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authModalRole,
        setAuthModalRole,
        openAuthModal,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        loadStarterCropsForFarmer,
        selectedProduct,
        setSelectedProduct,
        selectedFarmerId,
        setSelectedFarmerId,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartDrawerOpen,
        setCartDrawerOpen,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        checkoutModalOpen,
        setCheckoutModalOpen,
        placeOrder,
        orders,
        updateOrderStatus,
        reviews,
        addReview,
        updateFarmerVerification,
        diagnoses,
        saveDiagnosis,
        deleteDiagnosis,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        unreadNotificationsCount,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toasts,
        showToast,
        removeToast,
        backendStatus,
        supabaseStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
