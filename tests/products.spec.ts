import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/inventory.page';

test.describe('商品列表', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    await inventory.open();
  });

  test('商品可以按价格排序', async () => {
    await inventory.sort('lohi');
    const asc = await inventory.prices();
    expect(asc).toEqual([...asc].sort((a, b) => a - b));

    await inventory.sort('hilo');
    const desc = await inventory.prices();
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  test('可以查看商品详情', async () => {
    await inventory.openFirstItem();

    await expect(inventory.page).toHaveURL(/inventory-item/);
    await expect(inventory.detailName).toHaveText('Sauce Labs Backpack');
    await expect(inventory.detailPrice).toHaveText('$29.99');
  });
});
