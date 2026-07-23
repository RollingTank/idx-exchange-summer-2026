import React, { useState } from 'react';
import './PropertyFilters.css'

const INITIAL_STATE = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: ''
};

export default function PropertyFilters({ onSearch, onClear}) {
  const [filters, setFilters] = useState(INITIAL_STATE);
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFilters(prev => ({ ...prev, [name]: value}));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const activeFilters = Object.keys(filters).reduce((acc, key) => {
        if (filters[key] !== '') {
            acc[key] = filters[key];
        }
        return acc;
    }, {});

    onSearch(activeFilters);
  }

  const handleClear = () => {
    setFilters(INITIAL_STATE);
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleChange} />
      <input type="text" name="zipcode" placeholder="ZIP Code" value={filters.zipcode} onChange={handleChange} />
      <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleChange} />
      <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleChange} />
      
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
      <button type="button" onClick={handleClear}>Clear Filters</button>
    </form>
  );
};
