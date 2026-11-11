import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = devDb.getCategories();
  const products = devDb.getProducts();

  const formatted = categories
    .filter((cat) => cat.id.startsWith('cat-am-')) // Only show official Agrimart categories
    .map((cat) => {
      const count = products.filter((p) => p.categoryId === cat.id).length;
      return {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        nameKn: cat.nameKn,
        description: cat.description,
        imageUrl: cat.image,
        productCount: count,
        featured: false,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // alphabetical

  return NextResponse.json({
    success: true,
    count: formatted.length,
    data: formatted,
  });
}
