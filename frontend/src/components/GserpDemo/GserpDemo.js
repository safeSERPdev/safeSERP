import "./GserpDemo.css";

function GserpDemo({
  query,
  name,
  host,
  canonical,
  title,
  snippet,
  sitelinks,
  faviconSrc,
}) {
  return (
    <div className="gserp gserp--compact">
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
          <span className="gserp__query">{query}</span>
          <span className="gserp__search-icons">✕ 🔍</span>
        </div>
      </div>

      <nav className="gserp__tabs">
        <span className="gserp__tab">AI Mode</span>
        <span className="gserp__tab gserp__tab--active">All</span>
        <span className="gserp__tab">Images</span>
        <span className="gserp__tab">News</span>
        <span className="gserp__tab gserp__tab--tools">Tools</span>
      </nav>

      <div className="gserp__body">
        <div className="gserp__status">SafeSERP — sponsored ads blocked</div>

        <div className="gserp__pin">
          <div className="gserp__pin-label">
            Pinned official link — #1 safe result
          </div>
          <div className="gserp__pin-name">{name} (verified)</div>
          <div className="gserp__pin-btn">Open {host}</div>
          <div className="gserp__pin-hint">
            SafeSERP pinned the official site at the top. Unofficial lookalikes
            are hidden.
          </div>
        </div>

        <div className="gserp__verified">
          <div className="gserp__badge">
            Verified official — {name}
            <span>{host}</span>
          </div>
          <div className="gserp__result-head">
            <img
              className="gserp__favicon"
              src={faviconSrc}
              alt=""
              width={18}
              height={18}
            />
            <div>
              <div className="gserp__site">{name}</div>
              <div className="gserp__url">{canonical}</div>
            </div>
          </div>
          <div className="gserp__title">{title}</div>
          <div className="gserp__snippet">{snippet}</div>
        </div>

        <ul className="gserp__sitelinks">
          {sitelinks.map((link) => (
            <li key={link.label}>
              <span>{link.label}</span>
              <em>{link.desc}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GserpDemo;
