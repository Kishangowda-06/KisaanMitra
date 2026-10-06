import React, { useState } from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Layers,
  MessageCircle,
  Phone,
  CheckCircle2,
  ArrowLeft,
  X,
  Send,
  Leaf
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../marketplace/ProductCard';

export const FarmerPublicProfile: React.FC = () => {
  const { users, selectedFarmerId, products, setActiveView, showToast } = useApp();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  const farmer = users.find(u => u.id === selectedFarmerId && u.role === 'farmer') ||
    users.find(u => u.role === 'farmer' && u.farmerProfile);

  if (!farmer || !farmer.farmerProfile) {
    return (
      <div className="py-20 bg-[#F8FAF7] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center border border-slate-200 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-800 font-serif">No Farmer Selected</h2>
          <p className="text-xs text-slate-500">
            Please select a verified agricultural producer from the directory to inspect their farm, soil practices, and produce.
          </p>
          <button
            onClick={() => setActiveView('farmers')}
            className="px-6 py-2.5 rounded-full bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-sm"
          >
            Browse Growers Directory
          </button>
        </div>
      </div>
    );
  }

  const profile = farmer.farmerProfile;

  const farmerProducts = products.filter(p => p.farmerId === farmer.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    showToast(`Direct message dispatched to ${farmer.name}!`, 'success');
    setMessageText('');
    setContactModalOpen(false);
  };

  return (
    <div className="py-10 bg-[#F8FAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => setActiveView('farmers')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Farmers</span>
        </button>

        {/* Farm Hero Banner */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm">
          {/* Banner Image */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-emerald-950">
            <img
              src={profile.bannerImage}
              alt={profile.farmName}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Verification Badge */}
            {profile.verificationStatus === 'verified' && (
              <span className="absolute top-4 right-4 bg-emerald-900/90 backdrop-blur-md text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-400/40 shadow-lg flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Agricultural Producer
              </span>
            )}
          </div>

          {/* Profile Header Details */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              <div className="flex items-end gap-5">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-white shadow-xl"
                />
                <div className="mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-tight">
                    {farmer.name}
                  </h1>
                  <p className="text-sm font-bold text-emerald-700">{profile.farmName}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.location}, {profile.state}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setContactModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Grower</span>
                </button>
              </div>
            </div>

            {/* Farm Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-6 rounded-2xl bg-[#F8FAF7] border border-emerald-900/10 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Farmer Rating</span>
                <div className="flex items-center gap-1 text-slate-900 font-extrabold text-sm mt-0.5">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span>{profile.rating}</span>
                  <span className="text-slate-400 text-[11px] font-normal">({profile.totalReviews} reviews)</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Farming Experience</span>
                <span className="text-slate-900 font-extrabold text-sm mt-0.5 block">
                  {profile.experienceYears} Years
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Cultivated Land</span>
                <span className="text-slate-900 font-extrabold text-sm mt-0.5 block">
                  {profile.farmSizeAcres} Acres
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Active Listings</span>
                <span className="text-emerald-800 font-extrabold text-sm mt-0.5 block">
                  {farmerProducts.length} Crops Available
                </span>
              </div>
            </div>

            {/* Bio Story */}
            <div className="mt-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-serif">About the Farm & Practices</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {profile.description}
              </p>

              {/* Sustainable Practices Pills */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 block mb-2">Sustainable & Organic Methods:</span>
                <div className="flex flex-wrap gap-2">
                  {profile.practices.map((pr, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5"
                    >
                      <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                      {pr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crops for Sale by this Farmer */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
              Fresh Produce Available from {farmer.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispatched fresh from {profile.location} directly to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmerProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT GROWER MODAL */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Message {farmer.name}</h3>
              <button onClick={() => setContactModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <p className="text-slate-600">
                Ask about bulk orders, custom harvest dates, or organic certifications.
              </p>
              <textarea
                rows={4}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Write your note to the farmer..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send Direct Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
