(() => {
  "use strict";

  const AD_SELECTORS = [
    "#tads",
    "#tadsb",
    "#bottomads",
    "#tvcap",
    "#taw",
    "[data-text-ad]",
    "[data-text-ad='1']",
    "[data-aavs]",
    "[data-ta-slot]",
    ".commercial-unit-desktop-top",
    ".commercial-unit-desktop-rhs",
    ".commercial-unit-mobile-top",
    ".pla-unit",
    ".cu-container",
    "div[aria-label='Ads']",
    "div[aria-label='Anzeigen']",
    "div[aria-label='Annonces']",
    "div[aria-label='Anuncios']",
  ].join(",");

  const SPONSORED_LABELS = [
    "sponsored",
    "sponsorisé",
    "sponsorise",
    "annonces",
    "anzeige",
    "anzeigen",
    "anuncio",
    "anuncios",
    "annuncio",
    "gesponsord",
    "reklama",
    "reklam",
    "광고",
    "広告",
    "贊助",
    "赞助",
  ];

  const SAFE_STORE_HOSTS = new Set([
    "chrome.google.com",
    "chromewebstore.google.com",
    "addons.mozilla.org",
    "microsoftedge.microsoft.com",
    "apps.apple.com",
    "play.google.com",
  ]);

  const MULTI_PUBLIC_SUFFIXES = new Set([
    "co.uk",
    "com.au",
    "co.jp",
    "co.kr",
    "co.in",
    "com.br",
    "com.mx",
    "co.nz",
    "com.sg",
    "co.za",
    "com.tr",
    "com.ar",
    "com.tw",
    "com.hk",
    "co.id",
    "com.ph",
    "com.vn",
    "co.th",
    "com.my",
    "com.sa",
    "com.eg",
    "com.pk",
    "com.ng",
    "com.ua",
    "com.co",
    "com.pe",
  ]);

  const ownedHosts = new WeakSet();
  const SHADOW_STYLES = `
    :host {
      display: block !important;
      width: 100% !important;
      font-family: "Segoe UI", system-ui, sans-serif !important;
      color-scheme: dark;
    }
    .box { box-sizing: border-box; width: 100%; }
    .status {
      margin: 0 0 10px 0; padding: 8px 12px; border-radius: 6px;
      font-size: 13px; font-weight: 600; line-height: 1.35;
      color: #86efac; background: rgba(6, 78, 59, 0.55);
      border: 1px solid rgba(16, 185, 129, 0.45);
    }
    .pin {
      margin: 0 0 12px 0; padding: 12px 14px; border-radius: 8px;
      background: rgba(6, 78, 59, 0.92); color: #ecfdf5;
      border: 1px solid rgba(52, 211, 153, 0.65);
    }
    .pin-label {
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; color: #a7f3d0; margin-bottom: 4px;
    }
    .pin-name { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #fff; }
    .pin-link {
      display: inline-block; font-size: 13px; font-weight: 700;
      color: #064e3b; background: #6ee7b7; padding: 8px 12px;
      border-radius: 6px; text-decoration: none; border: 1px solid #047857;
    }
    .pin-hint { margin-top: 8px; font-size: 12px; font-weight: 500; color: #a7f3d0; line-height: 1.35; }
    .badge {
      margin: 0 0 8px 0; padding: 8px 10px; border-radius: 5px;
      font-size: 13px; font-weight: 700; line-height: 1.3;
    }
    .badge-ok {
      background: rgba(4, 120, 87, 0.95); color: #ecfdf5;
      border: 1px solid rgba(110, 231, 183, 0.55);
    }
    .badge-bad {
      background: rgba(153, 27, 27, 0.95); color: #fef2f2;
      border: 1px solid rgba(252, 165, 165, 0.55);
    }
    .badge-sub { margin-top: 3px; font-size: 12px; font-weight: 500; opacity: 0.92; }
  `;

  let registry = null;
  let lastRun = 0;
  let observer = null;
  let mutating = false;
  let observeTarget = null;
  let statusHost = null;
  let pinHost = null;
  let lastHref = "";
  let heartbeatTimer = null;

  function normalizeHost(hostname) {
    if (!hostname) return "";
    return String(hostname).toLowerCase().replace(/^www\./, "");
  }

  function hostMatchesDomain(host, domain) {
    return normalizeHost(host) === normalizeHost(domain);
  }

  function getQuery() {
    try {
      return new URLSearchParams(location.search).get("q") || "";
    } catch {
      return "";
    }
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
    return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function brandTokens(site) {
    const tokens = [alnum(site.name), ...site.keywords.map(alnum)].filter(
      (t) => t.length >= 5
    );
    return [...new Set(tokens)];
  }

  function isHttpsCanonical(url) {
    try {
      const u = new URL(url);
      return u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function sanitizeSites(data) {
    const sites = Array.isArray(data && data.sites) ? data.sites : [];
    return {
      version: data && data.version ? data.version : 0,
      sites: sites.filter(
        (s) =>
          s &&
          s.id &&
          s.name &&
          Array.isArray(s.domains) &&
          s.domains.length &&
          isHttpsCanonical(s.canonical)
      ),
    };
  }

  function findSiteByHost(host) {
    if (!registry) return null;
    const h = normalizeHost(host);
    for (const site of registry.sites) {
      for (const domain of site.domains) {
        if (hostMatchesDomain(h, domain)) return site;
      }
    }
    return null;
  }

  function keywordHitScore(query, keyword) {
    const q = query.toLowerCase().trim();
    const kw = keyword.toLowerCase().trim();
    if (!q || !kw) return 0;
    if (q === kw) return 100 + kw.length;
    const re = new RegExp(
      "(?:^|[^a-z0-9])" + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:[^a-z0-9]|$)",
      "i"
    );
    if (re.test(q)) return 60 + kw.length;
    // Only allow loose includes for longer, specific keywords
    if (kw.length >= 8 && q.includes(kw)) return 20 + kw.length;
    return 0;
  }

  function scoreSiteForQuery(query, site) {
    let best = 0;
    for (const kw of site.keywords || []) {
      best = Math.max(best, keywordHitScore(query, kw));
    }
    // Prefer keywords, but allow distinctive names (len >= 7) as whole-query hits.
    if (alnum(site.name).length >= 7) {
      best = Math.max(best, keywordHitScore(query, site.name));
    }
    return best;
  }

  function findSitesByQuery(query) {
    if (!registry) return [];
    const scored = registry.sites
      .map((site) => ({ site, score: scoreSiteForQuery(query, site) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.map((x) => x.site);
  }

  function primarySiteForQuery(query) {
    const ranked = findSitesByQuery(query);
    return ranked[0] || null;
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
      if (Math.abs(label.length - token.length) <= 2 && levenshtein(label, token) <= 2) {
        return true;
      }
    }
    return false;
  }

  function isLookalike(host, site) {
    const h = normalizeHost(host);
    if (!h || SAFE_STORE_HOSTS.has(h)) return false;
    if (findSiteByHost(h)) return false;

    const tokens = brandTokens(site);
    const apex = etldPlusOne(h);
    const officialApexes = site.domains.map((d) => etldPlusOne(d));
    if (officialApexes.includes(apex)) {
      // Same registrable domain family but not an exact allowlisted host
      return !site.domains.some((d) => hostMatchesDomain(h, d));
    }

    // Nested spoof: official domain embedded as labels under a different apex
    // e.g. app.uniswap.org.evil.com
    for (const domain of site.domains) {
      const d = normalizeHost(domain);
      if (h.includes(d + ".") || h.endsWith("." + d) || h.includes("." + d + ".")) {
        return true;
      }
    }

    // Brand impersonation in the registrable domain itself
    // e.g. uniswap-app.com, metamasklogin.io, juplter.xyz
    // Avoid substring traps like thephantommenace.com containing "phantom".
    const apexLabels = apex.split(".").map(alnum).filter(Boolean);
    for (const token of tokens) {
      for (const label of apexLabels) {
        if (!label) continue;
        if (label === token) return true;
        if (label.startsWith(token) && label.length <= token.length + 10) return true;
        if (label.endsWith(token) && label.length <= token.length + 10) return true;
        if (
          Math.abs(label.length - token.length) <= 2 &&
          levenshtein(label, token) <= 2
        ) {
          return true;
        }
      }
    }

    // Brand + scam pattern in full host (claim/airdrop) only with brand proximity
    const scamBits = ["claim", "airdrop", "connect-wallet", "walletconnect-login"];
    const brandInHost = tokens.some((t) => hostContainsBrand(h, t));
    if (brandInHost && scamBits.some((b) => h.includes(b))) return true;

    return false;
  }

  function removeAds() {
    document.querySelectorAll(AD_SELECTORS).forEach((el) => {
      if (el && el.isConnected) el.remove();
    });

    document
      .querySelectorAll("#tads, #tadsb, #bottomads, #tvcap, [data-text-ad]")
      .forEach((el) => {
        if (el && el.isConnected) el.remove();
      });

    const roots = document.querySelectorAll("#center_col, #rso, #tads, #search");
    roots.forEach((root) => {
      root.querySelectorAll("span").forEach((node) => {
        const text = (node.textContent || "").trim().toLowerCase();
        if (!text || text.length > 24) return;
        if (!SPONSORED_LABELS.some((l) => text === l)) return;
        const block = node.closest(
          "#tads, #tadsb, #bottomads, #tvcap, [data-text-ad], .cu-container"
        );
        if (block && block.isConnected) block.remove();
      });
    });
  }

  function hostFromHref(href) {
    if (!href) return "";
    try {
      if (href.startsWith("/url?") || href.includes("google.") && href.includes("url?")) {
        const abs = href.startsWith("http")
          ? href
          : location.origin + href;
        const u = new URL(abs);
        const q = u.searchParams.get("q") || u.searchParams.get("url");
        if (q) return normalizeHost(new URL(q).hostname);
      }
      if (href.startsWith("http")) {
        const u = new URL(href);
        if (u.hostname.includes("google.")) return "";
        return normalizeHost(u.hostname);
      }
    } catch {
      /* skip */
    }
    return "";
  }

  function extractHostFromResult(resultEl) {
    const cite = resultEl.querySelector("cite");
    if (cite) {
      const citeText = (cite.textContent || "").trim();
      const citeMatch = citeText.match(/^(?:https?:\/\/)?([^\/\s›]+)/i);
      if (citeMatch) return normalizeHost(citeMatch[1]);
    }

    const anchors = resultEl.querySelectorAll("a[href]");
    for (const a of anchors) {
      const host = hostFromHref(a.getAttribute("href") || "");
      if (host) return host;
    }
    return "";
  }

  function getResultBlocks() {
    const candidates = [];
    const seen = new Set();

    const push = (el) => {
      if (!el || seen.has(el)) return;
      if (!el.querySelector("a h3, h3")) return;
      if (el.closest("#tads, #tadsb, #bottomads, #tvcap")) return;
      if (el.id === "safeserp-status-host" || el.id === "safeserp-pin-host") return;
      if (el.parentElement) {
        const nestedParent = el.parentElement.closest(".g, [data-sokoban-container]");
        if (
          nestedParent &&
          nestedParent !== el &&
          nestedParent.querySelector("a h3, h3")
        ) {
          return;
        }
      }
      seen.add(el);
      candidates.push(el);
    };

    document.querySelectorAll("#rso .g, #search .g").forEach(push);
    if (!candidates.length) {
      document.querySelectorAll("#rso a h3, #search a h3").forEach((h3) => {
        push(h3.closest(".g") || h3.closest("div[data-hveid]"));
      });
    }
    return candidates;
  }

  function createShadowHost(id) {
    const host = document.createElement("div");
    host.id = id;
    host.setAttribute("data-safeserp-owned", "1");
    ownedHosts.add(host);
    // open mode still gated by WeakSet ownership checks; closed mode broke
    // shadow access in some Chromium content-script paths after reload.
    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = SHADOW_STYLES;
    shadow.appendChild(style);
    host._safeserpShadow = shadow;
    return host;
  }

  function isOwnedHost(el) {
    return !!(el && ownedHosts.has(el) && el.getAttribute("data-safeserp-owned") === "1");
  }

  function resultsAnchor() {
    // Prefer the results column / result list — never the searchform overlay tree.
    // Entity / "People also search" carousels often sit above #rso; still pin into #rso
    // when present so we don't land inside the carousel strip.
    return (
      document.querySelector("#rso") ||
      document.querySelector("#search div#rso") ||
      document.querySelector("#center_col #rso") ||
      document.querySelector("#search") ||
      document.querySelector("#center_col") ||
      document.querySelector("#main") ||
      document.querySelector("[role='main']")
    );
  }

  function uiMissing() {
    const root = resultsAnchor();
    if (!root) return true;
    if (!statusHost || !statusHost.isConnected || !root.contains(statusHost)) {
      return true;
    }
    return false;
  }

  function syncOwnedRefs() {
    if (statusHost && !statusHost.isConnected) statusHost = null;
    if (pinHost && !pinHost.isConnected) pinHost = null;
    // Recover refs if Google wiped the DOM but nodes with our ids were recreated
    // elsewhere, or stale globals point at detached shells.
    const liveStatus = document.getElementById("safeserp-status-host");
    if (liveStatus && isOwnedHost(liveStatus)) statusHost = liveStatus;
    const livePin = document.getElementById("safeserp-pin-host");
    if (livePin && isOwnedHost(livePin)) pinHost = livePin;
  }

  function placeAtTop(node) {
    const root = resultsAnchor();
    if (!root || !node) return;
    if (root.firstElementChild !== node) {
      root.insertBefore(node, root.firstChild);
    }
  }

  function placeAfter(node, afterNode) {
    const root = resultsAnchor();
    if (!root || !node) return;
    if (afterNode && afterNode.parentElement === root) {
      if (afterNode.nextElementSibling !== node) {
        afterNode.insertAdjacentElement("afterend", node);
      }
      return;
    }
    placeAtTop(node);
  }

  function insertStatus() {
    const root = resultsAnchor();
    if (!root) return;

    // Drop spoofed status nodes not created by us
    document.querySelectorAll("#safeserp-status-host").forEach((el) => {
      if (!isOwnedHost(el)) el.remove();
    });

    if (!statusHost || !isOwnedHost(statusHost) || !statusHost.isConnected) {
      statusHost = createShadowHost("safeserp-status-host");
    }

    const shadow = statusHost._safeserpShadow || statusHost.shadowRoot;
    if (!shadow) return;
    let box = shadow.querySelector(".status");
    if (!box) {
      box = document.createElement("div");
      box.className = "box status";
      shadow.appendChild(box);
    }
    box.textContent = "SafeSERP — sponsored ads blocked";
    placeAtTop(statusHost);
  }

  function insertOfficialPin(site) {
    document.querySelectorAll("#safeserp-pin-host").forEach((el) => {
      if (!isOwnedHost(el)) el.remove();
    });

    if (!site) {
      if (pinHost && pinHost.isConnected) pinHost.remove();
      pinHost = null;
      return null;
    }

    if (!pinHost || !isOwnedHost(pinHost) || !pinHost.isConnected) {
      pinHost = createShadowHost("safeserp-pin-host");
    }

    const shadow = pinHost._safeserpShadow || pinHost.shadowRoot;
    if (!shadow) return null;
    let pin = shadow.querySelector(".pin");
    if (!pin) {
      pin = document.createElement("div");
      pin.className = "box pin";
      shadow.appendChild(pin);
    }

    // Always rebuild contents so a compromised page cannot keep spoofed text
    while (pin.firstChild) pin.removeChild(pin.firstChild);

    const label = document.createElement("div");
    label.className = "pin-label";
    label.textContent = "Pinned official link — #1 safe result";

    const name = document.createElement("div");
    name.className = "pin-name";
    name.textContent = site.name + " (verified)";

    const link = document.createElement("a");
    link.className = "pin-link";
    link.href = site.canonical;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open " + site.canonical.replace(/^https:\/\//, "");

    const hint = document.createElement("div");
    hint.className = "pin-hint";
    hint.textContent =
      "SafeSERP pinned the official " +
      (site.type === "wallet"
        ? "wallet"
        : site.type === "cex"
          ? "exchange"
          : site.type === "dapp"
            ? "dapp"
            : "site") +
      " at the top. Unofficial lookalikes are hidden.";

    pin.appendChild(label);
    pin.appendChild(name);
    pin.appendChild(link);
    pin.appendChild(hint);

    placeAfter(pinHost, statusHost);
    return pinHost;
  }

  function shouldHideBrandResult(host, matchedSites) {
    const h = normalizeHost(host);
    if (!h || SAFE_STORE_HOSTS.has(h) || !matchedSites.length) return false;
    // Never hide the allowlisted official result — that gets a green verified badge.
    if (findSiteByHost(h)) return false;
    for (const site of matchedSites) {
      if (isLookalike(h, site)) return true;
    }
    return false;
  }

  function hideResultBlock(block) {
    if (!block || !block.isConnected) return;
    block.setAttribute("data-safeserp-hidden", "1");
    block.style.setProperty("display", "none", "important");
    block.style.setProperty("visibility", "hidden", "important");
    block.style.setProperty("height", "0", "important");
    block.style.setProperty("max-height", "0", "important");
    block.style.setProperty("overflow", "hidden", "important");
    block.style.setProperty("margin", "0", "important");
    block.style.setProperty("padding", "0", "important");
    block.style.setProperty("pointer-events", "none", "important");
    block.classList.remove("safeserp-result-verified", "safeserp-result-scam");
    block.querySelectorAll(".safeserp-badge-host, .safeserp-badge").forEach((el) => el.remove());
  }

  function clearHidden(block) {
    if (!block || block.getAttribute("data-safeserp-hidden") !== "1") return;
    block.removeAttribute("data-safeserp-hidden");
    [
      "display",
      "visibility",
      "height",
      "max-height",
      "overflow",
      "margin",
      "padding",
      "pointer-events",
    ].forEach((prop) => block.style.removeProperty(prop));
  }

  function resultHasIdentityChrome(block) {
    if (!block) return false;
    if (block.querySelector("cite")) return true;
    // Google favicon / site icon variants commonly used in organic results
    if (
      block.querySelector(
        "img[src*='favicon'], img[src*='gstatic.com/favicon'], img[src*='google.com/s2/favicons'], .XNo5Ab, .eqAnXb, .H9lube"
      )
    ) {
      return true;
    }
    return false;
  }

  function ensureVerifiedBadge(resultEl, site) {
    resultEl.querySelectorAll(":scope > .safeserp-badge-host").forEach((el) => {
      if (!isOwnedHost(el)) el.remove();
    });

    let host = null;
    for (const child of resultEl.children) {
      if (
        child.classList &&
        child.classList.contains("safeserp-badge-host") &&
        isOwnedHost(child)
      ) {
        host = child;
        break;
      }
    }

    const title = "Verified official — " + site.name;
    const subtitle = site.canonical.replace(/^https:\/\//, "");
    const desired = "verified|" + title + "|" + subtitle;

    if (!host) {
      host = document.createElement("div");
      host.className = "safeserp-badge-host";
      host.setAttribute("data-safeserp-owned", "1");
      ownedHosts.add(host);
      const shadow = host.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = SHADOW_STYLES;
      shadow.appendChild(style);
      host._safeserpShadow = shadow;
      resultEl.insertBefore(host, resultEl.firstChild);
    }

    const shadow = host._safeserpShadow || host.shadowRoot;
    if (!shadow) return;

    if (host.dataset.safeserpKey !== desired) {
      let badge = shadow.querySelector(".badge");
      if (!badge) {
        badge = document.createElement("div");
        shadow.appendChild(badge);
      }
      while (badge.firstChild) badge.removeChild(badge.firstChild);
      badge.className = "box badge badge-ok";
      const main = document.createElement("div");
      main.textContent = title;
      badge.appendChild(main);
      const sub = document.createElement("div");
      sub.className = "badge-sub";
      sub.textContent = subtitle;
      badge.appendChild(sub);
      host.dataset.safeserpKey = desired;
    }

    resultEl.classList.remove("safeserp-result-scam");
    resultEl.classList.add("safeserp-result-verified");
  }

  function scoreOfficialResult(host, site) {
    const h = normalizeHost(host);
    let canon = "";
    try {
      canon = normalizeHost(new URL(site.canonical).hostname);
    } catch {
      canon = "";
    }
    if (h === canon) return 100;
    if (site.domains.some((d) => hostMatchesDomain(h, d))) return 50;
    return 0;
  }

  function faviconUrlForSite(site) {
    let host = "";
    try {
      host = new URL(site.canonical).hostname;
    } catch {
      host = site.domains[0] || "";
    }
    return (
      "https://www.google.com/s2/favicons?domain=" +
      encodeURIComponent(host) +
      "&sz=64"
    );
  }

  function removeSyntheticResult() {
    document.querySelectorAll("#safeserp-synthetic-result").forEach((el) => el.remove());
  }

  function insertSyntheticVerifiedResult(site) {
    removeSyntheticResult();
    if (!site) return null;

    const card = document.createElement("div");
    card.id = "safeserp-synthetic-result";
    card.className = "safeserp-result-verified safeserp-synthetic-result";
    card.setAttribute("data-safeserp-owned", "1");
    ownedHosts.add(card);

    // Reuse the same verified badge strip
    ensureVerifiedBadge(card, site);

    const row = document.createElement("div");
    row.className = "safeserp-synthetic-row";

    const img = document.createElement("img");
    img.className = "safeserp-synthetic-favicon";
    img.alt = "";
    img.width = 28;
    img.height = 28;
    img.referrerPolicy = "no-referrer";
    img.src = faviconUrlForSite(site);

    const meta = document.createElement("div");
    meta.className = "safeserp-synthetic-meta";

    const siteName = document.createElement("div");
    siteName.className = "safeserp-synthetic-sitename";
    siteName.textContent = site.name;

    const urlLine = document.createElement("div");
    urlLine.className = "safeserp-synthetic-url";
    urlLine.textContent = site.canonical;

    meta.appendChild(siteName);
    meta.appendChild(urlLine);
    row.appendChild(img);
    row.appendChild(meta);

    const title = document.createElement("a");
    title.className = "safeserp-synthetic-title";
    title.href = site.canonical;
    title.target = "_blank";
    title.rel = "noopener noreferrer";
    title.textContent = site.name;

    const snippet = document.createElement("div");
    snippet.className = "safeserp-synthetic-snippet";
    snippet.textContent =
      "Official allowlisted " +
      (site.type === "wallet"
        ? "wallet"
        : site.type === "cex"
          ? "exchange"
          : site.type === "dapp"
            ? "dapp"
            : "site") +
      " — open this URL only.";

    card.appendChild(row);
    card.appendChild(title);
    card.appendChild(snippet);

    placeAfter(card, pinHost || statusHost);
    return card;
  }

  function verifyResults() {
    if (!registry) return;
    const query = getQuery();
    const matchedSites = findSitesByQuery(query);
    const primary = primarySiteForQuery(query);

    insertOfficialPin(primary);

    const blocks = getResultBlocks();
    const bestBySite = new Map();

    for (const block of blocks) {
      if (block.id === "safeserp-synthetic-result") continue;
      const host = extractHostFromResult(block);
      if (!host) continue;

      const official = findSiteByHost(host);
      if (official) {
        clearHidden(block);
        const score = scoreOfficialResult(host, official);
        // Prefer organic cards that still show Google's logo + URL chrome
        const identityBonus = resultHasIdentityChrome(block) ? 25 : 0;
        const total = score + identityBonus;
        const prev = bestBySite.get(official.id);
        if (!prev || total > prev.score) {
          bestBySite.set(official.id, {
            block,
            score: total,
            host,
            site: official,
            hasIdentity: identityBonus > 0,
          });
        }
        continue;
      }

      if (block.getAttribute("data-safeserp-hidden") === "1") continue;

      if (matchedSites.length && shouldHideBrandResult(host, matchedSites)) {
        hideResultBlock(block);
      }
    }

    const verifiedBlocks = new Set();

    if (primary && bestBySite.has(primary.id) && bestBySite.get(primary.id).hasIdentity) {
      const best = bestBySite.get(primary.id);
      verifiedBlocks.add(best.block);
      ensureVerifiedBadge(best.block, best.site);
      removeSyntheticResult();
    } else if (primary) {
      // No full organic card (wrong TLD, sitelinks-only, or missing host).
      // Inject a verified card with logo + URL so every brand matches PancakeSwap.
      insertSyntheticVerifiedResult(primary);
    } else {
      removeSyntheticResult();
    }

    for (const { block, site } of bestBySite.values()) {
      if (verifiedBlocks.has(block)) continue;
      if (!matchedSites.some((s) => s.id === site.id)) continue;
      // Avoid double cards when primary already has organic or synthetic
      if (primary && site.id === primary.id) continue;
      verifiedBlocks.add(block);
      ensureVerifiedBadge(block, site);
    }

    for (const block of blocks) {
      if (block.id === "safeserp-synthetic-result") continue;
      if (verifiedBlocks.has(block)) continue;
      if (block.classList.contains("safeserp-result-verified")) {
        block.classList.remove("safeserp-result-verified");
        block.querySelectorAll(":scope > .safeserp-badge-host").forEach((el) => el.remove());
      }
    }

    document.querySelectorAll(".safeserp-result-scam").forEach((el) => {
      el.classList.remove("safeserp-result-scam");
    });
  }

  function observeRoot() {
    // Always watch a long-lived node. Google's "People also search" / entity
    // carousels replace #center_col / #rso via SPA navigation; observing those
    // alone leaves the MutationObserver stuck on a detached tree and SafeSERP dies.
    return document.documentElement || document.body;
  }

  function ensureObserver() {
    const root = observeRoot();
    if (!root) return;
    if (!observer) {
      observer = new MutationObserver(() => {
        if (mutating) return;
        scheduleRun(false);
      });
    }
    if (observeTarget !== root || !observeTarget || !observeTarget.isConnected) {
      try {
        observer.disconnect();
      } catch {
        /* ignore */
      }
      observeTarget = root;
      observer.observe(observeTarget, { childList: true, subtree: true });
    }
  }

  function scheduleRun(force) {
    if (force) scheduleRun._force = true;
    // Coalesce SPA / mutation bursts; keep any pending force flag.
    if (scheduleRun._timer) return;
    const urgent = !!scheduleRun._force;
    scheduleRun._timer = setTimeout(() => {
      scheduleRun._timer = 0;
      const f = !!scheduleRun._force;
      scheduleRun._force = false;
      run(f);
    }, urgent ? 0 : 50);
  }

  function run(force) {
    if (mutating) return;
    const now = Date.now();
    const href = location.href;
    const hrefChanged = href !== lastHref;
    if (!force && !hrefChanged && now - lastRun < 180) return;
    lastRun = now;
    lastHref = href;

    mutating = true;
    try {
      if (observer) observer.disconnect();
      syncOwnedRefs();
      removeAds();
      insertStatus();
      verifyResults();
    } catch (err) {
      console.error("[SafeSERP] run failed", err);
    } finally {
      mutating = false;
      ensureObserver();
    }
  }

  function hookSpaNavigation() {
    const bump = () => scheduleRun(true);

    window.addEventListener("popstate", bump);
    window.addEventListener("hashchange", bump);
    window.addEventListener("pageshow", bump);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") bump();
    });

    // Google search uses history.pushState / replaceState for tile carousels
    // ("People also search for") without a full reload.
    const wrap = (fnName) => {
      const orig = history[fnName];
      if (typeof orig !== "function" || orig.__safeserpWrapped) return;
      const wrapped = function () {
        const ret = orig.apply(this, arguments);
        bump();
        return ret;
      };
      wrapped.__safeserpWrapped = true;
      history[fnName] = wrapped;
    };
    try {
      wrap("pushState");
      wrap("replaceState");
    } catch {
      /* some environments freeze history */
    }

    // Safety net: if Google wiped our UI or SPA nav was missed, reinject.
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (mutating) return;
      if (location.href !== lastHref || uiMissing()) {
        scheduleRun(true);
      }
    }, 1000);
  }

  function boot(data) {
    registry = sanitizeSites(data);
    lastHref = location.href;

    const start = () => {
      ensureObserver();
      hookSpaNavigation();
      run(true);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
    setTimeout(() => scheduleRun(true), 500);
    setTimeout(() => scheduleRun(true), 1500);
    setTimeout(() => scheduleRun(true), 3000);
  }

  const runtime =
    typeof browser !== "undefined" && browser.runtime
      ? browser.runtime
      : typeof chrome !== "undefined"
        ? chrome.runtime
        : null;

  // Prefer embedded registry (no network / WAR). Fetch is a fallback only.
  const embedded =
    typeof self !== "undefined" && self.__SAFESERP_REGISTRY__
      ? self.__SAFESERP_REGISTRY__
      : null;

  if (embedded && Array.isArray(embedded.sites) && embedded.sites.length) {
    boot(embedded);
  } else if (runtime && runtime.getURL) {
    fetch(runtime.getURL("data/verified-sites.json"))
      .then((r) => r.json())
      .then(boot)
      .catch((err) => {
        console.error("[SafeSERP] failed to load registry", err);
        boot({ version: 0, sites: [] });
      });
  } else {
    console.warn("[SafeSERP] registry unavailable");
    boot({ version: 0, sites: [] });
  }
})();
