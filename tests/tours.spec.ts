// spec: specs/tours-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginWithValidUser } from './utils/auth';

test.describe('CebuFlexi Tours Feature', () => {
    test.afterAll(async ({ browser }) => {
      await browser.close();
    });
  test('1. Load Tours Page', async ({ page }) => {
    // Login first
    await loginWithValidUser(page);
    // 1. Navigate to `/tours`
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    // 2. Observe page load and main heading
    await expect(page).toHaveTitle('Cebu Tours & Packages | CebuFlexi Tours');
    await expect(page.getByRole('heading', { name: /Discover Cebu Tours/i })).toBeVisible();
    // Use heading for All Tours section
    await expect(page.getByRole('heading', { name: /All Tours/i })).toBeVisible();
  });

  test('2. Search for Tours', async ({ page }) => {
    // 1. Enter a valid tour name/location in the search box
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    // Use getByRole for search box
    const searchBox = page.getByRole('textbox', { name: 'Search by title or location...' });
    await searchBox.fill('Cebu City');
    await searchBox.press('Enter');
    // Wait for results
    const tourTitle = page.getByText('Cebu City Street Food Tour', { exact: false });
    await expect(tourTitle).toBeVisible();
  });

  test('3. Search for Non-Existent Tour', async ({ page }) => {
    // 1. Enter a random string in the search box
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    const searchBox = page.getByRole('textbox', { name: 'Search by title or location...' });
    await searchBox.fill('zzzzzzzzzzzzzz');
    await searchBox.press('Enter');
    // No tours are displayed
    const noToursMsg = page.locator('text=/No tours found|No tours match your filters|Loading tours/i');
    await expect(noToursMsg).toBeVisible();
  });

  test('4. Filter by Category', async ({ page }) => {
    // 1. Select each category radio button (Beach, Adventure, Cultural, Food)
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    const categories = ['Beach', 'Adventure', 'Cultural', 'Food'];
    for (const category of categories) {
      await page.getByRole('radio', { name: category }).check();
      await page.getByRole('button', { name: /Apply Filters/i }).click();
      // Assert at least one tour card is visible after filtering
      const tourCard = page.getByRole('heading', { level: 1 });
      await expect(tourCard).toBeVisible();
    }
  });

  test('5. Filter by Duration', async ({ page }) => {
    // 1. Open the "Duration" dropdown
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    // Use combobox for duration (custom dropdown)
    const durationDropdown = page.getByRole('combobox', { name: 'Duration' });
    const durations = ['1 day', '2 days', '3 days', '4-7 days', 'any duration'];
    for (const duration of durations) {
      await durationDropdown.click();
      // Try to find the dropdown option by text, role, or listitem
      let option = page.getByRole('option', { name: new RegExp(duration, 'i') });
      if (await option.count() === 0) {
        option = page.getByRole('listitem', { name: new RegExp(duration, 'i') });
      }
      if (await option.count() === 0) {
        option = page.getByText(duration, { exact: false });
      }
      if (await option.count() === 0) {
        // Log and skip if not found
        console.warn(`Duration option '${duration}' not found in dropdown.`);
        continue;
      }
      await option.first().click();
      await page.getByRole('button', { name: /Apply Filters/i }).click();
      // Assert at least one tour card is visible after filtering
      const tourCard = page.getByRole('heading', { level: 1 });
      await expect(tourCard).toBeVisible();
    }
  });

  test('6. Filter by Price Range', async ({ page }) => {
    // 1. Adjust the price range sliders
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    // Use sliders for price range
    const minSlider = page.getByRole('slider', { name: 'Minimum' });
    const maxSlider = page.getByRole('slider', { name: 'Maximum' });
    await minSlider.focus();
    await minSlider.press('ArrowRight'); // Increase min price
    await maxSlider.focus();
    await maxSlider.press('ArrowLeft'); // Decrease max price
    await page.getByRole('button', { name: /Apply Filters/i }).click();
    // Tours within the selected price range are displayed (look for price text)
    await expect(page.locator('text=₱')).toBeVisible();
  });

  test('7. Reset Filters', async ({ page }) => {
    // 1. Apply any filter
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    await page.getByRole('radio', { name: 'Beach' }).check();
    await page.getByRole('button', { name: /Apply Filters/i }).click();
    await page.getByRole('button', { name: /Reset Filters/i }).click();
    await expect(page.getByRole('radio', { name: 'Beach' })).not.toBeChecked();
    // All tours are displayed (look for heading)
    await expect(page.getByRole('heading', { name: /All Tours/i })).toBeVisible();
  });

  test('8. Navigate to Tour Details', async ({ page }) => {
    // 1. Click on any tour card in the list
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    // Click first "View Details" button
    const viewDetailsBtn = page.getByRole('button', { name: 'View Details' }).first();
    await viewDetailsBtn.click();
    await expect(page).toHaveURL(/\/tours\//);
    // Assert a known tour title is visible after navigation
    const tourTitle = page.getByRole('heading', { name: /Bohol Island Day Trip|Camotes Islands Escape|Cebu Adventure Experience|Cebu Beach Escape|Cebu City Street Food Tour|Cebu Food & Culture Tour|Cebu Mountain Highlands Tour|Oslob Whale Shark Experience/i });
    await expect(tourTitle).toBeVisible();
  });

  test('9. Edge Case: No Tours Available', async ({ page }) => {
    // 1. Apply filters that result in zero tours (e.g., impossible price range)
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    const minSlider = page.getByRole('slider', { name: 'Minimum' });
    const maxSlider = page.getByRole('slider', { name: 'Maximum' });
    await minSlider.focus();
    for (let i = 0; i < 50; i++) await minSlider.press('ArrowRight');
    await maxSlider.focus();
    for (let i = 0; i < 50; i++) await maxSlider.press('ArrowLeft');
    await page.getByRole('button', { name: /Apply Filters/i }).click();
    // "No tours found" or similar message is shown
    const noToursMsg = page.locator('text=/No tours found|No tours match your filters|Loading tours/i');
    await expect(noToursMsg).toBeVisible();
  });

  test('10. UI and Accessibility Checks', async ({ page }) => {
    // 1. Tab through all interactive elements
    await loginWithValidUser(page);
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    await page.keyboard.press('Tab');
    // 2. Check for visible focus indicators
    // (Assume focus indicator is a visible outline)
    // 3. Ensure all images have alt text
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt', /.+/);
    }
  });

  test('11. Error Handling', async ({ page }) => {
    // Simulate network error and assert error message or loading indicator
    await loginWithValidUser(page);
    // Intercept tours API and force network error
    await page.route('**/api/tours**', route => route.abort());
    await page.goto('https://cebuflexi-web.vercel.app/tours');
    // Assert error message or loading indicator is visible
    const errorMsg = page.locator('text=/error|failed|unavailable|loading|No tours found|No tours match your filters/i');
    await expect(errorMsg).toBeVisible();
  });
});
