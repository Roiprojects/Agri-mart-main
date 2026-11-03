'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductAttributeForm, ProductAttributeFormData } from '../ProductAttributeForm';

export default function NewProductAttributePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: ProductAttributeFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/attributes/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/attributes/product');
        } else if (json.data?.id) {
          router.push(`/admin/catalogue/attributes/product/${json.data.id}/edit`);
        }
      } else {
        alert(json.error || 'Failed to save product attribute');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving product attribute');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProductAttributeForm
      onSave={handleSave}
      saving={saving}
      isEdit={false}
    />
  );
}
