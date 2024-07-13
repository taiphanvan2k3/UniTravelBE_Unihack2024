const redis = require("redis");
const { logInfo, logError } = require("../services/logger.service");

const client = redis.createClient({ url: process.env.REDIS_CLOUD_URL });
client.on("error", (err) => logError("redis-initialize.js", err.message));
client.on("connect", () => {
    logInfo("redis-initialize.js", "Connected to Redis");
});

client.connect();

module.exports = client;
