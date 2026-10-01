import { SEED_PRODUCTS, ProductType } from './seed-data';

export interface QuestionnaireInput {
  crop: string;
  soilType: string;
  acreage: number;
  farmingStage: number;
  pestProblems: string;
  irrigationMethod: string;
  budgetRange: 'LOW' | 'MEDIUM' | 'HIGH';
  location: string;
  objective: string;
}

export interface RecommendationResult {
  summary: string;
  fertilizers: ProductType[];
  pestProtection: ProductType[];
  equipment: ProductType[];
  seeds: ProductType[];
  recommendedCombos: {
    title: string;
    description: string;
    items: ProductType[];
    bundlePrice: number;
    originalPrice: number;
    savings: number;
  }[];
  agronomistAdvice: string[];
}

export function generateFarmerRecommendations(input: QuestionnaireInput): RecommendationResult {
  const allProducts = SEED_PRODUCTS;

  const matchingFertilizers = allProducts.filter(
    (p) =>
      p.categoryId === 'cat-fertilizers' &&
      (p.targetCrops.includes(input.crop) || p.targetCrops.includes('All') || p.cropStages.includes(input.farmingStage))
  );

  const matchingProtection = allProducts.filter(
    (p) =>
      p.categoryId === 'cat-protection' &&
      (p.targetCrops.includes(input.crop) || input.pestProblems !== 'None')
  );

  const matchingEquipment = allProducts.filter((p) => {
    if (p.categoryId !== 'cat-machinery' && p.categoryId !== 'cat-irrigation') return false;
    if (input.acreage >= 4) return true;
    return p.price <= 20000;
  });

  const matchingSeeds = allProducts.filter(
    (p) => p.categoryId === 'cat-seeds' && p.targetCrops.includes(input.crop)
  );

  const comboFertilizer = matchingFertilizers[0] || allProducts.find((p) => p.categoryId === 'cat-fertilizers')!;
  const comboPest = matchingProtection[0] || allProducts.find((p) => p.categoryId === 'cat-protection')!;
  const comboOriginal = comboFertilizer.price + comboPest.price;
  const comboBundle = Math.round(comboOriginal * 0.88);

  const stageNames = [
    '',
    'Preparation of Soil',
    'Sowing',
    'Manure & Fertilizers',
    'Irrigation',
    'Protection from Weeds',
    'Harvesting',
    'Storage',
  ];

  const adviceList: string[] = [
    'For ' + input.soilType + ' soil growing ' + input.crop + ' across ' + input.acreage + ' acres, basal organic matter incorporation is vital to enhance moisture retention.',
    'Currently in Stage ' + input.farmingStage + ' (' + (stageNames[input.farmingStage] || 'Active Growth') + '): Prioritize scheduled nutrient top-dressing and monitor under-leaf for pest emergence.',
    input.irrigationMethod === 'Drip'
      ? 'Take advantage of your Drip system by applying water-soluble bio-consortia through the venturi injector for 40% higher nutrient uptake.'
      : 'For furrow/flood irrigation, split fertilizer applications into two doses 12 days apart to minimize leaching.',
    input.pestProblems && input.pestProblems !== 'None'
      ? 'Targeting ' + input.pestProblems + ': Apply Azadirachtin organic repellent early morning or late evening. Supplement with solar insect traps at 1 trap per 1.5 acres.'
      : 'No severe pest pressure reported. Maintain prophylactic neem oil sprays every 15 days to suppress insect vector build-up.',
  ];

  return {
    summary: 'AI Agronomy Plan generated for ' + input.acreage + ' Acres of ' + input.crop + ' in ' + input.location + ' (' + input.soilType + ' Soil - Stage ' + input.farmingStage + ')',
    fertilizers: matchingFertilizers.length > 0 ? matchingFertilizers : [allProducts[2]],
    pestProtection: matchingProtection.length > 0 ? matchingProtection : [allProducts[4]],
    equipment: matchingEquipment.length > 0 ? matchingEquipment : [allProducts[1]],
    seeds: matchingSeeds.length > 0 ? matchingSeeds : [allProducts[3]],
    recommendedCombos: [
      {
        title: input.crop + ' Stage ' + input.farmingStage + ' Green Care Power Combo',
        description: 'Synergistic combination of ' + comboFertilizer.name + ' with ' + comboPest.name + ' for combined nutrient feeding and systemic immunity.',
        items: [comboFertilizer, comboPest],
        originalPrice: comboOriginal,
        bundlePrice: comboBundle,
        savings: comboOriginal - comboBundle,
      },
    ],
    agronomistAdvice: adviceList,
  };
}
