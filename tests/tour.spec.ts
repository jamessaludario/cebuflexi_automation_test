import { test, expect } from '@playwright/test';
import { loginUser } from './utils/auth'; // Import the reusable login function
import { createIncognitoContext } from './utils/browser-utils'; // Import the browser utility

test('Search for existing tour/s', async ({ browser }) => {

  // Create a new incognito browser context using the helper
  const { context, page } = await createIncognitoContext(browser);

  // Get credentials from environment variables
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;
  
  // Use the reusable login function to log in first
  await loginUser(page, email, password);

  // --- Search Steps ---
  // Locate the search bar and type "street"
  const searchInput = page.locator('input[placeholder="Search for tours, locations..."]');
  await searchInput.fill('street');
  await searchInput.press('Enter');

  // Wait for 1 second to allow search results to load
  await page.waitForTimeout(1000);

  // Assert that the URL is now the tours page
  await expect(page).toHaveURL(/.*\/tours/);
  
  // Assert that at least one tour card is visible
  await expect(page.locator('div.group').first()).toBeVisible();

  // Close the browser context after the test
  await context.close();
});