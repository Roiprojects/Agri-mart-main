import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '@/lib/seed-data';
import ProductCard from '@/components/shop/ProductCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, ArrowLeft, Filter } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEED_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolved = await params;
  const category = SEED_CATEGORIES.find((c) => c.slug === resolved.slug);

  if (!category) {
    return { title: 'Category Not Found | AGRI MART MEGA' };
  }

  const title = `${category.name} | AGRI MART MEGA`;
  const description = `${category.description}. Buy genuine, certified ${category.name.toLowerCase()} with 1-year AMC warranty, dark warehouse dispatch, and Karnataka dealer network support.`;
  const canonical = `https://www.${SITE_CONFIG.domain}/categories/${category.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      images: [{ url: category.image, width: 800, height: 600, alt: category.name }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [category.image],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolved = await params;
  const category = SEED_CATEGORIES.find((c) => c.slug === resolved.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = SEED_PRODUCTS.filter(
    (p) => p.categoryId === category.id || p.category.toLowerCase().includes(category.name.toLowerCase().slice(0, 5))
  );

  const breadcrumbsListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://www.${SITE_CONFIG.domain}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop Catalog',
        item: `https://www.${SITE_CONFIG.domain}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://www.${SITE_CONFIG.domain}/categories/${category.slug}`,
      },
    ],
  };

  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://www.${SITE_CONFIG.domain}/categories/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categoryProducts.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.${SITE_CONFIG.domain}/products/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: category.name },
        ]}
      />

      {/* Category Hero Banner */}
      <div className="bg-white rounded-3xl border border-agri-border overflow-hidden shadow-card grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="p-6 sm:p-10 lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">
              Certified Inputs
            </Badge>
            <Badge variant="golden" size="sm">
              Dark Warehouse Dispatch
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-agri-dark tracking-tight leading-tight">
            {category.name}
          </h1>

          <p className="text-xs sm:text-sm text-agri-secondary leading-relaxed max-w-2xl">
            {category.description}. Tested and verified across Karnataka black cotton and red loamy soils.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-agri-secondary">
            <span><strong>{categoryProducts.length}</strong> items in this category</span>
            <span>&bull;</span>
            <span className="text-agri-green font-semibold">100% Genuine Certified</span>
          </div>
        </div>

        <div className="relative h-48 sm:h-64 lg:h-full lg:col-span-4 bg-agri-cream">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-agri-border/60 pb-3">
          <h2 className="text-lg font-bold text-agri-dark">
            Available {category.name} ({categoryProducts.length})
          </h2>
          <Link href="/shop" className="text-xs font-semibold text-agri-green hover:underline">
            View All Categories &rarr;
          </Link>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-agri-border space-y-2">
            <p className="text-sm text-agri-secondary">New batches arriving at dark warehouses shortly.</p>
            <Link href="/shop" className="text-xs font-bold text-agri-green underline">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
