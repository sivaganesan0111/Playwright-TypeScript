
import { expect, Locator, Page } from '@playwright/test';

export class AmazonHomePage {

    private readonly searchBox: Locator;
    private readonly continueShoppingButton: Locator;

    constructor(private readonly page: Page) {

        this.searchBox = page.locator('#twotabsearchtextbox');

        this.continueShoppingButton = page.getByRole('button', {
            name: 'Continue shopping',
            exact: true
        });
    }

    async navigate(url: string): Promise<void> {

        console.log(`Navigating to Amazon: ${url}`);

        await this.page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 45000
        });

        // Check for Amazon Continue Shopping interstitial.
        if (
            await this.continueShoppingButton
                .isVisible()
                .catch(() => false)
        ) {

            console.log('Continue Shopping interstitial detected.');

            await this.continueShoppingButton.click();

            console.log('Continue Shopping button clicked.');
        }

        // Wait for Amazon homepage search box.
        await expect(this.searchBox).toBeVisible({
            timeout: 20000
        });

        console.log('Amazon homepage loaded successfully.');
    }

    async search(
        searchTerm: string,
        suggestionLabel: string
    ): Promise<void> {

        await expect(this.searchBox).toBeVisible();

        await this.searchBox.fill(searchTerm);

        const suggestion = this.page.locator(
            `[aria-label="${suggestionLabel}"]`
        );

        await expect(suggestion).toBeVisible({
            timeout: 10000
        });

        await suggestion.click();

        console.log(`Amazon search submitted: ${searchTerm}`);
    }
}
