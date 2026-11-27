
import { expect, Locator, Page } from '@playwright/test';

export class AmazonHomePage {

    private readonly searchBox: Locator;

    constructor(private readonly page: Page) {

        // Amazon search input has a stable ID.
        this.searchBox = page.locator('#twotabsearchtextbox');
    }

    // Navigate to Amazon homepage.
    async navigate(url: string): Promise<void> {

        console.log(`Navigating to Amazon: ${url}`);

        await this.page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 45000
        });

        try {

            // Wait for Amazon search input.
            await expect(this.searchBox).toBeVisible({
                timeout: 20000
            });

            console.log('Amazon homepage loaded successfully.');
        }
        catch (error) {

            // Capture page details for debugging.
            const currentUrl = this.page.url();
            const pageTitle = await this.page.title();

            const pageContent = await this.page.locator('body')
                .innerText()
                .catch(() => 'Unable to retrieve page content');

            const diagnosticMessage = `
Amazon homepage loading failed.

Expected: Amazon search box should be visible.

Actual URL: ${currentUrl}

Page Title: ${pageTitle}

Page Content:
${pageContent.substring(0, 1500)}
`;

            console.error(diagnosticMessage);

            throw new Error(
                `Amazon homepage is not ready. ${diagnosticMessage}`
            );
        }
    }

    // Search for a product.
    async search(
        searchTerm: string,
        suggestionLabel: string
    ): Promise<void> {

        await expect(this.searchBox).toBeVisible();

        await this.searchBox.fill(searchTerm);

        // Locate the matching search suggestion.
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
