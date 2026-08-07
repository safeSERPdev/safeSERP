# SafeSERP

Open-source desktop browser extension that **blocks Google sponsored search ads** and **pins / badges official crypto DEX & wallet sites** so phishing clones never sit in the first click.

Site: [https://safeserp.web.app](https://safeserp.web.app)

Works on **Chrome, Edge, Brave, Firefox, Opera, and Vivaldi** from one folder: [`extension/`](extension/).

## Open verified whitelist

The official domain allowlist is public and versioned in:

**[`extension/data/verified-sites.json`](extension/data/verified-sites.json)**

Anyone can audit which DEXs and wallets are marked verified, propose additions via PR, or fork the list. Unknown sites are never marked safe — allowlist only.

## What it does

1. Hides and removes sponsored / ad blocks on Google Search (especially top results).
2. Pins a canonical **official link** card to the top when the query matches a known brand.
3. Badges the best matching organic result as verified (not every related subdomain).
4. Warns on lookalike domains with the real URL to use instead.

## Install (load unpacked)

### Chrome / Edge / Brave / Opera / Vivaldi

1. Download or clone this repo
2. Open the browser extensions page (`chrome://extensions`, `edge://extensions`, or `brave://extensions`)
3. Enable **Developer mode** → **Load unpacked** → select [`extension/`](extension/)

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…** → select [`extension/manifest.json`](extension/manifest.json)

## Test it

Search Google for `uniswap`, `metamask`, `jupiter`, or `phantom`.

- Sponsored blocks should be gone
- A pinned official link should sit at the top
- The official domain should show a verified label
- Lookalikes (if any) should show a warning

## Contribute official sites

Edit [`extension/data/verified-sites.json`](extension/data/verified-sites.json):

```json
{
  "id": "example",
  "name": "Example",
  "type": "dex",
  "chain": "eth",
  "keywords": ["example"],
  "domains": ["example.com", "app.example.com"],
  "canonical": "https://app.example.com"
}
```

Open a PR with evidence that the domain is official (project docs, GitHub org, etc.).

## Landing site

Vite + React app in [`frontend/`](frontend/). Firebase Hosting serves `frontend/build` via [`firebase.json`](firebase.json).

```bash
cd frontend
npm install
cp .env.example .env   # add your Firebase web config if needed
npm run build
```

## Privacy

- Content scripts run only on Google Search result pages
- Verification uses the bundled public allowlist in this repo
- Do not commit Firebase Admin SDK keys or `.env` files (see `.gitignore`)
