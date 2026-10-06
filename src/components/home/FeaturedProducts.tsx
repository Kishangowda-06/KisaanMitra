import React from 'react';
import { ShoppingBag, ArrowRight, Star, Heart, MapPin, CheckCircle, Plus, Tractor } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const FeaturedProducts: React.FC = () => {
  const { products, addToCart, wishlist, toggleWishlist, setSelectedProduct, setActiveView, openAuthModal, currentUser } = useApp();

  const featured = products.filter(p => p.featured || true).slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Farm Fresh Harvest
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mt-2">
              Featured Agricultural Produce
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Pure heirloom vegetables, sun-ripened orchard fruits, and unpolished grains direct from verified soil stewards.
            </p>
          </div>
          {products.length > 0 && (
            <button
              onClick={() => {
                setActiveView('marketplace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
            >
              <span>Explore all {products.length} products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Empty State when no produce listed yet */}
        {products.length === 0 ? (
          <div className="bg-[#F8FAF7] rounded-3xl p-12 sm:p-16 text-center border border-dashed border-emerald-300 shadow-xs max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <ShoppingBag className="w-8 h-8 text-emerald-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Direct Agricultural Produce Marketplace
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Registered farmers and agricultural producers enter their farm harvest details, vegetables, fruits, and grains directly into the platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {currentUser?.role === 'farmer' ? (
                <button
                  onClick={() => {
                    setActiveView('farmer-dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Your Fresh Harvest Produce</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('register', 'farmer')}
                  className="px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Tractor className="w-4 h-4" />
                  <span>Register as Farmer & List Produce</span>
                </button>
              )}
              <button
                onClick={() => openAuthModal('register', 'customer')}
                className="px-6 py-3 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                Sign Up as Consumer
              </button>
            </div>
          </div>
        ) : (
          /* Product Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(product => {
              const isWishlisted = wishlist.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image & Top Badges */}
                  <div
                    className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Organic Badge */}
                    {product.organicStatus && (
                      <span className="absolute top-3 left-3 bg-emerald-950/85 backdrop-blur-md text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Organic
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-white/80 text-slate-600 hover:text-rose-500 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Harvest Tag */}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {product.harvestDate}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Farmer & Location */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="flex items-center gap-1 font-semibold text-emerald-800">
                          {product.farmerName}
                          {product.farmerVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {product.farmLocation.split(',')[0]}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold text-emerald-950 font-serif">
                            ₹{product.price}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">/{product.unit}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          {product.availableQuantity} {product.unit} available
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-md shadow-emerald-800/10 active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
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
