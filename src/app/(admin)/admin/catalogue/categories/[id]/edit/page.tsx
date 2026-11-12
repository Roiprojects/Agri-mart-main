'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm, CategoryFormData } from '../../CategoryForm';
import {
  getCategoryOverrideById,
  mergeCategoriesWithOverrides,
  saveCategoryOverride,
} from '@/lib/admin-category-overrides';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/catalogue/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((catRes) => {
        const merged = mergeCategoriesWithOverrides(catRes.success && Array.isArray(catRes.data) ? catRes.data : []);
        setCategories(merged);
        const match = merged.find((c: any) => c.id === resolvedParams.id) || getCategoryOverrideById(resolvedParams.id);
        setCategory(match || null);
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

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
        body: JSON.stringify({
          ...data,
          slug,
          id: resolvedParams.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        const savedObj = json.data || { ...data, slug, id: resolvedParams.id };
        saveCategoryOverride(savedObj);

        if (!continueEditing) {
          router.push('/admin/catalogue/categories');
          router.refresh();
        } else {
          setCategory(savedObj);
        }
      } else {
        alert(json.message || 'Failed to update category');
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
        <span>Loading category details...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Category not found.</p>
      </div>
    );
  }

  return (
    <CategoryForm
      initialValues={category}
      categories={categories}
      onSave={handleSave}
      saving={saving}
      isEdit={true}
    />
  );
}
