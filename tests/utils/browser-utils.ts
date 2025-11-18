import { Browser, BrowserContext, Page, TestInfo } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Small helpers (kept local to avoid circular exports)
const ensureDir = (dir: string) => fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true });
const safe = (name: string) => name.replace(/[^a-zA-Z0-9-_]/g, '_');
const now = () => new Date().toISOString().replace(/[:.]/g, '-');

/**
 * Normal incognito context: video is handled automatically for failing tests.
 */
export async function createIncognitoContext(
  browser: Browser,
  testInfo?: TestInfo
): Promise<{ context: BrowserContext; page: Page }> {
  // Temp video folder inside test-results (fallback when no testInfo provided)
  const tempVideoDir = testInfo
    ? path.join(testInfo.outputDir, 'video')
    : path.join(process.cwd(), 'test-results', 'video-temp');
  ensureDir(tempVideoDir);

  const context = await browser.newContext({
    viewport: null,
    recordVideo: { dir: tempVideoDir, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();

  const originalClose = context.close.bind(context);
  context.close = async () => {
    await originalClose(); // Playwright finalizes video

    const video = page.video();
    if (!video) return;

    // If no testInfo was provided (helper used standalone), just delete temp video
    if (!testInfo) {
      try {
        await video.delete();
      } catch (e) {
        /* ignore */
      }
      return;
    }

    if (testInfo.status === 'failed') {
      const videosDir = path.resolve(__dirname, '../../videos');
      ensureDir(videosDir);

      const fileName = `${safe(testInfo.title)}_${now()}.webm`;
      const targetPath = path.join(videosDir, fileName);

      try {
        await video.saveAs(targetPath);
        await video.delete(); // remove temp copy
        console.log(`[browser-utils] 💾 Saved failed test video: ${targetPath}`);
      } catch (err) {
        console.warn(`[browser-utils] ⚠️ Could not save video:`, err);
      }
    }
  };

  return { context, page };
}

/**
 * Always-record context: video is recorded for all tests.
 */
export async function createContextWithVideo(
  browser: Browser,
  testInfo?: TestInfo
): Promise<{ context: BrowserContext; page: Page }> {
  const tempDir = testInfo ? path.join(testInfo.outputDir, 'video') : path.join(process.cwd(), 'test-results', 'video-temp');
  ensureDir(tempDir);

  const context = await browser.newContext({
    viewport: null,
    recordVideo: {
      dir: tempDir, // temporary storage, final save in afterEach
      size: { width: 1920, height: 1080 },
    },
  });
  const page = await context.newPage();
  return { context, page };
}
