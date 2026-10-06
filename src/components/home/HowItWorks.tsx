import React from 'react';
import { UploadCloud, Cpu, ShieldCheck, ShoppingCart, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HowItWorks: React.FC = () => {
  const { setActiveView } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Describe or Upload',
      desc: 'Snap a photograph of your crop leaf, stem, fruit or soil. Or type symptoms in your native language.',
      icon: UploadCloud,
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      num: '02',
      title: 'AI Analyzes',
      desc: 'Multimodal vision models analyze lesion morphology, chlorosis patterns, and fungal/pest indicators in seconds.',
      icon: Cpu,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      num: '03',
      title: 'Get Safe Recommendations',
      desc: 'Receive transparent diagnosis confidence, organic remedies (neem, Trichoderma), and local KVK guidance.',
      icon: ShieldCheck,
      color: 'bg-amber-100 text-amber-800'
    },
    {
      num: '04',
      title: 'Take Action / Shop',
      desc: 'Apply remedies, log health recovery, or list healthy harvest directly on the Kisan Mitra marketplace.',
      icon: ShoppingCart,
      color: 'bg-teal-100 text-teal-800'
    }
  ];

  return (
    <section className="py-20 bg-[#F8FAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
            End-To-End Agronomic Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From first symptom to bountiful harvest and direct consumer delivery in 4 intuitive steps.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black tracking-widest text-slate-400 font-mono">
                      STEP {step.num}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout Action */}
        <div className="mt-14 max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-xl font-bold font-serif">Have a sick plant right now?</h4>
            <p className="text-xs text-emerald-200">
              Run a free diagnostic scan in under 10 seconds. No subscription needed.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveView('ai-assistant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-full bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md shrink-0"
          >
            Launch AI Crop Doctor →
          </button>
        </div>
      </div>
    </section>
  );
};
