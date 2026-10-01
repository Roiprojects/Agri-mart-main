'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm, CategoryFormData } from '../../CategoryForm';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/catalogue/categories')
      .then((r) => r.json())
      .then((catRes) => {
        if (catRes.success && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
          const match = catRes.data.find((c: any) => c.id === resolvedParams.id);
          setCategory(match || null);
        }
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleSave = async (data: CategoryFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: resolvedParams.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (!continueEditing) {
          router.push('/admin/catalogue/categories');
        } else {
          setCategory({ ...data, id: resolvedParams.id });
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
