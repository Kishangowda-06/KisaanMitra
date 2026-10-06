import React, { useState, useEffect } from 'react';
import { X, Sprout, ShoppingBag, ShieldCheck, Check, ArrowRight, User, Eye, EyeOff, Sparkles, MapPin, Tractor, Phone, Mail, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, User as UserType } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    authModalRole,
    setAuthModalRole,
    users,
    loginUser,
    registerUser,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('farmer');
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Farmer specific
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSizeAcres, setFarmSizeAcres] = useState(5);
  const [mainCrops, setMainCrops] = useState('');
  const [practices, setPractices] = useState('Drip Irrigation, Organic Compost, Neem Bio-spray');
  const [farmDescription, setFarmDescription] = useState('');

  // Customer specific
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Sync mode and role with context when opened
  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode);
      setRole(authModalRole);
    }
  }, [authModalOpen, authModalMode, authModalRole]);

  if (!authModalOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !name.trim()) {
      showToast('Please enter your full name and email', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password should be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    // Check if email already registered
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      showToast(`An account with ${email} already exists. Please sign in!`, 'error');
      setMode('login');
      return;
    }

    const newUser: UserType = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+91 98000 00000',
      password,
      role,
      avatar: role === 'farmer'
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      farmerProfile: role === 'farmer' ? {
        id: `fp-${Date.now()}`,
        farmName: farmName.trim() || `${name.trim()}'s Organic Farm`,
        location: farmLocation.trim() || 'Nashik, Maharashtra',
        state: farmLocation.includes(',') ? farmLocation.split(',')[1].trim() : 'Maharashtra',
        description: farmDescription.trim() || `Dedicated to chemical-free sustainable agriculture. Growing fresh produce with traditional eco-friendly methods.`,
        verificationStatus: 'verified' as const,
        rating: 5.0,
        totalReviews: 0,
        totalProducts: 0,
        experienceYears: 6,
        farmSizeAcres: Number(farmSizeAcres) || 5,
        cropsGrown: mainCrops ? mainCrops.split(',').map(c => c.trim()).filter(Boolean) : ['Tomatoes', 'Wheat', 'Vegetables'],
        bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
        practices: practices ? practices.split(',').map(p => p.trim()).filter(Boolean) : ['Drip Irrigation', 'Organic Vermicompost'],
        certifiedOrganic: true
      } : undefined,
      customerProfile: role === 'customer' ? {
        id: `cp-${Date.now()}`,
        address: streetAddress.trim() || 'Main Market Road',
        city: city.trim() || 'Bengaluru',
        state: state.trim() || 'Karnataka',
        postalCode: postalCode.trim() || '560001'
      } : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    await registerUser(newUser);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.password && password && existing.password !== password) {
        showToast('Incorrect password. Please try again.', 'error');
        return;
      }
      loginUser(existing);
    } else {
      // User entered a new email directly in login - facilitate instant account creation
      const generatedUser: UserType = {
        id: `user-${Date.now()}`,
        name: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: cleanEmail,
        phone: phone || '+91 98765 00000',
        password: password || '123456',
        role,
        avatar: role === 'farmer'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        farmerProfile: role === 'farmer' ? {
          id: `fp-${Date.now()}`,
          farmName: `${cleanEmail.split('@')[0]} Natural Farm`,
          location: 'Nashik, Maharashtra',
          state: 'Maharashtra',
          description: 'Producer of naturally grown farm fresh crops.',
          verificationStatus: 'verified' as const,
          rating: 5.0,
          totalReviews: 0,
          totalProducts: 0,
          experienceYears: 4,
          farmSizeAcres: 5,
          cropsGrown: ['Tomatoes', 'Wheat', 'Onions'],
          bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
          practices: ['Drip Irrigation', 'Jeevamrutha'],
          certifiedOrganic: true
        } : undefined,
        customerProfile: role === 'customer' ? {
          id: `cp-${Date.now()}`,
          address: 'MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001'
        } : undefined,
        createdAt: new Date().toISOString().split('T')[0]
      };

      registerUser(generatedUser);
    }
  };

  // Quick test helper that creates and enters a real user into the system
  const handleCreateTestAccount = async (testRole: UserRole) => {
    let testUser: UserType;

    if (testRole === 'farmer') {
      testUser = {
        id: `user-farmer-${Date.now()}`,
        name: 'Kishan Kumar Patel',
        email: `kishan.farmer.${Date.now().toString().slice(-4)}@kisanmitra.org`,
        phone: '+91 98220 44551',
        password: 'password123',
        role: 'farmer',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
        farmerProfile: {
          id: `fp-${Date.now()}`,
          farmName: 'Patel Organic Bio-Farms',
          location: 'Nashik, Maharashtra',
          state: 'Maharashtra',
          description: 'Practicing chemical-free Vedic farming with drip irrigation, vermicompost, and zero pesticides.',
          verificationStatus: 'verified',
          rating: 5.0,
          totalReviews: 0,
          totalProducts: 0,
          experienceYears: 8,
          farmSizeAcres: 12,
          cropsGrown: ['Desi Tomatoes', 'Organic Wheat', 'Nashik Red Onions', 'Spinach'],
          bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
          practices: ['Drip Irrigation', 'Jeevamrutha', 'Neem Bio-sprays', 'Solar Pumps'],
          certifiedOrganic: true
        },
        createdAt: new Date().toISOString().split('T')[0]
      };
    } else if (testRole === 'customer') {
      testUser = {
        id: `user-customer-${Date.now()}`,
        name: 'Priya Verma',
        email: `priya.consumer.${Date.now().toString().slice(-4)}@gmail.com`,
        phone: '+91 98110 33442',
        password: 'password123',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        customerProfile: {
          id: `cp-${Date.now()}`,
          address: '402, Green Glen Orchards, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560103'
        },
        createdAt: new Date().toISOString().split('T')[0]
      };
    } else {
      testUser = {
        id: `user-admin-${Date.now()}`,
        name: 'Dr. Vandana Rao (State Agri Director)',
        email: `admin.${Date.now().toString().slice(-4)}@kisanmitra.gov.in`,
        phone: '+91 11 2338 1234',
        password: 'password123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date().toISOString().split('T')[0]
      };
    }

    await registerUser(testUser);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-2 shadow-md border border-emerald-400/30">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
            {mode === 'login' ? 'Sign in to Kisan Mitra' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-500">
            Enter your details to start using the agricultural platform & marketplace
          </p>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 pb-2 border-b-2 transition-colors cursor-pointer ${
              mode === 'login' ? 'border-emerald-800 text-emerald-900' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 pb-2 border-b-2 transition-colors cursor-pointer ${
              mode === 'register' ? 'border-emerald-800 text-emerald-900' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Role Selector in Registration */}
        {mode === 'register' && (
          <div>
            <label className="font-bold text-slate-700 block mb-1.5 text-xs">
              Select Your Role:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                  role === 'farmer'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg mb-1">👨‍🌾</div>
                <div className="text-xs">Farmer / Producer</div>
                <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                  Sell harvest, manage farm & diagnose crops
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                  role === 'customer'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg mb-1">🛒</div>
                <div className="text-xs">Customer / Consumer</div>
                <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                  Buy fresh harvest directly from growers
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={mode === 'register' ? handleRegister : handleLogin} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === 'farmer' ? 'Enter your full name' : 'Enter your full name'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@kisanmitra.org"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                required
              />
            </div>
          )}

          {/* Farmer Specific Registration Fields */}
          {mode === 'register' && role === 'farmer' && (
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Tractor className="w-4 h-4 text-emerald-700" />
                <span>Farm & Producer Details</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Farm Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={e => setFarmName(e.target.value)}
                  placeholder="E.g. Green Valley Bio Farms"
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Location / District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={farmLocation}
                    onChange={e => setFarmLocation(e.target.value)}
                    placeholder="Nashik, Maharashtra"
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Farm Size (Acres)
                  </label>
                  <input
                    type="number"
                    value={farmSizeAcres}
                    onChange={e => setFarmSizeAcres(Number(e.target.value))}
                    min={1}
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Main Crops & Produce Grown
                </label>
                <input
                  type="text"
                  value={mainCrops}
                  onChange={e => setMainCrops(e.target.value)}
                  placeholder="E.g. Tomatoes, Wheat, Potatoes, Mangoes"
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Farming Practices
                </label>
                <input
                  type="text"
                  value={practices}
                  onChange={e => setPractices(e.target.value)}
                  placeholder="E.g. Drip Irrigation, Natural Vermicompost"
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Farm Story / Bio
                </label>
                <textarea
                  value={farmDescription}
                  onChange={e => setFarmDescription(e.target.value)}
                  rows={2}
                  placeholder="Briefly describe your agricultural background and produce..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 resize-none"
                />
              </div>
            </div>
          )}

          {/* Customer Specific Registration Fields */}
          {mode === 'register' && role === 'customer' && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Delivery Address (for Fresh Produce Delivery)</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Street / Apartment Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={e => setStreetAddress(e.target.value)}
                  placeholder="House #, Street, Locality"
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Postal Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="560001"
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Password {mode === 'register' && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-10 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{mode === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Fast Test Account Creator */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 text-center mb-2">
            Quick Test Accounts (Automatically enters real data)
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              type="button"
              onClick={() => handleCreateTestAccount('farmer')}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-[11px] transition-colors cursor-pointer"
            >
              👨‍🌾 Test Farmer
            </button>
            <button
              type="button"
              onClick={() => handleCreateTestAccount('customer')}
              className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-900 font-bold text-[11px] transition-colors cursor-pointer"
            >
              🛒 Test Consumer
            </button>
            <button
              type="button"
              onClick={() => handleCreateTestAccount('admin')}
              className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-purple-900 font-bold text-[11px] transition-colors cursor-pointer"
            >
              🛡️ Test Admin
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400">
          Kisan Mitra AI • Secured with Supabase Cloud Database & AES-256 Encryption
        </div>
      </div>
    </div>
  );
};
