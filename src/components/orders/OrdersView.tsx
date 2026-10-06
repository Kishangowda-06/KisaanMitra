import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Filter,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, currentUser, setActiveView, openAuthModal } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('All');

  if (!currentUser) {
    return (
      <div className="py-20 bg-[#F8FAF7] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center border border-slate-200 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <Package className="w-8 h-8 text-emerald-700" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
              Track Your Harvest Orders
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Please sign in with your customer account or register to view your order history, packaging progress, and delivery tracking.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => openAuthModal('login', 'customer')}
              className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => openAuthModal('register', 'customer')}
              className="px-6 py-3 rounded-xl border border-emerald-700 text-emerald-900 hover:bg-emerald-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Create Customer Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter orders based on user role
  const relevantOrders = orders.filter(ord => {
    if (currentUser?.role === 'farmer') {
      // Farmer sees orders that contain items grown by them
      const hasFarmerItems = ord.items.some(it => it.farmerId === currentUser.id);
      return hasFarmerItems;
    }
    // Customer sees their own orders
    return ord.customerId === currentUser?.id || currentUser?.role === 'admin';
  });

  const filteredOrders = statusFilter === 'All'
    ? relevantOrders
    : relevantOrders.filter(o => o.status === statusFilter);

  const statusesList: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Preparing',
    'Dispatched',
    'Delivered'
  ];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Preparing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Dispatched':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="py-10 bg-[#F8FAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Harvest Fulfillment Pipeline
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight mt-1.5">
              {currentUser?.role === 'farmer' ? 'Incoming Customer Orders' : 'My Orders & Real-time Tracking'}
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              {currentUser?.role === 'farmer'
                ? 'Manage farm packaging, dispatch schedules, and order state transitions.'
                : 'Track farm plucking, packaging, and cold-van delivery directly from growers.'}
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-hidden text-emerald-900 font-bold"
            >
              <option value="All">All ({relevantOrders.length})</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Feed */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-serif">
              No orders found in this category
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {currentUser?.role === 'farmer'
                ? 'Your farm has no pending orders matching this filter.'
                : 'You have not placed any orders yet. Explore our farm direct marketplace!'}
            </p>
            {currentUser?.role !== 'farmer' && (
              <button
                onClick={() => setActiveView('marketplace')}
                className="px-6 py-2.5 rounded-full bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-sm"
              >
                Explore Fresh Produce
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="p-5 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-extrabold text-slate-900 text-sm font-mono">
                      #{order.id}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">Placed on: {order.createdAt}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">Customer: <strong>{order.customerName}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items & Delivery Info */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Items list */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Harvest Items ({order.items.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{item.productName}</div>
                              <div className="text-[11px] text-emerald-700">
                                Grower: {item.farmerName}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-slate-900">
                              {item.quantity} {item.unit}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              ₹{item.unitPrice * item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>Total Paid:</span>
                      <span className="text-base text-emerald-950 font-serif">
                        ₹{order.finalAmount} ({order.paymentMethod})
                      </span>
                    </div>
                  </div>

                  {/* Right: Timeline & Farmer Actions */}
                  <div className="lg:col-span-5 bg-[#FAFBF9] p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Fulfillment Lifecycle
                    </h4>

                    {/* Timeline */}
                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                      {order.timeline.map((entry, idx) => (
                        <div key={idx} className="relative flex items-start gap-3 pl-6 text-xs">
                          <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between font-bold text-slate-800">
                              <span>{entry.status}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{entry.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{entry.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Farmer Action: Progress Order Status */}
                    {currentUser?.role === 'farmer' && (
                      <div className="pt-3 border-t border-slate-200">
                        <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                          Farmer Control: Advance Order Status
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {statusesList.map(st => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(order.id, st)}
                              disabled={order.status === st}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                order.status === st
                                  ? 'bg-emerald-800 text-white cursor-default'
                                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-emerald-50 hover:text-emerald-800 cursor-pointer'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
