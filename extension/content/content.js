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
  ].join(",");

  const SPONSORED_LABELS = [
    "sponsored",
    "annonces",
    "anzeige",
    "anzeigen",
    "anuncio",
    "anuncios",
    "annuncio",
    "reklama",
    "reklam",
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

  let registry = null;
  let lastRun = 0;
  let observer = null;
  let mutating = false;

  function normalizeHost(hostname) {
    if (!hostname) return "";
    return String(hostname).toLowerCase().replace(/^www\./, "");
  }

  /** Exact host match against listed domains only (no auto-subdomain expansion). */
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

  function findSitesByQuery(query) {
    if (!registry) return [];
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return registry.sites.filter((site) =>
      site.keywords.some((kw) => q.includes(kw.toLowerCase()))
    );
  }

  function canonicalHost(site) {
    try {
      return normalizeHost(new URL(site.canonical).hostname);
    } catch {
      return normalizeHost(site.domains[0] || "");
    }
  }

  function isLookalike(host, site) {
    const h = normalizeHost(host);
    if (!h || SAFE_STORE_HOSTS.has(h)) return false;
    if (findSiteByHost(h)) return false;

    const base = (h.split(".")[0] || "").replace(/[^a-z0-9]/g, "");
    const brandTokens = [
      site.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      ...site.keywords.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, "")),
    ].filter((t) => t.length >= 4);

    for (const token of brandTokens) {
      if (base.includes(token)) return true;
      if (Math.abs(base.length - token.length) <= 2 && levenshtein(base, token) <= 2) {
        return true;
      }
    }

    const knownFakes = [
      "unlswap",
      "uniswap-",
      "metamask-",
      "meta-mask",
      "juplter",
      "phantom-",
      "rayd1um",
      "app-uniswap",
      "uniswapapp",
      "metamaskapp",
      "claim-",
      "airdrop-",
    ];
    for (const fake of knownFakes) {
      if (h.includes(fake) || base.includes(fake.replace(/-$/, ""))) return true;
    }

    return false;
  }

  function removeAds() {
    document.querySelectorAll(AD_SELECTORS).forEach((el) => {
      if (el && el.isConnected) el.remove();
    });

    document.querySelectorAll("#tads, #tadsb, #bottomads, #tvcap, [data-text-ad]").forEach((el) => {
      if (el && el.isConnected) el.remove();
    });

    // Targeted sponsored-label cleanup (avoid scanning every div repeatedly)
    document.querySelectorAll("#rso span, #tads span, #center_col span").forEach((node) => {
      const text = (node.textContent || "").trim().toLowerCase();
      if (!text || text.length > 20) return;
      if (!SPONSORED_LABELS.some((l) => text === l)) return;
      const block = node.closest("#tads, #tadsb, #bottomads, #tvcap, [data-text-ad]");
      if (block && block.isConnected) block.remove();
    });
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
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("http")) continue;
      try {
        const u = new URL(href);
        if (u.hostname.includes("google.")) continue;
        return normalizeHost(u.hostname);
      } catch {
        /* skip */
      }
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
      // Skip nested result wrappers so one SERP card is not processed twice
      if (el.parentElement && el.parentElement.closest(".g, [data-sokoban-container]")) {
        const nestedParent = el.parentElement.closest(".g, [data-sokoban-container]");
        if (nestedParent && nestedParent !== el && nestedParent.querySelector("a h3, h3")) {
          return;
        }
      }
      seen.add(el);
      candidates.push(el);
    };

    document.querySelectorAll("#rso .g, #search .g").forEach(push);
    if (!candidates.length) {
      document.querySelectorAll("#rso a h3").forEach((h3) => {
        push(h3.closest(".g") || h3.closest("div[data-hveid]"));
      });
    }

    return candidates;
  }

  function ensureBadge(resultEl, kind, title, subtitle) {
    const existing = resultEl.querySelector(":scope > .safeserp-badge");
    const desired = kind + "|" + title + "|" + (subtitle || "");
    if (existing && existing.dataset.safeserpKey === desired) {
      resultEl.classList.add(
        kind === "verified" ? "safeserp-result-verified" : "safeserp-result-scam"
      );
      return;
    }
    if (existing) existing.remove();
    resultEl.querySelectorAll(".safeserp-badge").forEach((b) => b.remove());

    const badge = document.createElement("div");
    badge.className =
      "safeserp-badge " +
      (kind === "verified" ? "safeserp-badge-verified" : "safeserp-badge-scam");
    badge.setAttribute("data-safeserp", kind);
    badge.dataset.safeserpKey = desired;

    const main = document.createElement("div");
    main.textContent = title;
    badge.appendChild(main);

    if (subtitle) {
      const sub = document.createElement("div");
      sub.className = "safeserp-badge-sub";
      sub.textContent = subtitle;
      badge.appendChild(sub);
    }

    // Insert as direct child of the result card — never inside Google's <a>/h3 wrappers
    // (those containers can inherit transforms that flip text).
    resultEl.insertBefore(badge, resultEl.firstChild);

    resultEl.classList.remove("safeserp-result-verified", "safeserp-result-scam");
    resultEl.classList.add(
      kind === "verified" ? "safeserp-result-verified" : "safeserp-result-scam"
    );
  }

  function resultsRoot() {
    return (
      document.querySelector("#rso") ||
      document.querySelector("#search") ||
      document.querySelector("#center_col") ||
      document.querySelector("#main")
    );
  }

  function pinNodeToTop(node, afterNode) {
    const root = resultsRoot();
    if (!root || !node) return;

    if (afterNode && afterNode.parentElement === root) {
      if (afterNode.nextElementSibling !== node) {
        afterNode.insertAdjacentElement("afterend", node);
      }
      return;
    }

    // Keep status strip above everything if it lives in the same root
    const status = document.getElementById("safeserp-status");
    if (status && status.parentElement === root) {
      if (status.nextElementSibling !== node) {
        status.insertAdjacentElement("afterend", node);
      }
      return;
    }

    if (root.firstElementChild !== node) {
      root.insertBefore(node, root.firstChild);
    }
  }

  function insertStatus() {
    const root =
      document.querySelector("#center_col") ||
      document.querySelector("#search") ||
      document.querySelector("#main");
    if (!root) return;

    let el = document.getElementById("safeserp-status");
    if (!el) {
      el = document.createElement("div");
      el.id = "safeserp-status";
      el.textContent = "SafeSERP — sponsored ads blocked";
    }
    if (root.firstElementChild !== el) {
      root.insertBefore(el, root.firstChild);
    }
  }

  function insertOfficialBanner(sites) {
    const existing = document.getElementById("safeserp-official-banner");
    if (!sites.length) {
      if (existing) existing.remove();
      return null;
    }

    const primary = sites[0];
    const key = primary.id + "|" + primary.canonical;
    let banner = existing;

    if (!banner || banner.dataset.safeserpKey !== key) {
      if (banner) banner.remove();

      banner = document.createElement("div");
      banner.id = "safeserp-official-banner";
      banner.dataset.safeserpKey = key;

      const label = document.createElement("div");
      label.className = "safeserp-banner-label";
      label.textContent = "Pinned official link — #1 safe result";

      const name = document.createElement("div");
      name.className = "safeserp-banner-name";
      name.textContent = primary.name + " (verified)";

      const link = document.createElement("a");
      link.className = "safeserp-banner-link";
      link.href = primary.canonical;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open " + primary.canonical.replace(/^https?:\/\//, "");

      const hint = document.createElement("div");
      hint.className = "safeserp-banner-hint";
      hint.textContent =
        "SafeSERP moved the official " +
        (primary.type === "wallet" ? "wallet" : "site") +
        " to the top so you don’t click a sponsored fake.";

      banner.appendChild(label);
      banner.appendChild(name);
      banner.appendChild(link);
      banner.appendChild(hint);
    }

    // Always re-assert top placement (Google re-renders the SERP often)
    pinNodeToTop(banner);
    return banner;
  }

  function pinVerifiedResultToTop(block, afterBanner) {
    if (!block || !block.isConnected) return;
    pinNodeToTop(block, afterBanner || document.getElementById("safeserp-official-banner"));
  }

  function scoreOfficialResult(host, site) {
    const h = normalizeHost(host);
    const canon = canonicalHost(site);
    if (h === canon) return 100;
    if (site.domains.some((d) => hostMatchesDomain(h, d))) return 50;
    return 0;
  }

  function verifyResults() {
    if (!registry) return;
    const query = getQuery();
    const matchedSites = findSitesByQuery(query);
    const banner = insertOfficialBanner(matchedSites);

    const blocks = getResultBlocks();
    const bestBySite = new Map(); // siteId -> { block, score, host }

    for (const block of blocks) {
      const host = extractHostFromResult(block);
      if (!host) continue;

      const official = findSiteByHost(host);
      if (official) {
        const score = scoreOfficialResult(host, official);
        const prev = bestBySite.get(official.id);
        if (!prev || score > prev.score) {
          bestBySite.set(official.id, { block, score, host, site: official });
        }
      }
    }

    const verifiedBlocks = new Set();
    // Prefer pinning the primary query match's official result to #1
    const primary = matchedSites[0];
    let primaryPinned = false;

    if (primary && bestBySite.has(primary.id)) {
      const best = bestBySite.get(primary.id);
      verifiedBlocks.add(best.block);
      ensureBadge(
        best.block,
        "verified",
        "Verified official — " + best.site.name,
        best.site.canonical.replace(/^https?:\/\//, "")
      );
      pinVerifiedResultToTop(best.block, banner);
      primaryPinned = true;
    }

    for (const { block, site } of bestBySite.values()) {
      if (verifiedBlocks.has(block)) continue;
      verifiedBlocks.add(block);
      ensureBadge(
        block,
        "verified",
        "Verified official — " + site.name,
        site.canonical.replace(/^https?:\/\//, "")
      );
      // Only auto-move the primary brand match; don't reshuffle every match
      if (!primaryPinned && matchedSites.some((s) => s.id === site.id)) {
        pinVerifiedResultToTop(block, banner);
        primaryPinned = true;
      }
    }

    // Clear stale verified styling from non-winning duplicates
    for (const block of blocks) {
      if (verifiedBlocks.has(block)) continue;
      if (block.classList.contains("safeserp-result-verified")) {
        block.classList.remove("safeserp-result-verified");
        block.querySelectorAll(".safeserp-badge-verified").forEach((b) => b.remove());
      }
    }

    for (const block of blocks) {
      if (verifiedBlocks.has(block)) continue;
      const host = extractHostFromResult(block);
      if (!host || SAFE_STORE_HOSTS.has(host)) continue;

      let lookalikeSite = null;
      for (const site of matchedSites) {
        if (isLookalike(host, site)) {
          lookalikeSite = site;
          break;
        }
      }

      if (lookalikeSite) {
        ensureBadge(
          block,
          "scam",
          "Warning — not official",
          "Use " + lookalikeSite.canonical.replace(/^https?:\/\//, "")
        );
      }
    }
  }

  function run() {
    if (mutating) return;
    const now = Date.now();
    if (now - lastRun < 200) return;
    lastRun = now;

    mutating = true;
    try {
      if (observer) observer.disconnect();
      removeAds();
      insertStatus();
      verifyResults();
    } finally {
      mutating = false;
      if (observer && document.documentElement) {
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      }
    }
  }

  function boot(data) {
    registry = data;
    const start = () => {
      run();
      observer = new MutationObserver(() => run());
      if (document.documentElement) {
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
    setTimeout(run, 500);
    setTimeout(run, 1500);
  }

  const runtime =
    typeof browser !== "undefined" && browser.runtime
      ? browser.runtime
      : typeof chrome !== "undefined"
        ? chrome.runtime
        : null;

  if (!runtime || !runtime.getURL) {
    console.warn("[SafeSERP] runtime API unavailable");
    return;
  }

  fetch(runtime.getURL("data/verified-sites.json"))
    .then((r) => r.json())
    .then(boot)
    .catch((err) => {
      console.error("[SafeSERP] failed to load registry", err);
      boot({ version: 0, sites: [] });
    });
})();
