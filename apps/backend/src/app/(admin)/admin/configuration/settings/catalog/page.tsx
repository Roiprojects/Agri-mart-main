'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  MessageSquare,
  MessagesSquare,
  TrendingUp,
  Share2,
  Scale,
  PlusCircle,
  RotateCcw,
  ArrowUp,
  ChevronUp,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Menu,
  FileText,
  LayoutGrid,
  Tag,
  Percent,
  ArrowLeftRight,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { ImageEditorField } from '@/components/admin/ImageEditorField';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 select-none shadow-2xs"
    >
      ?
    </span>
  );
}

interface ReviewTypeItem {
  id: string;
  name: string;
  isRequired: boolean;
  isVisibleToAllCustomers: boolean;
  displayOrder: number;
  description?: string;
  locales?: {
    en?: { name: string; description: string };
    rtl?: { name: string; description: string };
  };
}

interface ProductSortingOption {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
}

export default function CatalogSettingsPage() {
  const router = useRouter();
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards state
  const [aiOpen, setAiOpen] = useState(true);
  const [productFieldsOpen, setProductFieldsOpen] = useState(true);
  const [productPageOpen, setProductPageOpen] = useState(true);
  const [catalogPagesOpen, setCatalogPagesOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [taxOpen, setTaxOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(true);
  const [reviewTypesOpen, setReviewTypesOpen] = useState(true);
  const [performanceOpen, setPerformanceOpen] = useState(true);
  const [shareOpen, setShareOpen] = useState(true);
  const [compareOpen, setCompareOpen] = useState(true);
  const [additionalSectionsOpen, setAdditionalSectionsOpen] = useState(true);
  const [exportImportOpen, setExportImportOpen] = useState(true);
  const [productSortingOpen, setProductSortingOpen] = useState(true);

  // Product fields (media_1791349415553.png)
  const [showSkuOnProductDetailsPage, setShowSkuOnProductDetailsPage] = useState(true);
  const [showSkuOnCatalogPages, setShowSkuOnCatalogPages] = useState(false);
  const [showGtin, setShowGtin] = useState(false);
  const [showManufacturerPartNumber, setShowManufacturerPartNumber] = useState(false);
  const [showShortDescriptionOnCatalogPages, setShowShortDescriptionOnCatalogPages] = useState(false);

  // Product page (media_1791349415553.png)
  const [productUrlStructureType, setProductUrlStructureType] = useState('/Product');
  const [showFreeShippingIcon, setShowFreeShippingIcon] = useState(true);
  const [allowViewingOfUnpublishedProductDetailsPage, setAllowViewingOfUnpublishedProductDetailsPage] =
    useState(true);
  const [discontinuedMessageForUnpublishedProducts, setDiscontinuedMessageForUnpublishedProducts] =
    useState(true);
  const [displayTypeForAttributeValueWhenOutOfStock, setDisplayTypeForAttributeValueWhenOutOfStock] =
    useState('Disable');

  // Catalog pages (media_1791349419550.png)
  const [allowViewModeChanging, setAllowViewModeChanging] = useState(true);
  const [defaultViewMode, setDefaultViewMode] = useState('Grid');
  const [includeProductsFromSubcategories, setIncludeProductsFromSubcategories] = useState(true);
  const [showNumberOfDistinctProductsBesidesEachCategory, setShowNumberOfDistinctProductsBesidesEachCategory] =
    useState(true);
  const [includeSubcategoriesInDistinctProductsCount, setIncludeSubcategoriesInDistinctProductsCount] =
    useState(false);
  const [categoryBreadcrumbEnabled, setCategoryBreadcrumbEnabled] = useState(true);
  const [numberOfManufacturersToDisplay, setNumberOfManufacturersToDisplay] = useState<number | string>(2);
  const [useAjaxProductsLoading, setUseAjaxProductsLoading] = useState(true);
  const [enableManufacturerFiltering, setEnableManufacturerFiltering] = useState(false);
  const [enableCatalogPriceRangeFiltering, setEnableCatalogPriceRangeFiltering] = useState(false);
  const [enableSpecificationAttributeFiltering, setEnableSpecificationAttributeFiltering] = useState(false);
  const [displayAllPicturesOnCatalogPages, setDisplayAllPicturesOnCatalogPages] = useState(false);
  const [displayFromPrices, setDisplayFromPrices] = useState(false);

  // Tags (media_1791349495099.png)
  const [numberOfProductTags, setNumberOfProductTags] = useState<number | string>(15);
  const [allowCustomersToSelectProductsByTagPageSize, setAllowCustomersToSelectProductsByTagPageSize] =
    useState(true);
  const [productsByTagPageSizeOptions, setProductsByTagPageSizeOptions] = useState('6, 3, 9, 18');
  const [productsByTagPriceRangeFiltering, setProductsByTagPriceRangeFiltering] = useState(true);
  const [productsByTagEnterPriceRangeManually, setProductsByTagEnterPriceRangeManually] = useState(true);
  const [productsByTagPriceFrom, setProductsByTagPriceFrom] = useState<number | string>(0);
  const [productsByTagPriceTo, setProductsByTagPriceTo] = useState<number | string>(0);

  // Tax (media_1791349518173.png)
  const [displayTaxShippingInfoFooter, setDisplayTaxShippingInfoFooter] = useState(false);
  const [displayTaxShippingInfoProductDetailsPage, setDisplayTaxShippingInfoProductDetailsPage] =
    useState(false);
  const [displayTaxShippingInfoProductBoxes, setDisplayTaxShippingInfoProductBoxes] = useState(false);
  const [displayTaxShippingInfoShoppingCart, setDisplayTaxShippingInfoShoppingCart] = useState(false);
  const [displayTaxShippingInfoWishlist, setDisplayTaxShippingInfoWishlist] = useState(false);
  const [displayTaxShippingInfoOrderDetailsPage, setDisplayTaxShippingInfoOrderDetailsPage] =
    useState(false);

  // 1. Artificial Intelligence fields (media_1791348103171.png & media_1791348106363.png)
  const [enableArtificialIntelligence, setEnableArtificialIntelligence] = useState(true);
  const [providerType, setProviderType] = useState('Gemini');
  const [apiKey, setApiKey] = useState('');
  const [allowGenerateProductDescription, setAllowGenerateProductDescription] = useState(true);
  const [aiQueryGenerateProductDescription, setAiQueryGenerateProductDescription] = useState(
    'Create a description on the {4} language for the product with the "{0}" name. Use the following features and keywords: {1}. Use a short description: "{2}". Optimize the result for SEO. The description should be {3} words long. Format the result as HTML.'
  );
  const [allowGenerateMetaTitle, setAllowGenerateMetaTitle] = useState(true);
  const [aiQueryGenerateMetaTitle, setAiQueryGenerateMetaTitle] = useState(
    'Create most suitable meta title on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text.'
  );
  const [allowGenerateMetaKeywords, setAllowGenerateMetaKeywords] = useState(true);
  const [aiQueryGenerateMetaKeywords, setAiQueryGenerateMetaKeywords] = useState(
    'Create five or six of keywords on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO, list them separated by commas. Use plain text.'
  );
  const [allowGenerateMetaDescription, setAllowGenerateMetaDescription] = useState(true);
  const [aiQueryGenerateMetaDescription, setAiQueryGenerateMetaDescription] = useState(
    'Create a meta description on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text. The text should be at most 300 characters long.'
  );

  // 2. Search fields (media_1791348108093.png & media_1791348109836.png)
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [showProductCategoriesForSearchBox, setShowProductCategoriesForSearchBox] = useState(false);
  const [searchAutocompleteEnabled, setSearchAutocompleteEnabled] = useState(true);
  const [numberOfAutocompleteProductsToDisplay, setNumberOfAutocompleteProductsToDisplay] =
    useState<number | string>(10);
  const [showLinkToAllSearchResultsInAutocompleteBox, setShowLinkToAllSearchResultsInAutocompleteBox] =
    useState(false);
  const [showProductImagesInAutocompleteBox, setShowProductImagesInAutocompleteBox] =
    useState(false);
  const [searchTermMinimumLength, setSearchTermMinimumLength] = useState<number | string>(3);
  const [
    searchPageAllowCustomersToSelectPageSize,
    setSearchPageAllowCustomersToSelectPageSize,
  ] = useState(true);
  const [searchPagePageSizeOptions, setSearchPagePageSizeOptions] = useState('6, 3, 9, 18');
  const [searchPagePriceRangeFiltering, setSearchPagePriceRangeFiltering] = useState(true);
  const [searchPageEnterPriceRangeManually, setSearchPageEnterPriceRangeManually] = useState(true);
  const [searchPagePriceFrom, setSearchPagePriceFrom] = useState<number | string>(0);
  const [searchPagePriceTo, setSearchPagePriceTo] = useState<number | string>(0);
  const [
    allowCustomersToSearchWithManufacturerName,
    setAllowCustomersToSearchWithManufacturerName,
  ] = useState(true);
  const [allowCustomersToSearchWithCategoryName, setAllowCustomersToSearchWithCategoryName] =
    useState(false);

  // 3. Product reviews fields (media_1791348459764.png)
  const [productReviewsMustBeApproved, setProductReviewsMustBeApproved] = useState(false);
  const [oneReviewPerProductFromCustomer, setOneReviewPerProductFromCustomer] = useState(false);
  const [allowAnonymousUsersToWriteProductReviews, setAllowAnonymousUsersToWriteProductReviews] =
    useState(false);
  const [productReviewPossibleOnlyAfterPurchasing, setProductReviewPossibleOnlyAfterPurchasing] =
    useState(false);
  const [notifyAboutNewProductReviews, setNotifyAboutNewProductReviews] = useState(false);
  const [notifyCustomerAboutProductReviewReply, setNotifyCustomerAboutProductReviewReply] =
    useState(true);
  const [reviewsPerStore, setReviewsPerStore] = useState(false);
  const [showProductReviewsTabOnMyAccountPage, setShowProductReviewsTabOnMyAccountPage] =
    useState(true);
  const [productReviewsPageSize, setProductReviewsPageSize] = useState<number | string>(10);
  const [sortProductReviewsByAscending, setSortProductReviewsByAscending] = useState(false);

  // 4. Review types fields (media_1791348557185.png)
  const [reviewTypes, setReviewTypes] = useState<ReviewTypeItem[]>([]);
  const [reviewTypeModalOpen, setReviewTypeModalOpen] = useState(false);
  const [editingReviewType, setEditingReviewType] = useState<ReviewTypeItem | null>(null);
  const [rtNameInput, setRtNameInput] = useState('');
  const [rtRequiredInput, setRtRequiredInput] = useState(false);
  const [rtVisibleInput, setRtVisibleInput] = useState(true);
  const [rtOrderInput, setRtOrderInput] = useState<number | string>(1);

  // 5. Performance fields (media_1791348557185.png)
  const [ignoreAclRulesSitewide, setIgnoreAclRulesSitewide] = useState(true);
  const [ignoreLimitPerStoreRulesSitewide, setIgnoreLimitPerStoreRulesSitewide] = useState(true);
  const [ignoreDiscountsSitewide, setIgnoreDiscountsSitewide] = useState(false);
  const [ignoreFeaturedProductsSitewide, setIgnoreFeaturedProductsSitewide] = useState(false);
  const [cacheProductPrices, setCacheProductPrices] = useState(false);

  // 6. Share fields (media_1791348612688.png)
  const [showShareButton, setShowShareButton] = useState(true);
  const [shareButtonCode, setShareButtonCode] = useState(
    '</a><a class="addthis_button_preferred_2"></a><a class="addthis_button_preferred_3"></a><a class="addthis_button_preferred_4"></a><a class="addthis_button_compact"></a><a class="addthis_counter addthis_bubble_style"></a></div><script src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=nopsolutions"></script><!-- AddThis Button END -->'
  );
  const [emailAFriendEnabled, setEmailAFriendEnabled] = useState(true);
  const [allowAnonymousUsersToEmailAFriend, setAllowAnonymousUsersToEmailAFriend] = useState(false);

  // 7. Compare products fields (media_1791348612688.png)
  const [compareProductsEnabled, setCompareProductsEnabled] = useState(true);
  const [includeShortDescriptionInCompareProducts, setIncludeShortDescriptionInCompareProducts] =
    useState(false);
  const [includeFullDescriptionInCompareProducts, setIncludeFullDescriptionInCompareProducts] =
    useState(false);

  // 8. Additional sections fields (media_1791348625312.png & media_1791348701724.png)
  const [removeRequiredProducts, setRemoveRequiredProducts] = useState(false);
  const [showBestSellersOnHomePage, setShowBestSellersOnHomePage] = useState(true);
  const [numberOfBestSellersOnHomePage, setNumberOfBestSellersOnHomePage] = useState<number | string>(
    4
  );
  const [productsAlsoPurchasedEnabled, setProductsAlsoPurchasedEnabled] = useState(true);
  const [
    numberOfAlsoPurchasedProductsToDisplay,
    setNumberOfAlsoPurchasedProductsToDisplay,
  ] = useState<number | string>(5);
  const [recentlyViewedProductsEnabled, setRecentlyViewedProductsEnabled] = useState(true);
  const [numberOfRecentlyViewedProducts, setNumberOfRecentlyViewedProducts] = useState<
    number | string
  >(3);
  const [newProductsPageEnabled, setNewProductsPageEnabled] = useState(true);
  const [
    newProductsPageAllowCustomersToSelectPageSize,
    setNewProductsPageAllowCustomersToSelectPageSize,
  ] = useState(false);
  const [numberOfProductsOnNewProductsPage, setNumberOfProductsOnNewProductsPage] = useState<
    number | string
  >(6);
  const [displayDateForPreOrderAvailability, setDisplayDateForPreOrderAvailability] =
    useState(false);

  // Catalog placeholder image
  const [defaultCatalogPlaceholderImage, setDefaultCatalogPlaceholderImage] = useState(
    'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=400&q=80'
  );

  // 9. Export/Import fields (media_1791351690676.png)
  const [exportImportProductsWithAttributes, setExportImportProductsWithAttributes] = useState(true);
  const [exportImportProductsWithSpecificationAttributes, setExportImportProductsWithSpecificationAttributes] =
    useState(true);
  const [exportImportProductsWithTierPrices, setExportImportProductsWithTierPrices] = useState(true);
  const [exportImportProductsWithCategoryBreadcrumb, setExportImportProductsWithCategoryBreadcrumb] =
    useState(false);
  const [exportImportCategoriesUsingNameOfCategory, setExportImportCategoriesUsingNameOfCategory] =
    useState(false);
  const [exportImportProductsAllowDownloadImages, setExportImportProductsAllowDownloadImages] =
    useState(false);
  const [exportImportProductsAllowSplittingFile, setExportImportProductsAllowSplittingFile] =
    useState(false);
  const [exportImportRelatedEntitiesUsingName, setExportImportRelatedEntitiesUsingName] = useState(true);
  const [exportImportProductsWithLimitedToStores, setExportImportProductsWithLimitedToStores] =
    useState(false);
  const [exportImportCategoriesWithLimitedToStores, setExportImportCategoriesWithLimitedToStores] =
    useState(false);

  // 10. Product sorting fields (media_1791351715936.png)
  const [allowProductSorting, setAllowProductSorting] = useState(true);
  const [productSortingOptions, setProductSortingOptions] = useState<ProductSortingOption[]>([
    { id: 'sort-1', name: 'Position', displayOrder: 0, isActive: true },
    { id: 'sort-2', name: 'Name: A to Z', displayOrder: 5, isActive: true },
    { id: 'sort-3', name: 'Name: Z to A', displayOrder: 6, isActive: true },
    { id: 'sort-4', name: 'Price: Low to High', displayOrder: 10, isActive: true },
    { id: 'sort-5', name: 'Price: High to Low', displayOrder: 11, isActive: true },
    { id: 'sort-6', name: 'Created on', displayOrder: 15, isActive: true },
  ]);
  const [sortingModalOpen, setSortingModalOpen] = useState(false);
  const [editingSortingOption, setEditingSortingOption] = useState<ProductSortingOption | null>(null);
  const [sortNameInput, setSortNameInput] = useState('');
  const [sortOrderInput, setSortOrderInput] = useState<number | string>(0);
  const [sortActiveInput, setSortActiveInput] = useState(true);

  // Toast & Saving
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load initial settings from API or localStorage
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/catalog', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            applySettingsData(data.settings);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch catalog settings from API, checking localStorage...', err);
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('agri_catalog_settings');
        if (saved) {
          applySettingsData(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadSettings();
  }, []);

  const applySettingsData = (s: any) => {
    if (s.enableArtificialIntelligence !== undefined)
      setEnableArtificialIntelligence(s.enableArtificialIntelligence);
    if (s.providerType) setProviderType(s.providerType);
    if (s.apiKey !== undefined) setApiKey(s.apiKey);
    if (s.allowGenerateProductDescription !== undefined)
      setAllowGenerateProductDescription(s.allowGenerateProductDescription);
    if (s.aiQueryGenerateProductDescription)
      setAiQueryGenerateProductDescription(s.aiQueryGenerateProductDescription);
    if (s.allowGenerateMetaTitle !== undefined)
      setAllowGenerateMetaTitle(s.allowGenerateMetaTitle);
    if (s.aiQueryGenerateMetaTitle) setAiQueryGenerateMetaTitle(s.aiQueryGenerateMetaTitle);
    if (s.allowGenerateMetaKeywords !== undefined)
      setAllowGenerateMetaKeywords(s.allowGenerateMetaKeywords);
    if (s.aiQueryGenerateMetaKeywords)
      setAiQueryGenerateMetaKeywords(s.aiQueryGenerateMetaKeywords);
    if (s.allowGenerateMetaDescription !== undefined)
      setAllowGenerateMetaDescription(s.allowGenerateMetaDescription);
    if (s.aiQueryGenerateMetaDescription)
      setAiQueryGenerateMetaDescription(s.aiQueryGenerateMetaDescription);

    if (s.searchEnabled !== undefined) setSearchEnabled(s.searchEnabled);
    if (s.showProductCategoriesForSearchBox !== undefined)
      setShowProductCategoriesForSearchBox(s.showProductCategoriesForSearchBox);
    if (s.searchAutocompleteEnabled !== undefined)
      setSearchAutocompleteEnabled(s.searchAutocompleteEnabled);
    if (s.numberOfAutocompleteProductsToDisplay !== undefined)
      setNumberOfAutocompleteProductsToDisplay(s.numberOfAutocompleteProductsToDisplay);
    if (s.showLinkToAllSearchResultsInAutocompleteBox !== undefined)
      setShowLinkToAllSearchResultsInAutocompleteBox(
        s.showLinkToAllSearchResultsInAutocompleteBox
      );
    if (s.showProductImagesInAutocompleteBox !== undefined)
      setShowProductImagesInAutocompleteBox(s.showProductImagesInAutocompleteBox);
    if (s.searchTermMinimumLength !== undefined)
      setSearchTermMinimumLength(s.searchTermMinimumLength);
    if (s.searchPageAllowCustomersToSelectPageSize !== undefined)
      setSearchPageAllowCustomersToSelectPageSize(
        s.searchPageAllowCustomersToSelectPageSize
      );
    if (s.searchPagePageSizeOptions)
      setSearchPagePageSizeOptions(s.searchPagePageSizeOptions);
    if (s.searchPagePriceRangeFiltering !== undefined)
      setSearchPagePriceRangeFiltering(s.searchPagePriceRangeFiltering);
    if (s.searchPageEnterPriceRangeManually !== undefined)
      setSearchPageEnterPriceRangeManually(s.searchPageEnterPriceRangeManually);
    if (s.searchPagePriceFrom !== undefined) setSearchPagePriceFrom(s.searchPagePriceFrom);
    if (s.searchPagePriceTo !== undefined) setSearchPagePriceTo(s.searchPagePriceTo);
    if (s.allowCustomersToSearchWithManufacturerName !== undefined)
      setAllowCustomersToSearchWithManufacturerName(
        s.allowCustomersToSearchWithManufacturerName
      );
    if (s.allowCustomersToSearchWithCategoryName !== undefined)
      setAllowCustomersToSearchWithCategoryName(s.allowCustomersToSearchWithCategoryName);

    // Reviews
    if (s.productReviewsMustBeApproved !== undefined)
      setProductReviewsMustBeApproved(s.productReviewsMustBeApproved);
    if (s.oneReviewPerProductFromCustomer !== undefined)
      setOneReviewPerProductFromCustomer(s.oneReviewPerProductFromCustomer);
    if (s.allowAnonymousUsersToWriteProductReviews !== undefined)
      setAllowAnonymousUsersToWriteProductReviews(s.allowAnonymousUsersToWriteProductReviews);
    if (s.productReviewPossibleOnlyAfterPurchasing !== undefined)
      setProductReviewPossibleOnlyAfterPurchasing(s.productReviewPossibleOnlyAfterPurchasing);
    if (s.notifyAboutNewProductReviews !== undefined)
      setNotifyAboutNewProductReviews(s.notifyAboutNewProductReviews);
    if (s.notifyCustomerAboutProductReviewReply !== undefined)
      setNotifyCustomerAboutProductReviewReply(s.notifyCustomerAboutProductReviewReply);
    if (s.reviewsPerStore !== undefined) setReviewsPerStore(s.reviewsPerStore);
    if (s.showProductReviewsTabOnMyAccountPage !== undefined)
      setShowProductReviewsTabOnMyAccountPage(s.showProductReviewsTabOnMyAccountPage);
    if (s.productReviewsPageSize !== undefined)
      setProductReviewsPageSize(s.productReviewsPageSize);
    if (s.sortProductReviewsByAscending !== undefined)
      setSortProductReviewsByAscending(s.sortProductReviewsByAscending);

    if (s.reviewTypes && Array.isArray(s.reviewTypes)) setReviewTypes(s.reviewTypes);

    // Performance
    if (s.ignoreAclRulesSitewide !== undefined)
      setIgnoreAclRulesSitewide(s.ignoreAclRulesSitewide);
    if (s.ignoreLimitPerStoreRulesSitewide !== undefined)
      setIgnoreLimitPerStoreRulesSitewide(s.ignoreLimitPerStoreRulesSitewide);
    if (s.ignoreDiscountsSitewide !== undefined)
      setIgnoreDiscountsSitewide(s.ignoreDiscountsSitewide);
    if (s.ignoreFeaturedProductsSitewide !== undefined)
      setIgnoreFeaturedProductsSitewide(s.ignoreFeaturedProductsSitewide);
    if (s.cacheProductPrices !== undefined) setCacheProductPrices(s.cacheProductPrices);

    // Share
    if (s.showShareButton !== undefined) setShowShareButton(s.showShareButton);
    if (s.shareButtonCode !== undefined) setShareButtonCode(s.shareButtonCode);
    if (s.emailAFriendEnabled !== undefined) setEmailAFriendEnabled(s.emailAFriendEnabled);
    if (s.allowAnonymousUsersToEmailAFriend !== undefined)
      setAllowAnonymousUsersToEmailAFriend(s.allowAnonymousUsersToEmailAFriend);

    // Compare
    if (s.compareProductsEnabled !== undefined)
      setCompareProductsEnabled(s.compareProductsEnabled);
    if (s.includeShortDescriptionInCompareProducts !== undefined)
      setIncludeShortDescriptionInCompareProducts(
        s.includeShortDescriptionInCompareProducts
      );
    if (s.includeFullDescriptionInCompareProducts !== undefined)
      setIncludeFullDescriptionInCompareProducts(s.includeFullDescriptionInCompareProducts);

    // Additional sections
    if (s.removeRequiredProducts !== undefined)
      setRemoveRequiredProducts(s.removeRequiredProducts);
    if (s.showBestSellersOnHomePage !== undefined)
      setShowBestSellersOnHomePage(s.showBestSellersOnHomePage);
    if (s.numberOfBestSellersOnHomePage !== undefined)
      setNumberOfBestSellersOnHomePage(s.numberOfBestSellersOnHomePage);
    if (s.productsAlsoPurchasedEnabled !== undefined)
      setProductsAlsoPurchasedEnabled(s.productsAlsoPurchasedEnabled);
    if (s.numberOfAlsoPurchasedProductsToDisplay !== undefined)
      setNumberOfAlsoPurchasedProductsToDisplay(s.numberOfAlsoPurchasedProductsToDisplay);
    if (s.recentlyViewedProductsEnabled !== undefined)
      setRecentlyViewedProductsEnabled(s.recentlyViewedProductsEnabled);
    if (s.numberOfRecentlyViewedProducts !== undefined)
      setNumberOfRecentlyViewedProducts(s.numberOfRecentlyViewedProducts);
    if (s.newProductsPageEnabled !== undefined)
      setNewProductsPageEnabled(s.newProductsPageEnabled);
    if (s.newProductsPageAllowCustomersToSelectPageSize !== undefined)
      setNewProductsPageAllowCustomersToSelectPageSize(
        s.newProductsPageAllowCustomersToSelectPageSize
      );
    if (s.numberOfProductsOnNewProductsPage !== undefined)
      setNumberOfProductsOnNewProductsPage(s.numberOfProductsOnNewProductsPage);
    if (s.displayDateForPreOrderAvailability !== undefined)
      setDisplayDateForPreOrderAvailability(s.displayDateForPreOrderAvailability);

    if (s.defaultCatalogPlaceholderImage)
      setDefaultCatalogPlaceholderImage(s.defaultCatalogPlaceholderImage);

    // Product fields (media_1791349415553.png)
    if (s.showSkuOnProductDetailsPage !== undefined)
      setShowSkuOnProductDetailsPage(s.showSkuOnProductDetailsPage);
    if (s.showSkuOnCatalogPages !== undefined)
      setShowSkuOnCatalogPages(s.showSkuOnCatalogPages);
    if (s.showGtin !== undefined) setShowGtin(s.showGtin);
    if (s.showManufacturerPartNumber !== undefined)
      setShowManufacturerPartNumber(s.showManufacturerPartNumber);
    if (s.showShortDescriptionOnCatalogPages !== undefined)
      setShowShortDescriptionOnCatalogPages(s.showShortDescriptionOnCatalogPages);

    // Product page (media_1791349415553.png)
    if (s.productUrlStructureType) setProductUrlStructureType(s.productUrlStructureType);
    if (s.showFreeShippingIcon !== undefined)
      setShowFreeShippingIcon(s.showFreeShippingIcon);
    if (s.allowViewingOfUnpublishedProductDetailsPage !== undefined)
      setAllowViewingOfUnpublishedProductDetailsPage(
        s.allowViewingOfUnpublishedProductDetailsPage
      );
    if (s.discontinuedMessageForUnpublishedProducts !== undefined)
      setDiscontinuedMessageForUnpublishedProducts(
        s.discontinuedMessageForUnpublishedProducts
      );
    if (s.displayTypeForAttributeValueWhenOutOfStock)
      setDisplayTypeForAttributeValueWhenOutOfStock(
        s.displayTypeForAttributeValueWhenOutOfStock
      );

    // Catalog pages (media_1791349419550.png)
    if (s.allowViewModeChanging !== undefined)
      setAllowViewModeChanging(s.allowViewModeChanging);
    if (s.defaultViewMode) setDefaultViewMode(s.defaultViewMode);
    if (s.includeProductsFromSubcategories !== undefined)
      setIncludeProductsFromSubcategories(s.includeProductsFromSubcategories);
    if (s.showNumberOfDistinctProductsBesidesEachCategory !== undefined)
      setShowNumberOfDistinctProductsBesidesEachCategory(
        s.showNumberOfDistinctProductsBesidesEachCategory
      );
    if (s.includeSubcategoriesInDistinctProductsCount !== undefined)
      setIncludeSubcategoriesInDistinctProductsCount(
        s.includeSubcategoriesInDistinctProductsCount
      );
    if (s.categoryBreadcrumbEnabled !== undefined)
      setCategoryBreadcrumbEnabled(s.categoryBreadcrumbEnabled);
    if (s.numberOfManufacturersToDisplay !== undefined)
      setNumberOfManufacturersToDisplay(s.numberOfManufacturersToDisplay);
    if (s.useAjaxProductsLoading !== undefined)
      setUseAjaxProductsLoading(s.useAjaxProductsLoading);
    if (s.enableManufacturerFiltering !== undefined)
      setEnableManufacturerFiltering(s.enableManufacturerFiltering);
    if (s.enableCatalogPriceRangeFiltering !== undefined)
      setEnableCatalogPriceRangeFiltering(s.enableCatalogPriceRangeFiltering);
    if (s.enableSpecificationAttributeFiltering !== undefined)
      setEnableSpecificationAttributeFiltering(
        s.enableSpecificationAttributeFiltering
      );
    if (s.displayAllPicturesOnCatalogPages !== undefined)
      setDisplayAllPicturesOnCatalogPages(s.displayAllPicturesOnCatalogPages);
    if (s.displayFromPrices !== undefined)
      setDisplayFromPrices(s.displayFromPrices);

    // Tags (media_1791349495099.png)
    if (s.numberOfProductTags !== undefined)
      setNumberOfProductTags(s.numberOfProductTags);
    if (s.allowCustomersToSelectProductsByTagPageSize !== undefined)
      setAllowCustomersToSelectProductsByTagPageSize(
        s.allowCustomersToSelectProductsByTagPageSize
      );
    if (s.productsByTagPageSizeOptions)
      setProductsByTagPageSizeOptions(s.productsByTagPageSizeOptions);
    if (s.productsByTagPriceRangeFiltering !== undefined)
      setProductsByTagPriceRangeFiltering(s.productsByTagPriceRangeFiltering);
    if (s.productsByTagEnterPriceRangeManually !== undefined)
      setProductsByTagEnterPriceRangeManually(
        s.productsByTagEnterPriceRangeManually
      );
    if (s.productsByTagPriceFrom !== undefined)
      setProductsByTagPriceFrom(s.productsByTagPriceFrom);
    if (s.productsByTagPriceTo !== undefined)
      setProductsByTagPriceTo(s.productsByTagPriceTo);

    // Tax (media_1791349518173.png)
    if (s.displayTaxShippingInfoFooter !== undefined)
      setDisplayTaxShippingInfoFooter(s.displayTaxShippingInfoFooter);
    if (s.displayTaxShippingInfoProductDetailsPage !== undefined)
      setDisplayTaxShippingInfoProductDetailsPage(
        s.displayTaxShippingInfoProductDetailsPage
      );
    if (s.displayTaxShippingInfoProductBoxes !== undefined)
      setDisplayTaxShippingInfoProductBoxes(s.displayTaxShippingInfoProductBoxes);
    if (s.displayTaxShippingInfoShoppingCart !== undefined)
      setDisplayTaxShippingInfoShoppingCart(s.displayTaxShippingInfoShoppingCart);
    if (s.displayTaxShippingInfoWishlist !== undefined)
      setDisplayTaxShippingInfoWishlist(s.displayTaxShippingInfoWishlist);
    if (s.displayTaxShippingInfoOrderDetailsPage !== undefined)
      setDisplayTaxShippingInfoOrderDetailsPage(
        s.displayTaxShippingInfoOrderDetailsPage
      );

    // Export/Import (media_1791351690676.png)
    if (s.exportImportProductsWithAttributes !== undefined)
      setExportImportProductsWithAttributes(s.exportImportProductsWithAttributes);
    if (s.exportImportProductsWithSpecificationAttributes !== undefined)
      setExportImportProductsWithSpecificationAttributes(s.exportImportProductsWithSpecificationAttributes);
    if (s.exportImportProductsWithTierPrices !== undefined)
      setExportImportProductsWithTierPrices(s.exportImportProductsWithTierPrices);
    if (s.exportImportProductsWithCategoryBreadcrumb !== undefined)
      setExportImportProductsWithCategoryBreadcrumb(s.exportImportProductsWithCategoryBreadcrumb);
    if (s.exportImportCategoriesUsingNameOfCategory !== undefined)
      setExportImportCategoriesUsingNameOfCategory(s.exportImportCategoriesUsingNameOfCategory);
    if (s.exportImportProductsAllowDownloadImages !== undefined)
      setExportImportProductsAllowDownloadImages(s.exportImportProductsAllowDownloadImages);
    if (s.exportImportProductsAllowSplittingFile !== undefined)
      setExportImportProductsAllowSplittingFile(s.exportImportProductsAllowSplittingFile);
    if (s.exportImportRelatedEntitiesUsingName !== undefined)
      setExportImportRelatedEntitiesUsingName(s.exportImportRelatedEntitiesUsingName);
    if (s.exportImportProductsWithLimitedToStores !== undefined)
      setExportImportProductsWithLimitedToStores(s.exportImportProductsWithLimitedToStores);
    if (s.exportImportCategoriesWithLimitedToStores !== undefined)
      setExportImportCategoriesWithLimitedToStores(s.exportImportCategoriesWithLimitedToStores);

    // Product sorting (media_1791351715936.png)
    if (s.allowProductSorting !== undefined)
      setAllowProductSorting(s.allowProductSorting);
    if (s.productSortingOptions && Array.isArray(s.productSortingOptions))
      setProductSortingOptions(s.productSortingOptions);

    if (s.defaultCatalogPlaceholderImage)
      setDefaultCatalogPlaceholderImage(s.defaultCatalogPlaceholderImage);

    if (s.isAdvanced !== undefined) setIsAdvanced(s.isAdvanced);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      enableArtificialIntelligence,
      providerType,
      apiKey,
      allowGenerateProductDescription,
      aiQueryGenerateProductDescription,
      allowGenerateMetaTitle,
      aiQueryGenerateMetaTitle,
      allowGenerateMetaKeywords,
      aiQueryGenerateMetaKeywords,
      allowGenerateMetaDescription,
      aiQueryGenerateMetaDescription,

      searchEnabled,
      showProductCategoriesForSearchBox,
      searchAutocompleteEnabled,
      numberOfAutocompleteProductsToDisplay:
        Number(numberOfAutocompleteProductsToDisplay) || 10,
      showLinkToAllSearchResultsInAutocompleteBox,
      showProductImagesInAutocompleteBox,
      searchTermMinimumLength: Number(searchTermMinimumLength) || 3,
      searchPageAllowCustomersToSelectPageSize,
      searchPagePageSizeOptions,
      searchPagePriceRangeFiltering,
      searchPageEnterPriceRangeManually,
      searchPagePriceFrom: Number(searchPagePriceFrom) || 0,
      searchPagePriceTo: Number(searchPagePriceTo) || 0,
      allowCustomersToSearchWithManufacturerName,
      allowCustomersToSearchWithCategoryName,

      productReviewsMustBeApproved,
      oneReviewPerProductFromCustomer,
      allowAnonymousUsersToWriteProductReviews,
      productReviewPossibleOnlyAfterPurchasing,
      notifyAboutNewProductReviews,
      notifyCustomerAboutProductReviewReply,
      reviewsPerStore,
      showProductReviewsTabOnMyAccountPage,
      productReviewsPageSize: Number(productReviewsPageSize) || 10,
      sortProductReviewsByAscending,

      reviewTypes,

      ignoreAclRulesSitewide,
      ignoreLimitPerStoreRulesSitewide,
      ignoreDiscountsSitewide,
      ignoreFeaturedProductsSitewide,
      cacheProductPrices,

      showShareButton,
      shareButtonCode,
      emailAFriendEnabled,
      allowAnonymousUsersToEmailAFriend,

      compareProductsEnabled,
      includeShortDescriptionInCompareProducts,
      includeFullDescriptionInCompareProducts,

      removeRequiredProducts,
      showBestSellersOnHomePage,
      numberOfBestSellersOnHomePage: Number(numberOfBestSellersOnHomePage) || 4,
      productsAlsoPurchasedEnabled,
      numberOfAlsoPurchasedProductsToDisplay:
        Number(numberOfAlsoPurchasedProductsToDisplay) || 5,
      recentlyViewedProductsEnabled,
      numberOfRecentlyViewedProducts: Number(numberOfRecentlyViewedProducts) || 3,
      newProductsPageEnabled,
      newProductsPageAllowCustomersToSelectPageSize,
      numberOfProductsOnNewProductsPage: Number(numberOfProductsOnNewProductsPage) || 6,
      displayDateForPreOrderAvailability,

      // Product fields (media_1791349415553.png)
      showSkuOnProductDetailsPage,
      showSkuOnCatalogPages,
      showGtin,
      showManufacturerPartNumber,
      showShortDescriptionOnCatalogPages,

      // Product page (media_1791349415553.png)
      productUrlStructureType,
      showFreeShippingIcon,
      allowViewingOfUnpublishedProductDetailsPage,
      discontinuedMessageForUnpublishedProducts,
      displayTypeForAttributeValueWhenOutOfStock,

      // Catalog pages (media_1791349419550.png)
      allowViewModeChanging,
      defaultViewMode,
      includeProductsFromSubcategories,
      showNumberOfDistinctProductsBesidesEachCategory,
      includeSubcategoriesInDistinctProductsCount,
      categoryBreadcrumbEnabled,
      numberOfManufacturersToDisplay: Number(numberOfManufacturersToDisplay) || 2,
      useAjaxProductsLoading,
      enableManufacturerFiltering,
      enableCatalogPriceRangeFiltering,
      enableSpecificationAttributeFiltering,
      displayAllPicturesOnCatalogPages,
      displayFromPrices,

      // Tags (media_1791349495099.png)
      numberOfProductTags: Number(numberOfProductTags) || 15,
      allowCustomersToSelectProductsByTagPageSize,
      productsByTagPageSizeOptions,
      productsByTagPriceRangeFiltering,
      productsByTagEnterPriceRangeManually,
      productsByTagPriceFrom: Number(productsByTagPriceFrom) || 0,
      productsByTagPriceTo: Number(productsByTagPriceTo) || 0,

      // Tax (media_1791349518173.png)
      displayTaxShippingInfoFooter,
      displayTaxShippingInfoProductDetailsPage,
      displayTaxShippingInfoProductBoxes,
      displayTaxShippingInfoShoppingCart,
      displayTaxShippingInfoWishlist,
      displayTaxShippingInfoOrderDetailsPage,

      // Export/Import (media_1791351690676.png)
      exportImportProductsWithAttributes,
      exportImportProductsWithSpecificationAttributes,
      exportImportProductsWithTierPrices,
      exportImportProductsWithCategoryBreadcrumb,
      exportImportCategoriesUsingNameOfCategory,
      exportImportProductsAllowDownloadImages,
      exportImportProductsAllowSplittingFile,
      exportImportRelatedEntitiesUsingName,
      exportImportProductsWithLimitedToStores,
      exportImportCategoriesWithLimitedToStores,

      // Product sorting (media_1791351715936.png)
      allowProductSorting,
      productSortingOptions,

      defaultCatalogPlaceholderImage,
      isAdvanced,
    };

    try {
      localStorage.setItem('agri_catalog_settings', JSON.stringify(payload));
      const res = await fetch('/api/admin/settings/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save to server');
      }
      showToast('The catalog settings have been updated successfully.');
    } catch (err: any) {
      console.warn('Saved to localStorage fallback:', err);
      showToast('The catalog settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setEnableArtificialIntelligence(true);
    setProviderType('Gemini');
    setApiKey('');
    setAllowGenerateProductDescription(true);
    setAiQueryGenerateProductDescription(
      'Create a description on the {4} language for the product with the "{0}" name. Use the following features and keywords: {1}. Use a short description: "{2}". Optimize the result for SEO. The description should be {3} words long. Format the result as HTML.'
    );
    setAllowGenerateMetaTitle(true);
    setAiQueryGenerateMetaTitle(
      'Create most suitable meta title on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text.'
    );
    setAllowGenerateMetaKeywords(true);
    setAiQueryGenerateMetaKeywords(
      'Create five or six of keywords on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO, list them separated by commas. Use plain text.'
    );
    setAllowGenerateMetaDescription(true);
    setAiQueryGenerateMetaDescription(
      'Create a meta description on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text. The text should be at most 300 characters long.'
    );

    setSearchEnabled(true);
    setShowProductCategoriesForSearchBox(false);
    setSearchAutocompleteEnabled(true);
    setNumberOfAutocompleteProductsToDisplay(10);
    setShowLinkToAllSearchResultsInAutocompleteBox(false);
    setShowProductImagesInAutocompleteBox(false);
    setSearchTermMinimumLength(3);
    setSearchPageAllowCustomersToSelectPageSize(true);
    setSearchPagePageSizeOptions('6, 3, 9, 18');
    setSearchPagePriceRangeFiltering(true);
    setSearchPageEnterPriceRangeManually(true);
    setSearchPagePriceFrom(0);
    setSearchPagePriceTo(0);
    setAllowCustomersToSearchWithManufacturerName(true);
    setAllowCustomersToSearchWithCategoryName(false);

    setProductReviewsMustBeApproved(false);
    setOneReviewPerProductFromCustomer(false);
    setAllowAnonymousUsersToWriteProductReviews(false);
    setProductReviewPossibleOnlyAfterPurchasing(false);
    setNotifyAboutNewProductReviews(false);
    setNotifyCustomerAboutProductReviewReply(true);
    setReviewsPerStore(false);
    setShowProductReviewsTabOnMyAccountPage(true);
    setProductReviewsPageSize(10);
    setSortProductReviewsByAscending(false);

    setReviewTypes([]);

    setIgnoreAclRulesSitewide(true);
    setIgnoreLimitPerStoreRulesSitewide(true);
    setIgnoreDiscountsSitewide(false);
    setIgnoreFeaturedProductsSitewide(false);
    setCacheProductPrices(false);

    setShowShareButton(true);
    setEmailAFriendEnabled(true);
    setAllowAnonymousUsersToEmailAFriend(false);

    setCompareProductsEnabled(true);
    setIncludeShortDescriptionInCompareProducts(false);
    setIncludeFullDescriptionInCompareProducts(false);

    setRemoveRequiredProducts(false);
    setShowBestSellersOnHomePage(true);
    setNumberOfBestSellersOnHomePage(4);
    setProductsAlsoPurchasedEnabled(true);
    setNumberOfAlsoPurchasedProductsToDisplay(5);
    setRecentlyViewedProductsEnabled(true);
    setNumberOfRecentlyViewedProducts(3);
    setNewProductsPageEnabled(true);
    setNewProductsPageAllowCustomersToSelectPageSize(false);
    setNumberOfProductsOnNewProductsPage(6);
    setDisplayDateForPreOrderAvailability(false);

    setShowSkuOnProductDetailsPage(true);
    setShowSkuOnCatalogPages(false);
    setShowGtin(false);
    setShowManufacturerPartNumber(false);
    setShowShortDescriptionOnCatalogPages(false);

    setProductUrlStructureType('/Product');
    setShowFreeShippingIcon(true);
    setAllowViewingOfUnpublishedProductDetailsPage(true);
    setDiscontinuedMessageForUnpublishedProducts(true);
    setDisplayTypeForAttributeValueWhenOutOfStock('Disable');

    setAllowViewModeChanging(true);
    setDefaultViewMode('Grid');
    setIncludeProductsFromSubcategories(true);
    setShowNumberOfDistinctProductsBesidesEachCategory(true);
    setIncludeSubcategoriesInDistinctProductsCount(false);
    setCategoryBreadcrumbEnabled(true);
    setNumberOfManufacturersToDisplay(2);
    setUseAjaxProductsLoading(true);
    setEnableManufacturerFiltering(false);
    setEnableCatalogPriceRangeFiltering(false);
    setEnableSpecificationAttributeFiltering(false);
    setDisplayAllPicturesOnCatalogPages(false);
    setDisplayFromPrices(false);

    setNumberOfProductTags(15);
    setAllowCustomersToSelectProductsByTagPageSize(true);
    setProductsByTagPageSizeOptions('6, 3, 9, 18');
    setProductsByTagPriceRangeFiltering(true);
    setProductsByTagEnterPriceRangeManually(true);
    setProductsByTagPriceFrom(0);
    setProductsByTagPriceTo(0);

    setDisplayTaxShippingInfoFooter(false);
    setDisplayTaxShippingInfoProductDetailsPage(false);
    setDisplayTaxShippingInfoProductBoxes(false);
    setDisplayTaxShippingInfoShoppingCart(false);
    setDisplayTaxShippingInfoWishlist(false);
    setDisplayTaxShippingInfoOrderDetailsPage(false);

    // Export/Import defaults (media_1791351690676.png)
    setExportImportProductsWithAttributes(true);
    setExportImportProductsWithSpecificationAttributes(true);
    setExportImportProductsWithTierPrices(true);
    setExportImportProductsWithCategoryBreadcrumb(false);
    setExportImportCategoriesUsingNameOfCategory(false);
    setExportImportProductsAllowDownloadImages(false);
    setExportImportProductsAllowSplittingFile(false);
    setExportImportRelatedEntitiesUsingName(true);
    setExportImportProductsWithLimitedToStores(false);
    setExportImportCategoriesWithLimitedToStores(false);

    // Product sorting defaults (media_1791351715936.png)
    setAllowProductSorting(true);
    setProductSortingOptions([
      { id: 'sort-1', name: 'Position', displayOrder: 0, isActive: true },
      { id: 'sort-2', name: 'Name: A to Z', displayOrder: 5, isActive: true },
      { id: 'sort-3', name: 'Name: Z to A', displayOrder: 6, isActive: true },
      { id: 'sort-4', name: 'Price: Low to High', displayOrder: 10, isActive: true },
      { id: 'sort-5', name: 'Price: High to Low', displayOrder: 11, isActive: true },
      { id: 'sort-6', name: 'Created on', displayOrder: 15, isActive: true },
    ]);

    showToast('Reset to default values. Click Save to apply.', 'success');
  };

  const openEditSorting = (item: ProductSortingOption) => {
    setEditingSortingOption(item);
    setSortNameInput(item.name);
    setSortOrderInput(item.displayOrder);
    setSortActiveInput(item.isActive);
    setSortingModalOpen(true);
  };

  const saveSortingOption = () => {
    if (!sortNameInput.trim()) {
      alert('Please enter a sorting option name.');
      return;
    }
    const order = Number(sortOrderInput) || 0;
    if (editingSortingOption) {
      setProductSortingOptions((prev) =>
        prev.map((opt) =>
          opt.id === editingSortingOption.id
            ? {
                ...opt,
                name: sortNameInput.trim(),
                displayOrder: order,
                isActive: sortActiveInput,
              }
            : opt
        )
      );
      showToast('Product sorting option updated.');
    }
    setSortingModalOpen(false);
  };

  const toggleSortingActive = (id: string) => {
    setProductSortingOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, isActive: !opt.isActive } : opt))
    );
  };

  const openAddReviewType = () => {
    router.push('/admin/configuration/settings/catalog/review-types/new');
  };

  const openEditReviewType = (item: ReviewTypeItem) => {
    router.push(`/admin/configuration/settings/catalog/review-types/edit/${item.id}`);
  };

  const saveReviewType = () => {
    if (!rtNameInput.trim()) {
      alert('Please enter a review type name.');
      return;
    }
    const order = Number(rtOrderInput) || 1;
    if (editingReviewType) {
      setReviewTypes((prev) =>
        prev.map((r) =>
          r.id === editingReviewType.id
            ? {
                ...r,
                name: rtNameInput.trim(),
                isRequired: rtRequiredInput,
                isVisibleToAllCustomers: rtVisibleInput,
                displayOrder: order,
              }
            : r
        )
      );
      showToast('Review type updated.');
    } else {
      const newItem: ReviewTypeItem = {
        id: `rt-${Date.now()}`,
        name: rtNameInput.trim(),
        isRequired: rtRequiredInput,
        isVisibleToAllCustomers: rtVisibleInput,
        displayOrder: order,
      };
      setReviewTypes((prev) => [...prev, newItem]);
      showToast('New review type added.');
    }
    setReviewTypeModalOpen(false);
  };

  const deleteReviewType = (id: string) => {
    if (!confirm('Are you sure you want to delete this review type?')) return;
    setReviewTypes((prev) => prev.filter((r) => r.id !== id));
    showToast('Review type deleted.');
    setReviewTypeModalOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── HEADER (Matching media_1791348103171.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Catalog settings</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching media_1791348103171.png) ── */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded-[3px] text-xs font-normal border transition-colors duration-150 cursor-pointer select-none w-[94px] h-[28px] shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] border-[#2080b9] text-white hover:bg-[#1f72a3]'
              : 'bg-[#f8fafc] border-[#2489c5] text-[#2489c5] hover:bg-slate-100'
          }`}
          title="Toggle Basic / Advanced mode"
        >
          {isAdvanced ? (
            <>
              <span className="text-white text-xs font-normal pl-0.5">Advanced</span>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white shadow-2xs" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white border border-[#2489c5] shadow-2xs" />
              <span className="text-[#2489c5] text-xs font-normal pr-0.5">Basic</span>
            </>
          )}
        </button>
      </div>

      {/* ── QUICK JUMP NAVIGATION PILLS ── */}
      <div className="bg-white border border-[#d2d6de] rounded p-2.5 shadow-2xs flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider px-1">
          Sections:
        </span>
        {[
          { id: 'sec-ai', label: 'Artificial Intelligence' },
          { id: 'sec-product-fields', label: 'Product fields' },
          { id: 'sec-product-page', label: 'Product page' },
          { id: 'sec-catalog-pages', label: 'Catalog pages' },
          { id: 'sec-tags', label: 'Tags' },
          { id: 'sec-tax', label: 'Tax' },
          { id: 'sec-search', label: 'Search' },
          { id: 'sec-reviews', label: 'Product reviews' },
          { id: 'sec-review-types', label: 'Review types' },
          { id: 'sec-performance', label: 'Performance' },
          { id: 'sec-share', label: 'Share' },
          { id: 'sec-compare', label: 'Compare products' },
          { id: 'sec-additional', label: 'Additional sections' },
          { id: 'sec-export-import', label: 'Export/Import' },
          { id: 'sec-product-sorting', label: 'Product sorting' },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#3c8dbc] hover:text-white text-slate-700 text-xs font-medium transition cursor-pointer border border-slate-200 shadow-2xs"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* ── CARD 1: ARTIFICIAL INTELLIGENCE (Matching media_1791348103171.png & media_1791348106363.png) ── */}
      <div id="sec-ai" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setAiOpen(!aiOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Artificial Intelligence</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {aiOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {aiOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            <p className="text-xs text-slate-600 leading-relaxed">
              Artificial intelligence functionality allows you to use third-party AI services such
              as DeepSeek, Gemini or ChatGPT to automatically generate content. This could be either
              product descriptions or meta tags for specific pages or entities.
            </p>

            {/* Enable artificial intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Enable artificial intelligence</span>
                <HelpTooltip text="Check to activate automated AI content generation tools in catalog management." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={enableArtificialIntelligence}
                  onChange={(e) => setEnableArtificialIntelligence(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch children under Enable artificial intelligence */}
            {enableArtificialIntelligence && (
              <>
                {/* Provider type */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Provider type</span>
                    <HelpTooltip text="Select the underlying generative AI model service." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      value={providerType}
                      onChange={(e) => setProviderType(e.target.value)}
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                    >
                      <option value="Gemini">Gemini</option>
                      <option value="ChatGPT">ChatGPT</option>
                      <option value="DeepSeek">DeepSeek</option>
                      <option value="Claude">Claude</option>
                    </select>
                  </div>
                </div>

                {/* API key */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                    <span>API key</span>
                    <HelpTooltip text="Enter your authentication API key for the selected AI provider." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-5 space-y-1">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter provider API key"
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white font-mono"
                    />
                    <p className="text-[11px] text-slate-500 leading-normal">
                      To use the {providerType} API, you need an API key. You can create a key with a
                      few clicks in Google AI Studio.
                    </p>
                  </div>
                </div>

                {/* Allow to generate product description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Allow to generate product
                      <br className="hidden md:inline" /> description
                    </span>
                    <HelpTooltip text="Enable the AI magic button on product edit pages to write rich descriptions." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={allowGenerateProductDescription}
                      onChange={(e) => setAllowGenerateProductDescription(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI query to generate product description */}
                {allowGenerateProductDescription && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                      <span className="text-right">
                        AI query to generate product
                        <br className="hidden md:inline" /> description
                      </span>
                      <HelpTooltip text="Prompt template sent to AI for product descriptions." />
                    </label>
                    <div className="md:col-span-8 max-w-2xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <textarea
                        rows={2}
                        value={aiQueryGenerateProductDescription}
                        onChange={(e) => setAiQueryGenerateProductDescription(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Allow to generate meta title */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Allow to generate meta title</span>
                    <HelpTooltip text="Enable AI generation of optimized SEO HTML page titles." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={allowGenerateMetaTitle}
                      onChange={(e) => setAllowGenerateMetaTitle(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI query to generate meta title */}
                {allowGenerateMetaTitle && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                      <span>AI query to generate meta title</span>
                      <HelpTooltip text="Prompt template for SEO page titles." />
                    </label>
                    <div className="md:col-span-8 max-w-2xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <textarea
                        rows={2}
                        value={aiQueryGenerateMetaTitle}
                        onChange={(e) => setAiQueryGenerateMetaTitle(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Allow to generate meta keywords */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Allow to generate meta keywords</span>
                    <HelpTooltip text="Enable AI generation of comma-separated SEO keywords." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={allowGenerateMetaKeywords}
                      onChange={(e) => setAllowGenerateMetaKeywords(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI query to generate meta keywords */}
                {allowGenerateMetaKeywords && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                      <span>AI query to generate meta keywords</span>
                      <HelpTooltip text="Prompt template for SEO keywords." />
                    </label>
                    <div className="md:col-span-8 max-w-2xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <textarea
                        rows={2}
                        value={aiQueryGenerateMetaKeywords}
                        onChange={(e) => setAiQueryGenerateMetaKeywords(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Allow to generate meta description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Allow to generate meta
                      <br className="hidden md:inline" /> description
                    </span>
                    <HelpTooltip text="Enable AI generation of search engine snippet descriptions." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={allowGenerateMetaDescription}
                      onChange={(e) => setAllowGenerateMetaDescription(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI query to generate meta description */}
                {allowGenerateMetaDescription && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                      <span className="text-right">
                        AI query to generate meta
                        <br className="hidden md:inline" /> description
                      </span>
                      <HelpTooltip text="Prompt template for SEO snippet descriptions." />
                    </label>
                    <div className="md:col-span-8 max-w-2xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <textarea
                        rows={2}
                        value={aiQueryGenerateMetaDescription}
                        onChange={(e) => setAiQueryGenerateMetaDescription(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── CARD: PRODUCT FIELDS (Matching media_1791349415553.png) ── */}
      <div id="sec-product-fields" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setProductFieldsOpen(!productFieldsOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Menu className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Product fields</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {productFieldsOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {productFieldsOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Show SKU on product details page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Show SKU on product details page</span>
                <HelpTooltip text="An option indicating whether to display SKU on the product details page." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showSkuOnProductDetailsPage}
                  onChange={(e) => setShowSkuOnProductDetailsPage(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Show SKU on catalog pages (indented) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-6">
                <span>Show SKU on catalog pages</span>
                <HelpTooltip text="An option indicating whether to display SKU on catalog pages." />
              </label>
              <div className="md:col-span-8 flex items-center relative pl-5">
                <div
                  className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="checkbox"
                  checked={showSkuOnCatalogPages}
                  onChange={(e) => setShowSkuOnCatalogPages(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Show GTIN (further indented) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-12">
                <span>Show GTIN</span>
                <HelpTooltip text="An option indicating whether to display GTIN on the product details page." />
              </label>
              <div className="md:col-span-8 flex items-center relative pl-10">
                <div
                  className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="checkbox"
                  checked={showGtin}
                  onChange={(e) => setShowGtin(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Show manufacturer part number */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-6">
                <span>Show manufacturer part number</span>
                <HelpTooltip text="An option indicating whether to display manufacturer part number." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showManufacturerPartNumber}
                  onChange={(e) => setShowManufacturerPartNumber(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Show short description on catalog pages */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-6">
                <span className="text-right">Show short description on catalog pages</span>
                <HelpTooltip text="An option indicating whether to display short description on catalog pages." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showShortDescriptionOnCatalogPages}
                  onChange={(e) => setShowShortDescriptionOnCatalogPages(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD: PRODUCT PAGE (Matching media_1791349415553.png) ── */}
      <div id="sec-product-page" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setProductPageOpen(!productPageOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Product page</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {productPageOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {productPageOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Product URL structure type */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Product URL structure type</span>
                <HelpTooltip text="Choose the URL structure format for product pages." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={productUrlStructureType}
                  onChange={(e) => setProductUrlStructureType(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="/Product">/Product</option>
                  <option value="/Product/Id">/Product/Id</option>
                  <option value="/Product/SeoName">/Product/SeoName</option>
                </select>
              </div>
            </div>

            {/* Show "free shipping" icon */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Show &quot;free shipping&quot; icon</span>
                <HelpTooltip text="An option indicating whether to display the free shipping icon on the product details page." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showFreeShippingIcon}
                  onChange={(e) => setShowFreeShippingIcon(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Allow viewing of unpublished product details page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Allow viewing of unpublished product details page</span>
                <HelpTooltip text="An option indicating whether customers or administrators can view unpublished product details." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowViewingOfUnpublishedProductDetailsPage}
                  onChange={(e) =>
                    setAllowViewingOfUnpublishedProductDetailsPage(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Discontinued message for unpublished products (indented) */}
            {allowViewingOfUnpublishedProductDetailsPage && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-6">
                  <span>Discontinued message for unpublished products</span>
                  <HelpTooltip text="An option indicating whether to display a discontinued message for unpublished products." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={discontinuedMessageForUnpublishedProducts}
                    onChange={(e) =>
                      setDiscontinuedMessageForUnpublishedProducts(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Display type for attribute value when out of stock */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Display type for attribute value when out of stock</span>
                <HelpTooltip text="Choose how product attributes should appear when out of stock." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={displayTypeForAttributeValueWhenOutOfStock}
                  onChange={(e) =>
                    setDisplayTypeForAttributeValueWhenOutOfStock(e.target.value)
                  }
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="Disable">Disable</option>
                  <option value="Hide">Hide</option>
                  <option value="Display">Display</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD: CATALOG PAGES (Matching media_1791349419550.png) ── */}
      <div id="sec-catalog-pages" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setCatalogPagesOpen(!catalogPagesOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Catalog pages</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {catalogPagesOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {catalogPagesOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Allow view mode changing */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Allow view mode changing</span>
                <HelpTooltip text="Check to allow customers to select view mode (grid or list)." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowViewModeChanging}
                  onChange={(e) => setAllowViewModeChanging(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Default view mode */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Default view mode</span>
                <HelpTooltip text="Choose the default view mode for catalog category and manufacturer pages." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={defaultViewMode}
                  onChange={(e) => setDefaultViewMode(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="Grid">Grid</option>
                  <option value="List">List</option>
                </select>
              </div>
            </div>

                {/* Include products from subcategories */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Include products from subcategories</span>
                    <HelpTooltip text="Check to include products from subcategories on parent category pages." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={includeProductsFromSubcategories}
                      onChange={(e) => setIncludeProductsFromSubcategories(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Show the number of distinct products besides each category */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Show the number of distinct products besides each category</span>
                    <HelpTooltip text="Check to show the number of products next to each category name in navigation." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={showNumberOfDistinctProductsBesidesEachCategory}
                      onChange={(e) =>
                        setShowNumberOfDistinctProductsBesidesEachCategory(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Include subcategories (number of distinct products) - tree branch */}
                {showNumberOfDistinctProductsBesidesEachCategory && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-6">
                      <span>Include subcategories (number of distinct products)</span>
                      <HelpTooltip text="Check to include subcategory products in the displayed count." />
                    </label>
                    <div className="md:col-span-8 flex items-center relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="checkbox"
                        checked={includeSubcategoriesInDistinctProductsCount}
                        onChange={(e) =>
                          setIncludeSubcategoriesInDistinctProductsCount(e.target.checked)
                        }
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Category breadcrumb enabled */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Category breadcrumb enabled</span>
                    <HelpTooltip text="Check to enable category breadcrumb trail navigation." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={categoryBreadcrumbEnabled}
                      onChange={(e) => setCategoryBreadcrumbEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Number of manufacturers to display */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Number of manufacturers to display</span>
                    <HelpTooltip text="Set the number of manufacturers to display in catalog navigation." />
                  </label>
                  <div className="md:col-span-8 max-w-xl">
                    <input
                      type="number"
                      value={numberOfManufacturersToDisplay}
                      onChange={(e) => setNumberOfManufacturersToDisplay(e.target.value)}
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Use AJAX products loading */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Use AJAX products loading</span>
                    <HelpTooltip text="Check to enable asynchronous AJAX products loading on catalog pages." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={useAjaxProductsLoading}
                      onChange={(e) => setUseAjaxProductsLoading(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Enable manufacturer filtering */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Enable manufacturer filtering</span>
                    <HelpTooltip text="Check to enable filtering products by manufacturer on category pages." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={enableManufacturerFiltering}
                      onChange={(e) => setEnableManufacturerFiltering(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Enable price range filtering */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Enable price range filtering</span>
                    <HelpTooltip text="Check to enable filtering products by price range on catalog pages." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={enableCatalogPriceRangeFiltering}
                      onChange={(e) =>
                        setEnableCatalogPriceRangeFiltering(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Enable specification attribute filtering */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Enable specification attribute filtering</span>
                    <HelpTooltip text="Check to enable specification attribute filtering (e.g. color, size) on catalog pages." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={enableSpecificationAttributeFiltering}
                      onChange={(e) =>
                        setEnableSpecificationAttributeFiltering(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Display all pictures on catalog pages */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Display all pictures on catalog pages</span>
                    <HelpTooltip text="Check to display all pictures on catalog pages (e.g., thumbnail gallery)." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayAllPicturesOnCatalogPages}
                      onChange={(e) =>
                        setDisplayAllPicturesOnCatalogPages(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Display 'From' prices */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Display &apos;From&apos; prices</span>
                    <HelpTooltip text="Check to display 'From' before product prices if tiered or variable pricing applies." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayFromPrices}
                      onChange={(e) => setDisplayFromPrices(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>
          </div>
        )}
      </div>

      {/* ── CARD: TAGS (Matching media_1791349495099.png) ── */}
      <div id="sec-tags" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setTagsOpen(!tagsOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Tags</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {tagsOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {tagsOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Number of product tags (cloud) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Number of product tags (cloud)</span>
                <HelpTooltip text="Set the number of tags to display in the tag cloud." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={numberOfProductTags}
                  onChange={(e) => setNumberOfProductTags(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Allow customers to select 'Products by tag' page size */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Allow customers to select &apos;Products by tag&apos; page size</span>
                    <HelpTooltip text="Check to allow customers to choose the page size on 'Products by tag' page." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowCustomersToSelectProductsByTagPageSize}
                      onChange={(e) =>
                        setAllowCustomersToSelectProductsByTagPageSize(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* 'Products by tag' page size options (tree branch) */}
                {allowCustomersToSelectProductsByTagPageSize && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-6">
                      <span>&apos;Products by tag&apos; page size options</span>
                      <HelpTooltip text="Comma-separated page size options, e.g. 6, 3, 9, 18." />
                    </label>
                    <div className="md:col-span-8 max-w-xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="text"
                        value={productsByTagPageSizeOptions}
                        onChange={(e) => setProductsByTagPageSizeOptions(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* 'Products by tag' page. Price range filtering */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>&apos;Products by tag&apos; page. Price range filtering</span>
                    <HelpTooltip text="Check to enable price range filtering on 'Products by tag' page." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={productsByTagPriceRangeFiltering}
                      onChange={(e) =>
                        setProductsByTagPriceRangeFiltering(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* 'Products by tag' page. Enter price range manually (tree branch) */}
                {productsByTagPriceRangeFiltering && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-6">
                        <span>&apos;Products by tag&apos; page. Enter price range manually</span>
                        <HelpTooltip text="Check to allow manual price range inputs on 'Products by tag' page." />
                      </label>
                      <div className="md:col-span-8 flex items-center relative pl-5">
                        <div
                          className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          type="checkbox"
                          checked={productsByTagEnterPriceRangeManually}
                          onChange={(e) =>
                            setProductsByTagEnterPriceRangeManually(e.target.checked)
                          }
                          className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* 'Products by tag' page. Price 'from' */}
                    {productsByTagEnterPriceRangeManually && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-12">
                            <span>&apos;Products by tag&apos; page. Price &apos;from&apos;</span>
                            <HelpTooltip text="Minimum price for manual range on 'Products by tag' page." />
                          </label>
                          <div className="md:col-span-8 max-w-xs flex items-center relative pl-5">
                            <div
                              className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                              aria-hidden="true"
                            />
                            <input
                              type="number"
                              value={productsByTagPriceFrom}
                              onChange={(e) => setProductsByTagPriceFrom(e.target.value)}
                              className="w-full border border-r-0 border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-l px-3 py-1.5 text-xs text-slate-800 bg-white"
                            />
                            <span className="px-3 py-1.5 bg-[#eee] border border-[#d2d6de] text-slate-600 text-xs font-normal rounded-r">
                              USD
                            </span>
                          </div>
                        </div>

                        {/* 'Products by tag' page. Price 'to' */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pl-12">
                            <span>&apos;Products by tag&apos; page. Price &apos;to&apos;</span>
                            <HelpTooltip text="Maximum price for manual range on 'Products by tag' page." />
                          </label>
                          <div className="md:col-span-8 max-w-xs flex items-center relative pl-5">
                            <div
                              className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                              aria-hidden="true"
                            />
                            <input
                              type="number"
                              value={productsByTagPriceTo}
                              onChange={(e) => setProductsByTagPriceTo(e.target.value)}
                              className="w-full border border-r-0 border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-l px-3 py-1.5 text-xs text-slate-800 bg-white"
                            />
                            <span className="px-3 py-1.5 bg-[#eee] border border-[#d2d6de] text-slate-600 text-xs font-normal rounded-r">
                              USD
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
          </div>
        )}
      </div>

      {/* ── CARD: TAX (Matching media_1791349518173.png) ── */}
      <div id="sec-tax" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setTaxOpen(!taxOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Tax</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {taxOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {taxOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Display tax/shipping info (footer) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Display tax/shipping info (footer)</span>
                <HelpTooltip text="An option indicating whether to display tax/shipping info in footer." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={displayTaxShippingInfoFooter}
                  onChange={(e) => setDisplayTaxShippingInfoFooter(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Display tax/shipping info (product details page) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Display tax/shipping info (product details page)</span>
                <HelpTooltip text="An option indicating whether to display tax/shipping info on product details page." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={displayTaxShippingInfoProductDetailsPage}
                  onChange={(e) =>
                    setDisplayTaxShippingInfoProductDetailsPage(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Display tax/shipping info (product boxes) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Display tax/shipping info (product boxes)</span>
                    <HelpTooltip text="An option indicating whether to display tax/shipping info in product boxes." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayTaxShippingInfoProductBoxes}
                      onChange={(e) =>
                        setDisplayTaxShippingInfoProductBoxes(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Display tax/shipping info (shopping cart) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Display tax/shipping info (shopping cart)</span>
                    <HelpTooltip text="An option indicating whether to display tax/shipping info in shopping cart." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayTaxShippingInfoShoppingCart}
                      onChange={(e) =>
                        setDisplayTaxShippingInfoShoppingCart(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Display tax/shipping info (wishlist) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Display tax/shipping info (wishlist)</span>
                    <HelpTooltip text="An option indicating whether to display tax/shipping info in wishlist." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayTaxShippingInfoWishlist}
                      onChange={(e) => setDisplayTaxShippingInfoWishlist(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Display tax/shipping info (order details page) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Display tax/shipping info (order details page)</span>
                    <HelpTooltip text="An option indicating whether to display tax/shipping info on order details page." />
                  </label>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayTaxShippingInfoOrderDetailsPage}
                      onChange={(e) =>
                        setDisplayTaxShippingInfoOrderDetailsPage(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>
          </div>
        )}
      </div>

      {/* ── CARD 2: SEARCH (Matching media_1791348108093.png & media_1791348109836.png) ── */}
      <div id="sec-search" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Search</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {searchOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {searchOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Search enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Search enabled</span>
                <HelpTooltip text="Check to enable global keyword search box in the storefront navigation." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={searchEnabled}
                  onChange={(e) => setSearchEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child 1: Show product categories for the search box */}
            {searchEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Show product categories for the
                    <br className="hidden md:inline" /> search box
                  </span>
                  <HelpTooltip text="Check to display the drop-down list with product categories next to the search box." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={showProductCategoriesForSearchBox}
                    onChange={(e) =>
                      setShowProductCategoriesForSearchBox(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tree branch child 2: Search autocomplete enabled */}
            {searchEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Search autocomplete enabled</span>
                  <HelpTooltip text="Check to display live instant autocomplete dropdown as user types in search box." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={searchAutocompleteEnabled}
                    onChange={(e) => setSearchAutocompleteEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Nested children under Search autocomplete enabled */}
            {searchEnabled && searchAutocompleteEnabled && (
              <>
                {/* Number of 'autocomplete' products to display */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Number of 'autocomplete' products to
                      <br className="hidden md:inline" /> display
                    </span>
                    <HelpTooltip text="Maximum number of product suggestion rows rendered in autocomplete popup." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-10">
                    <div
                      className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="number"
                      min="1"
                      value={numberOfAutocompleteProductsToDisplay}
                      onChange={(e) =>
                        setNumberOfAutocompleteProductsToDisplay(e.target.value)
                      }
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Show a link to all search results in the autocomplete box */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Show a link to all search results in the
                      <br className="hidden md:inline" /> autocomplete box
                    </span>
                    <HelpTooltip text="Add 'View all results' button at the bottom of instant autocomplete dropdown." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-10">
                    <div
                      className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={showLinkToAllSearchResultsInAutocompleteBox}
                      onChange={(e) =>
                        setShowLinkToAllSearchResultsInAutocompleteBox(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Show product images in autocomplete box */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Show product images in autocomplete
                      <br className="hidden md:inline" /> box
                    </span>
                    <HelpTooltip text="Display small product picture thumbnails next to titles in live autocomplete." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-10">
                    <div
                      className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={showProductImagesInAutocompleteBox}
                      onChange={(e) =>
                        setShowProductImagesInAutocompleteBox(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Search term minimum length */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Search term minimum length</span>
                <HelpTooltip text="Minimum number of characters required before search execution or suggestions trigger." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  min="1"
                  value={searchTermMinimumLength}
                  onChange={(e) => setSearchTermMinimumLength(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Search page. Allow customers to select page size */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Search page. Allow customers to select
                  <br className="hidden md:inline" /> page size
                </span>
                <HelpTooltip text="Allow shoppers to choose items per page on search results view." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={searchPageAllowCustomersToSelectPageSize}
                  onChange={(e) =>
                    setSearchPageAllowCustomersToSelectPageSize(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Search page. Page size options */}
            {searchPageAllowCustomersToSelectPageSize && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Search page. Page size options</span>
                  <HelpTooltip text="Comma-separated integers for items-per-page dropdown (e.g. 6, 3, 9, 18)." />
                </label>
                <div className="md:col-span-8 max-w-xl relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchPagePageSizeOptions}
                    onChange={(e) => setSearchPagePageSizeOptions(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Search page. Price range filtering (media_1791348109836.png) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Search page. Price range filtering</span>
                <HelpTooltip text="Enable price range filter slider or presets on search results." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={searchPagePriceRangeFiltering}
                  onChange={(e) => setSearchPagePriceRangeFiltering(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Search page. Enter price range manually */}
            {searchPagePriceRangeFiltering && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Search page. Enter price range
                      <br className="hidden md:inline" /> manually
                    </span>
                    <HelpTooltip text="Allow specifying explicit fixed price boundaries for search filtering." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={searchPageEnterPriceRangeManually}
                      onChange={(e) =>
                        setSearchPageEnterPriceRangeManually(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Nested: Price 'from' */}
                {searchPageEnterPriceRangeManually && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                        <span>Search page. Price 'from'</span>
                        <HelpTooltip text="Starting baseline minimum filter price." />
                      </label>
                      <div className="md:col-span-8 flex items-center gap-2 relative pl-10">
                        <div
                          className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={searchPagePriceFrom}
                          onChange={(e) => setSearchPagePriceFrom(e.target.value)}
                          className="w-36 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                        />
                        <span className="text-xs text-slate-700 font-medium">USD</span>
                      </div>
                    </div>

                    {/* Nested: Price 'to' */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                        <span>Search page. Price 'to'</span>
                        <HelpTooltip text="Ceiling maximum filter price." />
                      </label>
                      <div className="md:col-span-8 flex items-center gap-2 relative pl-10">
                        <div
                          className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={searchPagePriceTo}
                          onChange={(e) => setSearchPagePriceTo(e.target.value)}
                          className="w-36 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                        />
                        <span className="text-xs text-slate-700 font-medium">USD</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Allow customers to search with manufacturer name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Allow customers to search with
                  <br className="hidden md:inline" /> manufacturer name
                </span>
                <HelpTooltip text="Include brand and manufacturer metadata in keyword matching query." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowCustomersToSearchWithManufacturerName}
                  onChange={(e) =>
                    setAllowCustomersToSearchWithManufacturerName(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Allow customers to search with category name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Allow customers to search with
                  <br className="hidden md:inline" /> category name
                </span>
                <HelpTooltip text="Include category labels and parent category names in search index." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowCustomersToSearchWithCategoryName}
                  onChange={(e) =>
                    setAllowCustomersToSearchWithCategoryName(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 3: PRODUCT REVIEWS (Matching media_1791348459764.png) ── */}
      <div id="sec-reviews" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setReviewsOpen(!reviewsOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Product reviews</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {reviewsOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {reviewsOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Product reviews must be approved */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Product reviews must be approved</span>
                <HelpTooltip text="Check if product reviews must be moderated and approved by a store administrator before publishing." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={productReviewsMustBeApproved}
                  onChange={(e) => setProductReviewsMustBeApproved(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* One review per product from customer */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  One review per product from
                  <br className="hidden md:inline" /> customer
                </span>
                <HelpTooltip text="Limit customers to leaving only a single review per product." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={oneReviewPerProductFromCustomer}
                  onChange={(e) => setOneReviewPerProductFromCustomer(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Allow anonymous users to write product reviews */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Allow anonymous users to write
                  <br className="hidden md:inline" /> product reviews
                </span>
                <HelpTooltip text="Allow unregistered guest visitors to submit product ratings and reviews." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowAnonymousUsersToWriteProductReviews}
                  onChange={(e) =>
                    setAllowAnonymousUsersToWriteProductReviews(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Product review possible only after product purchasing */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Product review possible only after
                  <br className="hidden md:inline" /> product purchasing
                </span>
                <HelpTooltip text="Restrict review submissions exclusively to verified buyers who ordered the product." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={productReviewPossibleOnlyAfterPurchasing}
                  onChange={(e) =>
                    setProductReviewPossibleOnlyAfterPurchasing(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Notify about new product reviews */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Notify about new product reviews</span>
                <HelpTooltip text="Send notification email to store admin upon customer submission of a new review." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={notifyAboutNewProductReviews}
                  onChange={(e) => setNotifyAboutNewProductReviews(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Notify customer about product review reply */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Notify customer about product review
                  <br className="hidden md:inline" /> reply
                </span>
                <HelpTooltip text="Send notification email to review author when an official store reply is posted." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={notifyCustomerAboutProductReviewReply}
                  onChange={(e) =>
                    setNotifyCustomerAboutProductReviewReply(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Reviews per store */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Reviews per store</span>
                <HelpTooltip text="Display and filter product reviews on a per-multistore basis." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={reviewsPerStore}
                  onChange={(e) => setReviewsPerStore(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Show product reviews tab on 'My account' page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Show product reviews tab on 'My
                  <br className="hidden md:inline" /> account' page
                </span>
                <HelpTooltip text="Show customer reviews history tab inside customer account dashboard." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showProductReviewsTabOnMyAccountPage}
                  onChange={(e) =>
                    setShowProductReviewsTabOnMyAccountPage(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Product reviews page size */}
            {showProductReviewsTabOnMyAccountPage && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Product reviews page size</span>
                  <HelpTooltip text="Number of reviews displayed per page in customer account history." />
                </label>
                <div className="md:col-span-8 max-w-xl relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    min="1"
                    value={productReviewsPageSize}
                    onChange={(e) => setProductReviewsPageSize(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Sort by ascending */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Sort by ascending</span>
                <HelpTooltip text="Sort product reviews chronologically ascending (oldest first)." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={sortProductReviewsByAscending}
                  onChange={(e) => setSortProductReviewsByAscending(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 4: REVIEW TYPES (Matching media_1791348557185.png) ── */}
      <div id="sec-review-types" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setReviewTypesOpen(!reviewTypesOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <MessagesSquare className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Review types</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {reviewTypesOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {reviewTypesOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            <p className="text-xs text-slate-600 leading-relaxed">
              You can configure a list of review types if you think that a basic review is not enough.{' '}
              <span className="text-[#3c8dbc] hover:underline cursor-pointer">
                Learn more about product reviews
              </span>
            </p>

            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="py-2.5 px-4">Name</th>
                      <th className="py-2.5 px-4 text-center w-28">Required</th>
                      <th className="py-2.5 px-4 text-center w-44">Visible to all customers</th>
                      <th className="py-2.5 px-4 text-center w-32">Display order</th>
                      <th className="py-2.5 px-4 text-center w-24">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {reviewTypes.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-normal text-slate-800">{item.name}</td>
                        <td className="py-3 px-4 text-center">
                          {item.isRequired ? (
                            <span className="text-emerald-600 font-semibold">Yes</span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.isVisibleToAllCustomers ? (
                            <span className="text-emerald-600 font-semibold">Yes</span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-mono">{item.displayOrder}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => openEditReviewType(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 text-xs font-normal shadow-2xs transition cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-slate-600" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reviewTypes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          No data available in table
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer / pagination bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 border border-slate-300 rounded text-slate-400 bg-slate-50 cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 border border-slate-300 rounded text-slate-400 bg-slate-50 cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span>Show</span>
                    <select className="border border-slate-300 rounded px-2 py-0.5 bg-white text-xs text-slate-700">
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>items</span>
                  </div>

                  <span>
                    {reviewTypes.length === 0 ? 'No records' : `1-${reviewTypes.length} of ${reviewTypes.length} items`}
                  </span>

                  <button
                    type="button"
                    onClick={() => showToast('Refreshed review types.')}
                    className="p-1 border border-slate-300 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition"
                    title="Refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add New Button */}
              <div className="p-3.5 bg-slate-50/50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={openAddReviewType}
                  className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add new</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 5: PERFORMANCE (Matching media_1791348557185.png) ── */}
      <div id="sec-performance" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setPerformanceOpen(!performanceOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Performance</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {performanceOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {performanceOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Ignore ACL rules (sitewide) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Ignore ACL rules (sitewide)</span>
                <HelpTooltip text="Bypass customer role access control checks for catalog products to significantly accelerate SQL query performance." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={ignoreAclRulesSitewide}
                  onChange={(e) => setIgnoreAclRulesSitewide(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Ignore "limit per store" rules (sitewide) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Ignore "limit per store" rules
                  <br className="hidden md:inline" /> (sitewide)
                </span>
                <HelpTooltip text="Bypass multi-store mapping rules if running a single storefront deployment." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={ignoreLimitPerStoreRulesSitewide}
                  onChange={(e) =>
                    setIgnoreLimitPerStoreRulesSitewide(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Ignore discounts (sitewide) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Ignore discounts (sitewide)</span>
                <HelpTooltip text="Skip real-time catalog discount engine lookups for high-throughput traffic spikes." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={ignoreDiscountsSitewide}
                  onChange={(e) => setIgnoreDiscountsSitewide(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Ignore featured products (sitewide) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Ignore featured products (sitewide)</span>
                <HelpTooltip text="Do not separate featured products at the top of category collection pages." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={ignoreFeaturedProductsSitewide}
                  onChange={(e) => setIgnoreFeaturedProductsSitewide(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Cache product prices */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Cache product prices</span>
                <HelpTooltip text="Store computed product tier prices in in-memory Redis/RAM cache for maximum throughput." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={cacheProductPrices}
                  onChange={(e) => setCacheProductPrices(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 6: SHARE (Matching media_1791348612688.png) ── */}
      <div id="sec-share" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setShareOpen(!shareOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Share</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {shareOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {shareOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Show a share button */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Show a share button</span>
                <HelpTooltip text="Render social media sharing buttons on product details pages." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showShareButton}
                  onChange={(e) => setShowShareButton(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Share button code */}
            {showShareButton && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                  <span>Share button code</span>
                  <HelpTooltip text="Custom HTML / JavaScript widget code for third-party social share plugins (e.g. AddThis, ShareThis)." />
                </label>
                <div className="md:col-span-8 max-w-2xl">
                  <textarea
                    rows={4}
                    value={shareButtonCode}
                    onChange={(e) => setShareButtonCode(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* 'Email a friend' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>'Email a friend' enabled</span>
                <HelpTooltip text="Allow shoppers to send direct email referrals with product link." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={emailAFriendEnabled}
                  onChange={(e) => setEmailAFriendEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Allow anonymous users to email a friend */}
            {emailAFriendEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Allow anonymous users to email a
                    <br className="hidden md:inline" /> friend
                  </span>
                  <HelpTooltip text="Allow unauthenticated guest visitors to utilize the referral email form." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={allowAnonymousUsersToEmailAFriend}
                    onChange={(e) =>
                      setAllowAnonymousUsersToEmailAFriend(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CARD 7: COMPARE PRODUCTS (Matching media_1791348612688.png) ── */}
      <div id="sec-compare" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setCompareOpen(!compareOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Compare products</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {compareOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {compareOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* 'Compare Products' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>'Compare Products' enabled</span>
                <HelpTooltip text="Check to activate side-by-side product comparison matrix table on storefront." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={compareProductsEnabled}
                  onChange={(e) => setCompareProductsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child 1: Include short description in compare products */}
            {compareProductsEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Include short description in compare
                    <br className="hidden md:inline" /> products
                  </span>
                  <HelpTooltip text="Include product summary teaser column in compare table." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={includeShortDescriptionInCompareProducts}
                    onChange={(e) =>
                      setIncludeShortDescriptionInCompareProducts(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tree branch child 2: Include full description in compare products */}
            {compareProductsEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Include full description in compare
                    <br className="hidden md:inline" /> products
                  </span>
                  <HelpTooltip text="Include full HTML specification and description block in compare matrix." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={includeFullDescriptionInCompareProducts}
                    onChange={(e) =>
                      setIncludeFullDescriptionInCompareProducts(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CARD 8: ADDITIONAL SECTIONS (Matching media_1791348625312.png & media_1791348701724.png) ── */}
      <div id="sec-additional" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setAdditionalSectionsOpen(!additionalSectionsOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-slate-700 stroke-[2.5]" />
            <span className="text-sm font-normal text-slate-800">Additional sections</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {additionalSectionsOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {additionalSectionsOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Remove required products */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Remove required products</span>
                <HelpTooltip text="Automatically remove prerequisite bundled accessories from cart if the parent item is removed." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={removeRequiredProducts}
                  onChange={(e) => setRemoveRequiredProducts(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Show best sellers on home page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Show best sellers on home page</span>
                <HelpTooltip text="Display the top-selling products carousel on the main storefront homepage." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showBestSellersOnHomePage}
                  onChange={(e) => setShowBestSellersOnHomePage(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Number of best sellers on home page */}
            {showBestSellersOnHomePage && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Number of best sellers on home
                    <br className="hidden md:inline" /> page
                  </span>
                  <HelpTooltip text="Total number of best seller products to display on home page." />
                </label>
                <div className="md:col-span-8 max-w-xl relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    min="1"
                    value={numberOfBestSellersOnHomePage}
                    onChange={(e) => setNumberOfBestSellersOnHomePage(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* 'Products also purchased' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>'Products also purchased' enabled</span>
                <HelpTooltip text="Display 'Customers Who Bought This Also Bought' recommendation section on product pages." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={productsAlsoPurchasedEnabled}
                  onChange={(e) => setProductsAlsoPurchasedEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Number of also purchased products to display */}
            {productsAlsoPurchasedEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Number of also purchased products to
                    <br className="hidden md:inline" /> display
                  </span>
                  <HelpTooltip text="Number of cross-sell products to display in the also-purchased carousel." />
                </label>
                <div className="md:col-span-8 max-w-xl relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    min="1"
                    value={numberOfAlsoPurchasedProductsToDisplay}
                    onChange={(e) =>
                      setNumberOfAlsoPurchasedProductsToDisplay(e.target.value)
                    }
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* 'Recently viewed products' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>'Recently viewed products' enabled</span>
                <HelpTooltip text="Store customer browsing trail and show a list of recently viewed products." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={recentlyViewedProductsEnabled}
                  onChange={(e) => setRecentlyViewedProductsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Number of 'Recently viewed products' */}
            {recentlyViewedProductsEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Number of 'Recently viewed
                    <br className="hidden md:inline" /> products'
                  </span>
                  <HelpTooltip text="Number of recently viewed products to remember and display." />
                </label>
                <div className="md:col-span-8 max-w-xl relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    min="1"
                    value={numberOfRecentlyViewedProducts}
                    onChange={(e) =>
                      setNumberOfRecentlyViewedProducts(e.target.value)
                    }
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* 'New products' page enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>'New products' page enabled</span>
                <HelpTooltip text="Enable dedicated /new-products page listing recently added catalog inventory." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={newProductsPageEnabled}
                  onChange={(e) => setNewProductsPageEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch children under 'New products' page enabled */}
            {newProductsPageEnabled && (
              <>
                {/* 'New products' page. Allow customers to select page size */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      'New products' page. Allow
                      <br className="hidden md:inline" /> customers to select page size
                    </span>
                    <HelpTooltip text="Allow shoppers to choose items per page on the new products page." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={newProductsPageAllowCustomersToSelectPageSize}
                      onChange={(e) =>
                        setNewProductsPageAllowCustomersToSelectPageSize(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Number of products on 'New products' page */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Number of products on 'New
                      <br className="hidden md:inline" /> products' page
                    </span>
                    <HelpTooltip text="Maximum number of products displayed on the newly added products page." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="number"
                      min="1"
                      value={numberOfProductsOnNewProductsPage}
                      onChange={(e) =>
                        setNumberOfProductsOnNewProductsPage(e.target.value)
                      }
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Display the date for a pre-order availability */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Display the date for a pre-order
                  <br className="hidden md:inline" /> availability
                </span>
                <HelpTooltip text="Display estimated shipping/availability calendar date for pre-order merchandise." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={displayDateForPreOrderAvailability}
                  onChange={(e) =>
                    setDisplayDateForPreOrderAvailability(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Image Editor for Catalog Placeholder Image */}
            <div className="border-t border-slate-100 pt-5 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-2">
                  <span>Default catalog image</span>
                  <HelpTooltip text="Fallback product picture displayed when an item has no uploaded images. Accepts local file uploads and direct web image URLs." />
                </label>
                <div className="md:col-span-8 max-w-xl">
                  <ImageEditorField
                    value={defaultCatalogPlaceholderImage}
                    onChange={(newVal) => setDefaultCatalogPlaceholderImage(newVal)}
                    shape="rectangle"
                    previewHeight="h-28"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Official default catalog asset used across search listings and category cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 9: EXPORT/IMPORT (Matching media_1791351690676.png) ── */}
      <div id="sec-export-import" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setExportImportOpen(!exportImportOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Export/Import</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {exportImportOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {exportImportOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Export/Import products with attributes */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import products with attributes</span>
                <HelpTooltip text="An option indicating whether to export/import product attributes (e.g., color, size variations)." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportProductsWithAttributes}
                  onChange={(e) => setExportImportProductsWithAttributes(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export/Import products with specification attributes */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import products with specification attributes</span>
                <HelpTooltip text="An option indicating whether to export/import specification attributes." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportProductsWithSpecificationAttributes}
                  onChange={(e) =>
                    setExportImportProductsWithSpecificationAttributes(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export/Import products with tier prices */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import products with tier prices</span>
                <HelpTooltip text="An option indicating whether to export/import product tier prices." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportProductsWithTierPrices}
                  onChange={(e) => setExportImportProductsWithTierPrices(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export/Import products with category breadcrumb */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import products with category breadcrumb</span>
                <HelpTooltip text="An option indicating whether to export/import category breadcrumb paths (e.g. Computers > Desktops)." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportProductsWithCategoryBreadcrumb}
                  onChange={(e) =>
                    setExportImportProductsWithCategoryBreadcrumb(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export/Import categories using name of category */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import categories using name of category</span>
                <HelpTooltip text="An option indicating whether to use category names instead of numeric category IDs when exporting/importing." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportCategoriesUsingNameOfCategory}
                  onChange={(e) =>
                    setExportImportCategoriesUsingNameOfCategory(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export/Import products. Allow download images */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import products. Allow download images</span>
                <HelpTooltip text="Check to automatically download remote product pictures during catalog Excel or XML import." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportProductsAllowDownloadImages}
                  onChange={(e) =>
                    setExportImportProductsAllowDownloadImages(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export/Import products. Allow splitting file */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import products. Allow splitting file</span>
                <HelpTooltip text="Check to split large catalog export datasets into multiple consecutive archive batches." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportProductsAllowSplittingFile}
                  onChange={(e) =>
                    setExportImportProductsAllowSplittingFile(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export/Import related entities using name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import related entities using name</span>
                <HelpTooltip text="Check to reference related entities (such as manufacturers, vendors) by name rather than database IDs." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportRelatedEntitiesUsingName}
                  onChange={(e) =>
                    setExportImportRelatedEntitiesUsingName(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export/Import products with "limited to stores" */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export/Import products with &quot;limited to stores&quot;</span>
                <HelpTooltip text="Export and import store mapping assignments per product." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportProductsWithLimitedToStores}
                  onChange={(e) =>
                    setExportImportProductsWithLimitedToStores(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Export / Import categories with "limited to stores" */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Export / Import categories with &quot;limited to stores&quot;</span>
                <HelpTooltip text="Export and import store mapping assignments per category." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={exportImportCategoriesWithLimitedToStores}
                  onChange={(e) =>
                    setExportImportCategoriesWithLimitedToStores(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 10: PRODUCT SORTING (Matching media_1791351715936.png) ── */}
      <div id="sec-product-sorting" className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef] scroll-mt-4">
        <div
          onClick={() => setProductSortingOpen(!productSortingOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Product sorting</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {productSortingOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {productSortingOpen && (
          <div className="p-5 space-y-5 text-xs text-slate-700">
            {/* Allow product sorting */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Allow product sorting</span>
                <HelpTooltip text="Check to allow customers to choose product sorting order (position, price, name, etc.) on catalog pages." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowProductSorting}
                  onChange={(e) => setAllowProductSorting(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Table of sorting options */}
            {allowProductSorting && (
              <div className="border border-[#e7e7e7] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9fafc] border-b border-[#e7e7e7] text-slate-700 font-semibold">
                        <th className="py-2.5 px-4 text-left w-2/5">Name</th>
                        <th className="py-2.5 px-4 text-center w-1/5">Display order</th>
                        <th className="py-2.5 px-4 text-center w-1/5">Is active</th>
                        <th className="py-2.5 px-4 text-center w-1/5">Edit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f4f4]">
                      {productSortingOptions.map((opt) => (
                        <tr key={opt.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-4 text-slate-800 font-normal">
                            {opt.name}
                          </td>
                          <td className="py-2.5 px-4 text-center text-slate-700">
                            {opt.displayOrder}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleSortingActive(opt.id)}
                              className="inline-flex items-center justify-center cursor-pointer text-[#3c8dbc] hover:text-[#286090]"
                              title="Click to toggle active state"
                            >
                              {opt.isActive ? (
                                <Check className="w-4 h-4 stroke-[2.5] text-[#3c8dbc]" />
                              ) : (
                                <X className="w-4 h-4 stroke-[2.5] text-red-500" />
                              )}
                            </button>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => openEditSorting(opt)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-normal text-slate-700 bg-white border border-[#d2d6de] hover:bg-slate-50 hover:border-slate-400 rounded transition cursor-pointer shadow-2xs"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table footer / Pagination toolbar matching media_1791351715936.png */}
                <div className="bg-[#f9fafc] border-t border-[#e7e7e7] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled
                      className="px-2.5 py-1 text-slate-400 border border-[#e7e7e7] bg-white rounded cursor-not-allowed select-none text-[11px]"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-white bg-[#337ab7] border border-[#337ab7] rounded font-semibold text-[11px]"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      disabled
                      className="px-2.5 py-1 text-slate-400 border border-[#e7e7e7] bg-white rounded cursor-not-allowed select-none text-[11px]"
                    >
                      Next
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Show</span>
                    <select
                      value="15"
                      disabled
                      className="border border-[#d2d6de] rounded px-2 py-0.5 text-xs text-slate-700 bg-white outline-none cursor-pointer"
                    >
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                    <span className="text-[11px] text-slate-500">items</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">
                      1-{productSortingOptions.length} of {productSortingOptions.length} items
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setProductSortingOptions([
                          { id: 'sort-1', name: 'Position', displayOrder: 0, isActive: true },
                          { id: 'sort-2', name: 'Name: A to Z', displayOrder: 5, isActive: true },
                          { id: 'sort-3', name: 'Name: Z to A', displayOrder: 6, isActive: true },
                          { id: 'sort-4', name: 'Price: Low to High', displayOrder: 10, isActive: true },
                          { id: 'sort-5', name: 'Price: High to Low', displayOrder: 11, isActive: true },
                          { id: 'sort-6', name: 'Created on', displayOrder: 15, isActive: true },
                        ]);
                        showToast('Sorting options refreshed.');
                      }}
                      className="text-slate-400 hover:text-slate-700 transition p-1"
                      title="Refresh sorting options"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM ACTIONS BAR ── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore original defaults</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-5 py-2 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* ── FLOATING GREEN SCROLL-TO-TOP BUTTON (Matching screenshots) ── */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded bg-[#00a65a] hover:bg-[#008d4c] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
        title="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* ── MODAL FOR ADD / EDIT REVIEW TYPE ── */}
      {reviewTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                {editingReviewType ? 'Edit review type' : 'Add new review type'}
              </h3>
              <button
                type="button"
                onClick={() => setReviewTypeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={rtNameInput}
                  onChange={(e) => setRtNameInput(e.target.value)}
                  placeholder="e.g. Quality, Delivery Speed, Value"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rt-required"
                  checked={rtRequiredInput}
                  onChange={(e) => setRtRequiredInput(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
                <label htmlFor="rt-required" className="text-xs text-slate-700 cursor-pointer">
                  Required
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rt-visible"
                  checked={rtVisibleInput}
                  onChange={(e) => setRtVisibleInput(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
                <label htmlFor="rt-visible" className="text-xs text-slate-700 cursor-pointer">
                  Visible to all customers
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display order
                </label>
                <input
                  type="number"
                  min="1"
                  value={rtOrderInput}
                  onChange={(e) => setRtOrderInput(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc]"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {editingReviewType ? (
                <button
                  type="button"
                  onClick={() => deleteReviewType(editingReviewType.id)}
                  className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReviewTypeModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveReviewType}
                  className="px-4 py-1.5 bg-[#2489c5] hover:bg-[#1f72a3] text-white rounded text-xs font-semibold transition"
                >
                  {editingReviewType ? 'Save changes' : 'Add item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL FOR EDIT SORTING OPTION ── */}
      {sortingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded border border-slate-300 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-[#f4f6f9] border-b border-[#e5e7eb] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                Edit product sorting option
              </h3>
              <button
                type="button"
                onClick={() => setSortingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={sortNameInput}
                  onChange={(e) => setSortNameInput(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800"
                  placeholder="Sorting name"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Display order</label>
                <input
                  type="number"
                  value={sortOrderInput}
                  onChange={(e) => setSortOrderInput(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sortIsActiveCheck"
                  checked={sortActiveInput}
                  onChange={(e) => setSortActiveInput(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
                <label htmlFor="sortIsActiveCheck" className="text-slate-800 cursor-pointer">
                  Is active
                </label>
              </div>
            </div>
            <div className="px-5 py-3 bg-[#f9fafc] border-t border-[#e5e7eb] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSortingModalOpen(false)}
                className="px-4 py-1.5 text-xs text-slate-700 border border-[#d2d6de] rounded hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSortingOption}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
