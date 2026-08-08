import { useEffect, useRef, useState } from "react";
import ssUniswap from "../../assets/store-screenshots/01-uniswap-1280x800.png";
import ssTrezor from "../../assets/store-screenshots/02-trezor-1280x800.png";
import ssPhantom from "../../assets/store-screenshots/03-phantom-1280x800.png";
import "./DemoScreens.css";

const SHOTS = [
  {
    src: ssUniswap,
    alt: "SafeSERP on Google for Uniswap — ads blocked, official link pinned",
    caption: "Uniswap",
  },
  {
    src: ssTrezor,
    alt: "SafeSERP on Google for Trezor — verified official wallet",
    caption: "Trezor",
  },
  {
    src: ssPhantom,
    alt: "SafeSERP on Google for Phantom — verified official wallet",
    caption: "Phantom",
  },
];

const SWIPE_THRESHOLD = 40;

function DemoScreens() {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const touchStart = useRef(null);
  const didSwipe = useRef(false);

  useEffect(() => {
    if (lightbox !== null) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SHOTS.length);
    }, 3500);
    return () => clearInterval(id);
  }, [lightbox, index]);

  useEffect(() => {
    if (lightbox === null) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") {
        setLightbox((i) => (i + 1) % SHOTS.length);
      }
      if (e.key === "ArrowLeft") {
        setLightbox((i) => (i - 1 + SHOTS.length) % SHOTS.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const openShot = (i) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const active = lightbox !== null ? SHOTS[lightbox] : null;

  const onCarouselTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    didSwipe.current = false;
  };

  const onCarouselTouchMove = (e) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
      didSwipe.current = true;
    }
  };

  const onCarouselTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) {
      return;
    }

    didSwipe.current = true;
    if (dx < 0) {
      setIndex((i) => (i + 1) % SHOTS.length);
    } else {
      setIndex((i) => (i - 1 + SHOTS.length) % SHOTS.length);
    }
  };

  const onCarouselTap = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    openShot(index);
  };

  return (
    <section className="shots" id="demo" aria-label="Product screenshots">
      <div className="shots__inner">
        <h2 className="shots__title">See it on real Google results</h2>
        <p className="shots__lead">
          Sponsored clones get stripped. The official link is pinned first.
        </p>

        <div className="shots__grid">
          {SHOTS.map((shot, i) => (
            <figure key={shot.caption} className="shots__card">
              <button
                type="button"
                className="shots__thumb"
                onClick={() => openShot(i)}
                aria-label={`Enlarge ${shot.caption} screenshot`}
              >
                <img
                  className="shots__img"
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  width={1280}
                  height={800}
                />
              </button>
              <figcaption className="shots__cap">{shot.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div
          className="shots__carousel"
          aria-roledescription="carousel"
          onTouchStart={onCarouselTouchStart}
          onTouchMove={onCarouselTouchMove}
          onTouchEnd={onCarouselTouchEnd}
        >
          <figure className="shots__card shots__card--carousel">
            <button
              type="button"
              className="shots__thumb"
              onClick={onCarouselTap}
              aria-label={`Enlarge ${SHOTS[index].caption} screenshot`}
            >
              <img
                className="shots__img"
                src={SHOTS[index].src}
                alt={SHOTS[index].alt}
                width={1280}
                height={800}
                draggable={false}
              />
            </button>
            <figcaption className="shots__cap">{SHOTS[index].caption}</figcaption>
          </figure>
          <div className="shots__dots" role="tablist" aria-label="Screenshots">
            {SHOTS.map((shot, i) => (
              <button
                key={shot.caption}
                type="button"
                className={
                  "shots__dot" + (i === index ? " shots__dot--active" : "")
                }
                aria-label={`Show ${shot.caption}`}
                aria-selected={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {active && (
        <div
          className="shots__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.caption} screenshot`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="shots__lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="shots__lightbox-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <figure className="shots__lightbox-figure">
              <img
                className="shots__lightbox-img"
                src={active.src}
                alt={active.alt}
                width={1280}
                height={800}
              />
              <figcaption className="shots__lightbox-cap">
                {active.caption}
              </figcaption>
            </figure>
            <div className="shots__lightbox-controls">
              <button
                type="button"
                className="shots__lightbox-nav"
                onClick={() =>
                  setLightbox((i) => (i - 1 + SHOTS.length) % SHOTS.length)
                }
                aria-label="Previous screenshot"
              >
                ‹
              </button>
              <button
                type="button"
                className="shots__lightbox-nav"
                onClick={() => setLightbox((i) => (i + 1) % SHOTS.length)}
                aria-label="Next screenshot"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DemoScreens;
