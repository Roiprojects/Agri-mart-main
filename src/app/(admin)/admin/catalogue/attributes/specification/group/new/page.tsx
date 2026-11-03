'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpecificationGroupForm, SpecificationGroupFormData } from '../SpecificationGroupForm';

export default function NewSpecificationGroupPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: SpecificationGroupFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/attributes/specification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isGroup: true,
          name: data.name,
          displayOrder: data.displayOrder,
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/attributes/specification');
        } else if (json.data?.id) {
          router.push(`/admin/catalogue/attributes/specification/group/${json.data.id}/edit`);
        }
      } else {
        alert(json.error || 'Failed to save specification attribute group');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving specification attribute group');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SpecificationGroupForm
      onSave={handleSave}
      saving={saving}
      isEdit={false}
      initialValues={{ displayOrder: 0 }}
    />
  );
}
