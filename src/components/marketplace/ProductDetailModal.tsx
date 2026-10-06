import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  CheckCircle,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  Truck,
  Leaf,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
    currentUser,
    setCheckoutModalOpen,
    setSelectedFarmerId,
    setActiveView
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!selectedProduct) return null;

  const productReviews = reviews.filter(r => r.productId === selectedProduct.id);
  const isWishlisted = wishlist.includes(selectedProduct.id);

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setCheckoutModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      productId: selectedProduct.id,
      customerId: currentUser?.id || 'guest',
      customerName: currentUser?.name || 'Verified Customer',
      customerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true
    });

    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200/90 my-8">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-800 shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-200 mb-3 shadow-inner">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />

                {selectedProduct.organicStatus && (
                  <span className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-400/40 shadow-sm flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-400" />
                    100% Organic Certified
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Farm Story Card */}
            <div className="mt-6 bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Direct From Grower
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Producer
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  👨‍🌾
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{selectedProduct.farmerName}</h4>
                  <p className="text-[11px] text-emerald-700 font-medium">{selectedProduct.farmName}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedProduct.farmLocation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFarmerId(selectedProduct.farmerId);
                  setSelectedProduct(null);
                  setActiveView('farmer-profile');
                }}
                className="w-full text-center text-xs font-bold text-emerald-800 hover:text-emerald-950 pt-2 border-t border-slate-100"
              >
                View Full Farm Profile & Other Crops →
              </button>
            </div>
          </div>

          {/* Details & Actions Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Ratings */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {selectedProduct.category}
                </span>

                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-slate-400 font-normal">
                    ({selectedProduct.reviewCount} customer reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-extrabold text-slate-900 font-serif leading-tight">
                {selectedProduct.name}
              </h2>

              {/* Price & Unit */}
              <div className="flex items-baseline gap-2 bg-[#F8FAF7] p-3.5 rounded-2xl border border-emerald-900/10">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{selectedProduct.price}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  per {selectedProduct.unit}
                </span>
                <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {selectedProduct.availableQuantity} {selectedProduct.unit} in stock
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Nutritional Highlights */}
              {selectedProduct.nutritionalHighlights && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">Highlights:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.nutritionalHighlights.map((hl, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Harvest details */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Harvested: {selectedProduct.harvestDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Express Cold-Van Dispatch</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Select Quantity:</span>
                <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 rounded-full hover:bg-white text-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-900 w-8 text-center">
                    {quantity} {selectedProduct.unit}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-full hover:bg-white text-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(selectedProduct, quantity)}
                  className="py-3 px-4 rounded-xl bg-white border-2 border-emerald-800 text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (₹{selectedProduct.price * quantity})</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md shadow-emerald-800/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span>Buy Now Directly</span>
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isWishlisted
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-slate-600 hover:text-slate-800 bg-slate-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              Verified Customer Reviews ({productReviews.length})
            </h3>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              {showReviewForm ? 'Cancel Review' : '+ Write a Review'}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= reviewRating ? 'text-amber-400 fill-current' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your experience with the freshness, aroma, or delivery of this harvest..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900"
              >
                Post Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {productReviews.length === 0 ? (
              <p className="text-xs text-slate-400">
                Be the first customer to review this harvest!
              </p>
            ) : (
              productReviews.map(rev => (
                <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{rev.customerName}</span>
                    <span className="text-slate-400 text-[10px]">{rev.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
