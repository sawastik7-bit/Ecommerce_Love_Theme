import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console:error]', m.text()); });
  await page.goto('http://localhost:3000/shop.html', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const nav = document.querySelector('nav[data-nav]');
    const scallop = document.querySelector('[data-nav-scallop]');
    const main = document.querySelector('main');
    const bread = document.querySelector('main nav.flex');
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, height: r.height };
    };
    const cs = (el) => { if (!el) return {}; const s = getComputedStyle(el); return { position: s.position, bottom: s.bottom, height: s.height }; };
    return {
      navRect: rect(nav),
      navCS: cs(nav),
      scallopRect: rect(scallop),
      scallopCS: cs(scallop),
      mainRect: rect(main),
      breadRect: rect(bread),
      navStyle: nav ? nav.getAttribute('class') : null,
    };
  });
  console.log('\n=== ' + vp.name + ' ===');
  console.log(JSON.stringify(info, null, 2));
  await context.close();
}
await browser.close();
