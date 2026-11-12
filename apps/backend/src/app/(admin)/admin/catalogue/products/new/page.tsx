'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm, ProductFormData } from '../ProductForm';
import { saveProductOverride } from '@/lib/admin-product-overrides';
import { mergeCategoriesWithOverrides } from '@/lib/admin-category-overrides';
import { mergeBrandsWithOverrides } from '@/lib/admin-brand-overrides';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string; parentId?: string | null }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/catalogue/categories', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/admin/brands', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([catRes, brandRes]) => {
        if (catRes.success) setCategories(mergeCategoriesWithOverrides(catRes.data || []));
        if (brandRes.success) setBrands(mergeBrandsWithOverrides(brandRes.data || []));
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
        const createdId = json.data?.id || data.id || `prod-${Date.now()}`;
        saveProductOverride({
          ...data,
          ...(json.data || {}),
          id: createdId,
          price: Number(data.price) || 0,
          comparePrice: data.comparePrice !== undefined ? Number(data.comparePrice) : 0,
          stockQuantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : 0,
          isPublished: Boolean(data.isPublished),
        });
        if (continueEditing && createdId) {
          router.push(`/admin/catalogue/products/${createdId}/edit`);
        } else {
          router.push('/admin/catalogue/products');
          router.refresh();
        }
      } else {
        alert(json.error || json.message || 'Failed to create product');
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
