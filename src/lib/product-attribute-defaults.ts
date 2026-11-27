export interface NormalizedProductSpec {
  id: string;
  attributeType: string;
  attributeName: string;
  value: string;
  allowFiltering: boolean;
  showOnProductPage: boolean;
  displayOrder: number;
}

export const ADMIN_SEED_PRODUCT_ATTRIBUTES = [
  {
    id: 'pa-color',
    name: 'Color',
    description: 'Product color variants (Agri Green, Kisan Blue, Harvest Yellow, Flame Red)',
    displayOrder: 1,
    predefinedValues: [
      { id: 'pv-1', name: 'Agri Green', rgbColor: '#15803d', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 1 },
      { id: 'pv-2', name: 'Kisan Blue', rgbColor: '#1d4ed8', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 2 },
      { id: 'pv-3', name: 'Harvest Yellow', rgbColor: '#eab308', priceAdjustment: 50, weightAdjustment: 0, isPreSelected: false, displayOrder: 3 },
      { id: 'pv-4', name: 'Flame Red', rgbColor: '#dc2626', priceAdjustment: 75, weightAdjustment: 0, isPreSelected: false, displayOrder: 4 },
    ],
  },
  {
    id: 'pa-frame-color',
    name: 'Frame Color',
    description: 'Chassis or heavy-duty frame finish colors',
    displayOrder: 2,
    predefinedValues: [
      { id: 'pv-5', name: 'Matte Black', rgbColor: '#1e293b', priceAdjustment: 0, weightAdjustment: 0, isPreSelected: false, displayOrder: 1 },
      { id: 'pv-6', name: 'Gunmetal Grey', rgbColor: '#475569', priceAdjustment: 120, weightAdjustment: 0.5, isPreSelected: false, displayOrder: 2 },
    ],
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
  },
];

const COLOR_NAME_MAP: Record<string, string> = {
  'agri green': '#15803d',
  'kisan blue': '#1d4ed8',
  'harvest yellow': '#eab308',
  'flame red': '#dc2626',
  'matte black': '#1e293b',
  'gunmetal grey': '#475569',
  green: '#16a34a',
  blue: '#2563eb',
  yellow: '#eab308',
  red: '#dc2626',
  black: '#0f172a',
  grey: '#64748b',
  gray: '#64748b',
  white: '#f8fafc',
  orange: '#ea580c',
  brown: '#78350f',
  gold: '#d97706',
  silver: '#94a3b8',
  purple: '#7c3aed',
  pink: '#db2777',
};

export function resolveColorHex(name?: string, explicitRgb?: string): string {
  if (explicitRgb && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(explicitRgb.trim())) {
    return explicitRgb.trim();
  }
  const lower = String(name || '').trim().toLowerCase();
  if (COLOR_NAME_MAP[lower]) return COLOR_NAME_MAP[lower];
  for (const [key, hex] of Object.entries(COLOR_NAME_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return '#64748b';
}

function doesAdminAttributeApplyToProduct(attr: any, product: any): boolean {
  if (Array.isArray(attr.usedByProducts) && attr.usedByProducts.length > 0) {
    if (attr.usedByProducts.some((u: any) => u?.id === product?.id || (u?.sku && u.sku === product?.sku))) {
      return true;
    }
  }

  const attrId = String(attr.id || '').toLowerCase();
  const attrName = String(attr.name || '').toLowerCase();
  const nameLower = String(product?.name || '').toLowerCase();
  const skuLower = String(product?.sku || '').toLowerCase();
  const catText = (
    typeof product?.category === 'object'
      ? `${product?.category?.name || ''} ${product?.categoryHierarchy || ''}`
      : `${product?.category || ''} ${product?.categoryHierarchy || ''}`
  ).toLowerCase();

  if (attrId === 'pa-color' || (attrName.includes('color') && !attrName.includes('frame'))) {
    return (
      catText.includes('machinery') ||
      catText.includes('tools') ||
      catText.includes('irrigation') ||
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
      catText.includes('machinery') ||
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
      catText.includes('weeder') ||
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
      catText.includes('sprayer') ||
      catText.includes('protection') ||
      catText.includes('irrigation')
    );
  }
  if (attrId === 'pa-pattern' || attrName.includes('pattern')) {
    return (
      nameLower.includes('tarpaulin') ||
      nameLower.includes('basket') ||
      nameLower.includes('weeder') ||
      nameLower.includes('tiller') ||
      catText.includes('tools')
    );
  }
  if (attrId === 'pa-package' || attrName.includes('packag') || attrName.includes('size')) {
    return true;
  }

  return true;
}

export function getEffectiveProductAttributes(product: any, adminAttributes?: any[]): any[] {
  if (Array.isArray(product?.productAttributes) && product.productAttributes.length > 0) {
    return product.productAttributes;
  }

  const sourceAttrs =
    Array.isArray(adminAttributes) && adminAttributes.length > 0
      ? adminAttributes
      : ADMIN_SEED_PRODUCT_ATTRIBUTES;

  const imgs: string[] = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : Array.isArray(product?.media)
    ? product.media.map((m: any) => m?.url).filter(Boolean)
    : [];

  return sourceAttrs
    .filter((attr) => Array.isArray(attr.predefinedValues) && attr.predefinedValues.length > 0)
    .filter((attr) => doesAdminAttributeApplyToProduct(attr, product))
    .sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0))
    .map((attr) => {
      const isColor = /color/i.test(String(attr.name || ''));
      const sortedVals = [...attr.predefinedValues].sort(
        (a: any, b: any) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0)
      );
      const hasAnyPreSelected = sortedVals.some((v: any) => Boolean(v.isPreSelected));

      return {
        id: attr.id || `attr-${attr.name}`,
        attributeName: attr.name,
        textPrompt: attr.description || '',
        isRequired: false,
        controlType: isColor ? 'Color squares' : 'Radio button list',
        displayOrder: Number(attr.displayOrder ?? 0),
        values: sortedVals.map((v: any, idx: number) => ({
          id: v.id || `${attr.id}-${idx}`,
          name: v.name,
          rgbColor: isColor ? resolveColorHex(v.name, v.rgbColor) : v.rgbColor,
          priceAdjustment: Number(v.priceAdjustment || 0),
          priceAdjustmentUsePercentage: Boolean(v.priceAdjustmentUsePercentage),
          weightAdjustment: Number(v.weightAdjustment || 0),
          cost: Number(v.cost || 0),
          isPreSelected: hasAnyPreSelected ? Boolean(v.isPreSelected) : idx === 0,
          picture: v.picture || (isColor ? imgs[idx % Math.max(1, imgs.length)] || '' : ''),
          displayOrder: Number(v.displayOrder ?? idx),
        })),
      };
    });
}

