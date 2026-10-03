'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SpecificationAttributeForm, SpecificationAttributeFormData } from '../../SpecificationAttributeForm';
import { RotateCw } from 'lucide-react';

export default function EditSpecificationAttributePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [attribute, setAttribute] = useState<SpecificationAttributeFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchAttr = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/catalogue/attributes/specification?id=${id}`);
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

  const handleSave = async (data: SpecificationAttributeFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/attributes/specification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
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
        } else {
          setAttribute(json.data);
        }
      } else {
        alert(json.error || 'Failed to update specification attribute');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating specification attribute');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <RotateCw className="w-6 h-6 animate-spin text-[#3c8dbc]" />
        <span>Loading specification attribute...</span>
      </div>
    );
  }

  if (!attribute) {
    return (
      <div className="p-8 text-center text-slate-500">
        Specification attribute not found.
      </div>
    );
  }

  return (
    <SpecificationAttributeForm
      initialValues={attribute}
      onSave={handleSave}
      saving={saving}
      isEdit={true}
    />
  );
}
