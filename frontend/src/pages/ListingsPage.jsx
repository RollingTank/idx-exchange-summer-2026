import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";
import "./ListingsPage.css";

const INITIAL_FILTERS = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

const INITIAL_SORT = {
  sortBy: "",
  sortOrder: "asc",
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
    sort: {
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
    },
    page: Math.max(parseInt(params.get("page") || "1", 10) || 1, 1),
  };
};

const buildSearchString = (filters, page, sort = INITIAL_SORT) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  if (sort.sortBy) {
    params.set("sortBy", sort.sortBy);
    params.set("sortOrder", sort.sortOrder || "asc");
  }

  return params.toString();
};

const buildApiParams = (filters, sort, currentPage, itemsPerPage) => {
  const params = {};

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params[key] = value;
    }
  });

  if (sort?.sortBy) {
    params.sortBy = sort.sortBy;
    params.sortOrder = sort.sortOrder || "asc";
  }

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
  const [activeSort, setActiveSort] = useState({
    ...INITIAL_SORT,
    ...initialSearchState.sort,
  });

  useEffect(() => {
    const nextSearchState = parseSearchState(location.search);
    setCurrentPage(nextSearchState.page);
    setActiveFilters({
      ...INITIAL_FILTERS,
      ...nextSearchState.filters,
    });
    setActiveSort({
      ...INITIAL_SORT,
      ...nextSearchState.sort,
    });
  }, [location.search]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = buildApiParams(
      activeFilters,
      activeSort,
      currentPage,
      itemsPerPage,
    );

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
  }, [currentPage, activeFilters, itemsPerPage, activeSort]);

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
  const handleSortChange = (field, value) => {
    const nextSort = {
      ...activeSort,
      [field]: value,
    };

    if (field === "sortBy" && !value) {
      nextSort.sortOrder = "asc";
    }

    setActiveSort(nextSort);

    const searchString = buildSearchString(activeFilters, 1, nextSort);
    navigate({
      pathname: "/",
      search: searchString ? `?${searchString}` : "",
    });
  };
  const handlePageChange = (page) => {
    const searchString = buildSearchString(activeFilters, page, activeSort);
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

      <div className="sort-controls" aria-label="Sort properties">
        <div className="field-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            value={activeSort.sortBy}
            onChange={(e) => handleSortChange("sortBy", e.target.value)}
          >
            <option value="">Default</option>
            <option value="L_SystemPrice">Price</option>
            <option value="ListingContractDate">Date Listed</option>
            <option value="LM_Int2_3">Square Footage</option>
            <option value="L_Keyword2">Beds</option>
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="sortOrder">Sort Order</label>
          <select
            id="sortOrder"
            value={activeSort.sortOrder}
            onChange={(e) => handleSortChange("sortOrder", e.target.value)}
            disabled={!activeSort.sortBy}
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

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
