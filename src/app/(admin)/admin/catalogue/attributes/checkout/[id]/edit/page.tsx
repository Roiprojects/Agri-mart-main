'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckoutAttributeForm, CheckoutAttributeFormData } from '../../CheckoutAttributeForm';
import { RotateCw } from 'lucide-react';

export default function EditCheckoutAttributePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [attribute, setAttribute] = useState<CheckoutAttributeFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchAttr = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/catalogue/attributes/checkout?id=${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setAttribute(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAttr();
  }, [id]);

  const handleSave = async (data: CheckoutAttributeFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/attributes/checkout', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/attributes/checkout');
        } else {
          setAttribute(json.data);
        }
      } else {
        alert(json.error || 'Failed to update checkout attribute');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating checkout attribute');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <RotateCw className="w-6 h-6 animate-spin text-[#3c8dbc]" />
        <span>Loading checkout attribute...</span>
      </div>
    );
  }

  if (!attribute) {
    return (
      <div className="p-8 text-center text-slate-500">
        Checkout attribute not found.
      </div>
    );
  }

  return (
    <CheckoutAttributeForm
      initialValues={attribute}
      onSave={handleSave}
      saving={saving}
      isEdit={true}
    />
  );
}
