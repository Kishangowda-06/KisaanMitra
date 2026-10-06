import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  ArrowUpDown,
  RotateCcw,
  Check,
  Plus,
  Tractor
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES_LIST } from '../../data/mockData';

export const MarketplaceView: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currentUser,
    setActiveView,
    openAuthModal
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchFarmer = p.farmerName.toLowerCase().includes(q);
          const matchLoc = p.farmLocation.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchFarmer && !matchLoc) return false;
        }
        // Organic
        if (organicOnly && !p.organicStatus) return false;
        // In-stock
        if (inStockOnly && p.availableQuantity <= 0) return false;
        // Price
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, organicOnly, inStockOnly, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setOrganicOnly(false);
    setInStockOnly(true);
    setMaxPrice(1000);
    setSortBy('featured');
  };

  return (
    <div className="py-10 bg-[#F8FAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Farmer Shortcut Banner if logged in as farmer */}
        {currentUser?.role === 'farmer' && (
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-emerald-400/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-lg">
                👨‍🌾
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Welcome to Farm Marketplace, {currentUser.name}!
                </h4>
                <p className="text-xs text-emerald-300">
                  {currentUser.farmerProfile?.farmName} • Ready to sell today&apos;s harvest to consumers?
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('farmer-dashboard')}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>List New Harvest Produce</span>
            </button>
          </div>
        )}

        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Soil-to-Table Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              Farm Fresh Agricultural Produce
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Browse organic vegetables, sun-ripened fruits, stone-milled grains, and farm pulses directly from registered farmers.
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-hidden text-emerald-900 font-bold cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated (Stars)</option>
                <option value="newest">Fresh Harvest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES_LIST.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Layout (Filters Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filter Sidebar (Desktop) */}
          <aside className={`lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-6 ${filterDrawerOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-700" />
                Refine Produce
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search inside filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Keyword / Crop / Farm:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search produce, crops, farmer..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Max Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Max Price / Unit:</span>
                <span className="text-emerald-900 font-extrabold font-serif">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min={20}
                max={1500}
                step={10}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>₹20</span>
                <span>₹1,500</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={e => setOrganicOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 cursor-pointer"
                />
                <span>Certified Organic Only</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Farm Origin Guarantee Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Kisan Farm Direct Pledge</span>
              </div>
              <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                All listed produce comes directly from verified agricultural producers with zero middleman markups.
              </p>
            </div>
          </aside>

          {/* Right Column: Product Cards Grid */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing <strong className="text-slate-800">{filteredProducts.length}</strong> fresh agricultural products
              </span>
              {selectedCategory !== 'All' && (
                <span className="font-semibold text-emerald-800">
                  Category: {selectedCategory}
                </span>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-serif">
                  {products.length === 0
                    ? 'No Produce Listed in Marketplace Yet'
                    : 'No crops found matching your filters'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {products.length === 0
                    ? 'Farmers and agricultural producers can register and list fresh produce directly to consumers. Log in or create an account to start!'
                    : 'Try adjusting the price range slider or clearing the category and organic filters.'}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  {products.length === 0 ? (
                    <>
                      <button
                        onClick={() => openAuthModal('register', 'farmer')}
                        className="px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        Register as Farmer / List Produce
                      </button>
                      <button
                        onClick={() => openAuthModal('login')}
                        className="px-6 py-2.5 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        Sign In
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={resetFilters}
                      className="px-6 py-2.5 rounded-full bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
