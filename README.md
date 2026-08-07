# SafeSERP

Open-source desktop browser extension that **blocks Google sponsored search ads** and **pins / badges official crypto DEX & wallet sites** so phishing clones never sit in the first click.

Site: [https://safeserp.web.app](https://safeserp.web.app)

Works on **Chrome, Edge, Brave, Firefox, Opera, and Vivaldi** from one folder: [`extension/`](extension/).

## Open verified whitelist

Source of truth (machine-readable): [`extension/data/verified-sites.json`](extension/data/verified-sites.json)

Anyone can audit this list, propose additions via PR, or fork it. Unknown sites are never marked safe — **allowlist only**.

### Ethereum / EVM DEXs

| Name | Official URL | Verified domains |
| --- | --- | --- |
| Uniswap | https://app.uniswap.org | `uniswap.org`, `app.uniswap.org` |
| Sushi | https://www.sushi.com | `sushi.com` |
| Curve | https://curve.fi | `curve.fi` |
| 1inch | https://app.1inch.io | `1inch.io`, `app.1inch.io` |
| Balancer | https://app.balancer.fi | `balancer.fi`, `app.balancer.fi` |
| CowSwap | https://swap.cow.fi | `cow.fi`, `swap.cow.fi` |
| Matcha | https://matcha.xyz | `matcha.xyz` |
| PancakeSwap | https://pancakeswap.finance | `pancakeswap.finance` |
| KyberSwap | https://kyberswap.com | `kyberswap.com` |

### Solana DEXs

| Name | Official URL | Verified domains |
| --- | --- | --- |
| Jupiter | https://jup.ag | `jup.ag` |
| Raydium | https://raydium.io | `raydium.io` |
| Orca | https://www.orca.so | `orca.so` |
| Meteora | https://meteora.ag | `meteora.ag` |
| Phoenix | https://www.phoenix.trade | `phoenix.trade` |
| Drift | https://www.drift.trade | `drift.trade` |
| Pump.fun | https://pump.fun | `pump.fun` |
| Lifinity | https://lifinity.io | `lifinity.io` |

### Bitcoin / cross-chain

| Name | Official URL | Verified domains |
| --- | --- | --- |
| THORSwap | https://app.thorswap.finance | `thorswap.finance`, `app.thorswap.finance` |
| THORChain | https://thorchain.org | `thorchain.org` |
| Rango | https://app.rango.exchange | `rango.exchange`, `app.rango.exchange` |
| Squid | https://app.squidrouter.com | `squidrouter.com`, `app.squidrouter.com` |
| Chainflip | https://swap.chainflip.io | `chainflip.io`, `swap.chainflip.io` |
| Bisq | https://bisq.network | `bisq.network` |

### Wallets

| Name | Official URL | Verified domains |
| --- | --- | --- |
| MetaMask | https://metamask.io/download | `metamask.io`, `support.metamask.io`, `portfolio.metamask.io` |
| Phantom | https://phantom.com/download | `phantom.com`, `phantom.app` |
| Solflare | https://solflare.com | `solflare.com` |
| Trust Wallet | https://trustwallet.com/download | `trustwallet.com` |
| Rabby | https://rabby.io | `rabby.io` |
| Coinbase Wallet | https://wallet.coinbase.com | `wallet.coinbase.com` |
| Ledger | https://www.ledger.com | `ledger.com` |
| Trezor | https://trezor.io | `trezor.io` |
| Backpack | https://backpack.app | `backpack.app` |
| Exodus | https://www.exodus.com | `exodus.com` |
| Glow | https://glow.app | `glow.app` |
| Keplr | https://www.keplr.app | `keplr.app` |
| Rainbow | https://rainbow.me | `rainbow.me` |

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

Edit [`extension/data/verified-sites.json`](extension/data/verified-sites.json) and update the tables above to match:

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
