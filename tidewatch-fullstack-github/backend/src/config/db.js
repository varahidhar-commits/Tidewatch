const { Pool } = require("pg");
const { createClient } = require("redis");

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || "tidewatch",
  password: process.env.PGPASSWORD || "tidewatch",
  database: process.env.PGDATABASE || "tidewatch",
});

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => console.error("Redis error:", err));

async function initRedis() {
  if (!redisClient.isOpen) await redisClient.connect();
}

// cache-aside helper: serve from Redis, fall back to Postgres, then repopulate cache
async function cached(key, ttlSeconds, fetchFn) {
  await initRedis();
  const hit = await redisClient.get(key);
  if (hit) return JSON.parse(hit);
  const fresh = await fetchFn();
  await redisClient.set(key, JSON.stringify(fresh), { EX: ttlSeconds });
  return fresh;
}

module.exports = { pool, redisClient, initRedis, cached };
