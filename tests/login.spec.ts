import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

// 登录测试不能带全局登录态，用空 state 覆盖
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('登录', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.open();
  });

  test('正确账号可以登录', async () => {
    await login.login('standard_user', 'secret_sauce');
    await expect(login.page).toHaveURL(/inventory/);
  });

  test('错误密码登录失败', async () => {
    await login.login('standard_user', 'wrong_password');

    await expect(login.error).toBeVisible();
    await expect(login.error).toContainText('do not match');
  });
});
