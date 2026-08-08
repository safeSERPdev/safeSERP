# SafeSERP — store listing pack

Extension package: [`../frontend/public/safeserp-extension-1.3.6.zip`](../frontend/public/safeserp-extension-1.3.6.zip)

Homepage: https://safeserp.xyz/  
Privacy policy: https://safeserp.xyz/privacy  

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

No accounts. No analytics. No search-query upload. See the privacy policy: https://safeserp.xyz/privacy

## Chrome Web Store — Privacy practices (copy/paste)

### Homepage URL (Store listing tab)
```
https://safeserp.xyz/
```
Must be HTTPS and return HTTP 200 in an incognito window. Privacy policy field:
```
https://safeserp.xyz/privacy
```

### Single purpose description
```
This extension has one purpose: on Google Search pages, hide sponsored ad results and highlight official crypto DEX, CEX, dapp, and wallet sites from a bundled public allowlist so users avoid phishing lookalikes.
```

### Host permission justification
(Content scripts match many Google Search TLDs — that is the “host permission.”)

```
SafeSERP only runs on Google Search result pages. Host access to www.google.* /search* URLs is required so the content script can (1) hide sponsored/ad result units and (2) pin and badge official allowlisted crypto sites in the results. The extension does not request host access to unrelated websites and does not collect or transmit browsing data.
```

### Remote code use
Select **No** — this extension does **not** execute remote code (no remote JS/Wasm, no dynamically loaded scripts from the network).

If the form still asks for a justification, paste:
```
SafeSERP does not use remote code. All JavaScript and the verified-site allowlist are bundled inside the extension package. The only optional network image request is loading a favicon from Google’s public favicon service (https://www.google.com/s2/favicons) for display in a local UI card; that is an image, not executable code. There is no eval, no remote script injection, and no code fetched from our servers.
```

### Data usage / certification
- Does not collect user data (or: no personally identifiable data / no search queries sent to a developer server)
- Certify compliance with Developer Program Policies — check the certification box
- Privacy policy URL: `https://safeserp.xyz/privacy`

### What to answer for common yes/no toggles
| Question | Answer |
| --- | --- |
| Collects user data? | **No** |
| Sells user data? | **No** |
| Uses remote code? | **No** |
| Handles personal/sensitive data? | **No** |

Then **Save Draft** and try **Submit for review** again.

## Submit checklist

1. Deploy site so `/privacy` is live  
2. Chrome Web Store → upload `safeserp-extension-1.3.6.zip` + 1280×800 screenshots + privacy URL  
3. Fill Privacy practices using the copy above  
4. Edge Add-ons → same zip / screenshots / privacy URL  
5. Firefox AMO → same zip, ID `safeserp@safeserp.web.app`, screenshots, privacy URL  
6. Opera Add-ons → Chromium zip + screenshots  

Do not change the Firefox ID after the first AMO submission.
