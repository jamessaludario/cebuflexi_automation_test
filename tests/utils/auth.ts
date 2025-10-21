import { Page, expect } from '@playwright/test';

/**
 * Helper function to perform user login.
 * Navigates to the app, clicks sign-in, fills credentials, clicks login, and verifies success.
 * @param page The Playwright Page object.
 * @param email The user's email for login.
 * @param password The user's password for login.
 */
export async function loginUser(page: Page, email: string, password_str: string) {
  await page.goto('https://cebuflexi-web.vercel.app');
  await page.locator('button:has-text("Sign In")').click(); 
  await page.locator('input#email').fill(email);
  await page.locator('input#password').fill(password_str);
  await page.locator('button[type="submit"]').click();
}

/**
 * Logs in with the valid user credentials from environment variables and verifies success.
 * @param page The Playwright Page object.
 */
export async function loginWithValidUser(page: Page) {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('Test credentials are not defined in the .env file.');
  }

  await loginUser(page, email, password);
  await expect(page.locator('svg.lucide-user')).toBeVisible({ timeout: 5000 });
}