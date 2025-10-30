import { Page, Browser, BrowserContext, TestInfo } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Creates a new incognito browser context and a new page, maximized.
 * @param browser The Playwright Browser object.
 * @returns An object containing the new context and page.
 */
export async function createIncognitoContext(
  browser: Browser
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({
    viewport: null,
    deviceScaleFactor: undefined,
  });
  const page = await context.newPage();
  return { context, page };
}

/**
 * Creates a new incognito browser context with video recording enabled.
 * Automatically names the video based on the test title, timestamp, and status.
 * Ensures the /videos directory exists, logs the path, and safely finalizes the video.
 * @param browser The Playwright Browser object.
 * @param testInfo The Playwright TestInfo object (auto-provided per test)
 * @returns An object containing the new context and page.
 */
export async function createContextWithVideo(
  browser: Browser,
  testInfo: TestInfo
): Promise<{ context: BrowserContext; page: Page }> {
  // Resolve base directory for videos
  const videosDir = path.resolve(__dirname, '../../videos');

  // Ensure base directory exists
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
    console.log(`[browser-utils] Created video directory: ${videosDir}`);
  }

  // Generate a safe folder name using test title + timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeTestName = testInfo.title.replace(/[^a-zA-Z0-9-_]/g, '_');
  const testVideoDir = path.join(videosDir, `${safeTestName}_${timestamp}`);

  fs.mkdirSync(testVideoDir, { recursive: true });

  // Create browser context with video recording enabled
  const context = await browser.newContext({
    viewport: null,
    deviceScaleFactor: undefined,
    recordVideo: {
      dir: testVideoDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  console.log(`[browser-utils] 🎥 Recording video for "${testInfo.title}" at: ${testVideoDir}`);

  // Wrap context.close() to safely finalize and rename the video file
  const originalClose = context.close.bind(context);
  context.close = async () => {
    try {
      console.log('[browser-utils] Waiting briefly before closing to finalize video...');
      await page.waitForTimeout(1000);
    } catch (err) {
      console.warn('[browser-utils] Error during wait before close:', err);
    }

    await originalClose();

    console.log(`[browser-utils] Context closed. Checking for video file in: ${testVideoDir}`);
    await new Promise((r) => setTimeout(r, 1000)); // give the file a moment to finish writing

    // Detect and rename the video file
    const files = fs.readdirSync(testVideoDir);
    const videoFile = files.find((f) => f.endsWith('.webm'));
    if (videoFile) {
      const oldPath = path.join(testVideoDir, videoFile);
      const status = testInfo.status ?? 'unknown'; // may be undefined if called mid-test
      const newFileName = `${safeTestName}_${timestamp}_${status}.webm`;
      const newPath = path.join(testVideoDir, newFileName);

      fs.renameSync(oldPath, newPath);
      console.log(`[browser-utils] ✅ Video saved as: ${newFileName}`);
    } else {
      console.warn(`[browser-utils] ⚠️ No .webm video found in ${testVideoDir}`);
    }
  };

  return { context, page };
}
