import React from 'react';
import Link from 'next/link';
import CustomerDataForm from '@/components/farm/CustomerDataForm';
import { ArrowLeft } from 'lucide-react';

export default function FarmProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href="/account" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Account Dashboard
      </Link>
      <CustomerDataForm />
    </div>
  );
}
