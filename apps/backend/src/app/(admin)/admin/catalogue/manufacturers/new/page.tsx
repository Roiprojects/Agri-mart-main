'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ManufacturerForm, ManufacturerFormData } from '../ManufacturerForm';

export default function NewManufacturerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: ManufacturerFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/manufacturers');
        } else if (json.data?.id) {
          router.push(`/admin/catalogue/manufacturers/${json.data.id}/edit`);
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
