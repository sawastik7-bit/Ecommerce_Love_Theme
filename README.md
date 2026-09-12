# Ethereal Boutique

A multi-page static boutique site for fashion / bridal / romantic apparel.

## Live deploy

This is a pure static HTML site — no build step required.

### Deploy to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Select the root folder (`ethereal-boutique`).
4. Vercel will detect static files automatically (`index.html` at root).
5. Click **Deploy**.

If needed, set the framework preset to **Other / Static** in Vercel project settings.

## Local preview

```bash
# Simple HTTP server (Python 3)
python -m http.server 3000

# Or with Node / npx
npx serve .
```

## Dev / test scripts

- `npm run screenshot` — Playwright page screenshots (requires `playwright`)
- `npm run serve` — python server

## Structure

- `index.html`, `shop.html`, `product.html`, `cart.html`, `checkout.html`, `about.html`, `contact.html`, `account.html`, `policy.html`, `404.html`, `thank-you.html`
- `assets/` — CSS, JS, images, partials (nav/footer)
