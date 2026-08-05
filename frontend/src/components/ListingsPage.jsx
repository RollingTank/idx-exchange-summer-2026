import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "./Pagination";
import "./ListingsPage.css";

const INITIAL_FILTERS = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

const parseSearchState = (search) => {
  const params = new URLSearchParams(search);

  return {
    filters: {
      city: params.get("city") || "",
      zipcode: params.get("zipcode") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      beds: params.get("beds") || "",
      baths: params.get("baths") || "",
    },
    page: Math.max(parseInt(params.get("page") || "1", 10) || 1, 1),
  };
};

const buildSearchString = (filters, page) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  return params.toString();
};

const buildApiParams = (filters, currentPage, itemsPerPage) => {
  const params = {};

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params[key] = value;
    }
  });

  params.offset = (currentPage - 1) * itemsPerPage;
  params.limit = itemsPerPage;

  return params;
};

export default function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialSearchState = parseSearchState(location.search);
  const [currentPage, setCurrentPage] = useState(initialSearchState.page);
  const [itemsPerPage] = useState(20);
  const [activeFilters, setActiveFilters] = useState({
    ...INITIAL_FILTERS,
    ...initialSearchState.filters,
  });

  useEffect(() => {
    const nextSearchState = parseSearchState(location.search);
    setCurrentPage(nextSearchState.page);
    setActiveFilters({
      ...INITIAL_FILTERS,
      ...nextSearchState.filters,
    });
  }, [location.search]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = buildApiParams(activeFilters, currentPage, itemsPerPage);

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
    const searchString = buildSearchString(activeFilters, 1);
    navigate({
      pathname: "/",
      search: searchString ? `?${searchString}` : "",
    });
  };
  const handleClear = () => {
    navigate("/");
  };
  const handlePageChange = (page) => {
    const searchString = buildSearchString(activeFilters, page);
    navigate({
      pathname: "/",
      search: searchString ? `?${searchString}` : "",
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  if (!loading && !error && totalCount === 0) {
    return (
      <div className="listings-container">
        <PropertyFilters
          onSearch={handleSearch}
          onClear={handleClear}
          initialFilters={activeFilters}
        />
        <h2>No Properties Found.</h2>
      </div>
    );
  }

  return (
    <div className="listings-container">
      <PropertyFilters
        onSearch={handleSearch}
        onClear={handleClear}
        initialFilters={activeFilters}
      />

      {loading && <div className="spinner">Loading active listings. . .</div>}

      {!loading && error && <div className="error-banner">Error: {error}</div>}

      {!loading && !error && totalCount === 0 && <h2>No Properties Found.</h2>}

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
