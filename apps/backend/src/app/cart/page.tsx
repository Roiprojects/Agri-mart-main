'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Truck, CheckCircle2, AlertCircle, Lock, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/lib/auth-client';
import { useShoppingCartSettings } from '@/lib/shopping-cart-settings';
import { SEED_PRODUCTS } from '@/lib/seed-data';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  variantId?: string;
  variantTitle?: string;
}

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { settings } = useShoppingCartSettings();
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'prod-001',
      name: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
      price: 36500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
      category: 'Farm Equipment & Machinery',
      variantId: 'var-001-1',
      variantTitle: '7 HP Petrol',
    },
    {
      id: 'prod-003',
      name: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
      price: 850,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
      category: 'Fertilizers & Soil Care',
      variantId: 'var-003-1',
      variantTitle: '5 Kg',
    },
  ]);

  const [couponCode, setCouponCode] = useState('MEGA1000');
  const [couponFeedback, setCouponFeedback] = useState<{ valid: boolean; message: string } | null>({
    valid: true,
    message: 'Coupon MEGA1000 applied (₹1,000 off)',
  });
  const [serverCalculation, setServerCalculation] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [deliveryPincode, setDeliveryPincode] = useState('580026');

  const syncCartToStorage = (updatedItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('agri_cart_items', JSON.stringify(updatedItems));
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (e) {}
    }
  };

  const recalculateCart = async (cartItems: CartItem[], code?: string, pin?: string) => {
    if (cartItems.length === 0) {
      setServerCalculation(null);
      return;
    }
    setIsCalculating(true);
    try {
      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ productId: i.id, variantId: i.variantId, quantity: i.quantity })),
          couponCode: code || undefined,
          pincode: pin || deliveryPincode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setServerCalculation(data);
        if (data.couponResult) {
          setCouponFeedback({
            valid: data.couponResult.valid,
            message: data.couponResult.message,
          });
        }
      }
    } catch (err) {
      console.error('Failed to calculate cart totals', err);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    let initialItems = items;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agri_cart_items');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialItems = parsed;
            setItems(parsed);
          }
        }
      } catch (e) {}
    }
    recalculateCart(initialItems, couponCode, deliveryPincode);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    if (!settings.allowCartItemEditing) return;

    if (delta > 0) {
      const currentTotal = items.reduce((s, i) => s + i.quantity, 0);
      if (currentTotal >= settings.maximumShoppingCartItems) {
        alert(`Maximum allowed items in shopping cart is ${settings.maximumShoppingCartItems}.`);
        return;
      }
    }

    const updated = items
      .map((item) => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          return newQ > 0 ? { ...item, quantity: newQ } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setItems(updated);
    syncCartToStorage(updated);
    recalculateCart(updated, couponCode, deliveryPincode);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    syncCartToStorage(updated);
    recalculateCart(updated, couponCode, deliveryPincode);
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    recalculateCart(items, couponCode, deliveryPincode);
  };

  const handleProceedCheckout = () => {
    // Store cart items for checkout session — open to everyone
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('agri_checkout_items', JSON.stringify(items));
      sessionStorage.setItem('agri_checkout_coupon', couponCode);
    }
    router.push('/checkout');
  };

  const crossSells = React.useMemo(() => {
    if (!settings.crossSellsNumber || settings.crossSellsNumber <= 0) return [];
    const itemIds = new Set(items.map((i) => i.id));
    return SEED_PRODUCTS.filter((p) => !itemIds.has(p.id)).slice(0, settings.crossSellsNumber);
  }, [items, settings.crossSellsNumber]);

  const addCrossSellItem = (product: any) => {
    const currentTotal = items.reduce((s, i) => s + i.quantity, 0);
    if (currentTotal >= settings.maximumShoppingCartItems) {
      alert(`Maximum allowed items in shopping cart is ${settings.maximumShoppingCartItems}.`);
      return;
    }
    const existing = items.find((i) => i.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      updated = [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0],
          category: product.category,
        },
      ];
    }
    setItems(updated);
    recalculateCart(updated, couponCode, deliveryPincode);
  };

  let subtotal = serverCalculation?.subtotal ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
  let discount = serverCalculation?.discount ?? (couponFeedback?.valid && settings.showDiscountBox ? 1000 : 0);
  let deliveryFee = serverCalculation?.deliveryFee ?? 0;
  let tax = serverCalculation?.tax ?? Math.round(subtotal * 0.05);
  let finalTotal = serverCalculation?.total ?? Math.max(0, subtotal - discount + deliveryFee + tax);

  if (settings.roundPricesDuringCalculation) {
    subtotal = Math.round(subtotal);
    discount = Math.round(discount);
    deliveryFee = Math.round(deliveryFee);
    tax = Math.round(tax);
    finalTotal = Math.round(finalTotal);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-xs">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Agricultural Shopping Cart</h1>
        <p className="text-xs text-slate-500 mt-1">Review farm equipment, fertilizers, and seed quantities before dark warehouse dispatch.</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  {settings.showProductImagesOnShoppingCart && (
                    <div className="relative w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] font-bold text-agri-green uppercase tracking-wider">{item.category}</div>
                    <div className="font-extrabold text-sm text-slate-900 line-clamp-1">{item.name}</div>
                    {item.variantTitle && (
                      <div className="text-[11px] text-slate-500">Variant: {item.variantTitle}</div>
                    )}
                    <div className="text-xs font-black text-slate-900 mt-1">₹{item.price.toLocaleString('en-IN')} each</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                  {settings.allowCartItemEditing ? (
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-bold text-slate-800 text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs">
                      Qty: {item.quantity}
                    </div>
                  )}

                  <div className="text-right min-w-[80px]">
                    <div className="font-black text-sm text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {settings.allowCartItemEditing && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary & Warehouse Routing Card */}
          <div className="lg:col-span-4 space-y-4">
            {/* Warehouse Routing Box */}
            {serverCalculation?.warehouseRouting && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-[11px] space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-agri-green" /> Nearest Fulfillment Hub
                </div>
                <div className="text-emerald-800">
                  Routing via <strong>{serverCalculation.warehouseRouting.assignedWarehouse.name}</strong>
                </div>
                <div className="text-emerald-700 text-[10px]">
                  Estimated Delivery: {serverCalculation.warehouseRouting.estimatedDelivery}
                </div>
              </div>
            )}

            {/* Coupon Box */}
            {settings.showDiscountBox && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-agri-green" /> Apply Kisan Discount Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. MEGA1000, KISAN500"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 p-2.5 border border-slate-300 rounded-xl font-mono uppercase text-xs focus:ring-1 focus:ring-agri-green outline-none"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 rounded-xl text-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {couponFeedback && (
                  <div className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                    couponFeedback.valid ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {couponFeedback.valid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{couponFeedback.message}</span>
                  </div>
                )}
              </div>
            )}

            {/* Server-Side Calculated Totals */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3">
                Order Value Breakdown (Server-Verified)
              </h3>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount:</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Agricultural GST (5% Included):</span>
                  <span className="font-semibold text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Warehouse Express Freight:</span>
                  <span className="font-semibold text-slate-900">
                    {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE (Above ₹10k)</span> : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-black text-slate-950">
                  <span>Payable Amount:</span>
                  <span className="text-base text-agri-green-dark">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {isLoggedIn && user && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Signed in as {user?.name || user?.phone}</span>
                </div>
              )}

              <button
                onClick={handleProceedCheckout}
                disabled={isCalculating}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Proceed to Warehouse Routing &amp; Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stock reserved atomically upon checkout submission</span>
              </div>
            </div>
          </div>

          {/* Cross-Sells Recommendations Box (nopCommerce CrossSellsNumber setting) */}
          {settings.crossSellsNumber > 0 && crossSells.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Recommended Supplies for Your Farm (Cross-Sells)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Farmers who bought items in your cart also bundled these agricultural inputs:
                  </p>
                </div>
                <span className="text-[10px] font-bold text-agri-green bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Fast Fulfillment
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {crossSells.map((prod) => (
                  <div
                    key={prod.id}
                    className="border border-slate-200 rounded-2xl p-3 flex flex-col justify-between hover:border-agri-green/60 transition bg-slate-50/50"
                  >
                    <div>
                      <div className="relative aspect-video w-full rounded-xl bg-slate-100 overflow-hidden mb-2.5">
                        <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div className="text-[10px] font-bold text-agri-green uppercase tracking-wider">
                        {prod.category}
                      </div>
                      <div className="font-bold text-xs text-slate-900 line-clamp-1">{prod.name}</div>
                      <div className="font-black text-xs text-slate-900 mt-1">₹{prod.price.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() => addCrossSellItem(prod)}
                      className="mt-3 w-full py-1.5 bg-slate-900 hover:bg-agri-green text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <p className="text-slate-500">Your shopping cart is currently empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-agri-green text-white font-bold text-xs px-6 py-3 rounded-xl"
          >
            Explore Catalogue
          </Link>
        </div>
      )}
    </div>
  );
}
