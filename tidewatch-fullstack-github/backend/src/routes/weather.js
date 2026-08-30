const express = require("express");
const router = express.Router();
const { pool, cached } = require("../config/db");

// GET /api/weather?region=Thoothukudi — latest reading, cached 5 min
router.get("/", async (req, res, next) => {
  try {
    const region = req.query.region || "Thoothukudi";
    const data = await cached(`weather:${region}`, 300, async () => {
      const { rows } = await pool.query(
        `SELECT * FROM weather_readings WHERE region = $1 ORDER BY recorded_at DESC LIMIT 1`,
        [region]
      );
      return rows[0] || null;
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/weather/history?region=Thoothukudi&hours=24
router.get("/history", async (req, res, next) => {
  try {
    const region = req.query.region || "Thoothukudi";
    const hours = parseInt(req.query.hours, 10) || 24;
    const { rows } = await pool.query(
      `SELECT * FROM weather_readings
       WHERE region = $1 AND recorded_at > now() - ($2 || ' hours')::interval
       ORDER BY recorded_at ASC`,
      [region, hours]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
