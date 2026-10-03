'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SpecificationGroupForm, SpecificationGroupFormData } from '../../SpecificationGroupForm';
import { RotateCw } from 'lucide-react';

export default function EditSpecificationGroupPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [group, setGroup] = useState<SpecificationGroupFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/catalogue/attributes/specification?groupId=${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setGroup(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  const handleSave = async (data: SpecificationGroupFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/attributes/specification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isGroup: true,
          id,
          name: data.name,
          displayOrder: data.displayOrder,
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/attributes/specification');
        } else {
          setGroup(json.data);
        }
      } else {
        alert(json.error || 'Failed to update specification attribute group');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating specification attribute group');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <RotateCw className="w-6 h-6 animate-spin text-[#3c8dbc]" />
        <span>Loading specification attribute group...</span>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-8 text-center text-slate-500">
        Specification attribute group not found.
      </div>
    );
  }

  return (
    <SpecificationGroupForm
      initialValues={group}
      onSave={handleSave}
      saving={saving}
      isEdit={true}
    />
  );
}
