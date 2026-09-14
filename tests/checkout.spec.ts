import { test, expect } from '@playwright/test';
import { CartPage } from './pages/cart.page';
import { CheckoutPage } from './pages/checkout.page';
import { InventoryPage } from './pages/inventory.page';

test.describe('结算', () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  // 前置：加一件商品并进入结算第一步（checkout 都从这里开始）
  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);
    await inventory.open();
    await inventory.addItem('sauce-labs-backpack');
    await inventory.openCart();
    await cart.checkoutButton.click();
    await checkout.waitForForm();
  });

  test('checkout 必填验证', async () => {
    // 全空直接点继续 → 报 First Name 必填
    await checkout.continueButton.click();
    await expect(checkout.error).toContainText('First Name is required');

    // 只填 first name → 报 Last Name 必填
    await checkout.firstName.fill('Jay');
    await checkout.continueButton.click();
    await expect(checkout.error).toContainText('Last Name is required');
  });

  test('完整购买流程成功', async () => {
    await checkout.fillBuyerInfo('Jay', 'W', '466100');
    await checkout.continueButton.click();

    // 第二步：概览页，核对金额
    await expect(checkout.page).toHaveURL(/checkout-step-two/);
    await expect(checkout.summary).toBeVisible();
    await expect(checkout.page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(checkout.subtotal).toHaveText('Item total: $29.99');
    // 
    await expect(checkout.total).toHaveText('Total: $99.99');

    await checkout.finishButton.click();

    await expect(checkout.page).toHaveURL(/checkout-complete/);
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });
});
