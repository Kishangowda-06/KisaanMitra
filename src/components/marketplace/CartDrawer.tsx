import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    setCheckoutModalOpen,
    setActiveView
  } = useApp();

  if (!cartDrawerOpen) return null;

  const deliveryFee = cartTotal >= 500 || cartTotal === 0 ? 0 : 40;
  const finalTotal = cartTotal + deliveryFee;

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Harvest Cart</h3>
                <p className="text-xs text-slate-500">{cart.length} unique produce items</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800 font-serif">
                  Your cart is waiting for something fresh.
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse tomatoes, seasonal fruits, organic millets and pure pulses direct from farmers.
                </p>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    setActiveView('marketplace');
                  }}
                  className="mt-4 px-6 py-2.5 bg-emerald-800 text-white rounded-full text-xs font-bold hover:bg-emerald-900 transition-colors shadow-sm"
                >
                  Explore Marketplace
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-3"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                    <p className="text-[11px] text-emerald-700 font-medium">{product.farmerName}</p>
                    <div className="text-xs font-extrabold text-slate-900 mt-1">
                      ₹{product.price * quantity}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        (₹{product.price}/{product.unit})
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-slate-300 hover:text-rose-500 p-0.5 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        className="p-1 rounded bg-white text-slate-600 hover:text-black shadow-2xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        className="p-1 rounded bg-white text-slate-600 hover:text-black shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Produce Subtotal:</span>
                  <span className="font-bold text-slate-800">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Farm Express Delivery:</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-700">FREE (Orders &gt; ₹500)</span>
                  ) : (
                    <span className="font-bold text-slate-800">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-emerald-950 font-serif">₹{finalTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-emerald-800 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>100% Direct Farmer Payment Guarantee. Safe prototype checkout.</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-lg shadow-emerald-800/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
