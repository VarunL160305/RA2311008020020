const express = require("express");
require("dotenv").config();
const Log = require("../logging_middleware/logger");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    Log("backend", "info", "service", `Incoming request: ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    Log("backend", "info", "route", "GET / - Home route accessed");
    res.send("Server working");
});

app.get("/test", (req, res) => {
    Log("backend", "warn", "route", "GET /test - test endpoint triggered");
    res.send("Test route");
});

app.get("/error", (req, res) => {
    try {
        throw new Error("Manual error triggered");
    } catch (err) {
        Log("backend", "error", "handler", `GET /error - ${err.message}`);
        res.status(500).send("Error occurred");
    }
});

app.get("/fatal", (req, res) => {
    Log("backend", "fatal", "db", "Simulated database failure");
    res.send("Fatal log sent");
});


app.listen(3000, () => {
    Log("backend", "info", "service", "Server started on port 3000");
    console.log("Running on port 3000");
});