import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const SEED_PRODUCT_ATTRIBUTES = [
  {
    id: 'pa-color',
    name: 'Color',
    description: 'Product color variants (Agri Green, Kisan Blue, Harvest Yellow, Flame Red)',
    displayOrder: 1,
    predefinedValues: [
      { id: 'pv-1', name: 'Agri Green', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 1 },
      { id: 'pv-2', name: 'Kisan Blue', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 2 },
      { id: 'pv-3', name: 'Harvest Yellow', priceAdjustment: 50, weightAdjustment: 0, isPreSelected: false, displayOrder: 3 },
      { id: 'pv-4', name: 'Flame Red', priceAdjustment: 75, weightAdjustment: 0, isPreSelected: false, displayOrder: 4 },
    ],
    usedByProducts: [],
  },
  {
    id: 'pa-frame-color',
    name: 'Frame Color',
    description: 'Chassis or heavy-duty frame finish colors',
    displayOrder: 2,
    predefinedValues: [
      { id: 'pv-5', name: 'Matte Black', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 1 },
      { id: 'pv-6', name: 'Gunmetal Grey', priceAdjustment: 120, weightAdjustment: 0.5, isPreSelected: false, displayOrder: 2 },
    ],
    usedByProducts: [],
  },
  {
    id: 'pa-pattern',
    name: 'Pattern',
    description: 'Surface weave, tread, or structural pattern options',
    displayOrder: 3,
    predefinedValues: [
      { id: 'pv-7', name: 'Heavy Cross-Weave Ribbed', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 1 },
      { id: 'pv-8', name: 'Reinforced Diamond Grip', priceAdjustment: 100, weightAdjustment: 0.2, isPreSelected: false, displayOrder: 2 },
    ],
    usedByProducts: [],
  },
  {
    id: 'pa-sprayer',
    name: 'Sprayer Tank Capacity (L)',
    description: 'Volume capacity for liquid sprays and bio-solutions',
    displayOrder: 4,
    predefinedValues: [
      { id: 'pv-9', name: '16 Litres Standard', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 1 },
      { id: 'pv-10', name: '20 Litres Jumbo', priceAdjustment: 450, weightAdjustment: 1.2, isPreSelected: false, displayOrder: 2 },
    ],
    usedByProducts: [],
  },
  {
    id: 'pa-blade',
    name: 'Blade Type & Material',
    description: 'Hardened carbon steel or boron steel rotary tilling blades',
    displayOrder: 5,
    predefinedValues: [
      { id: 'pv-11', name: '32-Blade Hardened Carbon Steel', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 1 },
      { id: 'pv-12', name: '40-Blade Heavy Boron Steel', priceAdjustment: 1850, weightAdjustment: 4.5, isPreSelected: false, displayOrder: 2 },
    ],
    usedByProducts: [],
  },
  {
    id: 'pa-package',
    name: 'Packaging Size (5kg, 10kg, 25kg)',
    description: 'Pack size, bag weight, and kit configuration options',
    displayOrder: 6,
    predefinedValues: [
      { id: 'pv-13', name: 'Standard Pack (1 Unit / 5 Kg)', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 1 },
      { id: 'pv-14', name: 'Economy Farm Pack (20 Kg / Bulk)', priceAdjustment: 950, weightAdjustment: 15, isPreSelected: false, displayOrder: 2 },
    ],
    usedByProducts: [],
  },
];

function getEnrichedProducts() {
  const rawProducts = devDb.getProducts({ onlyPublished: false });
  return rawProducts.map((p) => {
    const detailed = devDb.getProductWithDetails(p.id) || p;
    return {
      id: p.id,
      name: p.name,
      sku: p.sku || '',
      slug: p.slug || '',
      price: p.price || 0,
      mrp: p.mrp || 0,
      stockQuantity: p.stockQuantity ?? 100,
      published: !p.isDraft,
      categoryId: p.categoryId,
      parentCategoryId: (detailed as any).parentCategoryId || p.parentCategoryId,
      subCategoryId: (detailed as any).subCategoryId || p.subCategoryId,
      categoryHierarchy: (detailed as any).categoryHierarchy || '',
      parentCategoryName: (detailed as any).parentCategory?.name || '',
      subCategoryName: (detailed as any).subCategory?.name || '',
      brandName: (detailed as any).brand?.name || 'AgriPro',
    };
  });
}

