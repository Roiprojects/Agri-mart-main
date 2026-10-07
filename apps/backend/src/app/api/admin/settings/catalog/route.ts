import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

export interface CatalogSettingsData {
  // Artificial Intelligence (media_1791348103171.png & media_1791348106363.png)
  enableArtificialIntelligence: boolean;
  providerType: string;
  apiKey: string;
  allowGenerateProductDescription: boolean;
  aiQueryGenerateProductDescription: string;
  allowGenerateMetaTitle: boolean;
  aiQueryGenerateMetaTitle: string;
  allowGenerateMetaKeywords: boolean;
  aiQueryGenerateMetaKeywords: string;
  allowGenerateMetaDescription: boolean;
  aiQueryGenerateMetaDescription: string;

  // Search (media_1791348108093.png & media_1791348109836.png)
  searchEnabled: boolean;
  showProductCategoriesForSearchBox: boolean;
  searchAutocompleteEnabled: boolean;
  numberOfAutocompleteProductsToDisplay: number;
  showLinkToAllSearchResultsInAutocompleteBox: boolean;
  showProductImagesInAutocompleteBox: boolean;
  searchTermMinimumLength: number;
  searchPageAllowCustomersToSelectPageSize: boolean;
  searchPagePageSizeOptions: string;
  searchPagePriceRangeFiltering: boolean;
  searchPageEnterPriceRangeManually: boolean;
  searchPagePriceFrom: number;
  searchPagePriceTo: number;
  allowCustomersToSearchWithManufacturerName: boolean;
  allowCustomersToSearchWithCategoryName: boolean;

  // Catalog images & placeholder
  defaultCatalogPlaceholderImage?: string;

  isAdvanced: boolean;
}

export const DEFAULT_CATALOG_SETTINGS: CatalogSettingsData = {
  // Artificial Intelligence defaults
  enableArtificialIntelligence: true,
  providerType: 'Gemini',
  apiKey: '',
  allowGenerateProductDescription: true,
  aiQueryGenerateProductDescription:
    'Create a description on the {4} language for the product with the "{0}" name. Use the following features and keywords: {1}. Use a short description: "{2}". Optimize the result for SEO. The description should be {3} words long. Format the result as HTML.',
  allowGenerateMetaTitle: true,
  aiQueryGenerateMetaTitle:
    'Create most suitable meta title on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text.',
  allowGenerateMetaKeywords: true,
  aiQueryGenerateMetaKeywords:
    'Create five or six of keywords on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO, list them separated by commas. Use plain text.',
  allowGenerateMetaDescription: true,
  aiQueryGenerateMetaDescription:
    'Create a meta description on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text. The text should be at most 300 characters long.',

  // Search defaults
  searchEnabled: true,
  showProductCategoriesForSearchBox: false,
  searchAutocompleteEnabled: true,
  numberOfAutocompleteProductsToDisplay: 10,
  showLinkToAllSearchResultsInAutocompleteBox: false,
  showProductImagesInAutocompleteBox: false,
  searchTermMinimumLength: 3,
  searchPageAllowCustomersToSelectPageSize: true,
  searchPagePageSizeOptions: '6, 3, 9, 18',
  searchPagePriceRangeFiltering: true,
  searchPageEnterPriceRangeManually: true,
  searchPagePriceFrom: 0,
  searchPagePriceTo: 0,
  allowCustomersToSearchWithManufacturerName: true,
  allowCustomersToSearchWithCategoryName: false,

  defaultCatalogPlaceholderImage:
    'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=400&q=80',

  isAdvanced: true,
};

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for catalog settings:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for catalog settings:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const settings = db.catalogSettings
      ? { ...DEFAULT_CATALOG_SETTINGS, ...db.catalogSettings }
      : DEFAULT_CATALOG_SETTINGS;

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch catalog settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();

    const currentSettings = db.catalogSettings || DEFAULT_CATALOG_SETTINGS;
    const updatedSettings = {
      ...currentSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    db.catalogSettings = updatedSettings;
    const written = writeDb(db);

    if (!written) {
      return NextResponse.json(
        { success: false, error: 'Failed to write catalog settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: 'The catalog settings have been updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update catalog settings' },
      { status: 500 }
    );
  }
}
