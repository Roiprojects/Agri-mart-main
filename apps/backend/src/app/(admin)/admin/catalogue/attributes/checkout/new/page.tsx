'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutAttributeForm, CheckoutAttributeFormData } from '../CheckoutAttributeForm';

export default function NewCheckoutAttributePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: CheckoutAttributeFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/attributes/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/attributes/checkout');
        } else if (json.data?.id) {
          router.push(`/admin/catalogue/attributes/checkout/${json.data.id}/edit`);
        }
      } else {
        alert(json.error || 'Failed to save checkout attribute');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving checkout attribute');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CheckoutAttributeForm
      onSave={handleSave}
      saving={saving}
      isEdit={false}
      initialValues={{ displayOrder: 0, controlType: 'Drop-down list', taxCategory: '[None]' }}
    />
  );
}
