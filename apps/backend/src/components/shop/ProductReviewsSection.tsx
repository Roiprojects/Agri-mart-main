'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle2, Send, Lock } from 'lucide-react';
import { getProductOverrideById } from '@/lib/admin-product-overrides';
import { useAuth } from '@/lib/auth-client';

interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt?: string;
}

interface ProductReviewsSectionProps {
  productId: string;
  productSlug: string;
  productName: string;
  initialAllowCustomerReviews?: boolean;
  initialReviews: ReviewItem[];
}

const LOCAL_REVIEWS_KEY = 'agrimart_product_reviews_v1';

export default function ProductReviewsSection({
  productId,
  productSlug,
  productName,
  initialAllowCustomerReviews = true,
  initialReviews,
}: ProductReviewsSectionProps) {
  const { user } = useAuth();
  const [allowReviews, setAllowReviews] = useState<boolean>(initialAllowCustomerReviews);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || []);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user?.name && !customerName) {
      setCustomerName(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    const ov = getProductOverrideById(productId);
    if (ov && ov.allowCustomerReviews !== undefined) {
      setAllowReviews(Boolean(ov.allowCustomerReviews));
    } else {
      setAllowReviews(initialAllowCustomerReviews);
    }

    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(LOCAL_REVIEWS_KEY);
        if (raw) {
          const allLocal = JSON.parse(raw) || {};
          const localForProd: ReviewItem[] = Array.isArray(allLocal[productId]) ? allLocal[productId] : [];
          if (localForProd.length > 0) {
            const existingIds = new Set((initialReviews || []).map((r) => r.id));
            const merged = [...localForProd.filter((r) => !existingIds.has(r.id)), ...(initialReviews || [])];
            setReviews(merged);
          }
        }
      } catch {}
    }
  }, [productId, initialAllowCustomerReviews, initialReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowReviews) return;

    if (!title.trim() || !comment.trim()) {
      setFeedbackMsg({
        text: 'Please enter both a review summary and your feedback comments.',
        type: 'error',
      });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productSlug || productId)}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          comment: comment.trim(),
          customerName: customerName.trim() || user?.name || 'Verified Farmer',
          userId: user?.id,
        }),
      });
      const json = await res.json();

      const newRev: ReviewItem = json.data || {
        id: `rev-${Date.now()}`,
        customerName: customerName.trim() || user?.name || 'Verified Farmer',
        rating,
        title: title.trim(),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      if (!res.ok && res.status === 403) {
        setFeedbackMsg({
          text: json.message || 'Reviews are disabled for this product.',
          type: 'error',
        });
        setSubmitting(false);
        return;
      }

      // Persist locally so serverless reloads keep the newly submitted review
      if (typeof window !== 'undefined') {
        try {
          const raw = window.localStorage.getItem(LOCAL_REVIEWS_KEY);
          const allLocal = raw ? JSON.parse(raw) : {};
          const existingList = Array.isArray(allLocal[productId]) ? allLocal[productId] : [];
          allLocal[productId] = [newRev, ...existingList];
          window.localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(allLocal));
        } catch {}
      }

      setReviews((prev) => [newRev, ...prev]);
      setTitle('');
      setComment('');
      setRating(5);
      setShowForm(false);
      setFeedbackMsg({
        text: 'Thank you! Your 5-star rating and review have been published.',
        type: 'success',
      });
    } catch {
      setFeedbackMsg({
        text: 'Could not submit review right now. Please try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!allowReviews) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold">
          <Lock className="w-4 h-4 text-slate-400" />
          <span>Customer reviews and ratings are currently disabled for {productName}.</span>
        </div>
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-agri-green" /> Verified Farmer Reviews &amp; Field Experiences
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Average Rating: <strong className="text-slate-800">{avgRating} / 5.0</strong> ({reviews.length} review{reviews.length === 1 ? '' : 's'})
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2 rounded-xl bg-agri-green hover:bg-agri-green-dark text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto"
        >
          {showForm ? 'Cancel Review' : 'Write a Review & Rate'}
        </button>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold border ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Your Star Rating (1–5 Stars)
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          active ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-xs font-bold text-slate-700">{rating} / 5</span>
              </div>
            </div>

            <div className="sm:w-64">
              <label className="block text-xs font-bold text-slate-800 mb-1">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Gowda"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:border-agri-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Product Quality Summary *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Great build quality and fuel efficiency"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:border-agri-green"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Comments on Product Quality &amp; Shopping Experience *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback about product quality, delivery, and shopping experience..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:border-agri-green resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-agri-green hover:bg-agri-green-dark disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Farmer Purchase
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">{rev.title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{rev.comment}</p>
              <div className="text-[10px] text-slate-400 font-medium pt-1">
                &mdash; {rev.customerName}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No reviews yet for this product. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
