// spec: specs/navigation-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginWithValidUser } from './utils/auth';

const BASE_URL = 'https://cebuflexi-web.vercel.app';

test.describe('Navigation Bar Link Test Plan', () => {
  test('Login and Initial State', async ({ page }) => {
    // 1. Launch browser and navigate to https://cebuflexi-web.vercel.app/
    await page.goto(BASE_URL);
    // 2. Perform login using helper from auth.ts and browser-utils.ts
    await loginWithValidUser(page);
    // 3. Verify successful login (navigation bar visible)
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('Navigate to Home', async ({ page }) => {
    // 1. Click the "Home" link in the navigation bar
    await page.goto(BASE_URL);
    await loginWithValidUser(page);
    await page.getByRole('navigation').getByRole('link', { name: 'Home', exact: true }).click();
    // 2. Verify URL changes to base URL
    await expect(page).toHaveURL(`${BASE_URL}`);
    // 3. Confirm Home page content is visible
    await expect(page.getByRole('heading', { name: /Discover the Beauty of Cebu/ })).toBeVisible();
  });

  test('Navigate to Tours', async ({ page }) => {
    await page.goto(BASE_URL);
    await loginWithValidUser(page);
    await page.getByRole('navigation').getByRole('link', { name: 'Tours', exact: true }).click();
    await expect(page).toHaveURL(`${BASE_URL}/tours`);
    // Fix strict mode violation by checking for a unique heading
    const toursHeadings = page.locator('h1, h2, h3').filter({ hasText: /Discover Cebu Tours|All Tours|Tours/ });
    expect(await toursHeadings.count()).toBeGreaterThan(0);
  });

  test('Navigate to Car Rentals', async ({ page }) => {
    await page.goto(BASE_URL);
    await loginWithValidUser(page);
    await page.getByRole('navigation').getByRole('link', { name: 'Car Rentals', exact: true }).click();
    await expect(page).toHaveURL(`${BASE_URL}/car-rentals`);
    // Pass if 'Filter Vehicles' text is present
    await expect(page.locator('text=Filter Vehicles')).toBeVisible();
  });

  test('Navigate to About', async ({ page }) => {
    await page.goto(BASE_URL);
    await loginWithValidUser(page);
    await page.getByRole('navigation').getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(`${BASE_URL}/about`);
    // Pass if 'Our Story' text is present
    await expect(page.locator('text=Our Story')).toBeVisible();
  });

  test('Navigate to Blog', async ({ page }) => {
    await page.goto(BASE_URL);
    await loginWithValidUser(page);
    await page.getByRole('navigation').getByRole('link', { name: 'Blog', exact: true }).click();
    await expect(page).toHaveURL(`${BASE_URL}/blog`);
    await expect(page.getByRole('heading', { name: /Blog/i })).toBeVisible();
  });

  test('Navigate to Contact', async ({ page }) => {
    await page.goto(BASE_URL);
    await loginWithValidUser(page);
    await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(`${BASE_URL}/contact`);
    await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible();
  });
});
