# SafeSERP

Open-source desktop browser extension that **blocks Google sponsored search ads** and **pins / badges official crypto DEX & wallet sites** so phishing clones never sit in the first click.

Site: [https://safeserp.web.app](https://safeserp.web.app)

Works on **Chrome, Edge, Brave, Firefox, Opera, and Vivaldi** from one folder: [`extension/`](extension/).

## Open verified whitelist

Source of truth (machine-readable): [`extension/data/verified-sites.json`](extension/data/verified-sites.json)

Anyone can audit this list, propose additions via PR, or fork it. Unknown sites are never marked safe — **allowlist only**.

### Centralized exchanges

| Name | Official URL | Verified domains |
| --- | --- | --- |
| Binance | https://www.binance.com | `binance.com`, `www.binance.com`, `accounts.binance.com` |
| Coinbase | https://www.coinbase.com | `coinbase.com`, `www.coinbase.com`, `login.coinbase.com` |
| Kraken | https://www.kraken.com | `kraken.com`, `www.kraken.com`, `pro.kraken.com` |
| OKX | https://www.okx.com | `okx.com`, `www.okx.com` |
| Bybit | https://www.bybit.com | `bybit.com`, `www.bybit.com` |
| Bitget | https://www.bitget.com | `bitget.com`, `www.bitget.com` |
| Gate.io | https://www.gate.io | `gate.io`, `www.gate.io` |
| KuCoin | https://www.kucoin.com | `kucoin.com`, `www.kucoin.com` |
| Crypto.com | https://crypto.com | `crypto.com`, `www.crypto.com` |
| Gemini | https://www.gemini.com | `gemini.com`, `www.gemini.com` |
| Bitstamp | https://www.bitstamp.net | `bitstamp.net`, `www.bitstamp.net` |
| MEXC | https://www.mexc.com | `mexc.com`, `www.mexc.com` |
| HTX | https://www.htx.com | `htx.com`, `www.htx.com` |
| BingX | https://bingx.com | `bingx.com`, `www.bingx.com` |
| Bitfinex | https://www.bitfinex.com | `bitfinex.com`, `www.bitfinex.com` |
| BitMEX | https://www.bitmex.com | `bitmex.com`, `www.bitmex.com` |
| Deribit | https://www.deribit.com | `deribit.com`, `www.deribit.com` |
| Uphold | https://uphold.com | `uphold.com`, `www.uphold.com` |
| Robinhood | https://robinhood.com | `robinhood.com`, `www.robinhood.com` |
| Cash App | https://cash.app | `cash.app` |

### Ethereum / EVM DEXs

| Name | Official URL | Verified domains |
| --- | --- | --- |
| Uniswap | https://app.uniswap.org | `uniswap.org`, `app.uniswap.org` |
| Sushi | https://www.sushi.com | `sushi.com` |
| Curve | https://curve.fi | `curve.fi`, `www.curve.fi`, `curve.finance`, `www.curve.finance` |
| 1inch | https://app.1inch.io | `1inch.io`, `www.1inch.io`, `app.1inch.io` |
| Balancer | https://app.balancer.fi | `balancer.fi`, `app.balancer.fi` |
| CowSwap | https://swap.cow.fi | `cow.fi`, `swap.cow.fi` |
| Matcha | https://matcha.xyz | `matcha.xyz` |
| PancakeSwap | https://pancakeswap.finance | `pancakeswap.finance` |
| KyberSwap | https://kyberswap.com | `kyberswap.com` |
| Aerodrome | https://aerodrome.finance | `aerodrome.finance` |
| Velodrome | https://velodrome.finance | `velodrome.finance` |
| Camelot | https://app.camelot.exchange | `camelot.exchange`, `app.camelot.exchange` |
| Osmosis | https://app.osmosis.zone | `osmosis.zone`, `app.osmosis.zone` |
| LlamaSwap | https://swap.defillama.com | `swap.defillama.com` |

### Ethereum / EVM dapps

| Name | Official URL | Verified domains |
| --- | --- | --- |
| Aave | https://app.aave.com | `aave.com`, `app.aave.com` |
| Lido | https://stake.lido.fi | `lido.fi`, `stake.lido.fi` |
| Compound | https://app.compound.finance | `compound.finance`, `app.compound.finance` |
| Sky | https://app.sky.money | `sky.money`, `app.sky.money`, `makerdao.com` |
| EigenLayer | https://app.eigenlayer.xyz | `eigenlayer.xyz`, `app.eigenlayer.xyz` |
| Pendle | https://app.pendle.finance | `pendle.finance`, `app.pendle.finance` |
| Ethena | https://app.ethena.fi | `ethena.fi`, `app.ethena.fi` |
| Rocket Pool | https://stake.rocketpool.net | `rocketpool.net`, `stake.rocketpool.net` |
| Convex | https://www.convexfinance.com | `convexfinance.com`, `www.convexfinance.com` |
| Yearn | https://yearn.fi | `yearn.fi`, `yearn.finance` |
| OpenSea | https://opensea.io | `opensea.io`, `www.opensea.io` |
| Blur | https://blur.io | `blur.io` |
| ENS | https://app.ens.domains | `ens.domains`, `app.ens.domains` |
| GMX | https://app.gmx.io | `gmx.io`, `app.gmx.io` |
| dYdX | https://dydx.trade | `dydx.trade`, `www.dydx.trade` |
| Hyperliquid | https://app.hyperliquid.xyz | `hyperliquid.xyz`, `app.hyperliquid.xyz` |
| Polymarket | https://polymarket.com | `polymarket.com`, `www.polymarket.com` |
| Safe | https://app.safe.global | `safe.global`, `app.safe.global` |
| Revoke.cash | https://revoke.cash | `revoke.cash` |
| Etherscan | https://etherscan.io | `etherscan.io` |
| Arbitrum | https://bridge.arbitrum.io | `arbitrum.io`, `bridge.arbitrum.io` |
| Optimism | https://app.optimism.io | `optimism.io`, `app.optimism.io` |
| Base | https://base.org | `base.org`, `bridge.base.org` |
| Across | https://app.across.to | `across.to`, `app.across.to` |
| Stargate | https://stargate.finance | `stargate.finance` |
| ParaSwap | https://app.paraswap.io | `paraswap.io`, `app.paraswap.io` |
| Zapper | https://zapper.xyz | `zapper.xyz` |
| DeBank | https://debank.com | `debank.com` |
| DefiLlama | https://defillama.com | `defillama.com` |
| LI.FI | https://jumper.exchange | `li.fi`, `jumper.exchange` |

### Solana DEXs

| Name | Official URL | Verified domains |
| --- | --- | --- |
| Jupiter | https://jup.ag | `jup.ag`, `perps.jup.ag` |
| Raydium | https://raydium.io | `raydium.io` |
| Orca | https://www.orca.so | `orca.so` |
| Meteora | https://meteora.ag | `meteora.ag` |
| Phoenix | https://www.phoenix.trade | `phoenix.trade` |
| Drift | https://www.drift.trade | `drift.trade` |
| Pump.fun | https://pump.fun | `pump.fun` |
| Lifinity | https://lifinity.io | `lifinity.io` |

### Solana dapps

| Name | Official URL | Verified domains |
| --- | --- | --- |
| Marinade | https://marinade.finance | `marinade.finance` |
| Jito | https://www.jito.network | `jito.network`, `www.jito.network` |
| Sanctum | https://app.sanctum.so | `sanctum.so`, `app.sanctum.so` |
| Tensor | https://www.tensor.trade | `tensor.trade`, `www.tensor.trade` |
| Magic Eden | https://magiceden.io | `magiceden.io`, `www.magiceden.io` |
| Kamino | https://app.kamino.finance | `kamino.finance`, `app.kamino.finance` |
| Save | https://save.finance | `save.finance` |
| marginfi | https://app.marginfi.com | `marginfi.com`, `app.marginfi.com` |
| Wormhole | https://wormhole.com | `wormhole.com`, `portalbridge.com` |
| deBridge | https://app.debridge.finance | `debridge.finance`, `app.debridge.finance` |
| Mayan | https://mayan.finance | `mayan.finance` |
| Solscan | https://solscan.io | `solscan.io` |
| Birdeye | https://birdeye.so | `birdeye.so` |
| DEX Screener | https://dexscreener.com | `dexscreener.com` |
| Helius | https://www.helius.dev | `helius.dev` |
| Dialect | https://www.dialect.to | `dialect.to` |

### Bitcoin / cross-chain

| Name | Official URL | Verified domains |
| --- | --- | --- |
| THORSwap | https://app.thorswap.finance | `thorswap.finance`, `app.thorswap.finance` |
| THORChain | https://thorchain.org | `thorchain.org` |
| Rango | https://app.rango.exchange | `rango.exchange`, `app.rango.exchange` |
| Squid | https://app.squidrouter.com | `squidrouter.com`, `app.squidrouter.com` |
| Chainflip | https://swap.chainflip.io | `chainflip.io`, `swap.chainflip.io` |
| Bisq | https://bisq.network | `bisq.network` |
| Mempool | https://mempool.space | `mempool.space` |
| Boltz | https://boltz.exchange | `boltz.exchange` |
| SideShift | https://sideshift.ai | `sideshift.ai` |
| LN Markets | https://lnmarkets.com | `lnmarkets.com` |
| Lightning Labs | https://lightning.engineering | `lightning.engineering` |

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
| UniSat | https://unisat.io | `unisat.io` |
| Xverse | https://www.xverse.app | `xverse.app` |
| Leather | https://leather.io | `leather.io` |
| Sparrow Wallet | https://sparrowwallet.com | `sparrowwallet.com` |
| BlueWallet | https://bluewallet.io | `bluewallet.io` |
| Wasabi Wallet | https://wasabiwallet.io | `wasabiwallet.io` |
| Electrum | https://electrum.org | `electrum.org` |
| AQUA | https://aquawallet.io | `aquawallet.io` |

## What it does

1. Hides and removes sponsored / ad blocks on Google Search (especially top results).
2. Pins a canonical **official link** card to the top when the query matches a known brand.
3. Badges the best matching organic result as verified (not every related subdomain).
4. Hides unofficial brand lookalikes so the pinned official URL stays obvious.

## Install (load unpacked)

### Chrome / Edge / Brave / Opera / Vivaldi

1. Download or clone this repo
2. Open the browser extensions page (`chrome://extensions`, `edge://extensions`, or `brave://extensions`)
3. Enable **Developer mode** → **Load unpacked** → select [`extension/`](extension/)

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…** → select [`extension/manifest.json`](extension/manifest.json)

## Test it

Search Google for `uniswap`, `binance`, `aave`, `jupiter`, or `phantom`.

- Sponsored blocks should be gone
- A pinned official link should sit at the top
- The official domain should show a verified label
- Lookalikes (if any) should be hidden

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

Types: `dex`, `cex`, `dapp`, `wallet`, `cross`. Then run `node scripts/sync-whitelist.js`.
```

Open a PR with evidence that the domain is official (project docs, GitHub org, etc.).

## Landing site

Vite + React app in [`frontend/`](frontend/). Firebase Hosting serves `frontend/build` via [`firebase.json`](firebase.json).

Downloads are versioned from `extension/manifest.json`, e.g. `safeserp-extension-1.3.0.zip`. Rebuild the zip + download links with:

```bash
node scripts/pack-extension.js
```

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
