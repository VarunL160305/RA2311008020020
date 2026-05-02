const axios = require("axios");
const logData = require("../logging_middleware/logger");
require("dotenv").config();

const token = process.env.TOKEN;

async function getData() {
    try {
        const depotData = await axios.get(
            "http://20.207.122.201/evaluation-service/depots",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const vehicleData = await axios.get(
            "http://20.207.122.201/evaluation-service/vehicles",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        logData("backend", "info", "service", "data fetched");

        return {
            hours: depotData.data.depots[0].MechanicHours,
            vehicles: vehicleData.data.vehicles
        };

    } catch (err) {
        logData("backend", "error", "handler", "data fetch failed");
        return null;
    }
}

function solveProblem(totalHours, list) {
    const n = list.length;
    const dp = [];

    for (let i = 0; i <= n; i++) {
        dp[i] = [];
        for (let j = 0; j <= totalHours; j++) {
            dp[i][j] = 0;
        }
    }

    for (let i = 1; i <= n; i++) {
        let time = list[i - 1].Duration;
        let value = list[i - 1].Impact;

        for (let j = 0; j <= totalHours; j++) {
            if (time <= j) {
                dp[i][j] = Math.max(
                    value + dp[i - 1][j - time],
                    dp[i - 1][j]
                );
            } else {
                dp[i][j] = dp[i - 1][j];
            }
        }
    }

    return dp[n][totalHours];
}

async function start() {
    logData("backend", "info", "service", "scheduler started");

    const data = await getData();
    if (!data) return;

    const result = solveProblem(data.hours, data.vehicles);

    logData("backend", "info", "service", "calculation done");

    console.log("hours:", data.hours);
    console.log("vehicles:", data.vehicles.length);
    console.log("maximum impact:", result);
}

start();