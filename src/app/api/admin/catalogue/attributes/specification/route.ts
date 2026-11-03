import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

const SEED_SPEC_GROUPS = [
  { id: 'group-default', name: 'Default group (non-grouped specification attributes)', displayOrder: 0 },
];

const SEED_SPEC_ATTRIBUTES = [
  { id: 'sa-1', name: 'Engine Displacement (cc)', displayOrder: 1, groupId: 'group-default' },
  { id: 'sa-2', name: 'Power Rating (HP / kW)', displayOrder: 2, groupId: 'group-default' },
  { id: 'sa-3', name: 'Fuel Tank Capacity (L)', displayOrder: 3, groupId: 'group-default' },
  { id: 'sa-4', name: 'Starting Mechanism', displayOrder: 4, groupId: 'group-default' },
  { id: 'sa-5', name: 'Tilling Width (cm / inches)', displayOrder: 5, groupId: 'group-default' },
  { id: 'sa-6', name: 'Operating Pressure & Battery', displayOrder: 6, groupId: 'group-default' },
  { id: 'sa-7', name: 'Target Crop Types & Composition', displayOrder: 7, groupId: 'group-default' },
  { id: 'sa-8', name: 'Quality Standard & Fulfillment Hub', displayOrder: 8, groupId: 'group-default' },
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
      categoryHierarchy: (detailed as any).categoryHierarchy || '',
      parentCategoryName: (detailed as any).parentCategory?.name || '',
      subCategoryName: (detailed as any).subCategory?.name || '',
      brandName: (detailed as any).brand?.name || 'AgriPro',
      targetCrops: Array.isArray(p.targetCrops) ? p.targetCrops.join(', ') : (p.targetCrops || 'All Crops'),
      specifications: (detailed as any).specifications || [],
    };
  });
}

