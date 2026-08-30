const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// GET /api/sustainability/:vesselId — latest score
router.get("/:vesselId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM sustainability_scores WHERE vessel_id = $1 ORDER BY computed_at DESC LIMIT 1`,
      [req.params.vesselId]
    );
    res.json(rows[0] || { vessel_id: req.params.vesselId, score: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/sustainability/:vesselId/recompute
// Simple weighted-scoring model: quota adherence, zone compliance, bycatch ratio.
// Swap the scoring function body for a trained model without touching the API contract.
router.post("/:vesselId/recompute", async (req, res, next) => {
  try {
    const vesselId = req.params.vesselId;

    const [{ rows: catchRows }, { rows: breachRows }] = await Promise.all([
      pool.query(`SELECT species, SUM(weight_kg) AS kg FROM catches WHERE vessel_id = $1 GROUP BY species`, [vesselId]),
      pool.query(`SELECT COUNT(*) FROM geofence_events WHERE vessel_id = $1 AND event_type = 'enter'
                  AND occurred_at > now() - interval '30 days'`, [vesselId]),
    ]);

    const breaches = Number(breachRows[0].count);
    const bycatchRatio = req.body.bycatch_ratio ?? 0.1; // pass real sensor/observer estimate when available

    let score = 100;
    score -= breaches * 8;
    score -= bycatchRatio * 100 * 0.5;
    score = Math.max(0, Math.min(100, Math.round(score)));

    const { rows } = await pool.query(
      `INSERT INTO sustainability_scores (vessel_id, score, bycatch_ratio) VALUES ($1,$2,$3) RETURNING *`,
      [vesselId, score, bycatchRatio]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
