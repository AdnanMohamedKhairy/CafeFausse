// src/pages/Gallery.js
import React, { useState, useRef, useEffect } from "react";

/*
  Gallery with lightbox + fullscreen API.
  Put your images in frontend/public/ and list their paths in `images`.
*/

const images = [
  "/gallery-cafe-interior.webp",
  "/gallery-ribeye-steak.webp",
  "/gallery-special-event.webp",
  "/home-cafe-fausse.webp"
];

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const overlayRef = useRef(null);

  // open the lightbox at index i and attempt fullscreen
  const openAt = (i) => {
    setCurrent(i);
    setOpen(true);

    // request fullscreen after the DOM updates
    window.requestAnimationFrame(() => {
      try {
        const el = overlayRef.current;
        if (el && typeof el.requestFullscreen === "function") {
          // modern API
          el.requestFullscreen().catch(() => {});
        } else if (el && typeof el.webkitRequestFullscreen === "function") {
          // Safari older API
          el.webkitRequestFullscreen();
        }
      } catch (e) {
        // ignore if fullscreen not allowed
      }
    });
  };

  const close = () => {
    setOpen(false);
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitFullscreenElement) {
        // Safari fallback
        if (typeof document.webkitExitFullscreen === "function") {
          document.webkitExitFullscreen();
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  // keyboard handlers when open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // keep UI consistent if fullscreen state changes
  useEffect(() => {
    const handler = () => {
      // if the user exits fullscreen, we simply keep the modal open (no forced re-entry)
      // you could auto-close here if you prefer:
      // if (!document.fullscreenElement && open) setOpen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler); // safari
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, [open]);

  return (
    <div>
      <h2>Gallery</h2>

      <div className="gallery-grid" aria-hidden={open}>
        {images.map((src, i) => (
          <button
            key={i}
            className="gallery-thumb-btn"
            onClick={() => openAt(i)}
            aria-label={`Open image ${i + 1} in fullscreen`}
          >
            <img src={src} alt={`gallery-${i}`} className="gallery-thumb" />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="lightbox-overlay"
          ref={overlayRef}
          onClick={(e) => {
            // clicking backdrop closes; clicking children does not
            if (e.target === overlayRef.current) close();
          }}
        >
          <div className="lightbox-inner" role="dialog" aria-modal="true">
            <button className="lightbox-close" onClick={close} aria-label="Close (Esc)">
              ✕
            </button>

            <button
              className="lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
            >
              ‹
            </button>

            <div className="lightbox-image-wrap" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[current]}
                alt={`Large gallery ${current + 1}`}
                className="lightbox-image"
                draggable={false}
              />
              <div className="lightbox-caption">Image {current + 1} of {images.length}</div>
            </div>

            <button
              className="lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
