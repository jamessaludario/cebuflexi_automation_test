import { test, expect } from '@playwright/test';
import { loginWithValidUser } from './utils/auth'; // Import the new reusable login function
import { createIncognitoContext, createContextWithVideo } from './utils/browser-utils'; // Import the browser utility

test('Search for existing tour/s', async ({ browser }) => {
  // Create a new incognito browser context using the helper
  const { context, page } = await createIncognitoContext(browser);

  // Use the reusable login function to log in first
  await loginWithValidUser(page);

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

test('Should not find tours for a random search term', async ({ browser }) => {
  // Create a new incognito browser context using the helper
  const { context, page } = await createIncognitoContext(browser);

  // Use the reusable login function to log in first
  await loginWithValidUser(page);

  // --- Search Steps ---
  // Locate the search bar and type a random string
  const searchInput = page.locator('input[placeholder="Search for tours, locations..."]');
  await searchInput.fill('qwertyasdfg'); // A string unlikely to produce results
  await searchInput.press('Enter');

  // Wait for 1 second to allow search results to load
  await page.waitForTimeout(1000);

  // Assert that the URL is now the tours page
  await expect(page).toHaveURL(/.*\/tours/);

  // Assert that no tour cards are visible
  await expect(page.locator('div.group')).toHaveCount(0);

  // Optional: You can also assert that a "No results found" message is displayed.
  await expect(page.locator('text="No tours match your filters. Try adjusting your criteria."')).toBeVisible();

  // Close the browser context after the test
  await context.close();
});

test('should display featured tours and handle booking flow', async ({ browser }) => {
  const { context, page } = await createIncognitoContext(browser);
  await loginWithValidUser(page);

  // Locate the section for featured tours
  const featuredToursSection = page.locator('section', { has: page.locator('h2:has-text("Featured Tour Packages")') });
  await featuredToursSection.scrollIntoViewIfNeeded();

  // 1. Count how many featured tours are displayed
  const featuredTourCards = featuredToursSection.locator('div.group');
  const count = await featuredTourCards.count();
  console.log(`Found ${count} featured tour packages.`);
  await expect(featuredTourCards.first()).toBeVisible();

  // Get the first card to interact with
  const firstCard = featuredTourCards.first();

  // 2. Get the tour name from within the card
  const tourNameElement = firstCard.locator('div.font-semibold.transition-colors');
  const tourName = await tourNameElement.textContent();
  expect(tourName).not.toBeNull();

  // 3. Click the "Book Now" button and verify the new page title
  const bookNowButton = firstCard.locator('button:has-text("Book Now")');

  // Start waiting for the new page before clicking to avoid a race condition
  const pagePromise = context.waitForEvent('page');
  await bookNowButton.click();
  const newPage = await pagePromise; // The new page is now available

  // Wait for the new page to load
  await newPage.waitForLoadState();

  // Construct the expected title and assert
  const expectedTitle = `${tourName} | Cebu Tours - CebuFlexi Tours`;
  await expect(newPage).toHaveTitle(expectedTitle);

  // Close the context, which also closes all pages
  await context.close();
});

test('should navigate to tours page on "View All Tours" click', async ({ browser }, testInfo) => {
  // Create a new incognito browser context using the helper
  const { context, page } = await createContextWithVideo(browser, testInfo);

  // Use the reusable login function to log in first
  await loginWithValidUser(page);

  // Locate the "View All Tours" button
  const viewAllToursButton = page.locator('button:has-text("View All Tours")');

  // Use the browser's smooth scroll to bring the button into view
  await viewAllToursButton.evaluate(element => element.scrollIntoView({ behavior: 'smooth', block: 'center' }));

  // Click the button
  await viewAllToursButton.click();

  // Add a 2-second pause to wait for the next page to load
  await page.waitForTimeout(2000);

  // Assert that the URL is now the /tours page
  await expect(page).toHaveURL(/.*\/tours/);

  // Assert that the "All Tours" heading is visible on the page
  await expect(page.locator('h2', { hasText: 'All Tours' })).toBeVisible();

  // Close the browser context after the test
  await context.close();
});
