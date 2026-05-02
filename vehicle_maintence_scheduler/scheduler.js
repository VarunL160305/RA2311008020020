const Log = require("../logging_middleware/logger");

function schedule(vehicle) {
    Log("backend", "info", "cron_job", `Service scheduled for vehicle ${vehicle}`);
}
module.exports = schedule;