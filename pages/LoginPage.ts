import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', {
      name: 'Login',
      exact: true
    });
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.usernameField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
  }

  async logIn(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}
