import { BrowserContext, expect, Page } from '@playwright/test';

export class AmazonSearchResultsPage {
    constructor(private readonly page: Page) {}

    async selectProduct(
        context: BrowserContext,
        productTitle: string
    ): Promise<Page> {
        const productLink = this.page.getByRole('link', {
            name: productTitle,
            exact: true
        });

        await expect(productLink).toBeVisible();

        const popupPromise = this.page.waitForEvent('popup');
        await productLink.click();
        const popup = await popupPromise;

        await popup.waitForLoadState('domcontentloaded');

        const productPage = context.pages().find((page) => page === popup);
        if (!productPage) {
            throw new Error('The selected product tab was not found in the browser context.');
        }

        return productPage;
    }
}
