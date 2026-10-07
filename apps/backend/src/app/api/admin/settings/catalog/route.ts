import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

export interface ReviewTypeItem {
  id: string;
  name: string;
  isRequired: boolean;
  isVisibleToAllCustomers: boolean;
  displayOrder: number;
}

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

  // Product reviews (media_1791348459764.png)
  productReviewsMustBeApproved: boolean;
  oneReviewPerProductFromCustomer: boolean;
  allowAnonymousUsersToWriteProductReviews: boolean;
  productReviewPossibleOnlyAfterPurchasing: boolean;
  notifyAboutNewProductReviews: boolean;
  notifyCustomerAboutProductReviewReply: boolean;
  reviewsPerStore: boolean;
  showProductReviewsTabOnMyAccountPage: boolean;
  productReviewsPageSize: number;
  sortProductReviewsByAscending: boolean;

  // Review types (media_1791348557185.png)
  reviewTypes: ReviewTypeItem[];

  // Performance (media_1791348557185.png)
  ignoreAclRulesSitewide: boolean;
  ignoreLimitPerStoreRulesSitewide: boolean;
  ignoreDiscountsSitewide: boolean;
  ignoreFeaturedProductsSitewide: boolean;
  cacheProductPrices: boolean;

  // Share (media_1791348612688.png)
  showShareButton: boolean;
  shareButtonCode: string;
  emailAFriendEnabled: boolean;
  allowAnonymousUsersToEmailAFriend: boolean;

  // Compare products (media_1791348612688.png)
  compareProductsEnabled: boolean;
  includeShortDescriptionInCompareProducts: boolean;
  includeFullDescriptionInCompareProducts: boolean;

  // Additional sections (media_1791348625312.png)
  removeRequiredProducts: boolean;
  showBestSellersOnHomePage: boolean;
  numberOfBestSellersOnHomePage: number;
  productsAlsoPurchasedEnabled: boolean;
  numberOfAlsoPurchasedProductsToDisplay: number;
  recentlyViewedProductsEnabled: boolean;
  numberOfRecentlyViewedProducts: number;
  newProductsPageEnabled: boolean;
  newProductsPageAllowCustomersToSelectPageSize: boolean;
  numberOfProductsOnNewProductsPage: number;
  displayDateForPreOrderAvailability: boolean;

  // Product fields (media_1791349415553.png)
  showSkuOnProductDetailsPage: boolean;
  showSkuOnCatalogPages: boolean;
  showGtin: boolean;
  showManufacturerPartNumber: boolean;
  showShortDescriptionOnCatalogPages: boolean;

  // Product page (media_1791349415553.png)
  productUrlStructureType: string;
  showFreeShippingIcon: boolean;
  allowViewingOfUnpublishedProductDetailsPage: boolean;
  discontinuedMessageForUnpublishedProducts: boolean;
  displayTypeForAttributeValueWhenOutOfStock: string;

  // Catalog pages (media_1791349419550.png)
  allowViewModeChanging: boolean;
  defaultViewMode: string;
  includeProductsFromSubcategories: boolean;
  showNumberOfDistinctProductsBesidesEachCategory: boolean;
  includeSubcategoriesInDistinctProductsCount: boolean;
  categoryBreadcrumbEnabled: boolean;
  numberOfManufacturersToDisplay: number;
  useAjaxProductsLoading: boolean;
  enableManufacturerFiltering: boolean;
  enableCatalogPriceRangeFiltering: boolean;
  enableSpecificationAttributeFiltering: boolean;
  displayAllPicturesOnCatalogPages: boolean;
  displayFromPrices: boolean;

  // Tags (media_1791349495099.png)
  numberOfProductTags: number;
  allowCustomersToSelectProductsByTagPageSize: boolean;
  productsByTagPageSizeOptions: string;
  productsByTagPriceRangeFiltering: boolean;
  productsByTagEnterPriceRangeManually: boolean;
  productsByTagPriceFrom: number;
  productsByTagPriceTo: number;

  // Tax (media_1791349518173.png)
  displayTaxShippingInfoFooter: boolean;
  displayTaxShippingInfoProductDetailsPage: boolean;
  displayTaxShippingInfoProductBoxes: boolean;
  displayTaxShippingInfoShoppingCart: boolean;
  displayTaxShippingInfoWishlist: boolean;
  displayTaxShippingInfoOrderDetailsPage: boolean;

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

  // Product reviews defaults
  productReviewsMustBeApproved: false,
  oneReviewPerProductFromCustomer: false,
  allowAnonymousUsersToWriteProductReviews: false,
  productReviewPossibleOnlyAfterPurchasing: false,
  notifyAboutNewProductReviews: false,
  notifyCustomerAboutProductReviewReply: true,
  reviewsPerStore: false,
  showProductReviewsTabOnMyAccountPage: true,
  productReviewsPageSize: 10,
  sortProductReviewsByAscending: false,

  // Review types defaults
  reviewTypes: [],

  // Performance defaults
  ignoreAclRulesSitewide: true,
  ignoreLimitPerStoreRulesSitewide: true,
  ignoreDiscountsSitewide: false,
  ignoreFeaturedProductsSitewide: false,
  cacheProductPrices: false,

  // Share defaults
  showShareButton: true,
  shareButtonCode:
    '</a><a class="addthis_button_preferred_2"></a><a class="addthis_button_preferred_3"></a><a class="addthis_button_preferred_4"></a><a class="addthis_button_compact"></a><a class="addthis_counter addthis_bubble_style"></a></div><script src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=nopsolutions"></script><!-- AddThis Button END -->',
  emailAFriendEnabled: true,
  allowAnonymousUsersToEmailAFriend: false,

  // Compare products defaults
  compareProductsEnabled: true,
  includeShortDescriptionInCompareProducts: false,
  includeFullDescriptionInCompareProducts: false,

  // Additional sections defaults
  removeRequiredProducts: false,
  showBestSellersOnHomePage: true,
  numberOfBestSellersOnHomePage: 4,
  productsAlsoPurchasedEnabled: true,
  numberOfAlsoPurchasedProductsToDisplay: 5,
  recentlyViewedProductsEnabled: true,
  numberOfRecentlyViewedProducts: 3,
  newProductsPageEnabled: true,
  newProductsPageAllowCustomersToSelectPageSize: false,
  numberOfProductsOnNewProductsPage: 6,
  displayDateForPreOrderAvailability: false,

  // Product fields defaults (media_1791349415553.png)
  showSkuOnProductDetailsPage: true,
  showSkuOnCatalogPages: false,
  showGtin: false,
  showManufacturerPartNumber: false,
  showShortDescriptionOnCatalogPages: false,

  // Product page defaults (media_1791349415553.png)
  productUrlStructureType: '/Product',
  showFreeShippingIcon: true,
  allowViewingOfUnpublishedProductDetailsPage: true,
  discontinuedMessageForUnpublishedProducts: true,
  displayTypeForAttributeValueWhenOutOfStock: 'Disable',

  // Catalog pages defaults (media_1791349419550.png)
  allowViewModeChanging: true,
  defaultViewMode: 'Grid',
  includeProductsFromSubcategories: true,
  showNumberOfDistinctProductsBesidesEachCategory: true,
  includeSubcategoriesInDistinctProductsCount: false,
  categoryBreadcrumbEnabled: true,
  numberOfManufacturersToDisplay: 2,
  useAjaxProductsLoading: true,
  enableManufacturerFiltering: false,
  enableCatalogPriceRangeFiltering: false,
  enableSpecificationAttributeFiltering: false,
  displayAllPicturesOnCatalogPages: false,
  displayFromPrices: false,

  // Tags defaults (media_1791349495099.png)
  numberOfProductTags: 15,
  allowCustomersToSelectProductsByTagPageSize: true,
  productsByTagPageSizeOptions: '6, 3, 9, 18',
  productsByTagPriceRangeFiltering: true,
  productsByTagEnterPriceRangeManually: true,
  productsByTagPriceFrom: 0,
  productsByTagPriceTo: 0,

  // Tax defaults (media_1791349518173.png)
  displayTaxShippingInfoFooter: false,
  displayTaxShippingInfoProductDetailsPage: false,
  displayTaxShippingInfoProductBoxes: false,
  displayTaxShippingInfoShoppingCart: false,
  displayTaxShippingInfoWishlist: false,
  displayTaxShippingInfoOrderDetailsPage: false,

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
