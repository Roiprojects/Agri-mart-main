import React from 'react';
import { Metadata } from 'next';
import { devDb } from '@/lib/dev-db';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import WishlistClient, { WishlistProductItem } from '@/components/shop/WishlistClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Wishlist & Saved Farm Equipment | AGRI MART MEGA',
  description: 'Your saved agricultural machinery, fertilizers, and tools on Agri Mart Mega.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Customer Account', href: '/account' },
    { label: 'Wishlist' },
  ];

  const dbProducts = devDb.getProducts({ onlyPublished: true });
  const defaultImage = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';

  const mappedProducts: WishlistProductItem[] = dbProducts.map((p) => {
    const detailed = devDb.getProductWithDetails(p.id);
    const mediaUrls = detailed?.media?.map((m) => m.url).filter(Boolean) || [];
    const fallbackImages = Array.isArray((p as any).images) ? (p as any).images : [];
    const images = mediaUrls.length > 0 ? mediaUrls : fallbackImages.length > 0 ? fallbackImages : [defaultImage];

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      sku: p.sku || '',
      brand: detailed?.brand?.name || (p as any).brandName || 'AgriPro',
      category: detailed?.category?.name || 'Agricultural Machinery',
      price: p.price,
      comparePrice: p.comparePrice,
      images,
      disableBuyButton: Boolean(p.disableBuyButton),
      disableWishlistButton: Boolean(p.disableWishlistButton),
      availableStartDate: p.availableStartDate,
      availableEndDate: p.availableEndDate,
    };
  });

  const defaultIds = [SEED_PRODUCTS[0]?.id, SEED_PRODUCTS[2]?.id, SEED_PRODUCTS[5]?.id].filter(
    (id): id is string => Boolean(id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />
      <WishlistClient products={mappedProducts} defaultIds={defaultIds} />
    </div>
  );
}
