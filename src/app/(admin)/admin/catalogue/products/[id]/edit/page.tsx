'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm, ProductFormData } from '../../ProductForm';
import {
  getProductOverrideById,
  mergeProductsWithOverrides,
  saveProductOverride,
} from '@/lib/admin-product-overrides';
import { mergeCategoriesWithOverrides } from '@/lib/admin-category-overrides';
import { mergeBrandsWithOverrides } from '@/lib/admin-brand-overrides';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; parentId?: string | null }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/catalogue/products/${resolvedParams.id}`, { cache: 'no-store' })
        .then((r) => r.json())
        .catch(() => ({ success: false })),
      fetch('/api/admin/catalogue/products', { cache: 'no-store' })
        .then((r) => r.json())
        .catch(() => ({ success: false, data: [] })),
      fetch('/api/admin/catalogue/categories', { cache: 'no-store' })
        .then((r) => r.json())
        .catch(() => ({ success: false, data: [] })),
      fetch('/api/admin/brands', { cache: 'no-store' })
        .then((r) => r.json())
        .catch(() => ({ success: false, data: [] })),
    ])
      .then(([singleRes, prodRes, catRes, brandRes]) => {
        const cats = mergeCategoriesWithOverrides(catRes.success && Array.isArray(catRes.data) ? catRes.data : []);
        const brs = mergeBrandsWithOverrides(brandRes.success && Array.isArray(brandRes.data) ? brandRes.data : []);
        setCategories(cats);
        setBrands(brs);

        const serverList = prodRes.success && Array.isArray(prodRes.data) ? prodRes.data : [];
        const mergedList = mergeProductsWithOverrides(serverList, cats, brs);

        let match = mergedList.find((p: any) => p.id === resolvedParams.id);
        if (!match && singleRes?.success && singleRes?.data) {
          const override = getProductOverrideById(resolvedParams.id);
          match = override ? { ...singleRes.data, ...override } : singleRes.data;
        }
        if (!match) {
          match = getProductOverrideById(resolvedParams.id) || null;
        }
        setProduct(match || null);
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleSave = async (data: ProductFormData, continueEditing = false) => {
    try {
      setSaving(true);
      const payload = {
        ...product,
        ...data,
        id: resolvedParams.id,
        slug: data.seName || product?.slug || resolvedParams.id,
      };

      const res = await fetch(`/api/admin/catalogue/products/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        const savedObj = {
          ...payload,
          ...(json.data || {}),
          ...data,
          id: resolvedParams.id,
          price: Number(data.price) || 0,
          comparePrice: data.comparePrice !== undefined ? Number(data.comparePrice) : 0,
          cost: data.cost !== undefined ? Number(data.cost) : 0,
          stockQuantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : 0,
          isPublished: Boolean(data.isPublished),
          variants: [
            {
              ...(json.data?.variants?.[0] || product?.variants?.[0] || {}),
              sku: data.sku,
              price: Number(data.price) || 0,
              comparePrice: data.comparePrice !== undefined ? Number(data.comparePrice) : 0,
              stockQuantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : 0,
            },
          ],
        };
        saveProductOverride(savedObj);

        if (!continueEditing) {
          router.push('/admin/catalogue/products');
          router.refresh();
        } else {
          setProduct(savedObj);
        }
      } else {
        alert(json.error || json.message || 'Failed to update product');
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
