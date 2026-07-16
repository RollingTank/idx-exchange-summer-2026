import React from 'react';
import { getFirstPhoto } from "../utils/photoHelper";
import "./PropertyCard.css"

export default function PropertyCard({ property }) {
    const photo = getFirstPhoto(property.L_Photos);

    return (
        <div className='property-card'>
            <div className='card-image-wrapper'>
                <img src={photo} alt={property.L_Address} onError={(e) => {
                    e.target.src = '../img/image-broken.png'
                }}   />
            </div>
            <div className='card-content'>
                <h3>${Number(property.L_SystemPrice).toLocaleString()}</h3>
                <p className='address'>{property.L_Address}</p>
                <p className='location'>{property.L_City}, {property.L_State}</p>
                <div className='specs'>
                    <span>{property.L_Keyword2} Beds</span>
                    <span>{property.LM_Dec_3} Baths</span>
                    <span>{property.LM_Int2_3} Sqft</span>
                </div>
            </div>
        </div>
    );
}
