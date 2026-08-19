const { chromium } = require('@playwright/test');

const forkDir = process.argv[2];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: `scratchpad/${forkDir}-home-light.png`, fullPage: true });

  const themeToggle = page.locator('button[data-testid="theme-toggle"]').first();
  if (await themeToggle.isVisible()) {
    await themeToggle.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `scratchpad/${forkDir}-home-dark.png`, fullPage: true });
  }

  await browser.close();
  console.log(`Done capturing ${forkDir}`);
})();
