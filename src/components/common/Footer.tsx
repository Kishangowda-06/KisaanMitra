import React from 'react';
import { Sprout, Sparkles, Shield, Heart, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/80">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center border border-emerald-400/30">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl font-serif text-white tracking-tight">
                Kisan<span className="text-emerald-400">Mitra</span> AI
              </span>
            </div>

            <p className="text-emerald-200/80 text-sm leading-relaxed max-w-sm">
              Empowering farmers with intelligent computer-vision crop diagnostics and direct, transparent farm-to-consumer agricultural commerce. Cultivating prosperity from seed to harvest.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-emerald-300">
              <span className="px-2.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/50 flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Verified Producers
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/50 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Gemini Vision AI
              </span>
            </div>
          </div>

          {/* Core Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              AI Agricultural Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/70">
              <li>
                <button
                  onClick={() => {
                    setActiveView('ai-assistant');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  AI Plant Disease Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('ai-assistant');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Agronomist Chatbot
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Soil Health Guidelines
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Organic Bio-Formulations
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Weather & Spray Alerts
                </span>
              </li>
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Fresh Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/70">
              <li>
                <button
                  onClick={() => {
                    setActiveView('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Fresh Vegetables & Herbs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Orchard Fresh Fruits
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Indigenous Millets & Grains
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('farmers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Meet Verified Farmers
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Farmer Support Desk
            </h4>
            <div className="space-y-3 text-xs text-emerald-200/80">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">1800-180-1551</div>
                  <div className="text-[10px] text-emerald-400">Kisan Call Centre (24x7 Free)</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">support@kisanmitra.org</div>
                  <div className="text-[10px] text-emerald-400">Direct Producer Desk</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div>New Delhi • Nashik • Ludhiana • Mandya</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer and Legal */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60">
          <p className="max-w-2xl text-[11px] leading-relaxed text-emerald-300/70">
            <strong>Important Agricultural Guidance Notice:</strong> Kisan Mitra AI provides informational recommendations and probable plant health assessments based on visual symptoms. AI recommendations do not replace certified agronomists or local Krishi Vigyan Kendra (KVK) soil tests for severe blight or epidemic conditions.
          </p>
          <div className="text-right whitespace-nowrap text-[11px]">
            © {new Date().getFullYear()} Kisan Mitra AI. Made with care for farming communities.
          </div>
        </div>
      </div>
    </footer>
  );
};
