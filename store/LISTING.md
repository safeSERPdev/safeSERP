# SafeSERP — store listing pack

Extension package: [`../frontend/public/safeserp-extension-1.3.1.zip`](../frontend/public/safeserp-extension-1.3.1.zip)

Privacy policy (deploy first): https://safeserp.web.app/privacy

Firefox / AMO ID (permanent): `safeserp@safeserp.web.app`

## Screenshots

Source crops: `frontend/src/assets/ss1.png` (Uniswap), `ss2.png` (Trezor), `ss3.png` (Phantom).

Store-ready sizes in [`screenshots/`](screenshots/):

| File | Size | Scene |
| --- | --- | --- |
| `01-uniswap-1280x800.png` | 1280×800 | Ads blocked + pinned Uniswap + verified organic |
| `02-trezor-1280x800.png` | 1280×800 | Pinned / verified Trezor |
| `03-phantom-1280x800.png` | 1280×800 | Pinned / verified Phantom |
| `*-640x400.png` | 640×400 | Same scenes (CWS alternate size) |

Upload the **1280×800** set first (Chrome Web Store, Edge, AMO, Opera).

## Suggested listing copy

**Name:** SafeSERP — Block Sponsored Crypto Scams

**Short description:**  
Hides Google sponsored ads and pins official DEX, CEX, dapp, and wallet links from a public allowlist.

**Detailed description (draft):**  
SafeSERP runs on Google Search and:

1. Hides sponsored / ad result units before you click  
2. Pins the official allowlisted site at the top when your query matches a known brand  
3. Badges the best matching organic result as verified  
4. Hides clear unofficial lookalikes for that brand  

Allowlist only — unknown sites are never marked safe. The allowlist ships in the extension and is public in the open-source repo.

No accounts. No analytics. No search-query upload. See the privacy policy: https://safeserp.web.app/privacy

## Submit checklist

1. Deploy site so `/privacy` is live  
2. Chrome Web Store → upload `safeserp-extension-1.3.1.zip` + 1280×800 screenshots + privacy URL  
3. Edge Add-ons → same zip / screenshots / privacy URL  
4. Firefox AMO → same zip, ID `safeserp@safeserp.web.app`, screenshots, privacy URL  
5. Opera Add-ons → Chromium zip + screenshots  

Do not change the Firefox ID after the first AMO submission.
