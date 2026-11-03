'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm, CategoryFormData } from '../CategoryForm';

export default function NewCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/catalogue/categories')
      .then((r) => r.json())
      .then((catRes) => {
        if (catRes.success) setCategories(catRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data: CategoryFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        if (continueEditing && json.data?.id) {
          router.push(`/admin/catalogue/categories/${json.data.id}/edit`);
        } else {
          router.push('/admin/catalogue/categories');
        }
      } else {
        alert(json.message || 'Failed to create category');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 text-slate-400">
        <span>Loading categories...</span>
      </div>
    );
  }

  return (
    <CategoryForm
      categories={categories}
      onSave={handleSave}
      saving={saving}
      isEdit={false}
    />
  );
}
