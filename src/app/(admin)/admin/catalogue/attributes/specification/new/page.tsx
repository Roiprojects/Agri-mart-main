'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpecificationAttributeForm, SpecificationAttributeFormData } from '../SpecificationAttributeForm';

export default function NewSpecificationAttributePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: SpecificationAttributeFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/attributes/specification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          groupId: data.groupId || 'group-default',
          displayOrder: data.displayOrder,
          options: data.options || [],
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/attributes/specification');
        } else if (json.data?.id) {
          router.push(`/admin/catalogue/attributes/specification/${json.data.id}/edit`);
        }
      } else {
        alert(json.error || 'Failed to save specification attribute');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving specification attribute');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SpecificationAttributeForm
      onSave={handleSave}
      saving={saving}
      isEdit={false}
      initialValues={{ displayOrder: 0 }}
    />
  );
}
