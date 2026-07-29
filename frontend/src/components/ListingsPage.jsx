import React, { useState, useEffect } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "./Pagination";
import './ListingsPage.css'

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [activeFilters, setActiveFilters] = useState(null);

  

  useEffect(() => {
      let isMounted = true;
      setLoading(true);

      const params = {
        ...(activeFilters || {}),
        offset: (currentPage - 1) * 20,
        limit: itemsPerPage,
      };

      fetchProperties(params)
        .then((data) => {
          if (!isMounted) return;
          setProperties(data.results || []);
          setTotalCount(data.total || 0);
          setError(null);
        })
        .catch((err) => {
          if (!isMounted) return;
          setError(err.message || "Backend server is currently unreachable.");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }, [currentPage, activeFilters, itemsPerPage]);

  const handleSearch = (activeFilters) => {
    setActiveFilters(activeFilters);
    setCurrentPage(1);
  };
  const handleClear = () => {
    setActiveFilters(null);
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);


  if (totalCount === 0) {
    return (<div className="listings-container">
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
      <h2>
        No Properties Found.
      </h2></div>);
  }

  return (
    <div className="listings-container">
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      {loading && <div className="spinner">Loading active listings. . .</div>}

      {!loading && error && <div className="error-banner">Error: {error}</div>}

      {!loading && !error && totalCount === 0 && (
        <h2>No Properties Found.</h2>
      )}

      {!loading && !error && totalCount > 0 && (
        <>
          <h2>
            Showing {startItem}-{endItem} of {totalCount} properties
          </h2>

          <div className="property-grid">
            {properties.map((prop) => (
              <PropertyCard key={prop.L_ListingID} property={prop} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
