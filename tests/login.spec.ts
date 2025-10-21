import { test, expect } from '@playwright/test';
import { loginUser } from './utils/auth'; // Import the reusable login function
import { createIncognitoContext } from './utils/browser-utils'; // Import the browser utility

test('Successful Login', async ({ browser }) => {
  // Create a new incognito browser context using the helper
  const { context, page } = await createIncognitoContext(browser);
  
  // Get credentials from environment variables
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;
  
  // Use the reusable login function with valid credentials
  await loginUser(page, email, password);

  // We expect the user icon SVG to be visible after successful login
  await expect(page.locator('svg.lucide-user')).toBeVisible({ timeout: 5000 });
  
  // Close the browser context after the test
  await context.close();
});

test('Should fail with invalid credentials', async ({ browser }) => {
  // Create a new incognito browser context using the helper
  const { context, page } = await createIncognitoContext(browser);

  // Get credentials from environment variables
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_INVALID_PASSWORD!;
  
  // Use the reusable login function with valid credentials
  await loginUser(page, email, password);

  // Assert that an error message is shown
  // Note: You may need to update the selector and text to match your app's specific error message.
  const errorMessage = page.locator('div[role="alert"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Invalid email or password. Please check your credentials and try again.');

  // Assert that the user icon is not visible, confirming login failed
  await expect(page.locator('svg.lucide-user')).not.toBeVisible();

  await context.close();
});

test('Should show validation error for empty fields', async ({ browser }) => {
  const { context, page } = await createIncognitoContext(browser);

  // Get credentials from environment variables
  const email = "";
  const password = "";
  
  // Use the reusable login function with valid credentials
  await loginUser(page, email, password);

  // Get the native validation message from the email input element
  const emailInput = page.locator('input#email');
  const validationMessage = await emailInput.evaluate(el => (el as HTMLInputElement).validationMessage);

  // Assert that the browser's validation message is correct
  expect(validationMessage).toContain('Please fill out this field');

  await context.close();
});

test('Should show validation error for invalid email format', async ({ browser }) => {
  const { context, page } = await createIncognitoContext(browser);

  // Get credentials from environment variables
  const email = process.env.TEST_INVALID_EMAIL!;
  const password = process.env.TEST_INVALID_PASSWORD!;
  
  // Use the reusable login function with valid credentials
  await loginUser(page, email, password);

  const emailInput = page.locator('input#email');
  const validationMessage = await emailInput.evaluate(el => (el as HTMLInputElement).validationMessage);
  expect(validationMessage).toContain("Please include an '@' in the email address.");

  await context.close();
});