import React, { useState, useEffect } from 'react';
import { fetchProperties  } from '../api/client';
import PropertyCard from './PropertyCard';

export default function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchProperties()
            .then(data => {
                setProperties(data.results || []);
                setTotalCount(data.total || 0);
                setError(null);
            })
            .catch(err => {
                setError(err.message || "Backend server is currently unreachable.")
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="spinner">Loading active listings. . .</div>
        );
    }
    if (error) {
        return (
            <div className="error-banner">Error: {error}</div>
        );
    }

    return (
        <div className="listings-container">
            <h2>Showing {properties.length} of {totalCount} properties</h2>

            <div className="property-grid">
                {properties.map(prop => (
                    <PropertyCard key={prop.L_ListingID} property={prop} />
                ))}
            </div>
        </div>
    );
}
