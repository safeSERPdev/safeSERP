import logo from "../../assets/safeSERP2.png";
import uniswapLogo from "../../assets/logos/uniswap.png";
import trezorLogo from "../../assets/logos/trezor.png";
import {
  EXTENSION_VERSION,
  EXTENSION_ZIP_NAME,
  EXTENSION_ZIP_URL,
} from "../../extensionVersion";
import GserpDemo from "../GserpDemo/GserpDemo";
import StoreButtons from "../StoreButtons/StoreButtons";
import "./Hero.css";

const UNISWAP_DEMO = {
  query: "uniswap",
  name: "Uniswap",
  host: "app.uniswap.org",
  canonical: "https://app.uniswap.org",
  title: "Uniswap Interface",
  snippet:
    "Swap crypto on Ethereum, Base, Arbitrum, Polygon, Unichain and more. The DeFi platform trusted by millions.",
  faviconSrc: uniswapLogo,
  sitelinks: [
    {
      label: "Uniswap app",
      desc: "Swap crypto on Ethereum, Base, Arbitrum…",
    },
    {
      label: "Uniswap Pools",
      desc: "Explore liquidity pools across networks.",
    },
  ],
};

const TREZOR_DEMO = {
  query: "trezor",
  name: "Trezor",
  host: "trezor.io",
  canonical: "https://trezor.io",
  title: "Trezor Hardware Wallet",
  snippet:
    "The original hardware wallet. Keep your crypto safe offline with Trezor — official site only.",
  faviconSrc: trezorLogo,
  sitelinks: [
    {
      label: "Shop Trezor",
      desc: "Buy the official Trezor hardware wallet.",
    },
    {
      label: "Trezor Suite",
      desc: "Manage your coins in the official app.",
    },
  ],
};

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
        <span> We hide them — and pin the real site.</span>
      </h1>
      <p className="hero__sub">
        A one-job desktop extension for Chrome, Edge, Brave, and Firefox.
        Blocks sponsored results, pins the official DEX, exchange, dapp, or
        wallet link to the top of Google Search, and hides lookalike scams.
      </p>
      <div className="hero__actions">
        <a
          className="hero__cta"
          href={EXTENSION_ZIP_URL}
          download={EXTENSION_ZIP_NAME}
        >
          Download v{EXTENSION_VERSION}
        </a>
        <StoreButtons />
        <a className="hero__cta hero__cta--ghost" href="#install">
          Install steps
        </a>
      </div>

      <div className="hero__demo" aria-hidden="true">
        <GserpDemo {...UNISWAP_DEMO} />
        <GserpDemo {...TREZOR_DEMO} />
      </div>
    </header>
  );
}

export default Hero;
