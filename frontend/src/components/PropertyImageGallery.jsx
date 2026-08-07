import React, { useState, useEffect, useRef } from "react";
import { parsePhotos } from "./PropertyCard";
import "./PropertyImageGallery.css";

export default function PropertyImageGallery({ photosData }) {
  const photos = parsePhotos(photosData);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lightboxRef = useRef(null);
  const thumbnailRefs = useRef([]);

  useEffect(() => {
    if (isLightboxOpen && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[selectedIndex];
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleWindowKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (event.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      } else if (event.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isLightboxOpen, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="gallery-container">
        <div
          className="main-image no-image-placeholder"
          aria-label="No Images Found"
        >
          No Images Found
        </div>
      </div>
    );
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsLightboxOpen(false);
    } else if (e.key === "ArrowLeft") {
      setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    } else if (e.key === "ArrowRight") {
      setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="gallery-container">
      <div className="main-image-wrapper">
        <img
          src={photos[selectedIndex]}
          alt="Main Property View"
          className="main-image"
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow left"
              aria-label="Previous photo"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === 0 ? photos.length - 1 : prev - 1,
                );
              }}
            >
              &#10094;
            </button>
            <button
              type="button"
              className="gallery-arrow right"
              aria-label="Next photo"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === photos.length - 1 ? 0 : prev + 1,
                );
              }}
            >
              &#10095;
            </button>
            <div className="gallery-counter" aria-live="polite">
              {selectedIndex + 1} / {photos.length}
            </div>
          </>
        )}

        <button
          type="button"
          className="gallery-lightbox-trigger"
          aria-label="Open photo lightbox"
          onClick={() => setIsLightboxOpen(true)}
        />
      </div>

      {photos.length > 1 && (
        <div className="thumbnail-strip">
          {photos.map((photo, idx) => (
            <img
              key={idx}
              ref={(element) => {
                thumbnailRefs.current[idx] = element;
              }}
              src={photo}
              alt={`Thumbnail ${idx + 1}`}
              className={`thumbnail ${idx === selectedIndex ? "active" : ""}`}
              onClick={() => setSelectedIndex(idx)}
            />
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="lightbox-overlay"
          data-testid="lightbox-overlay"
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
            >
              &times;
            </button>

            <img
              src={photos[selectedIndex]}
              alt="Fullscreen view"
              className="lightbox-image"
            />

            {photos.length > 1 && (
              <>
                <button
                  className="lightbox-arrow left"
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev === 0 ? photos.length - 1 : prev - 1,
                    )
                  }
                >
                  &#10094;
                </button>
                <button
                  className="lightbox-arrow right"
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev === photos.length - 1 ? 0 : prev + 1,
                    )
                  }
                >
                  &#10095;
                </button>
                <div className="lightbox-counter">
                  {selectedIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
