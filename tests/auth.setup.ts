import { test as setup, expect } from '@playwright/test';

const baseUrl = 'https://www.saucedemo.com/';
const authFile = 'playwright/.auth/user.json';

setup('登录一次并保存登录态', async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory/);

  await page.context().storageState({ path: authFile });
});
