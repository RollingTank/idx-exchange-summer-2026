import React from "react";


export default function PropertyMap({ lat, lng, address }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="property-map-container">
      <h3>Location Map</h3>
      <div className="map-iframe-wrapper">
        <iframe
          title="Property Location"
          width="100%"
          height="350"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={embedUrl}
        />
      </div>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="directions-link"
      >
        Get Directions on Google Maps &rarr;
      </a>
    </div>
  );
}
