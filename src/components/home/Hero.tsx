import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Camera,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Users,
  Search,
  Activity,
  Tractor,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Hero: React.FC = () => {
  const { setActiveView, openAuthModal, products } = useApp();
  const [quickSymptom, setQuickSymptom] = useState('My tomato leaves are turning yellow with brown spots');

  const handleQuickScan = () => {
    setActiveView('ai-assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topProduct = products[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-[#F8FAF7] pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative background glow & mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-200/30 to-amber-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy, Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Super Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-bold tracking-wide shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Next-Gen AgTech + Direct-to-Consumer Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-serif leading-[1.15] tracking-tight">
              Smarter Farming.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700">
                Better Harvests.
              </span>{' '}
              Direct to Your Customers.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Kisan Mitra AI helps farmers understand crop problems, make informed decisions, and sell fresh agricultural products directly to consumers.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveView('ai-assistant');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-emerald-800 text-white font-bold text-base hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>Ask Kisan Mitra AI</span>
                <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActiveView('marketplace');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white text-emerald-950 font-bold text-base border-2 border-emerald-800/20 hover:border-emerald-700 hover:bg-emerald-50/50 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <span>Explore Fresh Products</span>
              </button>
            </div>

            {/* Secondary Actions: Real registration / login triggers */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <button
                onClick={() => openAuthModal('register', 'farmer')}
                className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-4 cursor-pointer flex items-center gap-1.5"
              >
                <Tractor className="w-4 h-4" />
                <span>Become a Farmer Seller</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => openAuthModal('register', 'customer')}
                className="text-slate-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Start Shopping as Consumer</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Farm Direct Sourcing</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">98.4%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Diagnosis Precision</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">0%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Middleman Cut</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual combining Agricultural Scene + Modern AI Interface */}
          <div className="lg:col-span-5 relative">
            {/* Background Decorative Rings */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-600/10 via-amber-500/10 to-emerald-400/10 rounded-3xl blur-xl transform -rotate-1" />

            <div className="relative bg-white rounded-3xl p-5 shadow-2xl border border-emerald-900/10 space-y-4">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    🌱
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Live AI Crop Health Diagnostic</h3>
                    <p className="text-[10px] text-emerald-700 font-medium">Multimodal Plant Pathology Engine</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <Activity className="w-3 h-3 mr-1 text-emerald-600 animate-pulse" /> Live Analysis
                </span>
              </div>

              {/* Plant Card Showcase with Scanner overlay */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 group shadow-inner border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
                  alt="Farmer examining healthy organic produce"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* AI Laser Scanline Simulation */}
                <div className="absolute inset-x-0 top-1/3 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />

                {/* Floating Detection Tags */}
                <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-emerald-400/40 shadow-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Crop Health & Pathology Scanner</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-semibold px-3 py-1.5 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-normal">Diagnosis Assistant</span>
                    <strong className="text-emerald-950">Immediate Organic Solutions</strong>
                  </div>
                </div>
              </div>

              {/* Instant Try-Prompt Bar */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Describe what you see or upload leaf photo:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickSymptom}
                    onChange={e => setQuickSymptom(e.target.value)}
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                  />
                  <button
                    onClick={handleQuickScan}
                    className="px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Diagnose</span>
                  </button>
                </div>
              </div>

              {/* Mini Marketplace Teaser pill */}
              <div
                onClick={() => {
                  if (topProduct) {
                    setActiveView('marketplace');
                  } else {
                    openAuthModal('register', 'farmer');
                  }
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm">
                    {topProduct ? '🌾' : '🚜'}
                  </div>
                  <div>
                    {topProduct ? (
                      <>
                        <div className="text-xs font-bold">{topProduct.name} listed by {topProduct.farmerName}</div>
                        <div className="text-[10px] text-emerald-300">₹{topProduct.price}/{topProduct.unit} • {topProduct.farmLocation}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs font-bold">Direct Farmer Marketplace Ready</div>
                        <div className="text-[10px] text-emerald-300">Register your farm or start buying fresh produce</div>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-0.5">
                  {topProduct ? 'Shop' : 'Join'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
