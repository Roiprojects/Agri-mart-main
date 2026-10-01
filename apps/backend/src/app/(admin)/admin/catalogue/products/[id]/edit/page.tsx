'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm, ProductFormData } from '../../ProductForm';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/catalogue/products').then((r) => r.json()),
      fetch('/api/admin/catalogue/categories').then((r) => r.json()),
      fetch('/api/admin/brands').then((r) => r.json()),
    ])
      .then(([prodRes, catRes, brandRes]) => {
        if (prodRes.success) {
          const match = (prodRes.data || []).find((p: any) => p.id === resolvedParams.id);
          setProduct(match || null);
        }
        if (catRes.success) setCategories(catRes.data || []);
        if (brandRes.success) setBrands(brandRes.data || []);
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleSave = async (data: ProductFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/products', {
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
          router.push('/admin/catalogue/products');
        } else {
          // Refresh local state
          setProduct({ ...data, id: resolvedParams.id });
        }
      } else {
        alert(json.message || 'Failed to update product');
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
        <span>Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <ProductForm
      initialValues={product}
      categories={categories}
      brands={brands}
      onSave={handleSave}
      saving={saving}
      isEdit={true}
    />
  );
}
