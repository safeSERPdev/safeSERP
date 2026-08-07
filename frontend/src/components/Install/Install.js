import {
  EXTENSION_VERSION,
  EXTENSION_ZIP_NAME,
  EXTENSION_ZIP_URL,
} from "../../extensionVersion";
import "./Install.css";

const BROWSERS = [
  {
    name: "Chrome",
    path: "chrome://extensions",
    steps:
      "Unzip the download → chrome://extensions → Developer mode → Load unpacked → select the unzipped folder (the one that contains manifest.json).",
  },
  {
    name: "Edge",
    path: "edge://extensions",
    steps:
      "Unzip the download → edge://extensions → Developer mode → Load unpacked → select the unzipped folder (contains manifest.json).",
  },
  {
    name: "Brave",
    path: "brave://extensions",
    steps:
      "Unzip the download → brave://extensions → Developer mode → Load unpacked → select the unzipped folder (contains manifest.json).",
  },
  {
    name: "Firefox",
    path: "about:debugging",
    steps:
      "Unzip the download → about:debugging#/runtime/this-firefox → Load Temporary Add-on → select manifest.json inside the unzipped folder.",
  },
];

function Install() {
  return (
    <section className="install" id="install">
      <div className="install__inner">
        <h2 className="install__title">Install on any desktop browser</h2>
        <p className="install__lead">
          <a
            className="install__download"
            href={EXTENSION_ZIP_URL}
            download={EXTENSION_ZIP_NAME}
          >
            Download SafeSERP v{EXTENSION_VERSION} (.zip)
          </a>
          {" — "}
          unzip it, then load that folder in your browser. Opera and Vivaldi use
          the same Chromium flow.
        </p>
        <div className="install__grid">
          {BROWSERS.map((browser) => (
            <article key={browser.name} className="install__card">
              <h3>{browser.name}</h3>
              <p className="install__path">{browser.path}</p>
              <p>{browser.steps}</p>
            </article>
          ))}
        </div>
        <p className="install__note">
          After loading, search Google for something like <code>uniswap</code>,{" "}
          <code>binance</code>, or <code>metamask</code>. Sponsored ads should
          disappear, a pinned official link should sit at the top, and the real
          result should show a verified label.
        </p>
      </div>
    </section>
  );
}

export default Install;
