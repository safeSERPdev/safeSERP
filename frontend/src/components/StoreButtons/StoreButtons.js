import chromeLogo from "../../assets/browsers/chrome.svg";
import firefoxLogo from "../../assets/browsers/firefox.svg";
import braveLogo from "../../assets/browsers/brave.svg";
import edgeLogo from "../../assets/browsers/edge.svg";
import operaLogo from "../../assets/browsers/opera.svg";
import "./StoreButtons.css";

const STORES = [
  {
    id: "chrome",
    name: "Chrome",
    store: "Chrome Web Store",
    logo: chromeLogo,
  },
  {
    id: "firefox",
    name: "Firefox",
    store: "Firefox Add-ons",
    logo: firefoxLogo,
  },
  {
    id: "brave",
    name: "Brave",
    store: "Chrome Web Store",
    logo: braveLogo,
  },
  {
    id: "edge",
    name: "Edge",
    store: "Edge Add-ons",
    logo: edgeLogo,
  },
  {
    id: "opera",
    name: "Opera",
    store: "Opera Add-ons",
    logo: operaLogo,
  },
];

function StoreButtons({ className = "" }) {
  return (
    <div className={`stores ${className}`.trim()} role="list">
      {STORES.map((store) => (
        <button
          key={store.id}
          type="button"
          className={`stores__btn stores__btn--${store.id}`}
          disabled
          aria-disabled="true"
          title={`${store.store} — coming soon`}
          role="listitem"
        >
          <img
            className="stores__logo"
            src={store.logo}
            alt=""
            width={20}
            height={20}
          />
          <span className="stores__text">
            <span className="stores__name">{store.name}</span>
            <span className="stores__soon">Soon</span>
          </span>
        </button>
      ))}
    </div>
  );
}

export default StoreButtons;
