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
  
  // Close the browser context after the test
  await context.close();
});