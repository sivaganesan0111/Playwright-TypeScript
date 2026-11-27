import { Page, test } from '@playwright/test';
import { AmazonHomePage } from '../../pages/amazon/AmazonHomePage';
import { AmazonProductPage } from '../../pages/amazon/AmazonProductPage';
import { AmazonSearchResultsPage } from '../../pages/amazon/AmazonSearchResultsPage';
import amazonTestData from '../../test-data/amazon/amazonTestData.json';
import { ScreenshotUtil } from '../../utils/ScreenshotUtil';
import { TestLogger } from '../../utils/TestLogger';

type AmazonTestData = {
    baseUrl: string;
    searchTerm: string;
    suggestionLabel: string;
    productTitle: string;
};

const data = amazonTestData as AmazonTestData;

test('Amazon Add to Cart', async ({ page, context }, testInfo) => {
    const testLogger = new TestLogger(testInfo);
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    let productPage: Page | undefined;

    try {
        await testLogger.step(
            '01 - Search for a product',
            'Amazon search results are displayed for the configured product.',
            async () => {
                await homePage.navigate(data.baseUrl);
                await homePage.search(data.searchTerm, data.suggestionLabel);
                return `Searched Amazon for ${data.searchTerm}.`;
            }
        );

        await testLogger.step(
            '02 - Open the product in a new tab',
            'The selected product opens in a new browser tab.',
            async () => {
                productPage = await searchResultsPage.selectProduct(
                    context,
                    data.productTitle
                );
                return 'Selected product opened in a new tab.';
            }
        );

        await testLogger.step(
            '03 - Add product to cart',
            'The product is visible and Amazon confirms it was added to the cart.',
            async () => {
                if (!productPage) {
                    throw new Error('The product tab was not opened.');
                }

                const product = new AmazonProductPage(productPage);
                await product.expectProductVisible();
                await product.addToCart();
                await ScreenshotUtil.capture(
                    productPage,
                    testInfo,
                    'amazon-add-to-cart.png'
                );
                return 'Product added to cart and confirmation screenshot captured.';
            }
        );
    } finally {
        await testLogger.attachExecutionSummary();
    }
});