function getProductsForSpecAttribute(attr: any, allProducts: any[]) {
  const attrId = (attr.id || '').toLowerCase();
  const attrName = (attr.name || '').toLowerCase();

  const results: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    published: boolean;
    categoryHierarchy: string;
    specValue: string;
  }> = [];

  for (const p of allProducts) {
    const nameLower = p.name.toLowerCase();
    const catLower = (p.categoryHierarchy || '').toLowerCase();
    const specs: any[] = Array.isArray(p.specifications) ? p.specifications : [];

    // Check if product has a matching spec in devDb.data.specifications
    const directSpec = specs.find((s) => {
      const sName = (s.name || '').toLowerCase();
      const sGroup = (s.group || '').toLowerCase();
      return (
        sName === attrName ||
        attrName.includes(sName) ||
        sName.includes(attrName) ||
        (attrId === 'sa-1' && sName.includes('displacement')) ||
        (attrId === 'sa-2' && (sName.includes('engine') || sName.includes('power'))) ||
        (attrId === 'sa-3' && (sName.includes('fuel') || sName.includes('consumption'))) ||
        (attrId === 'sa-5' && sName.includes('tilling')) ||
        (attrId === 'sa-6' && (sName.includes('battery') || sName.includes('pump') || sName.includes('injector'))) ||
        (attrId === 'sa-7' && (sName.includes('npk') || sName.includes('azadirachtin') || sName.includes('seed') || sName.includes('germination') || sName.includes('manifold'))) ||
        (attrId === 'sa-8' && (sName.includes('quality') || sName.includes('fulfillment') || sGroup.includes('quality')))
      );
    });

    if (directSpec) {
      results.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        published: p.published,
        categoryHierarchy: p.categoryHierarchy,
        specValue: `${directSpec.name}: ${directSpec.value}`,
      });
      continue;
    }

    // Fallback intelligent mapping so every product is searchable across relevant spec attributes
    if (attrId === 'sa-1' || attrName.includes('displacement')) {
      if (nameLower.includes('weeder') || nameLower.includes('tiller')) {
        results.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          published: p.published,
          categoryHierarchy: p.categoryHierarchy,
          specValue: nameLower.includes('7hp') ? '212 cc Heavy-Duty' : '170 cc Field Grade',
        });
      }
    } else if (attrId === 'sa-2' || attrName.includes('power rating')) {
      if (catLower.includes('machinery') || nameLower.includes('weeder') || nameLower.includes('tiller') || nameLower.includes('solar') || nameLower.includes('sprayer')) {
        results.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          published: p.published,
          categoryHierarchy: p.categoryHierarchy,
          specValue: nameLower.includes('7hp')
            ? '7 HP (5.2 kW) 4-Stroke'
            : nameLower.includes('5hp')
            ? '5 HP (3.7 kW) Rotary'
            : nameLower.includes('sprayer')
            ? '12V 12Ah Double Motor'
            : 'Solar 10W / 12V DC',
        });
      }
    } else if (attrId === 'sa-3' || attrName.includes('fuel') || attrName.includes('tank')) {
      if (nameLower.includes('weeder') || nameLower.includes('tiller') || nameLower.includes('sprayer') || nameLower.includes('neem')) {
        results.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          published: p.published,
          categoryHierarchy: p.categoryHierarchy,
          specValue: nameLower.includes('sprayer') ? '16 L Chemical Tank' : nameLower.includes('neem') ? '1 L Concentrate' : '3.6 L Fuel Tank (800 ml/hr)',
        });
      }
    } else if (attrId === 'sa-4' || attrName.includes('starting')) {
      if (catLower.includes('machinery') || nameLower.includes('weeder') || nameLower.includes('tiller') || nameLower.includes('sprayer')) {
        results.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          published: p.published,
          categoryHierarchy: p.categoryHierarchy,
          specValue: nameLower.includes('sprayer') ? 'Electric Push-Button Switch' : 'Recoil + Electric Key Start',
        });
      }
    } else if (attrId === 'sa-5' || attrName.includes('tilling')) {
      if (nameLower.includes('weeder') || nameLower.includes('tiller')) {
        results.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          published: p.published,
          categoryHierarchy: p.categoryHierarchy,
          specValue: '90 cm (36 Inches Adjustable)',
        });
      }
    } else if (attrId === 'sa-7' || attrName.includes('target crop')) {
      results.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        published: p.published,
        categoryHierarchy: p.categoryHierarchy,
        specValue: p.targetCrops || 'Sugarcane, Paddy, Cotton, Chilli, Wheat',
      });
    } else if (attrId === 'sa-8' || attrName.includes('quality') || attrName.includes('soil')) {
      results.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        published: p.published,
        categoryHierarchy: p.categoryHierarchy,
        specValue: specs[0] ? `${specs[0].name}: ${specs[0].value}` : 'ISO & BIS Certified Agricultural Grade',
      });
    } else {
      // Custom specification attribute: link all products
      results.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        published: p.published,
        categoryHierarchy: p.categoryHierarchy,
        specValue: specs[0] ? `${specs[0].name}: ${specs[0].value}` : 'Standard Specification',
      });
    }
  }

  return results;
}

function ensureSeedData() {
  const allProducts = getEnrichedProducts();

  if (!(devDb as any).data.specificationAttributeGroups || (devDb as any).data.specificationAttributeGroups.length === 0) {
    (devDb as any).data.specificationAttributeGroups = [...SEED_SPEC_GROUPS];
    try {
      devDb.save?.();
    } catch {}
  }
  if (!devDb.data.specificationAttributes || devDb.data.specificationAttributes.length === 0) {
    devDb.data.specificationAttributes = SEED_SPEC_ATTRIBUTES.map((a) => ({
      ...a,
      usedByProducts: getProductsForSpecAttribute(a, allProducts),
    }));
    try {
      devDb.save?.();
    } catch {}
  } else {
    const existingIds = new Set(devDb.data.specificationAttributes.map((a: any) => a.id));
    for (const seed of SEED_SPEC_ATTRIBUTES) {
      if (!existingIds.has(seed.id)) {
        devDb.data.specificationAttributes.push({ ...seed });
      }
    }
    devDb.data.specificationAttributes = devDb.data.specificationAttributes.map((a: any) => ({
      ...a,
      groupId: a.groupId || 'group-default',
      usedByProducts: getProductsForSpecAttribute(a, allProducts),
    }));
  }

  return allProducts;
}

