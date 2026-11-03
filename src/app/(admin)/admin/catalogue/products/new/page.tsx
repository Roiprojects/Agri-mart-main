'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm, ProductFormData } from '../ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/catalogue/categories').then((r) => r.json()),
      fetch('/api/admin/brands').then((r) => r.json()),
    ])
      .then(([catRes, brandRes]) => {
        if (catRes.success) setCategories(catRes.data || []);
        if (brandRes.success) setBrands(brandRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data: ProductFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        if (continueEditing && json.data?.id) {
          router.push(`/admin/catalogue/products/${json.data.id}/edit`);
        } else {
          router.push('/admin/catalogue/products');
        }
      } else {
        alert(json.message || 'Failed to create product');
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
        <span>Loading categories and brand options...</span>
      </div>
    );
  }

  return (
    <ProductForm
      categories={categories}
      brands={brands}
      onSave={handleSave}
      saving={saving}
      isEdit={false}
    />
  );
}