function getProductsForAttribute(attr: any, allProducts: any[]) {
  const attrId = (attr.id || '').toLowerCase();
  const attrName = (attr.name || '').toLowerCase();

  // Map products intelligently to attributes while also preserving any explicit usedByProducts
  const explicitIds = new Set(
    Array.isArray(attr.usedByProducts)
      ? attr.usedByProducts.map((u: any) => u.id)
      : []
  );

  const matched = allProducts.filter((p) => {
    if (explicitIds.has(p.id)) return true;
    const nameLower = p.name.toLowerCase();
    const skuLower = p.sku.toLowerCase();
    const catLower = (p.categoryHierarchy || '').toLowerCase();

    if (attrId === 'pa-color' || attrName.includes('color') && !attrName.includes('frame')) {
      // Applicable to all equipment, tools, sprayers, traps, tarpaulins, baskets
      return (
        catLower.includes('machinery') ||
        catLower.includes('tools') ||
        catLower.includes('irrigation') ||
        nameLower.includes('weeder') ||
        nameLower.includes('tiller') ||
        nameLower.includes('sprayer') ||
        nameLower.includes('trap') ||
        nameLower.includes('tarpaulin') ||
        nameLower.includes('basket')
      );
    }
    if (attrId === 'pa-frame-color' || attrName.includes('frame')) {
      return (
        catLower.includes('machinery') ||
        nameLower.includes('weeder') ||
        nameLower.includes('tiller') ||
        nameLower.includes('trap') ||
        skuLower.includes('agp-')
      );
    }
    if (attrId === 'pa-blade' || attrName.includes('blade')) {
      return (
        nameLower.includes('weeder') ||
        nameLower.includes('tiller') ||
        catLower.includes('weeder') ||
        skuLower.includes('pw') ||
        skuLower.includes('rt')
      );
    }
    if (attrId === 'pa-sprayer' || attrName.includes('sprayer') || attrName.includes('tank') || attrName.includes('capacity')) {
      return (
        nameLower.includes('sprayer') ||
        nameLower.includes('neem') ||
        nameLower.includes('drip') ||
        nameLower.includes('venturi') ||
        catLower.includes('sprayer') ||
        catLower.includes('protection') ||
        catLower.includes('irrigation')
      );
    }
    if (attrId === 'pa-pattern' || attrName.includes('pattern')) {
      return (
        nameLower.includes('tarpaulin') ||
        nameLower.includes('basket') ||
        nameLower.includes('weeder') ||
        nameLower.includes('tiller') ||
        catLower.includes('tools')
      );
    }
    if (attrId === 'pa-package' || attrName.includes('packag') || attrName.includes('size')) {
      // All products have packaging / unit configuration
      return true;
    }

    // For any custom attribute, link all products or matching products
    return true;
  });

  const defaultVal =
    Array.isArray(attr.predefinedValues) && attr.predefinedValues.length > 0
      ? attr.predefinedValues.map((v: any) => v.name).join(', ')
      : 'Standard Configuration';

  return matched.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: p.price,
    published: p.published,
    categoryHierarchy: p.categoryHierarchy,
    attributeValues: defaultVal,
  }));
}

function ensureSeedData() {
  const allProducts = getEnrichedProducts();

  if (!devDb.data.productAttributes || devDb.data.productAttributes.length === 0) {
    devDb.data.productAttributes = SEED_PRODUCT_ATTRIBUTES.map((attr) => ({
      ...attr,
      usedByProducts: getProductsForAttribute(attr, allProducts),
    }));
    try {
      devDb.save?.();
    } catch {}
  } else {
    const existingIds = new Set(devDb.data.productAttributes.map((a: any) => a.id));
    for (const seed of SEED_PRODUCT_ATTRIBUTES) {
      if (!existingIds.has(seed.id) && !devDb.data.productAttributes.some((a: any) => a.name === seed.name)) {
        devDb.data.productAttributes.push({ ...seed });
      }
    }

    devDb.data.productAttributes = devDb.data.productAttributes.map((attr: any) => {
      const seedMatch = SEED_PRODUCT_ATTRIBUTES.find((s) => s.id === attr.id || s.name === attr.name);
      const predefinedValues = (
        attr.predefinedValues && attr.predefinedValues.length > 0
          ? attr.predefinedValues
          : seedMatch?.predefinedValues || []
      ).map((v: any) => ({
        ...v,
        isPreSelected: false,
      }));
      return {
        ...attr,
        description: attr.description || seedMatch?.description || '',
        predefinedValues,
        usedByProducts: getProductsForAttribute({ ...attr, predefinedValues }, allProducts),
      };
    });
  }

  return allProducts;
}

