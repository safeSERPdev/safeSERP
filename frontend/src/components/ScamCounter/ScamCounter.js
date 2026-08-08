import { useEffect, useRef, useState } from "react";
import "./ScamCounter.css";

// Scam Sniffer 2024: ~332,000 crypto phishing victims (EVM).
const TARGET = 332_000;
const DURATION_MS = 2200;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function formatCount(n) {
  return Math.floor(n).toLocaleString("en-US");
}

function ScamCounter() {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const started = useRef(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const startAnim = () => {
      if (started.current) return;
      started.current = true;
      setReady(true);
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / DURATION_MS);
        setCount(TARGET * easeOutCubic(t));
        if (t < 1) requestAnimationFrame(step);
        else setCount(TARGET);
      };
      requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === "undefined") {
      startAnim();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startAnim();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <aside
      ref={rootRef}
      className={`scam${ready ? " scam--in" : ""}`}
      aria-label="Crypto phishing victim statistic"
    >
      <p className="scam__count">{formatCount(count)}</p>
      <p className="scam__line">
        people hit a crypto phishing drain in 2024 — roughly one every{" "}
        <strong>95 seconds</strong>.
      </p>
      <p className="scam__source">Source: Scam Sniffer, 2024 (EVM phishing)</p>
    </aside>
  );
}

export default ScamCounter;
