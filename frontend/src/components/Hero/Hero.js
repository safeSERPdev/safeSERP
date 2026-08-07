import logo from "../../assets/safeSERP2.png";
import "./Hero.css";

function Hero() {
  return (
    <header className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <p className="hero__brand">
        <img className="hero__logo" src={logo} alt="" />
        <span>SafeSERP</span>
      </p>
      <h1 className="hero__title">
        Sponsored Google ads drain crypto wallets.
        <span> We hide them — and pin the real site first.</span>
      </h1>
      <p className="hero__sub">
        A one-job desktop extension for Chrome, Edge, Brave, and Firefox.
        Blocks sponsored results, pins the official DEX, exchange, dapp, or
        wallet link to the top of Google Search, and hides lookalike scams.
      </p>
      <div className="hero__actions">
        <a
          className="hero__cta"
          href="/safeserp-extension.zip"
          download="safeserp-extension.zip"
        >
          Download extension
        </a>
        <a className="hero__cta hero__cta--ghost" href="#install">
          Install steps
        </a>
      </div>

      <div className="hero__demo" aria-hidden="true">
        <div className="gserp">
          <div className="gserp__top">
            <div className="gserp__logo" aria-hidden="true">
              <span>G</span>
              <span>o</span>
              <span>o</span>
              <span>g</span>
              <span>l</span>
              <span>e</span>
            </div>
            <div className="gserp__search">
              <span className="gserp__query">uniswap</span>
              <span className="gserp__search-icons">✕ 🔍</span>
            </div>
          </div>

          <nav className="gserp__tabs">
            <span className="gserp__tab">AI Mode</span>
            <span className="gserp__tab gserp__tab--active">All</span>
            <span className="gserp__tab">News</span>
            <span className="gserp__tab">Videos</span>
            <span className="gserp__tab">Images</span>
            <span className="gserp__tab">Forums</span>
            <span className="gserp__tab">Shopping</span>
            <span className="gserp__tab">More</span>
            <span className="gserp__tab gserp__tab--tools">Tools</span>
          </nav>

          <div className="gserp__body">
            <div className="gserp__status">SafeSERP — sponsored ads blocked</div>

            <div className="gserp__pin">
              <div className="gserp__pin-label">
                Pinned official link — #1 safe result
              </div>
              <div className="gserp__pin-name">Uniswap (verified)</div>
              <div className="gserp__pin-btn">Open app.uniswap.org</div>
              <div className="gserp__pin-hint">
                SafeSERP moved the official site to the top so you don’t click a
                sponsored fake.
              </div>
            </div>

            <div className="gserp__verified">
              <div className="gserp__badge">
                Verified official — Uniswap
                <span>app.uniswap.org</span>
              </div>
              <div className="gserp__result-head">
                <div className="gserp__favicon" />
                <div>
                  <div className="gserp__site">Uniswap Interface</div>
                  <div className="gserp__url">https://app.uniswap.org</div>
                </div>
              </div>
              <div className="gserp__title">Uniswap Interface</div>
              <div className="gserp__snippet">
                Swap crypto on Ethereum, Base, Arbitrum, Polygon, Unichain and
                more. The DeFi platform trusted by millions.
              </div>
            </div>

            <ul className="gserp__sitelinks">
              <li>
                <span>Uniswap app</span>
                <em>Swap crypto on Ethereum, Base, Arbitrum, Polygon, Unichain …</em>
              </li>
              <li>
                <span>Uniswap Pools</span>
                <em>Swap crypto on Ethereum, Base, Arbitrum, Polygon, Unichain …</em>
              </li>
              <li>
                <span>Uniswap pools explorer</span>
                <em>Explore liquidity pools across supported networks.</em>
              </li>
              <li>
                <span>Buy</span>
                <em>Swap crypto on Ethereum, Base, Arbitrum, Polygon, Unichain …</em>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
