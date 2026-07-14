const express = require('express');
const router = express.Router();
const pool = require('./database');

function validateListingID(req, res, next) {
    const id = req.params.id;

    const isValid = /^[0-9]+$/.test(id) && id.length <= 15;

    if (!isValid) {
        return res.status(400).json({
            error : `Invalid/Malformed Listing ID format`
        });
    }

    req.parseListingId = id;
    next();
}

router.get('/:id/openhouses', validateListingID, async (req, res, next) => {
    try {
        const listingID = req.parseListingId;

        const [propCheck] = await pool.query(
            'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
            [listingID]
        );
        if (propCheck.length == 0) {
            return res.status(404).json({
                error : 'property with given ID does not exist'
            });
        }
        const [openHouses] = await pool.query(
            'SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OH_StartDate ASC, OH_StartTime ASC', 
            [listingID]
        );

        res.json(openHouses);
    } catch(error) {
        next(error);
    }
});

router.get('/:id', validateListingID, async (req, res, next) => {
    try {
        const listingID = req.parseListingId;

        const [rows] = await pool.query(
            'SELECT * FROM rets_property WHERE L_ListingID = ?',
            [listingID]
        );

        if (rows.length == 0) {
            return res.status(404).json({
                'error' : `Property with ID ${listingID} doesn't exist`
            });
        }

        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res) => {
    try {
        let {city, zipcode, minPrice, maxPrice, beds, baths, limit, offset} = req.query;
        limit = limit === undefined ? 20 : parseInt(limit);
        offset = offset === undefined ? 0 : parseInt(offset);

        if (isNaN(limit) || limit <= 0 || limit >= 100) {
            return res.status(400).json({
                error : 'Invalid Limit.'
            });
        }
        if (isNaN(offset) || offset < 0) {
            return res.status(400).json({
                error : 'Invalid Offset'
            });
        }

        const num_filters = {minPrice, maxPrice, beds, baths};
        for (const [key, value] of Object.entries(num_filters)) {
            if (value !== undefined && (isNaN(Number(value)) || Number(value) < 0)) {
                return res.status(400).json({
                    error : `Invalid ${key}.`
                });
            }
        }

        if (minPrice >= maxPrice) {
            return res.status(400).json({
                error : `Max Price must be Greater than Min Price`
            });
        }

        let wheres = [];
        let queries = [];

        if (city) {
            wheres.push('LOWER(TRIM(L_City)) = Lower(TRIM(?))');
            queries.push(city);
        }
        if (zipcode) {
            wheres.push("L_Zip = ?");
            queries.push(zipcode);
        }
        if (minPrice) {
            wheres.push("L_SystemPrice >= ?");
            queries.push(Number(minPrice));
        } 
        if (maxPrice) {
            wheres.push("L_SystemPrice <= ?");
            queries.push(Number(maxPrice));
        }
        if (beds) {
            wheres.push("L_Keyword2 >= ?");
            queries.push(Number(beds));
        }
        if (baths) {
            wheres.push("LM_Dec_3 >= ?");
            queries.push(Number(baths));
        }

        const where_query = wheres.length > 0 ? `WHERE ${wheres.join(' AND ')}` : '';
        const count_query = `SELECT COUNT(*) as total FROM rets_property ${where_query}`;
        const data_query = `SELECT * FROM rets_property ${where_query} LIMIT ? OFFSET ?`;

        const [counts] = await pool.query(count_query, queries);
        const [results] = await pool.query(data_query, [...queries, limit, offset]);

        const total = counts[0].total;

        return res.status(200).json({
            total,
            limit,
            offset,
            results
        });
    } catch (error) {
        console.error("Error fecthing properties: ", error);
        return res.status(500).json({
            error : `Error: ${error}`
        });
    }
});

module.exports = router;
