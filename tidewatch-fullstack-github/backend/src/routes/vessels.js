const express = require("express");
const router = express.Router();
const { pool, cached, redisClient, initRedis } = require("../config/db");

// GET /api/vessels — fleet roster with latest telemetry (Redis-cached, 15s TTL)
router.get("/", async (req, res, next) => {
  try {
    const data = await cached("vessels:latest", 15, async () => {
      const { rows } = await pool.query(`
        SELECT v.id, v.name, v.mmsi, v.captain_name,
               t.lat, t.lon, t.heading_deg, t.speed_kn,
               t.fuel_pct, t.engine_temp_c, t.battery_pct, t.recorded_at
        FROM vessels v
        LEFT JOIN LATERAL (
          SELECT * FROM telemetry
          WHERE telemetry.vessel_id = v.id
          ORDER BY recorded_at DESC LIMIT 1
        ) t ON true
        ORDER BY v.id;
      `);
      return rows;
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/vessels/:id — single vessel detail
router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM vessels WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Vessel not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/vessels/:id/telemetry — IoT device / AIS ingest endpoint
router.post("/:id/telemetry", async (req, res, next) => {
  try {
    const { lat, lon, heading_deg, speed_kn, fuel_pct, engine_temp_c, battery_pct } = req.body;
    if (lat == null || lon == null) {
      return res.status(400).json({ error: "lat and lon are required" });
    }
    const { rows } = await pool.query(
      `INSERT INTO telemetry (vessel_id, lat, lon, heading_deg, speed_kn, fuel_pct, engine_temp_c, battery_pct)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.params.id, lat, lon, heading_deg, speed_kn, fuel_pct, engine_temp_c, battery_pct]
    );

    // invalidate roster cache so the next GET reflects fresh telemetry
    await initRedis();
    await redisClient.del("vessels:latest");

    // low-fuel safety alert
    if (fuel_pct != null && fuel_pct < 20) {
      await pool.query(
        `INSERT INTO alerts (vessel_id, severity, message) VALUES ($1,'warn',$2)`,
        [req.params.id, `Fuel below reserve threshold (${fuel_pct}%)`]
      );
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/vessels/:id/telemetry/history?hours=24
router.get("/:id/telemetry/history", async (req, res, next) => {
  try {
    const hours = parseInt(req.query.hours, 10) || 24;
    const { rows } = await pool.query(
      `SELECT * FROM telemetry
       WHERE vessel_id = $1 AND recorded_at > now() - ($2 || ' hours')::interval
       ORDER BY recorded_at ASC`,
      [req.params.id, hours]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
