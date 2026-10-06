import React, { useState } from 'react';
import {
  Sprout,
  Sparkles,
  ShoppingBag,
  Bell,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Tractor,
  Layers,
  ArrowRight,
  LogOut,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    users,
    switchToPersona,
    logoutUser,
    openAuthModal,
    cartCount,
    setCartDrawerOpen,
    unreadNotificationsCount,
    setNotificationDrawerOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    products,
    setSelectedProduct,
    backendStatus,
    supabaseStatus
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Search autocomplete matches
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Agricultural Banner */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-700/80 text-emerald-100">
            🌱 100% DIRECT FROM FARMS
          </span>
          <span className="text-emerald-300/80">
            Fair farmer prices • Zero middlemen • AI-guided sustainable cultivation
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-200">
            <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {backendStatus.hasGeminiKey ? 'Gemini 3.8 Flash AI Active' : 'AI Diagnostic Engine'}
          </span>
          <span className="text-emerald-500">|</span>
          <span className="flex items-center gap-1.5 text-emerald-300 font-semibold" title={`Supabase Project: ${supabaseStatus.projectId}`}>
            <span className={`w-2 h-2 rounded-full ${supabaseStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>Supabase DB Connected</span>
          </span>
          <span className="text-emerald-500">|</span>
          <span className="text-emerald-200">Agri Helpline: 1800-180-1551</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-200 border border-emerald-400/30">
              <Sprout className="w-7 h-7 text-emerald-100 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-emerald-950 font-serif">
                  Kisan<span className="text-emerald-600">Mitra</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-400 text-amber-950 rounded-md tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-800 tracking-wide hidden sm:block">
                Agri AI Assistant & Producer Marketplace
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search crops, vegetables, fruits, farm..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-full border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden transition-all text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Autocomplete dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden z-50 p-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
                  Matching Harvest Produce
                </div>
                {searchResults.map(prod => (
                  <div
                    key={prod.id}
                    onMouseDown={() => {
                      setSelectedProduct(prod);
                      setActiveView('marketplace');
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {prod.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ₹{prod.price}/{prod.unit} • {prod.farmerName} ({prod.farmLocation})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeView === 'home'
                  ? 'text-emerald-800 bg-emerald-50'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('ai-assistant')}
              className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'ai-assistant'
                  ? 'text-emerald-950 bg-emerald-100 shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Ask AI</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-700 text-white rounded-full">
                FREE
              </span>
            </button>

            <button
              onClick={() => handleNav('marketplace')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeView === 'marketplace'
                  ? 'text-emerald-800 bg-emerald-50'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => handleNav('farmers')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeView === 'farmers'
                  ? 'text-emerald-800 bg-emerald-50'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Our Farmers
            </button>

            {/* Role-Specific Portal Button */}
            {currentUser?.role === 'farmer' && (
              <button
                onClick={() => handleNav('farmer-dashboard')}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeView === 'farmer-dashboard'
                    ? 'text-emerald-900 bg-emerald-100 font-bold'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Tractor className="w-4 h-4" />
                <span>Farm Hub</span>
              </button>
            )}

            {currentUser?.role === 'customer' && (
              <button
                onClick={() => handleNav('customer-orders')}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  activeView === 'customer-orders'
                    ? 'text-emerald-800 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                My Orders
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin-dashboard')}
                className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeView === 'admin-dashboard'
                    ? 'text-purple-900 bg-purple-100'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons (Notifications, Cart, Auth User) */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2.5 rounded-full text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-900 text-white hover:bg-emerald-950 transition-all shadow-md shadow-emerald-900/10 active:scale-95 cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-xs font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* User Account / Profile or Sign In / Register Buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <div className="text-left hidden lg:block leading-tight">
                    <div className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Session Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 text-slate-800"
                  >
                    <div className="px-3 py-2.5 bg-emerald-50 rounded-xl mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          Active Account
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900 capitalize">
                          {currentUser.role}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-emerald-950 mt-1">{currentUser.name}</div>
                      <div className="text-[11px] text-emerald-700 truncate">{currentUser.email}</div>
                      {currentUser.farmerProfile && (
                        <div className="text-[10px] text-emerald-800 font-semibold mt-1 flex items-center gap-1">
                          <Tractor className="w-3 h-3" />
                          <span>{currentUser.farmerProfile.farmName}</span>
                        </div>
                      )}
                      {currentUser.customerProfile && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Delivery: {currentUser.customerProfile.city}, {currentUser.customerProfile.state}
                        </div>
                      )}
                    </div>

                    {/* Navigation shortcuts inside dropdown */}
                    {currentUser.role === 'farmer' && (
                      <button
                        onClick={() => {
                          handleNav('farmer-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-50 text-left text-xs font-bold text-emerald-900 transition-colors"
                      >
                        <Tractor className="w-4 h-4 text-emerald-700" />
                        <span>Open Farm Hub & Inventory</span>
                      </button>
                    )}

                    {currentUser.role === 'customer' && (
                      <button
                        onClick={() => {
                          handleNav('customer-orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-50 text-left text-xs font-bold text-emerald-900 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-700" />
                        <span>View My Orders & Tracking</span>
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          handleNav('admin-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50 text-left text-xs font-bold text-purple-900 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-700" />
                        <span>Open Admin Moderation Panel</span>
                      </button>
                    )}

                    {/* Switch accounts if other registered users exist */}
                    {users.filter(u => u.id !== currentUser.id).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                          Switch to Registered Account
                        </div>
                        {users
                          .filter(u => u.id !== currentUser.id)
                          .slice(0, 3)
                          .map(otherUser => (
                            <button
                              key={otherUser.id}
                              onClick={() => {
                                switchToPersona(otherUser.id);
                                setUserDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-left transition-colors"
                            >
                              <img
                                src={otherUser.avatar}
                                alt={otherUser.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-800 truncate">
                                  {otherUser.name}
                                </div>
                                <div className="text-[10px] text-slate-400 capitalize">
                                  {otherUser.role}
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Register Another Account</span>
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-xs font-bold rounded-full bg-emerald-800 hover:bg-emerald-900 text-white transition-all shadow-md shadow-emerald-900/10 cursor-pointer flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Join / Register</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search crops, vegetables, farmers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('home')}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold text-left"
            >
              🏡 Home
            </button>
            <button
              onClick={() => handleNav('ai-assistant')}
              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-left border border-emerald-200"
            >
              🌱 AI Crop Doctor
            </button>
            <button
              onClick={() => handleNav('marketplace')}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold text-left"
            >
              🛒 Marketplace
            </button>
            <button
              onClick={() => handleNav('farmers')}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold text-left"
            >
              👨‍🌾 Farmers Directory
            </button>
          </div>

          {currentUser?.role === 'farmer' && (
            <button
              onClick={() => handleNav('farmer-dashboard')}
              className="w-full p-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold text-center"
            >
              Open Farmer Dashboard & Orders
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNav('admin-dashboard')}
              className="w-full p-2.5 rounded-xl bg-purple-800 text-white text-xs font-bold text-center"
            >
              Open Administrator Panel
            </button>
          )}

          {currentUser?.role === 'customer' && (
            <button
              onClick={() => handleNav('customer-orders')}
              className="w-full p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center"
            >
              Track My Active Orders
            </button>
          )}

          {!currentUser && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  openAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  openAuthModal('register');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs text-center"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
