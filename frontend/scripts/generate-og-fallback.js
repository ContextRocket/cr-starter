const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const PORT = process.env.FRONTEND_PORT || 3003;

(async () => {
  console.log('Generating fallback OpenGraph image via Playwright...');
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    
    await page.goto(`http://localhost:${PORT}?_hideCookieConsent=1`);
    await page.addStyleTag({ content: 'body { overflow: hidden; }' });
    
    await page.evaluate(() => {
      const banner = document.querySelector('[data-testid="cookie-consent-banner"]');
      if (banner) banner.remove();
    });

    await page.waitForTimeout(2000);
    
    // We overwrite the dynamic route files so they don't override the static fallback image
    const ogStaticPath = path.resolve(__dirname, '../public/opengraph-image.png');
    const twStaticPath = path.resolve(__dirname, '../public/twitter-image.png');
    await page.screenshot({ path: ogStaticPath, type: 'png' });
    await page.screenshot({ path: twStaticPath, type: 'png' });

    console.log(`Successfully generated ${ogStaticPath}`);
  } catch (error) {
    console.error('Failed to generate fallback OG image:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
