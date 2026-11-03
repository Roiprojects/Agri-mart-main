'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MessageSquare, CheckCircle2, AlertCircle, User, ShieldCheck } from 'lucide-react';

export interface BlogReview {
  id: string;
  articleSlug: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

interface BlogReviewsSectionProps {
  articleSlug: string;
  articleTitle: string;
}

export default function BlogReviewsSection({ articleSlug, articleTitle }: BlogReviewsSectionProps) {
  const [reviews, setReviews] = useState<BlogReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [displayName, setDisplayName] = useState('');
  const [mobile, setMobile] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check client auth on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('agrimart_user') || localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        if (u.name) setDisplayName(u.name);
        if (u.mobile) setMobile(u.mobile);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${articleSlug}/reviews`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      } else {
        setReviews([]);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [articleSlug]);

  const approvedReviews = reviews.filter((r) => r.status === 'APPROVED');
  const reviewCount = approvedReviews.length;
  const averageRating =
    reviewCount > 0
      ? (approvedReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
      : '0.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitSuccess(null);

    if (!displayName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!mobile.trim() || !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      setErrorMessage('Please provide a valid 10-digit mobile number for farmer verification.');
      return;
    }

    if (comment.trim().length < 10) {
      setErrorMessage('Please write a helpful review of at least 10 characters.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage('Please choose a rating from 1 to 5 stars.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/blog/${articleSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          userName: displayName.trim(),
          userMobile: mobile.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(
          `Thank you, ${displayName.trim()}! Your review has been submitted for moderation and will appear once verified by Agri Mart Editorial.`
        );
        setComment('');
        // If not logged in, retain name
      } else {
        setErrorMessage(data.message || 'Failed to submit review. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network error submitting review: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-green" />
            Reader Reviews &amp; Feedback
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Genuine verified reflections from farmers and readers across Karnataka.
          </p>
        </div>

        {/* Rating Summary Badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl shrink-0">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(Number(averageRating))
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-semibold text-slate-800">
            {reviewCount > 0 ? (
              <span>
                <strong className="text-sm font-extrabold text-slate-900">{averageRating}</strong> / 5.0
                <span className="text-slate-500 ml-1">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
              </span>
            ) : (
              <span className="text-slate-500">No ratings yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Share Your Field Experience</h3>
          {!currentUser && (
            <span className="text-[11px] text-slate-500">
              Have an account?{' '}
              <Link href="/login" className="text-brand-green font-bold hover:underline">
                Sign In
              </Link>
            </span>
          )}
        </div>

        {submitSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Review Received Successfully!</p>
              <p className="mt-0.5 text-emerald-800">{submitSuccess}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Interactive Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Your Rating (1 to 5 Stars) *
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} star`}
                    className="p-1 hover:scale-110 transition cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {rating === 5 && 'Excellent & Practical'}
                  {rating === 4 && 'Very Helpful'}
                  {rating === 3 && 'Good'}
                  {rating === 2 && 'Fair'}
                  {rating === 1 && 'Needs Improvement'}
                </span>
              </div>
            </div>

            {/* User Name & Mobile Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Ramesh Gowda"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  10-Digit Mobile Number (Farmer ID) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9845190812"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                />
              </div>
            </div>

            {/* Written Review */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Review &amp; Field Notes *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Share how the guidance in "${articleTitle}" applies to your farm or machinery...`}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-green/30 leading-relaxed"
              />
              <span className="text-[10px] text-slate-400">
                Minimum 10 characters. Submissions undergo standard moderation to maintain genuine community discussions.
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Farmer Moderation</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-green hover:bg-brand-greenDark text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Submitting Review...' : 'Submit Reader Review'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Approved Reviews List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-xs">
          Approved Community Reviews ({reviewCount})
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Loading reader reviews...
          </div>
        ) : reviewCount === 0 ? (
          <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No reviews yet. Be the first to review.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Share your feedback or field experience using the form above to guide fellow farmers.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{rev.userName}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pl-9">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