export async function GET(request: Request) {
  try {
    const allProducts = ensureSeedData();
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId') || searchParams.get('group_id');
    const search = searchParams.get('search')?.toLowerCase().trim();

    const groups = (devDb as any).data.specificationAttributeGroups || [...SEED_SPEC_GROUPS];

    if (groupId) {
      const singleGroup = groups.find((g: any) => g.id === groupId);
      return NextResponse.json({ success: !!singleGroup, data: singleGroup });
    }

    let attrs = devDb.getSpecificationAttributes
      ? devDb.getSpecificationAttributes()
      : devDb.data.specificationAttributes || [];

    attrs = attrs.map((a: any) => ({
      ...a,
      groupId: a.groupId || 'group-default',
      usedByProducts: getProductsForSpecAttribute(a, allProducts),
    }));

    const id = searchParams.get('id');
    if (id) {
      const single = attrs.find((a: any) => a.id === id);
      return NextResponse.json({ success: !!single, data: single, products: allProducts });
    }

    if (search) {
      attrs = attrs.filter((a: any) => {
        const matchName = (a.name || '').toLowerCase().includes(search);
        const matchId = (a.id || '').toLowerCase().includes(search);
        const matchProduct =
          Array.isArray(a.usedByProducts) &&
          a.usedByProducts.some(
            (p: any) =>
              (p.id || '').toLowerCase().includes(search) ||
              (p.name || '').toLowerCase().includes(search) ||
              (p.sku || '').toLowerCase().includes(search) ||
              (p.specValue || '').toLowerCase().includes(search)
          );
        return matchName || matchId || matchProduct;
      });
    }

    return NextResponse.json({
      success: true,
      count: attrs.length,
      data: attrs,
      products: allProducts,
      groups: groups.sort((a: any, b: any) => a.displayOrder - b.displayOrder),
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

    if (body.isGroup || body.type === 'group') {
      const groups = (devDb as any).data.specificationAttributeGroups || [];
      const newGroup = {
        id: body.id || `group-${Date.now()}`,
        name: body.name.trim(),
        displayOrder: Number(body.displayOrder) || groups.length,
        createdAt: new Date().toISOString(),
      };
      groups.push(newGroup);
      (devDb as any).data.specificationAttributeGroups = groups;
      try {
        (devDb as any).save?.();
      } catch {}
      return NextResponse.json({ success: true, data: newGroup });
    }

    const item = devDb.saveSpecificationAttribute
      ? devDb.saveSpecificationAttribute({
          ...body,
          groupId: body.groupId || 'group-default',
        })
      : {
          id: body.id || `sa-${Date.now()}`,
          name: body.name.trim(),
          displayOrder: Number(body.displayOrder) || 1,
          groupId: body.groupId || 'group-default',
          usedByProducts: getProductsForSpecAttribute(body, allProducts),
        };
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

    if (body.isGroup || body.type === 'group') {
      const groups = (devDb as any).data.specificationAttributeGroups || [];
      const idx = groups.findIndex((g: any) => g.id === body.id);
      if (idx >= 0) {
        groups[idx] = { ...groups[idx], ...body };
        try {
          (devDb as any).save?.();
        } catch {}
        return NextResponse.json({ success: true, data: groups[idx] });
      }
    }

    const item = devDb.saveSpecificationAttribute ? devDb.saveSpecificationAttribute(body) : body;
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

    if (devDb.deleteSpecificationAttributes) {
      devDb.deleteSpecificationAttributes(targetIds);
    } else {
      devDb.data.specificationAttributes = (devDb.data.specificationAttributes || []).filter(
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
