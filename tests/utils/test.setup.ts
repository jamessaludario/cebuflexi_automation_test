import { test as baseTest } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Helpers
const ensureDir = (dir: string) => fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true });
const safeName = (name: string) => name.replace(/[^a-zA-Z0-9-_]/g, '_');
const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

// Extend test to handle video saving
export const test = baseTest.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    const video = page.video();
    if (!video) return;

    // Wait briefly to ensure video is finalized
    await page.waitForTimeout(500);

    // Determine destination folder
    const alwaysRecord = testInfo.annotations.some(a => a.type === 'always-record');
    const baseDir = alwaysRecord
      ? path.resolve(__dirname, '../../videos/always')
      : path.resolve(__dirname, '../../videos');

    ensureDir(baseDir);

    const fileName = `${safeName(testInfo.title)}_${timestamp()}_${testInfo.status ?? 'done'}.webm`;
    const targetPath = path.join(baseDir, fileName);

    try {
      await video.saveAs(targetPath);
      await video.delete(); // clean temp copy
      console.log(`[test.setup] 💾 Video saved: ${targetPath}`);
    } catch (err) {
      console.warn('[test.setup] ⚠️ Could not save video:', err);
    }
  },
});

// Export expect
export const expect = baseTest.expect;
