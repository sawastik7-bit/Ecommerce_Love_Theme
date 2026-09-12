import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const outDir = join(projectRoot, 'screenshots');
mkdirSync(outDir, { recursive: true });

const BASE = process.env.BASE_URL || 'http://localhost:3000';

const pages = [
  { file: 'index.html', url: `${BASE}/index.html` },
  { file: 'shop.html', url: `${BASE}/shop.html` },
  { file: 'product.html', url: `${BASE}/product.html?id=aura-silk-slip-dress` },
  { file: 'cart.html', url: `${BASE}/cart.html` },
  { file: 'checkout.html', url: `${BASE}/checkout.html` },
  { file: 'thank-you.html', url: `${BASE}/thank-you.html` },
  { file: '404.html', url: `${BASE}/nonexistent.html` },
  { file: 'account.html', url: `${BASE}/account.html` },
  { file: 'about.html', url: `${BASE}/about.html` },
  { file: 'contact.html', url: `${BASE}/contact.html` },
  { file: 'policy.html', url: `${BASE}/policy.html` },
];

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

const page = await context.newPage();
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    console.log(`[console:error] ${page.url()} :: ${msg.text()}`);
  }
});
page.on('pageerror', (err) => {
  console.log(`[pageerror] ${page.url()} :: ${err.message}`);
});

for (const p of pages) {
  try {
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 60000 });
    // Give partial loader + images time to complete
    await page.waitForTimeout(3000);
    const out = join(outDir, p.file.replace('.html', '.png'));
    await page.screenshot({ path: out, fullPage: true });
    console.log(`saved ${p.file} -> ${out}`);
  } catch (err) {
    console.log(`FAILED ${p.file} :: ${err.message}`);
  }
}

await browser.close();
console.log('done');
