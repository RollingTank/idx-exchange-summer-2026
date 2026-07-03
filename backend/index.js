const express = require('express');
const cors = require('cors');
const pool = require('./database');
const propertiesRouter = require('./properties');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
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
