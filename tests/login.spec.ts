import { test, expect } from './utils/test.setup';
import { loginUser } from './utils/auth';
import { createIncognitoContext } from './utils/browser-utils';

test('Successful Login', async ({ browser }) => {
  // Normal test: uses Playwright's default page (fail-only video automatically)
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;

  await loginUser(page, email, password);

  await expect(page.locator('svg.lucide-user')).toBeVisible({ timeout: 5000 });

  await context.close();
});

test('Should fail with invalid credentials', async ({ browser }) => {
  const { context, page } = await createIncognitoContext(browser);

  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_INVALID_PASSWORD!;

  await loginUser(page, email, password);

  const errorMessage = page.locator('div[role="alert"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    'Invalid email or password. Please check your credentials and try again.'
  );

  // Validate that user icon is not visible
  await expect(page.locator('svg.lucide-user')).not.toBeVisible();

  await context.close();
});

test('Should show validation error for empty fields', async ({ browser }) => {
  const { context, page } = await createIncognitoContext(browser);

  const email = '';
  const password = '';

  await loginUser(page, email, password);

  const emailInput = page.locator('input#email');
  const validationMessage = await emailInput.evaluate(
    el => (el as HTMLInputElement).validationMessage
  );

  expect(validationMessage).toContain('Please fill out this field');

  await context.close();
});

test('Should show validation error for invalid email format', async ({ browser }) => {
  const { context, page } = await createIncognitoContext(browser);

  const email = process.env.TEST_INVALID_EMAIL!;
  const password = process.env.TEST_INVALID_PASSWORD!;

  await loginUser(page, email, password);

  const emailInput = page.locator('input#email');
  const validationMessage = await emailInput.evaluate(
    el => (el as HTMLInputElement).validationMessage
  );

  expect(validationMessage).toContain("Please include an '@' in the email address.");

  await context.close();
});
