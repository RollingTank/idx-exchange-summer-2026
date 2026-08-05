import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyDetail, fetchPropertyOpenHouses } from "../api/client";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyMap from "./PropertyMap";
import OpenHouses from "./OpenHouses";
import "./PropertyDetailPage.css";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([fetchPropertyDetail(id), fetchPropertyOpenHouses(id)])
      .then(([propertyData, openHouseData]) => {
        if (!isMounted) return;
        setProperty(propertyData);
        setOpenHouses(Array.isArray(openHouseData) ? openHouseData : []);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load property details.");
        setProperty(null);
        setOpenHouses([]);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading)
    return <div className="spinner">Loading property details...</div>;

  if (error || !property) {
    return (
      <div className="detail-error-container">
        <h2>Property Not Found</h2>
        <p>{error || "The property you are looking for does not exist."}</p>
        <button onClick={() => navigate("/")} className="back-btn">
          &larr; Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        &larr; Back
      </button>

      <PropertyImageGallery photosData={property.L_Photos} />

      <div className="property-header">
        <h1>${Number(property.L_SystemPrice || 0).toLocaleString()}</h1>
        <h2>{property.L_Address || property.UnparsedAddress}</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <strong>Bedrooms:</strong> {property.L_Keyword2}
        </div>
        <div className="stat-item">
          <strong>Bathrooms:</strong> {property.LM_Dec_3}
        </div>
        <div className="stat-item">
          <strong>Area:</strong> {property.LM_Int2_3} sqft
        </div>
        <div className="stat-item">
          <strong>Year Built:</strong> {property.YearBuilt || "N/A"}
        </div>
      </div>

      {property.L_Remarks && (
        <div className="property-section">
          <h3>Description</h3>
          <p>{property.L_Remarks}</p>
        </div>
      )}

      <OpenHouses openHouses={openHouses} />

      <PropertyMap
        lat={parseFloat(property.LMD_MP_Latitude)}
        lng={parseFloat(property.LMD_MP_Longitude)}
        address={property.L_Address || property.UnparsedAddress}
      />
    </div>
  );
}
