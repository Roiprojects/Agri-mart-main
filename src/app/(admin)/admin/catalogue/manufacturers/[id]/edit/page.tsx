'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ManufacturerForm, ManufacturerFormData } from '../../ManufacturerForm';
import {
  getBrandOverrideById,
  mergeBrandsWithOverrides,
  saveBrandOverride,
} from '@/lib/admin-brand-overrides';

export default function EditManufacturerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [manufacturer, setManufacturer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/brands', { cache: 'no-store' })
      .then((r) => r.json())
      .then((res) => {
        const merged = mergeBrandsWithOverrides(res.success && Array.isArray(res.data) ? res.data : []);
        const match =
          merged.find((b: any) => b.id === resolvedParams.id || b.slug === resolvedParams.id) ||
          getBrandOverrideById(resolvedParams.id);
        setManufacturer(match || null);
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

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
        body: JSON.stringify({
          ...data,
          slug,
          id: manufacturer?.id || resolvedParams.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        const savedObj = json.data || { ...data, slug, id: manufacturer?.id || resolvedParams.id };
        saveBrandOverride(savedObj);

        if (!continueEditing) {
          router.push('/admin/catalogue/manufacturers');
          router.refresh();
        } else {
          setManufacturer(savedObj);
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
