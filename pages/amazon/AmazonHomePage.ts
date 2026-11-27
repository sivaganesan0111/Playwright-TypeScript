import { expect, Locator, Page } from '@playwright/test';

export class AmazonHomePage {
    private readonly searchBox: Locator;

    constructor(private readonly page: Page) {
        this.searchBox = page.getByRole('searchbox');
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
        await expect(this.searchBox).toBeVisible();
    }

    async search(searchTerm: string, suggestionLabel: string): Promise<void> {
        await this.searchBox.fill(searchTerm);

        const suggestion = this.page.locator(
            `[aria-label="${suggestionLabel}"]`
        );
        await expect(suggestion).toBeVisible();
        await suggestion.click();
    }
}
