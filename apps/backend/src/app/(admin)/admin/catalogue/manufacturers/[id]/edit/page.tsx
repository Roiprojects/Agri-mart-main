'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ManufacturerForm, ManufacturerFormData } from '../../ManufacturerForm';

export default function EditManufacturerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [manufacturer, setManufacturer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/brands')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const match = res.data.find(
            (b: any) => b.id === resolvedParams.id || b.slug === resolvedParams.id
          );
          setManufacturer(match || null);
        }
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleSave = async (data: ManufacturerFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: manufacturer?.id || resolvedParams.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/manufacturers');
        } else {
          setManufacturer({ ...data, id: manufacturer?.id || resolvedParams.id });
        }
      } else {
        alert(json.message || json.error || 'Failed to update manufacturer');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating manufacturer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 text-slate-400">
        <span>Loading manufacturer details...</span>
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Manufacturer not found.</p>
      </div>
    );
  }

  return (
    <ManufacturerForm
      initialValues={manufacturer}
      onSave={handleSave}
      saving={saving}
      isEdit={true}
    />
  );
}