export function getEffectiveSpecificationAttributes(product: any): NormalizedProductSpec[] {
  const result: NormalizedProductSpec[] = [];
  const seenNames = new Set<string>();

  if (Array.isArray(product?.specificationAttributes)) {
    for (const s of product.specificationAttributes) {
      const name = String(s.attributeName || '').trim();
      const val = String(s.value || '').trim();
      if (!name || !val) continue;
      seenNames.add(name.toLowerCase());
      result.push({
        id: s.id || `sa-${name}`,
        attributeType: s.attributeType || 'Option',
        attributeName: name,
        value: val,
        allowFiltering: s.allowFiltering !== false,
        showOnProductPage: s.showOnProductPage !== false,
        displayOrder: Number(s.displayOrder ?? result.length),
      });
    }
  }

  if (Array.isArray(product?.specifications)) {
    for (const s of product.specifications) {
      const name = String(s?.name || '').trim();
      const val = String(s?.value || '').trim();
      if (!name || !val || seenNames.has(name.toLowerCase())) continue;
      seenNames.add(name.toLowerCase());
      result.push({
        id: `spec-${name}`,
        attributeType: 'Option',
        attributeName: name,
        value: val,
        allowFiltering: true,
        showOnProductPage: true,
        displayOrder: Number(s?.displayOrder ?? result.length),
      });
    }
  } else if (product?.specifications && typeof product.specifications === 'object') {
    for (const [rawName, rawVal] of Object.entries(product.specifications)) {
      const name = String(rawName || '').trim();
      const val = String(rawVal || '').trim();
      if (!name || !val || seenNames.has(name.toLowerCase())) continue;
      seenNames.add(name.toLowerCase());
      result.push({
        id: `spec-${name}`,
        attributeType: 'Option',
        attributeName: name,
        value: val,
        allowFiltering: true,
        showOnProductPage: true,
        displayOrder: result.length,
      });
    }
  }

  const brandName = typeof product?.brand === 'object' ? product?.brand?.name : product?.brand;
  const extras: Array<[string, any]> = [
    ['Brand', brandName],
    ['Model Number', product?.modelNumber],
    ['Warranty', product?.warranty],
    ['Dosage', product?.dosage],
    [
      'Target Crops',
      Array.isArray(product?.targetCrops) ? product.targetCrops.join(', ') : product?.targetCrops,
    ],
  ];
  for (const [label, raw] of extras) {
    const val = String(raw || '').trim();
    if (!val || seenNames.has(label.toLowerCase())) continue;
    seenNames.add(label.toLowerCase());
    result.push({
      id: `meta-${label}`,
      attributeType: 'Option',
      attributeName: label,
      value: val,
      allowFiltering: label === 'Brand' || label === 'Warranty',
      showOnProductPage: true,
      displayOrder: result.length,
    });
  }

  return result.sort((a, b) => a.displayOrder - b.displayOrder);
}
