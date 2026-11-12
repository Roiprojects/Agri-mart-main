'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ManufacturerForm, ManufacturerFormData } from '../ManufacturerForm';
import { saveBrandOverride } from '@/lib/admin-brand-overrides';

export default function NewManufacturerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: ManufacturerFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const slug =
        data.slug?.trim() ||
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, slug }),
      });
      const json = await res.json();
      if (json.success) {
        const savedObj = json.data || {
          ...data,
          slug,
          id: `br-am-${slug}-${Date.now()}`,
        };
        saveBrandOverride(savedObj);

        if (!continueEditing) {
          router.push('/admin/catalogue/manufacturers');
          router.refresh();
        } else if (savedObj?.id) {
          router.push(`/admin/catalogue/manufacturers/${savedObj.id}/edit`);
        }
      } else {
        alert(json.message || json.error || 'Failed to save manufacturer');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving manufacturer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ManufacturerForm
      onSave={handleSave}
      saving={saving}
      isEdit={false}
    />
  );
}
