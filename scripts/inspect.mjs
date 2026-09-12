import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
await page.goto('http://localhost:3000/shop.html', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const nav = document.querySelector('nav[data-nav]');
  const row = nav.querySelector('.flex.justify-between');
  const brand = document.querySelector('[data-brand-link]');
  const btn = document.querySelector('[data-mobile-menu-btn]');
  const icons = document.querySelector('.flex.items-center.gap-4');
  const r = (el) => { const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, height: b.height, w: b.width }; };
  return {
    nav: r(nav),
    row: r(row),
    brand: r(brand),
    btn: r(btn),
    icons: r(icons),
    brandText: brand ? brand.textContent.trim() : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
