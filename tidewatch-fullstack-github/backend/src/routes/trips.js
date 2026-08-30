const express = require("express");
const router = express.Router();
const { pool, redisClient, initRedis } = require("../config/db");

// POST /api/trips — log the start of a fishing trip
// body: { vessel_id, direction: 'N'|'S'|'E'|'W', entry_time: 'HH:MM', return_time: 'HH:MM', fuel_level_pct }
router.post("/", async (req, res, next) => {
  try {
    const { vessel_id, direction, entry_time, return_time, fuel_level_pct } = req.body;
    if (!vessel_id || !direction || !entry_time || !return_time) {
      return res.status(400).json({ error: "vessel_id, direction, entry_time, return_time are required" });
    }
    if (!["N", "S", "E", "W"].includes(direction)) {
      return res.status(400).json({ error: "direction must be one of N, S, E, W" });
    }

    const { rows } = await pool.query(
      `INSERT INTO trips (vessel_id, direction, entry_time, return_time, fuel_level_pct)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [vessel_id, direction, entry_time, return_time, fuel_level_pct]
    );

    // reflect the departure fuel reading onto the vessel's live telemetry
    if (fuel_level_pct != null) {
      await pool.query(
        `INSERT INTO telemetry (vessel_id, lat, lon, fuel_pct)
         SELECT $1, lat, lon, $2 FROM telemetry WHERE vessel_id = $1 ORDER BY recorded_at DESC LIMIT 1`,
        [vessel_id, fuel_level_pct]
      );
      await initRedis();
      await redisClient.del("vessels:latest");
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/trips/:vesselId — trip history for a vessel
router.get("/:vesselId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM trips WHERE vessel_id = $1 ORDER BY trip_date DESC, created_at DESC LIMIT 30`,
      [req.params.vesselId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/trips/:vesselId/today — today's trip, if logged
router.get("/:vesselId/today", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM trips WHERE vessel_id = $1 AND trip_date = CURRENT_DATE ORDER BY created_at DESC LIMIT 1`,
      [req.params.vesselId]
    );
    res.json(rows[0] || null);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
