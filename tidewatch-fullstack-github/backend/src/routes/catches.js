const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// POST /api/catches — log a catch entry
router.post("/", async (req, res, next) => {
  try {
    const { vessel_id, species, weight_kg, trip_id } = req.body;
    if (!vessel_id || !species || !weight_kg || !trip_id) {
      return res.status(400).json({ error: "vessel_id, species, weight_kg, trip_id are required" });
    }
    const { rows } = await pool.query(
      `INSERT INTO catches (vessel_id, species, weight_kg, trip_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [vessel_id, species, weight_kg, trip_id]
    );

    // check against active quota; raise alert + flag compliance if exceeded
    const quota = await pool.query(
      `SELECT * FROM quotas WHERE vessel_id = $1 AND species = $2
       AND now()::date BETWEEN period_start AND period_end`,
      [vessel_id, species]
    );
    if (quota.rows.length) {
      const totalRes = await pool.query(
        `SELECT COALESCE(SUM(weight_kg),0) AS total FROM catches
         WHERE vessel_id = $1 AND species = $2 AND trip_id = $3`,
        [vessel_id, species, trip_id]
      );
      const total = Number(totalRes.rows[0].total);
      if (total > Number(quota.rows[0].limit_kg)) {
        await pool.query(
          `INSERT INTO alerts (vessel_id, severity, message) VALUES ($1,'bad',$2)`,
          [vessel_id, `Quota exceeded for ${species}: ${total}kg logged against ${quota.rows[0].limit_kg}kg limit`]
        );
      }
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/catches/summary — totals per species across the fleet
router.get("/summary", async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT species, SUM(weight_kg) AS total_kg, COUNT(DISTINCT vessel_id) AS vessel_count
      FROM catches
      GROUP BY species
      ORDER BY total_kg DESC;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
