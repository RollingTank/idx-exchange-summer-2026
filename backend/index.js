const express = require('express');
const cors = require('cors');
const pool = require('./database');
const propertiesRouter = require('./properties');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const diff = process.hrtime(start);

        const durationInMs = (diff[0] * 1000 + diff[1] * 0.000001).toFixed(2);

        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${durationInMs} ms)`);
    })

    next();
});




app.use('/api/properties', propertiesRouter);

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        return res.status(200).json({
            status : "ok",
            database : "connected"
        });
    } catch (error) {
        console.error("Health check failed.");

        return res.status(500).json({
            status : "error",
            database : "unreachable"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(`Caught Server Error: ${err}`);
    res.status(500).json({
        error : 'internal server error'
    });
});
