'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm, CategoryFormData } from '../CategoryForm';
import {
  mergeCategoriesWithOverrides,
  saveCategoryOverride,
} from '@/lib/admin-category-overrides';

export default function NewCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/catalogue/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((catRes) => {
        if (catRes.success) {
          setCategories(mergeCategoriesWithOverrides(catRes.data || []));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data: CategoryFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const slug =
        data.slug?.trim() ||
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const res = await fetch('/api/admin/catalogue/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, slug }),
      });
      const json = await res.json();
      if (json.success) {
        const savedObj = json.data || {
          ...data,
          slug,
          id: `cat-am-${slug}-${Date.now()}`,
        };
        saveCategoryOverride(savedObj);

        if (continueEditing && savedObj?.id) {
          router.push(`/admin/catalogue/categories/${savedObj.id}/edit`);
        } else {
          router.push('/admin/catalogue/categories');
          router.refresh();
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
