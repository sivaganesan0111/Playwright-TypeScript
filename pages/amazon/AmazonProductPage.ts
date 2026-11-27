import { expect, Locator, Page } from '@playwright/test';

export class AmazonProductPage {
    private readonly landingImage: Locator;
    private readonly addToCartButton: Locator;

    constructor(private readonly page: Page) {
        this.landingImage = page.locator('#landingImage');
        this.addToCartButton = page.locator('#add-to-cart-button').last();
    }

    async expectProductVisible(): Promise<void> {
        await expect(this.landingImage).toBeVisible();
    }

    async addToCart(): Promise<void> {
        await expect(this.addToCartButton).toBeVisible();
        await this.addToCartButton.click();
        await expect(this.page.getByText('Added to Cart').first()).toBeVisible();
    }
}
