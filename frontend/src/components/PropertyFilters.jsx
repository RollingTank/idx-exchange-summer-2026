import React, { useEffect, useState } from "react";
import "./PropertyFilters.css";

const INITIAL_STATE = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

export default function PropertyFilters({
  onSearch,
  onClear,
  initialFilters = INITIAL_STATE,
}) {
  const [filters, setFilters] = useState({
    ...INITIAL_STATE,
    ...initialFilters,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFilters({ ...INITIAL_STATE, ...initialFilters });
  }, [initialFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (filters.zipcode && !/^\d{5}$/.test(filters.zipcode)) {
      newErrors.zipcode = "ZIP code must be exactly 5 digits.";
    }

    if (filters.minPrice !== "" && filters.maxPrice !== "") {
      const min = Number(filters.minPrice);
      const max = Number(filters.maxPrice);

      if (min >= max) {
        newErrors.price = "Minimum price must be less than maximum price.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const activeFilters = Object.keys(filters).reduce((acc, key) => {
      if (filters[key] !== "") {
        acc[key] = filters[key];
      }
      return acc;
    }, {});

    onSearch(activeFilters);
  };

  const handleClear = () => {
    setFilters(INITIAL_STATE);
    setErrors({});
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <div className="field-group">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleChange}
        />
      </div>

      <div className="field-group">
        <input
          type="text"
          name="zipcode"
          placeholder="ZIP Code"
          value={filters.zipcode}
          onChange={handleChange}
        />
        {errors.zipcode && (
          <span className="error-message">{errors.zipcode}</span>
        )}
      </div>

      <div className="field-group">
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
        />
        {errors.price && <span className="error-message">{errors.price}</span>}
      </div>

      <select name="beds" value={filters.beds} onChange={handleChange}>
        <option value="">Beds (Any)</option>
        <option value="1">1+ Beds</option>
        <option value="2">2+ Beds</option>
        <option value="3">3+ Beds</option>
        <option value="4">4+ Beds</option>
        <option value="5">5+ Beds</option>
        <option value="6">6+ Beds</option>
        <option value="7">7+ Beds</option>
        <option value="8">8+ Beds</option>
        <option value="9">9+ Beds</option>
        <option value="10">10+ Beds</option>
      </select>

      <select name="baths" value={filters.baths} onChange={handleChange}>
        <option value="">Baths (Any)</option>
        <option value="1">1+ Baths</option>
        <option value="2">2+ Baths</option>
        <option value="3">3+ Baths</option>
        <option value="4">4+ Baths</option>
        <option value="5">5+ Baths</option>
        <option value="6">6+ Baths</option>
        <option value="7">7+ Baths</option>
        <option value="8">8+ Baths</option>
        <option value="9">9+ Baths</option>
        <option value="10">10+ Baths</option>
      </select>

      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>
        Clear Filters
      </button>
    </form>
  );
}
