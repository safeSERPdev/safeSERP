import logo from "../../assets/safeSERP2.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__brand">
          <img className="footer__logo" src={logo} alt="" />
          <span>SafeSERP</span>
        </p>
        <p className="footer__copy">
          Open-source allowlist — every verified DEX, CEX, dapp, and wallet URL
          is public in the repo. Anyone can audit it; unknown sites are never
          marked safe.
        </p>
        <p className="footer__links">
          <a
            href="https://github.com/safeSERPdev/safeSERP"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="footer__sep" aria-hidden="true">
            ·
          </span>
          <a
            href="https://github.com/safeSERPdev/safeSERP/blob/main/extension/data/verified-sites.json"
            target="_blank"
            rel="noopener noreferrer"
          >
            View whitelist
          </a>
          <span className="footer__sep" aria-hidden="true">
            ·
          </span>
          <a href="/privacy">Privacy</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
