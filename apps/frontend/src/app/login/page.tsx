'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config';
import { setClientAuthUser } from '@/lib/auth-client';
import { validatePhoneNumber, validateEmailOptional } from '@/lib/validation';
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserCheck,
  Sparkles,
  AlertTriangle,
  KeyRound,
  Tractor,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const [accessType, setAccessType] = useState<'login' | 'signin'>('login');
  const [identifier, setIdentifier] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const handleCredentialSubmit = async (submitType: 'login' | 'signin') => {
    setErrorMessage('');

    const rawIdentifier = identifier.trim();
    const rawPassword = password.trim();

    if (!rawIdentifier) {
      setErrorMessage('Please enter your Phone Number or Username.');
      return;
    }

    if (!rawPassword) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    const digitsOnly = rawIdentifier.replace(/\D/g, '');
    const isPhoneIdentifier =
      digitsOnly.length === 10 && /^\d+$/.test(rawIdentifier.replace(/[\s+-]/g, ''));

    if (
      !isPhoneIdentifier &&
      rawIdentifier.replace(/[\s+-]/g, '') !== '' &&
      /^\d+$/.test(rawIdentifier.replace(/[\s+-]/g, '')) &&
      digitsOnly.length !== 10
    ) {
      setErrorMessage('Please enter a valid 10-digit Phone Number or a valid Username.');
      return;
    }

    try {
      const res = await fetch('/api/package-of-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'AUTH_FARMER_ACCOUNT',
          identifier: rawIdentifier,
          password: rawPassword,
          submitType,
          fullName: farmerName.trim(),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || 'Invalid credentials.');
        return;
      }

      const acc = json.account;
      if (typeof window !== 'undefined' && Array.isArray(json.farmerAccounts)) {
        localStorage.setItem('agrimart_user_accounts_v1', JSON.stringify(json.farmerAccounts));
      }

      setClientAuthUser({
        id: acc.id,
        name: acc.name,
        mobile: acc.mobile,
        phone: acc.mobile,
        email: acc.email || '',
        role: 'CUSTOMER',
        isVerified: true,
      });
      router.push(redirectUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to connect to authentication server.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setResetSuccessMessage(data.message);
      }
    } catch (err: any) {
      alert('Error requesting reset: ' + err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-xs">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white border border-slate-200 shadow-sm mb-2">
            <Image
              src="/images/agrimart_logo_en_transparent.png"
              alt={SITE_CONFIG.name}
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {accessType === 'login' ? 'Log In to Agri Mart Mega' : 'Sign In to Agri Mart Mega'}
          </h1>
          <p className="text-xs text-slate-500">
            Access Package of Practice, farm machinery rental, order tracking, and Kisan Wallet
          </p>
        </div>

        {/* Login / Sign In Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Separate Log In and Sign In Mode Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setAccessType('login');
                setErrorMessage('');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition cursor-pointer border-2 flex items-center justify-center gap-1.5 ${
                accessType === 'login'
                  ? 'bg-emerald-700 text-white border-emerald-900 shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAccessType('signin');
                setErrorMessage('');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition cursor-pointer border-2 flex items-center justify-center gap-1.5 ${
                accessType === 'signin'
                  ? 'bg-agri-yellow text-agri-dark border-amber-500 shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCredentialSubmit(accessType);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number or Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter 10-digit Phone Number or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {accessType === 'signin' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-agri-green outline-none"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-agri-green hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {/* Separate Log In and Sign In Submit Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCredentialSubmit('login')}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => handleCredentialSubmit('signin')}
                className="w-full bg-agri-yellow hover:bg-amber-400 text-agri-dark font-extrabold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 border border-amber-400 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-agri-green" /> Reset Password
              </h3>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                &times;
              </button>
            </div>

            {resetSuccessMessage ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-[11px] space-y-2">
                <p>{resetSuccessMessage}</p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-agri-green text-white font-bold rounded-xl"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <p className="text-slate-500 text-[11px]">
                  Enter your registered email or mobile to receive a secure password recovery link.
                </p>
                <input
                  type="text"
                  required
                  placeholder="farmer@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-2.5 rounded-xl transition"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-xs text-slate-500">Loading Login...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
