import "./Privacy.css";

function Privacy() {
  return (
    <main className="privacy">
      <div className="privacy__inner">
        <p className="privacy__eyebrow">SafeSERP</p>
        <h1 className="privacy__title">Privacy policy</h1>
        <p className="privacy__updated">Last updated: August 7, 2026</p>

        <p>
          SafeSERP is a browser extension and website that helps you avoid
          sponsored phishing links on Google Search. This page explains what we
          do — and do not — collect.
        </p>

        <h2>What we collect</h2>
        <p>
          <strong>Nothing.</strong> The extension does not create accounts, does
          not use analytics, does not sell data, and does not send your search
          queries or browsing history to our servers.
        </p>

        <h2>How the extension works</h2>
        <ul>
          <li>
            Content scripts run only on Google Search result pages listed in the
            extension manifest.
          </li>
          <li>
            Official sites are matched against a public allowlist bundled inside
            the extension (
            <code>extension/data/verified-sites.json</code>).
          </li>
          <li>
            Matching and UI injection happen locally in your browser.
          </li>
          <li>
            When Google does not show a clear official result, the extension may
            load a favicon image from Google’s public favicon service so the
            pinned card can display a logo. That is an image request only — not
            remote code.
          </li>
        </ul>

        <h2>Website</h2>
        <p>
          This marketing site is a static page. We do not run accounts or
          tracking pixels as part of SafeSERP’s product. Hosting providers may
          log standard technical request data (as with any website).
        </p>

        <h2>Contact</h2>
        <p>
          Questions:{" "}
          <a href="mailto:safeserp@gmail.com">safeserp@gmail.com</a>
        </p>

        <p className="privacy__back">
          <a href="/">← Back to SafeSERP</a>
        </p>
      </div>
    </main>
  );
}

export default Privacy;
