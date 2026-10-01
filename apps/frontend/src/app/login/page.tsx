'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config';
import { setClientAuthUser } from '@/lib/auth-client';
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

  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [phone, setPhone] = useState('9845190812');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [devOtpNotice, setDevOtpNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const handleDemoLogin = () => {
    setClientAuthUser({
      id: 'demo-farmer-1',
      name: 'Basavaraj Patil',
      phone: '9845190812',
      role: 'farmer',
    });
    router.push(redirectUrl);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        if (data.devOtp) {
          setDevOtpNotice(data.message);
          setOtp(data.devOtp); // Pre-fill for instant frictionless testing
        }
      } else {
        setErrorMessage(data.message || 'Failed to dispatch OTP');
      }
    } catch (err: any) {
      setErrorMessage('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phone, code: otp }),
      });
      const data = await res.json();
      if (data.success) {
        setClientAuthUser({
          id: 'farmer-' + phone,
          name: 'Farmer User',
          phone,
          role: 'farmer',
        });
        router.push(redirectUrl);
      } else {
        setErrorMessage(data.message || 'Invalid verification code');
      }
    } catch (err: any) {
      setErrorMessage('Verification error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }
    setClientAuthUser({
      id: 'farmer-' + phone,
      name: 'Farmer User',
      phone,
      role: 'farmer',
    });
    router.push(redirectUrl);
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
        setResetSuccessMessage(data.message + (data.devResetToken ? ` [Sandbox Token: ${data.devResetToken}]` : ''));
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
            Sign In to Agri Mart Mega
          </h1>
          <p className="text-xs text-slate-500">
            Access Package of Practice, farm machinery rental, order tracking, and Kisan Wallet
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Quick Demo Login Option */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-amber-900 font-extrabold text-xs">
              <Tractor className="w-4 h-4 text-amber-600" />
              <span>Quick Demo Access</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Sign in instantly without SMS OTP to test Package of Practice, equipment rentals, and checkout.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
            >
              <span>1-Click Sign In as Demo Farmer (Basavaraj Patil) &rarr;</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider">or sign in with mobile</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition text-center ${
                authMode === 'otp'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Phone OTP Login (Fast)
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition text-center ${
                authMode === 'password'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Password Login
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {devOtpNotice && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1 text-[11px] animate-fadeIn">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Sandbox SMS Gateway Simulation
              </div>
              <p>{devOtpNotice}</p>
            </div>
          )}

          {authMode === 'otp' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Enter Mobile Number (Registered or New)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-xs">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="9845190812"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-agri-green outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isLoading ? 'Generating OTP...' : 'Send Login OTP via SMS'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Enter 6-Digit OTP</label>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setDevOtpNotice(null); }}
                      className="text-xs text-agri-green hover:underline font-bold"
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-center text-lg tracking-widest font-mono font-black focus:ring-1 focus:ring-agri-green outline-none"
                  />
                  <p className="text-[11px] text-slate-400 text-center mt-1.5">
                    Sent to +91-{phone.slice(-10)}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile or Email</label>
                <input
                  type="text"
                  required
                  placeholder="9845190812 or farmer@agrimart.in"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-agri-green"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In with Password</span>
              </button>
            </form>
          )}
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
