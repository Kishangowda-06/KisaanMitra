import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Camera,
  Layers,
  Calendar,
  IndianRupee,
  Activity,
  BarChart3,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory, ProductUnit } from '../../types';
import { CATEGORIES_LIST } from '../../data/mockData';
import { Tractor, Sparkles as SparklesIcon } from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loadStarterCropsForFarmer,
    orders,
    setActiveView,
    openAuthModal,
    diagnoses
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'diagnoses'>('overview');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Add/Edit Product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Vegetables');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(40);
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [availableQuantity, setAvailableQuantity] = useState(150);
  const [minOrderQuantity, setMinOrderQuantity] = useState(1);
  const [harvestDate, setHarvestDate] = useState('Freshly harvested today');
  const [organicStatus, setOrganicStatus] = useState(true);
  const [status, setStatus] = useState<'active' | 'out_of_stock' | 'draft'>('active');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80');

  // If user is not logged in or not a farmer, render registration / sign in prompt
  if (!currentUser || currentUser.role !== 'farmer') {
    return (
      <div className="py-20 bg-[#F8FAF7] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center border border-slate-200 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <Tractor className="w-8 h-8 text-emerald-700" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
              Farmer & Producer Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Please sign in with your farmer account or register your farm to manage produce listings, track sales revenue, and fulfill consumer orders.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => openAuthModal('login', 'farmer')}
              className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
            >
              Sign In as Farmer
            </button>
            <button
              onClick={() => openAuthModal('register', 'farmer')}
              className="px-6 py-3 rounded-xl border border-emerald-700 text-emerald-900 hover:bg-emerald-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Register New Farm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter products belonging to current farmer
  const farmerProducts = products.filter(
    p => p.farmerId === currentUser.id
  );

  // Filter orders containing current farmer's products
  const farmerOrders = orders.filter(ord =>
    ord.items.some(it => it.farmerId === currentUser.id)
  );

  // Statistics
  const totalSalesRevenue = farmerOrders.reduce((sum, ord) => sum + ord.finalAmount, 0);
  const totalInventoryKg = farmerProducts.reduce((sum, p) => sum + p.availableQuantity, 0);
  const activeProductCount = farmerProducts.filter(p => p.status === 'active').length;
  const todayOrdersCount = farmerOrders.length;

  const openAddModal = () => {
    setEditingProductId(null);
    setName('');
    setDescription('');
    setPrice(45);
    setUnit('kg');
    setAvailableQuantity(200);
    setHarvestDate('Freshly picked this morning');
    setOrganicStatus(true);
    setStatus('active');
    setProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description);
    setPrice(p.price);
    setUnit(p.unit);
    setAvailableQuantity(p.availableQuantity);
    setMinOrderQuantity(p.minOrderQuantity);
    setHarvestDate(p.harvestDate);
    setOrganicStatus(p.organicStatus);
    setStatus(p.status);
    setImageUrl(p.images[0]);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name,
        category,
        description,
        price: Number(price),
        unit,
        availableQuantity: Number(availableQuantity),
        minOrderQuantity: Number(minOrderQuantity),
        harvestDate,
        organicStatus,
        status,
        images: [imageUrl]
      });
    } else {
      addProduct({
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        farmName: currentUser.farmerProfile?.farmName || `${currentUser.name}'s Farm`,
        farmLocation: currentUser.farmerProfile?.location || 'Nashik, Maharashtra',
        farmerVerified: currentUser.farmerProfile?.verificationStatus === 'verified',
        farmerRating: currentUser.farmerProfile?.rating || 5.0,
        name,
        category,
        description,
        price: Number(price),
        unit,
        availableQuantity: Number(availableQuantity),
        minOrderQuantity: Number(minOrderQuantity),
        harvestDate,
        organicStatus,
        status,
        images: [imageUrl]
      });
    }

    setProductModalOpen(false);
  };

  return (
    <div className="py-10 bg-[#F8FAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-500/50"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
                    {currentUser.name}
                  </h1>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {currentUser.farmerProfile?.verificationStatus === 'verified' ? 'Verified Producer' : 'Pending Verification'}
                  </span>
                </div>
                <p className="text-emerald-200 text-xs sm:text-sm mt-0.5">
                  {currentUser.farmerProfile?.farmName || `${currentUser.name}'s Farm`} • {currentUser.farmerProfile?.location || 'India'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={openAddModal}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              {farmerProducts.length === 0 && (
                <button
                  onClick={() => loadStarterCropsForFarmer(currentUser)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
                  title="Quickly populate your farm with 3 sample harvest items"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Add Starter Crops</span>
                </button>
              )}

              <button
                onClick={() => {
                  setActiveView('ai-assistant');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>AI Crop Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
            }`}
          >
            Farm Overview & Revenue
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'products'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
            }`}
          >
            Manage Products & Inventory ({farmerProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
            }`}
          >
            Customer Orders ({farmerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('diagnoses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'diagnoses'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
            }`}
          >
            My AI Crop Scans ({diagnoses.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
                <span className="text-slate-400 text-xs font-bold block mb-1">Total Sales Revenue</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                  ₹{totalSalesRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last month
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
                <span className="text-slate-400 text-xs font-bold block mb-1">Active Harvest Listings</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-serif">
                  {activeProductCount} Crops
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">
                  Across 4 categories
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
                <span className="text-slate-400 text-xs font-bold block mb-1">Available Farm Stock</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                  {totalInventoryKg.toLocaleString()} Units
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">
                  Ready for morning plucking
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
                <span className="text-slate-400 text-xs font-bold block mb-1">Incoming Orders</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-serif">
                  {todayOrdersCount} Pending
                </div>
                <div className="text-[11px] text-amber-600 font-semibold mt-1">
                  Awaiting dispatch packing
                </div>
              </div>
            </div>

            {/* Visual Charts: Sales Over Time & Product Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sales over time bar chart mockup */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-serif">
                      Harvest Sales & Revenue Velocity
                    </h3>
                    <p className="text-xs text-slate-500">Monthly direct gross revenue (₹)</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Seasonal High
                  </span>
                </div>

                {/* SVG/CSS Bar Chart */}
                <div className="h-48 pt-6 flex items-end justify-between gap-3 border-b border-slate-100">
                  {[
                    { month: 'Apr', val: 18000, height: '40%' },
                    { month: 'May', val: 24500, height: '55%' },
                    { month: 'Jun', val: 32000, height: '70%' },
                    { month: 'Jul', val: 29000, height: '62%' },
                    { month: 'Aug', val: 41000, height: '88%' },
                    { month: 'Sep', val: 48500, height: '100%' }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                        ₹{(bar.val / 1000).toFixed(0)}k
                      </div>
                      <div
                        className="w-full max-w-[40px] bg-gradient-to-t from-emerald-800 to-emerald-600 rounded-t-xl group-hover:from-emerald-700 group-hover:to-teal-500 transition-all duration-300"
                        style={{ height: bar.height }}
                      />
                      <span className="text-[11px] font-bold text-slate-600">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Performance Breakdown */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-serif">
                  Top Performing Crops
                </h3>
                <div className="space-y-3">
                  {farmerProducts.slice(0, 4).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50">
                      <div className="flex items-center gap-2.5 truncate">
                        <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                        <div className="truncate">
                          <div className="font-bold text-slate-800 truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.availableQuantity} {p.unit} in stock</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-slate-900">₹{p.price}/{p.unit}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">{p.rating} ★</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS TABLE */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Active Farm Products ({farmerProducts.length})
                </h3>
                <p className="text-xs text-slate-500">Live prices and harvest availability on the public marketplace</p>
              </div>

              <button
                onClick={openAddModal}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Crop</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Crop Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Inventory</th>
                    <th className="p-4">Organic</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {farmerProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{prod.name}</div>
                            <div className="text-[10px] text-slate-400">{prod.harvestDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        ₹{prod.price}/{prod.unit}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-emerald-800">{prod.availableQuantity}</span> {prod.unit}
                      </td>
                      <td className="p-4">
                        {prod.organicStatus ? (
                          <span className="text-emerald-700 font-bold text-[11px]">✓ Yes</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Standard</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {prod.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Customer Orders Pipeline ({farmerOrders.length})
            </h3>
            <p className="text-xs text-slate-500">
              Update fulfillment stage (Order Placed → Confirmed → Preparing → Dispatched → Delivered).
            </p>
            <div className="space-y-4">
              {farmerOrders.map(order => (
                <div key={order.id} className="p-4 bg-white rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">#{order.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-slate-500">Customer: {order.customerName} ({order.customerPhone})</p>
                    <p className="text-slate-600 font-medium">
                      Items: {order.items.map(it => `${it.quantity} ${it.unit} ${it.productName}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end">
                    <span className="text-base font-extrabold text-slate-900 font-serif">₹{order.finalAmount}</span>
                    <button
                      onClick={() => setActiveView('customer-orders')}
                      className="text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Update Fulfillment Timeline →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MY AI CROP SCANS */}
        {activeTab === 'diagnoses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Archived Crop Diagnoses ({diagnoses.length})
                </h3>
                <p className="text-xs text-slate-500">Historical plant health assessments and organic action records</p>
              </div>
              <button
                onClick={() => {
                  setActiveView('ai-assistant');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900"
              >
                + New Crop Health Scan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnoses.map(diag => (
                <div key={diag.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {diag.plantIdentification}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{diag.probableIssue}</h4>
                      <p className="text-[11px] text-slate-400">{diag.createdAt}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {diag.confidence}% Confidence
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {diag.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800">
                      {diag.recommendedSteps.length} Prescribed Actions
                    </span>
                    <button
                      onClick={() => {
                        setActiveView('ai-assistant');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      View Full Diagnosis →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                {editingProductId ? 'Edit Farm Produce Listing' : 'List Fresh Harvest Produce'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="E.g. Desi Heirloom Tomatoes"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Organic Specials">Organic Specials</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Harvest Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe taste, soil practices, variety..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="box">box</option>
                    <option value="crate">crate</option>
                    <option value="bunch">bunch</option>
                    <option value="dozen">dozen</option>
                    <option value="bag">bag</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Quantity</label>
                  <input
                    type="number"
                    value={availableQuantity}
                    onChange={e => setAvailableQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harvest Date / Schedule</label>
                  <input
                    type="text"
                    value={harvestDate}
                    onChange={e => setHarvestDate(e.target.value)}
                    placeholder="Yesterday morning / Today"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Photo URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={organicStatus}
                    onChange={e => setOrganicStatus(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 accent-emerald-700"
                  />
                  <span>100% Organic Practice</span>
                </label>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="font-bold text-slate-700">Listing Status:</span>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-bold"
                  >
                    <option value="active">Active (In Marketplace)</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 shadow-md shadow-emerald-800/20"
                >
                  {editingProductId ? 'Update Listing' : 'Publish to Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
