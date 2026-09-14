import { test, expect } from '@playwright/test';
import { CartPage } from './pages/cart.page';
import { InventoryPage } from './pages/inventory.page';

test.describe('购物车', () => {
  let inventory: InventoryPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    await inventory.open();
  });

  test('可以添加商品', async () => {
    await inventory.addItem('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.openCart();
    await expect(cart.itemNames).toHaveText('Sauce Labs Backpack');
    await expect(cart.page.getByTestId('item-quantity')).toHaveText('1');
  });

  test('可以删除购物车商品', async () => {
    await inventory.addItem('sauce-labs-backpack');
    await inventory.addItem('sauce-labs-bike-light');
    await inventory.openCart();

    await cart.remove('sauce-labs-bike-light');

    await expect(cart.itemNames).toHaveText('Sauce Labs Backpack');
    await expect(cart.badge).toHaveText('1');
  });

  test('badge 数量正确', async () => {
    for (const id of ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-onesie'] as const) {
      await inventory.addItem(id);
    }
    await expect(inventory.cartBadge).toHaveText('3');

    // 清空后 badge 消失（元素不存在，不是显示 0）
    await cart.open();
    await cart.remove('sauce-labs-backpack');
    await cart.remove('sauce-labs-bike-light');
    await cart.remove('sauce-labs-onesie');
    await expect(cart.badge).toHaveCount(0);
  });
});
