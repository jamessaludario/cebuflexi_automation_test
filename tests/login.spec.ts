import { test, expect } from '@playwright/test';

test('Successful Login', async ({ browser }) => {

  // Create a new incognito browser context
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto('https://cebuflexi-web.vercel.app');

  // Click the sign-in button
  await page.locator('button:has-text("Sign In")').click(); 

  // Locate the username/email and password input fields and fill them in
  await page.locator('input#email').fill('bahogbilat@email.com');
  await page.locator('input#password').fill('J@m3s121296');

  // Locate the login button and click it
  await page.locator('button[type="submit"]').click();

  // Wait for navigation or a specific element to appear after login
  await expect(page.locator('svg.lucide-user')).toBeVisible({ timeout: 5000 });
  
  // Close the browser context after the test
  await context.close();

});