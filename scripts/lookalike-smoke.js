/**
 * Policy smoke tests for lookalike hiding.
 * Mirrors the rules in extension/content/content.js — keep in sync.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const registry = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "extension", "data", "verified-sites.json"),
    "utf8"
  )
);

const MULTI_PUBLIC_SUFFIXES = new Set([
  "co.uk",
  "com.au",
  "co.jp",
  "co.kr",
  "co.in",
  "com.br",
]);

const SAFE_STORE_HOSTS = new Set([
  "chrome.google.com",
  "chromewebstore.google.com",
  "addons.mozilla.org",
]);

const BLOCKED_HOSTS = new Set(["web.uniswap.org"]);

function normalizeHost(hostname) {
  if (!hostname) return "";
  return String(hostname).toLowerCase().replace(/^www\./, "");
}

function hostMatchesDomain(host, domain) {
  return normalizeHost(host) === normalizeHost(domain);
}

function etldPlusOne(host) {
  const h = normalizeHost(host);
  const parts = h.split(".").filter(Boolean);
  if (parts.length <= 2) return h;
  const lastTwo = parts.slice(-2).join(".");
  if (MULTI_PUBLIC_SUFFIXES.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return lastTwo;
}

function alnum(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const row = new Array(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return row[n];
}

function brandTokens(site) {
  const tokens = [alnum(site.name), ...site.keywords.map(alnum)].filter(
    (t) => t.length >= 5
  );
  return [...new Set(tokens)];
}

function findSiteByHost(host) {
  const h = normalizeHost(host);
  for (const site of registry.sites) {
    for (const domain of site.domains) {
      if (hostMatchesDomain(h, domain)) return site;
    }
  }
  return null;
}

function hostContainsBrand(host, token) {
  if (!token || token.length < 5) return false;
  const h = normalizeHost(host);
  const compact = alnum(h);
  const labels = h.split(".").map(alnum).filter(Boolean);
  const apex = alnum(etldPlusOne(h));
  if (compact.includes(token)) return true;
  if (apex.includes(token)) return true;
  for (const label of labels) {
    if (label.includes(token)) return true;
    if (
      Math.abs(label.length - token.length) <= 2 &&
      levenshtein(label, token) <= 2
    ) {
      return true;
    }
  }
  return false;
}

function isBlockedHost(host) {
  const h = normalizeHost(host);
  if (!h) return false;
  if (BLOCKED_HOSTS.has(h)) return true;
  for (const site of registry.sites) {
    const blocked = site.blockedDomains || [];
    if (blocked.some((d) => hostMatchesDomain(h, d))) return true;
  }
  return false;
}

function isLookalike(host, site) {
  const h = normalizeHost(host);
  if (!h || SAFE_STORE_HOSTS.has(h)) return false;
  if (findSiteByHost(h)) return false;
  if (isBlockedHost(h)) return true;

  const tokens = brandTokens(site);
  const apex = etldPlusOne(h);
  const officialApexes = site.domains.map((d) => etldPlusOne(d));
  if (officialApexes.includes(apex)) return false;

  for (const domain of site.domains) {
    const d = normalizeHost(domain);
    if (h.includes(d + ".") || h.endsWith("." + d) || h.includes("." + d + ".")) {
      return true;
    }
  }

  const scamBits = [
    "claim",
    "airdrop",
    "connect-wallet",
    "walletconnect-login",
    "connectwallet",
  ];
  const brandInHost = tokens.some((t) => hostContainsBrand(h, t));
  if (brandInHost && scamBits.some((b) => h.includes(b))) return true;

  const apexCompact = alnum(apex);
  const compounds = [
    "app",
    "swap",
    "wallet",
    "login",
    "connect",
    "defi",
    "exchange",
    "airdrop",
    "claim",
  ];
  for (const token of tokens) {
    if (token.length < 5) continue;
    for (const c of compounds) {
      if (apexCompact === token + c || apexCompact === c + token) return true;
    }
    const firstLabel = alnum((h.split(".")[0] || ""));
    if (
      (h.includes("-") || h.includes("_")) &&
      firstLabel.includes(token) &&
      compounds.some((c) => firstLabel.includes(c))
    ) {
      return true;
    }
  }

  const apexLabels = apex.split(".").map(alnum).filter(Boolean);
  for (const token of tokens) {
    if (token.length < 6) continue;
    for (const label of apexLabels) {
      if (!label || label === token) continue;
      const dist = levenshtein(label, token);
      if (dist >= 1 && dist <= 2 && Math.abs(label.length - token.length) <= 2) {
        return true;
      }
    }
  }

  return false;
}

function shouldHide(host, brandId) {
  const h = normalizeHost(host);
  if (findSiteByHost(h)) return false;
  if (isBlockedHost(h)) return true;
  const site = registry.sites.find((s) => s.id === brandId);
  assert.ok(site, "missing brand " + brandId);
  return isLookalike(h, site);
}

const cases = [
  ["app.uniswap.org", "uniswap", false, "official app"],
  ["uniswap.org", "uniswap", false, "official apex"],
  ["docs.uniswap.org", "uniswap", false, "same-apex docs left alone"],
  ["web.uniswap.org", "uniswap", true, "denylisted web subdomain"],
  ["uniswap-app.com", "uniswap", true, "compound phishing"],
  ["uniswap.org.evil.com", "uniswap", true, "nested spoof"],
  ["binance.com", "binance", false, "official CEX"],
  ["binance.us", "binance", false, "official alt TLD allowlisted"],
  ["blog.binance.com", "binance", false, "same-apex blog left alone"],
  ["metamask.io", "metamask", false, "official wallet"],
  ["metamask-claim.io", "metamask", true, "brand + claim"],
  ["uniswqp.com", "uniswap", true, "typosquat"],
];

let failed = 0;
for (const [host, brand, expectHide, note] of cases) {
  const got = shouldHide(host, brand);
  try {
    assert.strictEqual(got, expectHide, note);
    console.log("PASS", host, "hide=" + got, "—", note);
  } catch (err) {
    failed += 1;
    console.error("FAIL", host, "got hide=" + got, "expected", expectHide, "—", note);
  }
}

if (failed) {
  console.error("\n" + failed + " lookalike smoke test(s) failed");
  process.exit(1);
}
console.log("\nAll lookalike smoke tests passed (" + cases.length + ")");
