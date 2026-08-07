import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="how__inner">
        <h2 className="how__title">How it works</h2>
        <p className="how__lead">
          Search Google for a DEX or wallet. SafeSERP clears sponsored fakes,
          pins the official link first, and only badges the best matching result
          — not every related subdomain.
        </p>
        <ol className="how__list">
          <li>
            <strong>Strip sponsored results</strong>
            <span>
              Top ads, shopping units, and “Sponsored” blocks are removed so a
              phishing clone can’t sit in the first click slot.
            </span>
          </li>
          <li>
            <strong>Pin the official link to #1</strong>
            <span>
              When your query matches a known brand, a pinned card with the
              canonical URL is forced to the top of the results — before organic
              links.
            </span>
          </li>
          <li>
            <strong>Badge the real result</strong>
            <span>
              The best official match (e.g. app.uniswap.org) gets a calm green
              “Verified official” label. Extra Uniswap pages aren’t all boxed
              as verified.
            </span>
          </li>
          <li>
            <strong>Warn on lookalikes</strong>
            <span>
              Fake or near-miss domains get a red “Warning — not official” label
              pointing you back to the real URL.
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
