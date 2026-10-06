import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  QrCode,
  Banknote,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderItem } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartTotal,
    checkoutModalOpen,
    setCheckoutModalOpen,
    placeOrder,
    currentUser,
    setActiveView
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Delivery form
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.customerProfile?.address || '');
  const [city, setCity] = useState(currentUser?.customerProfile?.city || '');
  const [state, setState] = useState(currentUser?.customerProfile?.state || '');
  const [postalCode, setPostalCode] = useState(currentUser?.customerProfile?.postalCode || '');

  React.useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name || '');
      if (!phone) setPhone(currentUser.phone || '');
      if (!street) setStreet(currentUser.customerProfile?.address || '');
      if (!city) setCity(currentUser.customerProfile?.city || '');
      if (!state) setState(currentUser.customerProfile?.state || '');
      if (!postalCode) setPostalCode(currentUser.customerProfile?.postalCode || '');
    }
  }, [currentUser]);

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Kisan Pay (Demo)' | 'UPI Demo' | 'Card Demo'>('UPI Demo');
  const [placedOrderSuccess, setPlacedOrderSuccess] = useState<any | null>(null);

  if (!checkoutModalOpen) return null;

  const deliveryFee = cartTotal >= 500 ? 0 : 40;
  const finalAmount = cartTotal + deliveryFee;

  const handleCompleteOrder = () => {
    const orderItems: OrderItem[] = cart.map(c => ({
      productId: c.product.id,
      productName: c.product.name,
      farmerId: c.product.farmerId,
      farmerName: c.product.farmerName,
      unitPrice: c.product.price,
      quantity: c.quantity,
      unit: c.product.unit,
      image: c.product.images[0]
    }));

    const newOrder = placeOrder({
      customerId: currentUser?.id || 'guest',
      customerName: fullName,
      customerPhone: phone,
      items: orderItems,
      totalAmount: cartTotal,
      deliveryFee,
      finalAmount,
      deliveryAddress: {
        fullName,
        phone,
        street,
        city,
        state,
        postalCode
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Completed on Delivery' : 'Paid (Demo)',
      estimatedDelivery: 'Tomorrow by 4:00 PM'
    });

    setPlacedOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              {placedOrderSuccess ? 'Harvest Order Confirmed' : 'Farm Direct Checkout'}
            </h3>
            <p className="text-xs text-slate-500">
              {placedOrderSuccess ? 'Produce queued for morning plucking' : `Step ${step} of 3 • Sustainable Packaging`}
            </p>
          </div>
          <button
            onClick={() => {
              setCheckoutModalOpen(false);
              setPlacedOrderSuccess(null);
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Successful Order Placed View */}
        {placedOrderSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Order Placed Successfully
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-serif mt-2">
                Order #{placedOrderSuccess.id}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Thank you, {placedOrderSuccess.customerName}! Your order has been sent directly to the farmers. They will harvest fresh produce for morning dispatch.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <strong className="text-emerald-900">{placedOrderSuccess.estimatedDelivery}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="truncate max-w-[200px] text-right font-medium">
                  {placedOrderSuccess.deliveryAddress.street}, {placedOrderSuccess.deliveryAddress.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid (Demo Mode):</span>
                <strong className="text-slate-900">₹{placedOrderSuccess.finalAmount}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-emerald-800 font-semibold">
                <span className="flex items-center gap-1">⚡ Supabase Database:</span>
                <span>Saved to 'orders' &amp; 'sales' tables</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setCheckoutModalOpen(false);
                  setPlacedOrderSuccess(null);
                  setActiveView('customer-orders');
                }}
                className="px-6 py-3 rounded-full bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-md"
              >
                Track Order on Timeline →
              </button>
              <button
                onClick={() => {
                  setCheckoutModalOpen(false);
                  setPlacedOrderSuccess(null);
                  setActiveView('marketplace');
                }}
                className="px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 1 ? 'text-emerald-800' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-emerald-800 text-white' : 'bg-slate-200'}`}>
                  1
                </span>
                <span>Delivery</span>
              </div>
              <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-emerald-800' : 'bg-slate-200'}`} />
              <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 2 ? 'text-emerald-800' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-emerald-800 text-white' : 'bg-slate-200'}`}>
                  2
                </span>
                <span>Review</span>
              </div>
              <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-emerald-800' : 'bg-slate-200'}`} />
              <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 3 ? 'text-emerald-800' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-emerald-800 text-white' : 'bg-slate-200'}`}>
                  3
                </span>
                <span>Payment</span>
              </div>
            </div>

            {/* STEP 1: DELIVERY ADDRESS */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Customer Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      placeholder="House / Flat No., Society, Landmark"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Postal Code (PIN)</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Order Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ORDER SUMMARY */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Order Summary & Produce Breakdown</h4>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{product.name}</div>
                          <div className="text-[11px] text-emerald-700">Grower: {product.farmerName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900">
                          {quantity} {product.unit} × ₹{product.price} = ₹{quantity * product.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-emerald-900/10 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Produce Subtotal:</span>
                    <span className="font-bold text-slate-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Farm Express Transit:</span>
                    <span className="font-bold text-emerald-800">
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Final Amount Payable:</span>
                    <span className="text-emerald-950 font-serif">₹{finalAmount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Address</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 flex items-center gap-1.5"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT ABSTRACTION */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Select Payment Method</h4>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                    TEST & DEMO MODE
                  </span>
                </div>

                {/* Payment Options */}
                <div className="space-y-2.5">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'UPI Demo'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'UPI Demo'}
                        onChange={() => setPaymentMethod('UPI Demo')}
                        className="accent-emerald-700"
                      />
                      <QrCode className="w-5 h-5 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">UPI Instant Pay (Demo)</div>
                        <div className="text-[10px] text-slate-500">Google Pay, PhonePe, BHIM Simulation</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800">Simulated Instant</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="accent-emerald-700"
                      />
                      <Banknote className="w-5 h-5 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Cash / UPI on Delivery</div>
                        <div className="text-[10px] text-slate-500">Pay when fresh farm produce reaches your door</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600">Zero Upfront</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Kisan Pay (Demo)'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Kisan Pay (Demo)'}
                        onChange={() => setPaymentMethod('Kisan Pay (Demo)')}
                        className="accent-emerald-700"
                      />
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Kisan Direct Wallet / KCC (Demo)</div>
                        <div className="text-[10px] text-slate-500">Farmer credit union escrow simulation</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-700">100% Direct</span>
                  </label>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span><strong>Supabase Backend:</strong> Connected to Project <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px]">errpumennbqcszbkpaai</code>. Submitting this order automatically writes to the Supabase database.</span>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  <strong>Notice:</strong> This is a secure prototype demo transaction. No real credit card or bank credentials will be charged.
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Review</span>
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    className="px-8 py-3 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-800/25 active:scale-98"
                  >
                    Place Farm Order (₹{finalAmount})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
