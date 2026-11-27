export interface NormalizedProductSpec {
  id: string;
  attributeType: string;
  attributeName: string;
  value: string;
  allowFiltering: boolean;
  showOnProductPage: boolean;
  displayOrder: number;
}

function getCategorySlugOrName(product: any): string {
  const cat =
    typeof product?.category === 'object'
      ? product.category?.slug || product.category?.name || ''
      : product?.category || '';
  return `${cat} ${product?.categoryId || ''} ${product?.name || ''}`.toLowerCase();
}

export function getEffectiveProductAttributes(product: any): any[] {
  if (Array.isArray(product?.productAttributes) && product.productAttributes.length > 0) {
    return product.productAttributes;
  }

  const hint = getCategorySlugOrName(product);
  const imgs: string[] = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : Array.isArray(product?.media)
    ? product.media.map((m: any) => m?.url).filter(Boolean)
    : [];
  const img0 = imgs[0] || '';
  const img1 = imgs[1] || img0;
  const img2 = imgs[2] || img0;

  const isSeedOrChem =
    /seed|fertilizer|pesticide|fungicide|herbicide|insecticide|nutrient|bio-|organic|tonic|growth/.test(
      hint
    );
  const isIrrigationOrNet =
    /drip|pipe|sprinkler|mulch|shade|net|tarpaulin|hose|fitting|filter/.test(hint);

  if (isSeedOrChem) {
    return [
      {
        id: `default-color-${product?.id || 'p'}`,
        attributeName: 'Color',
        textPrompt: '',
        isRequired: false,
        controlType: 'Color squares',
        displayOrder: 0,
        values: [
          {
            id: 'col-green',
            name: 'Agri Green',
            rgbColor: '#15803d',
            priceAdjustment: 0,
            weightAdjustment: 0,
            isPreSelected: true,
            picture: img0,
            displayOrder: 0,
          },
          {
            id: 'col-amber',
            name: 'Harvest Gold',
            rgbColor: '#d97706',
            priceAdjustment: 0,
            weightAdjustment: 0,
            isPreSelected: false,
            picture: img1,
            displayOrder: 1,
          },
          {
            id: 'col-blue',
            name: 'Bio Blue',
            rgbColor: '#1d4ed8',
            priceAdjustment: 0,
            weightAdjustment: 0,
            isPreSelected: false,
            picture: img2,
            displayOrder: 2,
          },
        ],
      },
      {
        id: `default-size-${product?.id || 'p'}`,
        attributeName: 'Pack Size',
        textPrompt: '',
        isRequired: false,
        controlType: 'Radio button list',
        displayOrder: 1,
        values: [
          { id: 'sz-std', name: 'Standard Pack', priceAdjustment: 0, isPreSelected: true, displayOrder: 0 },
          { id: 'sz-2x', name: 'Twin Pack', priceAdjustment: 0, isPreSelected: false, displayOrder: 1 },
          { id: 'sz-bulk', name: 'Farm Bulk', priceAdjustment: 0, isPreSelected: false, displayOrder: 2 },
        ],
      },
    ];
  }

  if (isIrrigationOrNet) {
    return [
      {
        id: `default-color-${product?.id || 'p'}`,
        attributeName: 'Color',
        textPrompt: '',
        isRequired: false,
        controlType: 'Color squares',
        displayOrder: 0,
        values: [
          {
            id: 'col-uvblack',
            name: 'UV Black',
            rgbColor: '#0f172a',
            priceAdjustment: 0,
            isPreSelected: true,
            picture: img0,
            displayOrder: 0,
          },
          {
            id: 'col-forestgreen',
            name: 'Forest Green',
            rgbColor: '#166534',
            priceAdjustment: 0,
            isPreSelected: false,
            picture: img1,
            displayOrder: 1,
          },
          {
            id: 'col-royalblue',
            name: 'Royal Blue',
            rgbColor: '#1e40af',
            priceAdjustment: 0,
            isPreSelected: false,
            picture: img2,
            displayOrder: 2,
          },
          {
            id: 'col-grey',
            name: 'Industrial Grey',
            rgbColor: '#64748b',
            priceAdjustment: 0,
            isPreSelected: false,
            picture: img0,
            displayOrder: 3,
          },
        ],
      },
      {
        id: `default-size-${product?.id || 'p'}`,
        attributeName: 'Size',
        textPrompt: '',
        isRequired: false,
        controlType: 'Radio button list',
        displayOrder: 1,
        values: [
          { id: 'sz-s', name: 'Standard', priceAdjustment: 0, isPreSelected: true, displayOrder: 0 },
          { id: 'sz-m', name: 'Medium Roll', priceAdjustment: 0, isPreSelected: false, displayOrder: 1 },
          { id: 'sz-l', name: 'Large Roll', priceAdjustment: 0, isPreSelected: false, displayOrder: 2 },
        ],
      },
    ];
  }

  // Default for machinery, sprayers, tools, and all other products
  return [
    {
      id: `default-color-${product?.id || 'p'}`,
      attributeName: 'Color',
      textPrompt: '',
      isRequired: false,
      controlType: 'Color squares',
      displayOrder: 0,
      values: [
        {
          id: 'col-agrigreen',
          name: 'Agri Green',
          rgbColor: '#15803d',
          priceAdjustment: 0,
          isPreSelected: true,
          picture: img0,
          displayOrder: 0,
        },
        {
          id: 'col-crimson',
          name: 'Power Red',
          rgbColor: '#dc2626',
          priceAdjustment: 0,
          isPreSelected: false,
          picture: img1,
          displayOrder: 1,
        },
        {
          id: 'col-yellow',
          name: 'Harvest Yellow',
          rgbColor: '#eab308',
          priceAdjustment: 0,
          isPreSelected: false,
          picture: img2,
          displayOrder: 2,
        },
        {
          id: 'col-navy',
          name: 'Deep Blue',
          rgbColor: '#1e3a8a',
          priceAdjustment: 0,
          isPreSelected: false,
          picture: img0,
          displayOrder: 3,
        },
        {
          id: 'col-slate',
          name: 'Matte Black',
          rgbColor: '#1e293b',
          priceAdjustment: 0,
          isPreSelected: false,
          picture: img1,
          displayOrder: 4,
        },
      ],
    },
    {
      id: `default-size-${product?.id || 'p'}`,
      attributeName: 'Size',
      textPrompt: '',
      isRequired: false,
      controlType: 'Radio button list',
      displayOrder: 1,
      values: [
        { id: 'sz-std', name: 'Standard', priceAdjustment: 0, isPreSelected: true, displayOrder: 0 },
        { id: 'sz-pro', name: 'Pro Kit', priceAdjustment: 0, isPreSelected: false, displayOrder: 1 },
        { id: 'sz-hd', name: 'Heavy Duty', priceAdjustment: 0, isPreSelected: false, displayOrder: 2 },
      ],
    },
  ];
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

  // Merge product.specifications (array or Record<string, string>) so every product shows its specs
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

  // Add key fallback product metadata specs if not already present
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
