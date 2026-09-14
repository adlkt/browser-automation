import { type Locator, type Page } from '@playwright/test';

const inventoryUrl = 'https://www.saucedemo.com/inventory.html';

export type ProductId =
  | 'sauce-labs-backpack'
  | 'sauce-labs-bike-light'
  | 'sauce-labs-bolt-t-shirt'
  | 'sauce-labs-fleece-jacket'
  | 'sauce-labs-onesie'
  | 'test.allthethings()-t-shirt-(red)';

export class InventoryPage {
  readonly page: Page;
  readonly sortSelect: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  // 商品详情页（SPA 共用 inventory-item-name等 testid，放在同域管理）
  readonly detailName: Locator;
  readonly detailPrice: Locator;
  readonly backToProducts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortSelect = page.getByRole('combobox');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.detailName = page.getByTestId('inventory-item-name');
    this.detailPrice = page.getByTestId('inventory-item-price');
    this.backToProducts = page.getByTestId('back-to-products');
  }

  async open() {
    await this.page.goto(inventoryUrl);
  }

  async addItem(id: ProductId) {
    await this.page.getByTestId(`add-to-cart-${id}`).click();
  }

  async removeItem(id: ProductId) {
    await this.page.getByTestId(`remove-${id}`).click();
  }

  async sort(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortSelect.selectOption(option);
  }

  /** 解析后的价格数字数组，按 DOM 顺序 */
  async prices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async openFirstItem() {
    await this.itemNames.first().click();
    // SPA：URL 立即变但详情视图异步渲染，back 按钮出现才算切完
    await this.backToProducts.waitFor();
  }

  async openCart() {
    await this.cartLink.click();
    await this.page.getByTestId('cart-list').waitFor();
  }
}
