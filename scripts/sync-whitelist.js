const fs = require("fs");

const data = JSON.parse(
  fs.readFileSync("extension/data/verified-sites.json", "utf8")
);

fs.writeFileSync(
  "extension/data/registry.js",
  "/* auto-synced allowlist — edit verified-sites.json */\nself.__SAFESERP_REGISTRY__ = " +
    JSON.stringify(data, null, 2) +
    ";\n"
);

function row(s) {
  return (
    "| " +
    s.name +
    " | " +
    s.canonical +
    " | " +
    s.domains.map((d) => "`" + d + "`").join(", ") +
    " |"
  );
}

function table(title, filter) {
  const sites = data.sites.filter(filter);
  if (!sites.length) return "";
  return (
    "### " +
    title +
    "\n\n| Name | Official URL | Verified domains |\n| --- | --- | --- |\n" +
    sites.map(row).join("\n") +
    "\n\n"
  );
}

let md = fs.readFileSync("README.md", "utf8");
const start = md.indexOf("## Open verified whitelist");
const end = md.indexOf("## What it does");
if (start < 0 || end < 0) throw new Error("README markers missing");

const header =
  "## Open verified whitelist\n\n" +
  "Source of truth (machine-readable): [`extension/data/verified-sites.json`](extension/data/verified-sites.json)\n\n" +
  "Anyone can audit this list, propose additions via PR, or fork it. Unknown sites are never marked safe — **allowlist only**.\n\n";

const body =
  table("Centralized exchanges", (s) => s.type === "cex") +
  table("Market data & trackers", (s) => s.type === "tracker") +
  table("Ethereum / EVM DEXs", (s) => s.type === "dex" && s.chain === "eth") +
  table("Ethereum / EVM dapps", (s) => s.type === "dapp" && s.chain === "eth") +
  table("Solana DEXs", (s) => s.type === "dex" && s.chain === "sol") +
  table("Solana dapps", (s) => s.type === "dapp" && s.chain === "sol") +
  table(
    "Bitcoin / cross-chain",
    (s) =>
      s.type === "cross" ||
      (s.chain === "btc" && (s.type === "dex" || s.type === "dapp"))
  ) +
  table("Wallets", (s) => s.type === "wallet");

md = md.slice(0, start) + header + body + md.slice(end);
fs.writeFileSync("README.md", md);
console.log("Synced registry + README for", data.sites.length, "sites");
