import { type Locator, type Page } from '@playwright/test';

const cartUrl = 'https://www.saucedemo.com/cart.html';

export class CartPage {
  readonly page: Page;
  readonly list: Locator;
  readonly itemNames: Locator;
  readonly badge: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.list = page.getByTestId('cart-list');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.badge = page.getByTestId('shopping-cart-badge');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async open() {
    await this.page.goto(cartUrl);
  }

  async remove(id: string) {
    await this.page.getByTestId(`remove-${id}`).click();
  }
}