export async function GET(request: Request) {
  try {
    const allProducts = ensureSeedData();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');

    let attrs = devDb.getProductAttributes
      ? devDb.getProductAttributes()
      : devDb.data.productAttributes || [];

    // Ensure every returned attribute has fresh usedByProducts with id, name, sku
    attrs = attrs.map((attr: any) => ({
      ...attr,
      usedByProducts: getProductsForAttribute(attr, allProducts),
    }));

    if (id) {
      const single = attrs.find((a: any) => a.id === id);
      return NextResponse.json({ success: !!single, data: single, products: allProducts });
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      attrs = attrs.filter((a: any) => {
        const matchAttrName = (a.name || '').toLowerCase().includes(q);
        const matchAttrId = (a.id || '').toLowerCase().includes(q);
        const matchAttrDesc = (a.description || '').toLowerCase().includes(q);
        const matchValues =
          Array.isArray(a.predefinedValues) &&
          a.predefinedValues.some((v: any) => (v.name || '').toLowerCase().includes(q));
        const matchProduct =
          Array.isArray(a.usedByProducts) &&
          a.usedByProducts.some(
            (p: any) =>
              (p.id || '').toLowerCase().includes(q) ||
              (p.name || '').toLowerCase().includes(q) ||
              (p.sku || '').toLowerCase().includes(q)
          );
        return matchAttrName || matchAttrId || matchAttrDesc || matchValues || matchProduct;
      });
    }

    return NextResponse.json({
      success: true,
      count: attrs.length,
      data: attrs,
      products: allProducts,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const allProducts = ensureSeedData();
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    let item: any;
    if (typeof (devDb as any).saveProductAttribute === 'function') {
      item = (devDb as any).saveProductAttribute(body);
    } else {
      if (!(devDb as any).data.productAttributes) (devDb as any).data.productAttributes = [];
      item = {
        id: body.id || `pa-${Date.now()}`,
        name: body.name.trim(),
        description: body.description || '',
        displayOrder: body.displayOrder || (devDb as any).data.productAttributes.length + 1,
        predefinedValues: body.predefinedValues || [],
        usedByProducts: body.usedByProducts || getProductsForAttribute(body, allProducts),
        createdAt: new Date().toISOString(),
      };
      (devDb as any).data.productAttributes.push(item);
      try {
        (devDb as any).save?.();
      } catch {}
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    ensureSeedData();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    let item: any;
    if (typeof (devDb as any).saveProductAttribute === 'function') {
      item = (devDb as any).saveProductAttribute(body);
    } else {
      const list = (devDb as any).data?.productAttributes || [];
      const idx = list.findIndex((a: any) => a.id === body.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...body };
        item = list[idx];
        try {
          (devDb as any).save?.();
        } catch {}
      } else {
        item = body;
      }
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    ensureSeedData();
    const url = new URL(request.url);
    const queryIds = url.searchParams.get('ids');
    const singleId = url.searchParams.get('id');

    let targetIds: string[] = [];
    if (queryIds) targetIds = queryIds.split(',').map((s) => s.trim()).filter(Boolean);
    else if (singleId) targetIds = [singleId.trim()];
    else {
      try {
        const body = await request.json();
        if (Array.isArray(body.ids)) targetIds = body.ids;
        else if (body.id) targetIds = [body.id];
      } catch {}
    }

    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    if (devDb.deleteProductAttributes) {
      devDb.deleteProductAttributes(targetIds);
    } else {
      devDb.data.productAttributes = (devDb.data.productAttributes || []).filter(
        (a: any) => !targetIds.includes(a.id)
      );
      try {
        devDb.save?.();
      } catch {}
    }

    return NextResponse.json({ success: true, message: `Deleted ${targetIds.length} item(s)` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
