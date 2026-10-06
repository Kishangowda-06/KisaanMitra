import React from 'react';
import { Sparkles, ShoppingBag, Lightbulb, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WhyUs: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            The Kisan Mitra Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Why Kisan Mitra AI?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We bridge deep agronomic intelligence with a fair, disintermediated marketplace that rewards honest growers and delights consumers.
          </p>
        </div>

        {/* 3 Primary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: AI Crop Assistance */}
          <div className="rounded-3xl p-8 bg-gradient-to-b from-[#F3F8F2] to-white border border-emerald-900/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-800/20 mb-6 group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif mb-3">
                AI Crop Assistance
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Upload a plant photo or describe the problem. Our multimodal vision models instantly evaluate leaves, stems, and soil symptoms to pinpoint probable pathogens and abiotic stresses.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Early blight, wilt, rust & sucking pest detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Multi-language agricultural conversational assistant</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Archives crop history in farmer profile</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                setActiveView('ai-assistant');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Scan Crop Health</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Direct Farmer Marketplace */}
          <div className="rounded-3xl p-8 bg-gradient-to-b from-[#F9F7F1] to-white border border-amber-900/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-700/20 mb-6 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-7 h-7 text-amber-200" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif mb-3">
                Direct Farmer Marketplace
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Buy fresh agricultural products directly from producers. No mandi brokers, no predatory price cuts, and no long transit times compromising nutritional vitality.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Harvested same-day or day-before dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Verified grower profiles & farm coordinates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Direct farm pricing protects farmer livelihoods</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                setActiveView('marketplace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Browse Farm Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Smarter Agricultural Decisions */}
          <div className="rounded-3xl p-8 bg-gradient-to-b from-[#F2F7F8] to-white border border-teal-900/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-lg shadow-teal-800/20 mb-6 group-hover:scale-105 transition-transform">
                <Lightbulb className="w-7 h-7 text-teal-200" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif mb-3">
                Smarter Agricultural Decisions
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Get practical, easy-to-understand recommendations. We emphasize biological pest management, organic inputs like Jeevamrutha and neem, and clear guidance on when to seek KVK experts.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Safe non-toxic biological remedies preferred</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Clear distinction between observation and inference</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Integrates Soil Health Card & weather advisories</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                setActiveView('ai-assistant');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 px-4 rounded-xl bg-teal-50 text-teal-900 font-bold text-xs hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Learn Crop Management</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
