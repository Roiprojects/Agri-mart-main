'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sprout, ClipboardList, ArrowLeft, CheckCircle2, Layers, BookOpen, Users } from 'lucide-react';

const globalClientCache = globalThis as unknown as {
  __popRecordsCache?: any[];
  __farmersCache?: any[];
  __cgDataCache?: { stages?: any[]; masterGuides?: any[]; pageContent?: any };
};

export default function ProcurementPortalGatewayPage() {
  const [popFormsCount, setPopFormsCount] = useState<number>(
    globalClientCache.__popRecordsCache?.length ?? 2
  );
  const [farmersCount, setFarmersCount] = useState<number>(
    globalClientCache.__farmersCache?.length ?? 6
  );
  const [stagesCount, setStagesCount] = useState<number>(
    globalClientCache.__cgDataCache?.stages?.length ?? 7
  );
  const [masterCropsCount, setMasterCropsCount] = useState<number>(
    globalClientCache.__cgDataCache?.masterGuides?.length ?? 4
  );

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [popRes, farmersRes, cgRes] = await Promise.all([
          fetch('/api/package-of-practice').catch(() => null),
          fetch('/api/procurement/farmers').catch(() => null),
          fetch('/api/admin/crop-guidance').catch(() => null),
        ]);

        if (popRes && popRes.ok) {
          const popJson = await popRes.json();
          if (Array.isArray(popJson?.records)) {
            globalClientCache.__popRecordsCache = popJson.records;
            setPopFormsCount(popJson.records.length);
          }
        }

        if (farmersRes && farmersRes.ok) {
          const farmersJson = await farmersRes.json();
          if (Array.isArray(farmersJson?.profiles)) {
            globalClientCache.__farmersCache = farmersJson.profiles;
            setFarmersCount(farmersJson.profiles.length);
          }
        }

        if (cgRes && cgRes.ok) {
          const cgJson = await cgRes.json();
          globalClientCache.__cgDataCache = {
            stages: cgJson?.data,
            masterGuides: cgJson?.masterGuides,
            pageContent: cgJson?.pageContent,
          };
          if (Array.isArray(cgJson?.data)) {
            setStagesCount(cgJson.data.length);
          }
          if (Array.isArray(cgJson?.masterGuides)) {
            setMasterCropsCount(cgJson.masterGuides.length);
          }
        }
      } catch {}
    };
    fetchCounts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-800">
      {/* Top Back Button */}
      <div>
        <Link
          href="/"
          prefetch={true}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Back</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-[#183526] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#B4D334] text-slate-950 uppercase tracking-wide">
            Agronomy Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 text-white flex items-center gap-2.5">
            <Sprout className="w-7 h-7 text-[#F7C629]" />
            Procurement &amp; Agronomy Tracker
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl">
            Select a module below to manage Package of Practice (POP) farmer data or Crop Guidance content separately.
          </p>
        </div>
      </div>

      {/* 2 Separate Cards: 1. Package of Practice & 2. Crop Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: PACKAGE OF PRACTICE */}
        <Link
          href="/procurement/pop-forms"
          prefetch={true}
          className="p-7 rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-xs">
                <ClipboardList className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-emerald-800 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                Package of Practice
              </span>
            </div>

            <h2 className="font-bold text-slate-900 text-xl group-hover:text-emerald-800 transition-colors">
              Package of Practice
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Submitted Farmer Data &amp; Package of Practice (POP) Forms, 7-stage farmer crop cycles, farm profile &amp; crop selection records, input usage logs, and scheduled agronomist follow-up calls.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
                <ClipboardList className="w-3.5 h-3.5 text-emerald-700" />
                {popFormsCount} POP Forms
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                {farmersCount} Active Farmer Profiles
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center text-sm font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Enter Package of Practice</span>
            <span className="ml-1.5">&rarr;</span>
          </div>
        </Link>

        {/* CARD 2: CROP GUIDANCE */}
        <Link
          href="/procurement/crop-guidance"
          prefetch={true}
          className="p-7 rounded-2xl border-2 border-amber-200 hover:border-amber-500 bg-white hover:bg-amber-50/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shadow-xs">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-amber-800 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                Crop Guidance
              </span>
            </div>

            <h2 className="font-bold text-slate-900 text-xl group-hover:text-amber-800 transition-colors">
              Crop Guidance
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              7-Stage Agricultural Production &amp; Agronomist Action Checklists, General Manuring &amp; Irrigation Practices, Weed, Pest &amp; Disease Management, and Crop-Specific Master Guides CRUD.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                {stagesCount} Production Stages
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                {masterCropsCount} Crop Master Guides
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                PostgreSQL Synced
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center text-sm font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Enter Crop Guidance</span>
            <span className="ml-1.5">&rarr;</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
