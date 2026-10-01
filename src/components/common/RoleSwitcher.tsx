'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { ShieldCheck, UserCheck, ChevronDown } from 'lucide-react';

export default function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('CUSTOMER');

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-600 text-white">
            DEMO MODE
          </span>
          <span className="hidden sm:inline text-slate-400">
            Switch Stakeholder Portal:
          </span>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold px-2.5 py-1 rounded border border-slate-700 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{SITE_CONFIG.roles.find((r) => r.key === currentRole)?.label || currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isOpen && (
              <div
                className="absolute left-0 mt-1 w-64 rounded-md shadow-xl bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 divide-y divide-slate-700"
                onMouseLeave={() => setIsOpen(false)}
              >
                <div className="p-2 text-[11px] text-slate-400 font-medium">
                  Select Role to preview specific view & permissions:
                </div>
                <div className="py-1 max-h-80 overflow-y-auto">
                  {SITE_CONFIG.roles.map((role) => (
                    <Link
                      key={role.key}
                      href={role.path}
                      onClick={() => {
                        setCurrentRole(role.key);
                        setIsOpen(false);
                      }}
                      className={`block px-3 py-2 text-xs transition ${
                        currentRole === role.key
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="font-medium">{role.label}</div>
                      <div className="text-[10px] text-slate-400">Path: {role.path}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-slate-300">
          <span className="hidden md:inline">
            Domain: <strong className="text-emerald-400">{SITE_CONFIG.domain}</strong> (or {SITE_CONFIG.altDomain})
          </span>
          <span className="hidden lg:inline text-slate-400">|</span>
          <span className="hidden lg:inline text-slate-400">
            {SITE_CONFIG.projectRef}
          </span>
          <Link
            href="/admin"
            className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 underline underline-offset-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

