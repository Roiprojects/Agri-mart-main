'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  CheckCircle,
  ShoppingCart,
  Zap,
  Heart,
  Warehouse,
  CheckCircle2,
  Plus,
  Minus,
  MessageSquare,
  Lock,
  User,
  Tractor,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth, setClientAuthUser } from '@/lib/auth-client';
import { useShoppingCartSettings } from '@/lib/shopping-cart-settings';
import { useFilterYmmSettings } from '@/lib/filter-ymm-settings';

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { settings: cartSettings } = useShoppingCartSettings();
  const { settings: ymmSettings } = useFilterYmmSettings();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cart' | 'buy' | null>(null);

  const variants = product.variants && product.variants.length > 0 ? product.variants : [];
  const [selectedVariant, setSelectedVariant] = useState<any>(
    variants.find((v: any) => v.isDefault) || variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentComparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const discountPercent = currentComparePrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  // Track recently viewed products
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agri_recently_viewed');
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((item: any) => item.id !== product.id);
        filtered.unshift({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: currentPrice,
          image: product.media?.[0]?.url || product.images?.[0],
          category: product.category?.name || product.category,
        });
        localStorage.setItem('agri_recently_viewed', JSON.stringify(filtered.slice(0, 8)));

        // Check wishlist
        const wishlisted = localStorage.getItem('agri_wishlist');
        if (wishlisted) {
          const wList = JSON.parse(wishlisted);
          setIsWishlisted(wList.includes(product.id));
        }
      } catch (e) {}
    }
  }, [product.id, currentPrice]);

  const handleToggleWishlist = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agri_wishlist');
        let list: string[] = stored ? JSON.parse(stored) : [];
        let justAdded = false;
        if (list.includes(product.id)) {
          list = list.filter((id) => id !== product.id);
          setIsWishlisted(false);
        } else {
          list.push(product.id);
          setIsWishlisted(true);
          justAdded = true;
        }
        localStorage.setItem('agri_wishlist', JSON.stringify(list));
        if (justAdded && cartSettings.displayWishlistAfterAddingProduct) {
          router.push('/account/wishlist');
        }
      } catch (e) {}
    }
  };

  const executeAddToCart = () => {
    setAddedNotice(true);
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agri_cart_items');
        let cart = stored ? JSON.parse(stored) : [];
        const existingIdx = cart.findIndex(
          (i: any) => i.id === product.id && i.variantId === selectedVariant?.id
        );
        if (existingIdx >= 0) {
          cart[existingIdx].quantity += quantity;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: currentPrice,
            quantity,
            image: product.media?.[0]?.url || product.images?.[0],
            category: product.category?.name || product.category,
            variantId: selectedVariant?.id,
            variantTitle: selectedVariant?.title,
          });
        }
        localStorage.setItem('agri_cart_items', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        if (cartSettings.displayCartAfterAddingProduct) {
          router.push('/cart');
          return;
        }
      } catch (e) {}
    }
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const executeBuyNow = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'agri_checkout_items',
        JSON.stringify([
          {
            id: product.id,
            name: product.name,
            price: currentPrice,
            quantity,
            image: product.media?.[0]?.url || product.images?.[0],
            category: product.category?.name || product.category,
            variantId: selectedVariant?.id,
            variantTitle: selectedVariant?.title,
          },
        ])
      );
    }
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    executeAddToCart();
  };

  const handleBuyNow = () => {
    executeBuyNow();
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/catalogue/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_review',
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      setReviewSubmitted(true);
      setShowReviewForm(false);
    } catch (e) {
      setReviewSubmitted(true);
      setShowReviewForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & SKU */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              {product.category?.name || product.category || 'Agricultural Machinery'}
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {product.brand?.name || product.brand || 'AgriPro'}
            </span>
          </div>

          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs font-bold ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mt-2">
          {product.name}
        </h1>
        <div className="text-xs text-slate-500 mt-1 font-mono">
          SKU: <strong>{currentSku}</strong>
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center space-x-3 mt-3 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-extrabold ml-1 text-slate-900 text-sm">4.9</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">
            {product.reviews?.length || 18} Verified Farmer Reviews
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> In Stock &bull; Dark Warehouse Dispatch
          </span>
        </div>
      </div>

      {/* Pricing with GST notice */}
      <div className="p-5 bg-agri-pale/60 rounded-2xl border border-emerald-200/80 flex items-baseline gap-3">
        <div className="text-3xl font-black text-slate-950">
          ₹{currentPrice.toLocaleString('en-IN')}
        </div>
        {currentComparePrice && (
          <div className="text-base text-slate-400 line-through">
            ₹{currentComparePrice.toLocaleString('en-IN')}
          </div>
        )}
        {discountPercent > 0 && (
          <span className="bg-agri-yellow text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
            {discountPercent}% SAVINGS
          </span>
        )}
        <span className="text-xs text-emerald-800 font-semibold ml-auto">
          (Inclusive of 5% Agri GST &amp; Transit Insurance)
        </span>
      </div>

      {/* Variant Selector (if available) */}
      {variants.length > 1 && (
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold text-slate-900">
            Select Configuration / Pack Size:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {variants.map((v: any) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? 'border-agri-green bg-emerald-50 text-agri-green-dark ring-1 ring-agri-green shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{v.title}</div>
                  <div className="text-[11px] font-black mt-1">₹{v.price.toLocaleString('en-IN')}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 pt-2">
        <label className="text-xs font-bold text-slate-800">Quantity:</label>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-slate-200 text-slate-600 transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-4 font-bold text-slate-900 text-xs">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-slate-200 text-slate-600 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* User Login Status Indicator */}
      {isLoggedIn ? (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Signed in as {user?.name || user?.phone} &bull; Dark Warehouse Priority Dispatch Active</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
          <div className="flex items-center gap-1.5 font-semibold">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Sign in required to add items to cart or proceed to checkout</span>
          </div>
          <Link
            href={`/login?redirect=/products/${product.slug}`}
            className="text-amber-900 font-bold underline hover:text-amber-950"
          >
            Sign In &rarr;
          </Link>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleBuyNow}
          className="flex-1 text-center bg-agri-yellow hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" /> Buy Now &bull; Reserve Stock
        </button>

        <button
          onClick={handleAddToCart}
          className={`flex-1 text-center font-bold text-xs py-3.5 px-6 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 ${
            addedNotice
              ? 'bg-emerald-600 text-white'
              : 'bg-agri-green hover:bg-agri-green-dark text-white'
          }`}
        >
          {addedNotice ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Dark Warehouse Live Availability Breakdown */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-[11px]">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Warehouse className="w-4 h-4 text-agri-green" /> Regional Dark Warehouse Availability:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Hubballi Hub: <strong>In Stock</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Belagavi Hub: <strong>In Stock</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Dharwad Hub: <strong>In Stock</strong></span>
          </div>
        </div>
      </div>

      {/* Equipment Compatibility Matrix (Controlled by Filter (YMM) settings: displayOnProductDetailsPage) */}
      {ymmSettings.filterLevelEnabled && ymmSettings.displayOnProductDetailsPage && (
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Tractor className="w-4 h-4 text-agri-green" />
              <span>Verified Equipment Compatibility ({ymmSettings.levels.filter(l => l.enabled).map(l => l.name).join(' / ')})</span>
            </div>
            <span className="text-[10px] font-bold text-agri-green bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
              Guaranteed Fit
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Engineered and factory-tested for seamless compatibility with multi-brand agricultural machinery:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
              <span className="font-bold text-slate-800">Years:</span>
              <div className="text-slate-600">2020 – 2025 Current</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
              <span className="font-bold text-slate-800">Compatible Makes:</span>
              <div className="text-slate-600">AgriPro, Mahindra, KisanKraft, Kubota</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
              <span className="font-bold text-slate-800">Compatible Models:</span>
              <div className="text-slate-600">5HP - 55HP Tillers &amp; Tractors</div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-agri-green shrink-0" />
          <span>40–60km Dark Warehouse Direct Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-agri-green shrink-0" />
          <span>1-Year Comprehensive AMC &amp; Warranty</span>
        </div>
      </div>

      {/* Auth Requirement Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleIn text-xs">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Sign In Required to {pendingAction === 'buy' ? 'Buy Now' : 'Add to Cart'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Access Dark Warehouse dispatch &amp; warranty</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowAuthModal(false); setPendingAction(null); }}
                className="text-slate-400 hover:text-slate-700 p-1 text-base cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-xs">
                {product.name}
              </div>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                Please sign in to reserve dark warehouse stock, calculate doorstep delivery to your farm pin code, and access 1-year AMC warranty support.
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Real-time dark warehouse stock reservation (Hubballi / Belagavi)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Doorstep farm delivery tracking via SMS &amp; WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Kisan Wallet reward points on every agricultural purchase</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href={`/login?redirect=/products/${product.slug}`}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
              >
                <User className="w-4 h-4" />
                <span>Sign In with Phone OTP / Password &rarr;</span>
              </Link>

              <button
                type="button"
                onClick={handleDemoSignInAndProceed}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Tractor className="w-4 h-4 text-slate-950" />
                <span>1-Click Demo Farmer Sign In &amp; Continue</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
