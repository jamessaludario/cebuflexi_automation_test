import { Page, Browser, BrowserContext } from '@playwright/test';

/**
 * Creates a new incognito browser context and a new page, maximized.
 * @param browser The Playwright Browser object.
 * @returns An object containing the new context and page.
 */
export async function createIncognitoContext(browser: Browser): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({viewport: null, deviceScaleFactor: undefined});
  const page = await context.newPage();
  return { context, page };
}