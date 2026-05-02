const axios = require("axios");
require("dotenv").config();

const token = process.env.TOKEN;

async function logData(stack, level, pkg, message) {
    try {
        await axios.post(
            "http://20.207.122.201/evaluation-service/logs",
            {
                stack: stack,
                level: level,
                package: pkg,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (err) {
        console.log("log error");
    }
}

module.exports = logData;