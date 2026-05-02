const axios = require("axios");
require("dotenv").config();

const TOKEN = process.env.TOKEN
async function Log(stack, level, pkg, message) {
    try {
        const res = await axios.post(
            "http://20.207.122.201/evaluation-service/logs",
            {
                stack,
                level,
                package: pkg,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Log success:", res.data.message);

    } catch (err) {
        console.log("Logging failed:", err.message);
    }
}

module.exports = Log;