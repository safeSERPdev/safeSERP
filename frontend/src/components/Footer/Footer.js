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
          Allowlist only — unknown sites are never marked safe. Official DEXs and
          wallets live in <code>extension/data/verified-sites.json</code>.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
