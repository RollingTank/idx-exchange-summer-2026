import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirstPhoto } from "../utils/photoHelper";
import "./PropertyCard.css";

export const parsePhotos = (photosData) => {
  if (!photosData) return [];
  if (Array.isArray(photosData)) return photosData;
  try {
    return JSON.parse(photosData);
  } catch (err) {
    return [];
  }
};

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const defaultPhoto = getFirstPhoto(property?.L_Photos);
  const photos = parsePhotos(property?.L_Photos);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCardClick = () => {
    navigate(`/property/${property.L_ListingID}`);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const displayPhoto = photos.length > 0 ? photos[currentIndex] : defaultPhoto;

  return (
    <div
      className="property-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="card-image-wrapper">
        <div className="card-main-photo">
          <img
            className="img"
            src={displayPhoto}
            alt={property.L_Address || "Property photo"}
            onError={(e) => {
              e.target.src = "";
            }}
          />

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="carousel-btn prev"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePrev(event);
                }}
                aria-label="Previous Image"
              >
                &#10094;
              </button>
              <button
                type="button"
                className="carousel-btn next"
                onClick={(event) => {
                  event.stopPropagation();
                  handleNext(event);
                }}
                aria-label="Next Image"
              >
                &#10095;
              </button>
              <div className="carousel-counter">
                {currentIndex + 1} / {photos.length}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card-content">
        <h3>
          $
          {Number(
            property.L_SystemPrice || property.ListPrice || 0,
          ).toLocaleString()}
        </h3>
        <p className="address">
          {property.L_Address || property.UnparsedAddress}
        </p>
        <p className="location">
          {property.L_City}, {property.L_State} {property.L_Zip}
        </p>
        <div className="specs">
          <span>{property.L_Keyword2 || property.BedsTotal} Beds</span>
          <span>{property.LM_Dec_3 || property.BathsTotal} Baths</span>
          <span>{property.LM_Int2_3 || property.BuildingAreaTotal} Sqft</span>
        </div>
      </div>
    </div>
  );
}
