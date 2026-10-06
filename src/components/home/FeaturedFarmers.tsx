import React from 'react';
import { ShieldCheck, Star, MapPin, Package, ArrowRight, Tractor, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturedFarmers: React.FC = () => {
  const { users, setSelectedFarmerId, setActiveView, openAuthModal, currentUser } = useApp();

  const farmers = users.filter(u => u.role === 'farmer' && u.farmerProfile);

  return (
    <section className="py-20 bg-[#F4F7F3] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Verified Stewards of Soil
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mt-2">
              Agricultural Producers & Growers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Know who grows your food. Authentic profiles, farm locations, and direct-from-soil transparency.
            </p>
          </div>
          {farmers.length > 0 && (
            <button
              onClick={() => {
                setActiveView('farmers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
            >
              <span>View all {farmers.length} growers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Empty State when no farmers registered yet */}
        {farmers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-dashed border-emerald-300 shadow-xs max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <Tractor className="w-8 h-8 text-emerald-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Join the Kisan Mitra AI Producer Network
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                No farmers registered yet. Be among the first agricultural producers to create a verified farm profile and connect directly with local consumers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openAuthModal('register', 'farmer')}
                className="px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Tractor className="w-4 h-4" />
                <span>Register Your Farm Profile</span>
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-3 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                Sign In to Existing Farm
              </button>
            </div>
          </div>
        ) : (
          /* Farmers Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmers.map(farmer => {
              const profile = farmer.farmerProfile!;

              return (
                <div
                  key={farmer.id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Banner */}
                    <div className="relative h-28 w-full overflow-hidden bg-emerald-900">
                      <img
                        src={profile.bannerImage}
                        alt={profile.farmName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Verification Badge */}
                      {profile.verificationStatus === 'verified' && (
                        <span className="absolute top-3 right-3 bg-emerald-900/90 backdrop-blur-md text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Verified Farmer
                        </span>
                      )}
                    </div>

                    {/* Profile Avatar & Bio */}
                    <div className="px-5 pt-0 pb-4 relative">
                      <div className="-mt-10 mb-3 flex items-end justify-between">
                        <img
                          src={farmer.avatar}
                          alt={farmer.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
                        />
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                          <span>{profile.rating || 5.0}</span>
                          <span className="text-slate-400 text-[10px]">({profile.totalReviews || 0})</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 font-serif leading-tight">
                        {farmer.name}
                      </h3>
                      <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {profile.farmName}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{profile.location}</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {profile.description}
                      </p>

                      {/* Crops Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {profile.cropsGrown.slice(0, 3).map((crop, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        setSelectedFarmerId(farmer.id);
                        setActiveView('farmer-profile');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 rounded-xl border border-emerald-700/20 hover:bg-emerald-800 hover:text-white text-emerald-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                    >
                      <span>View Farm & Produce</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
