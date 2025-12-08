// Backend server test
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

// To send request to OpenWeather API
const weatherRoute = require("./routes/weather");
app.use("/weather", weatherRoute);

app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
