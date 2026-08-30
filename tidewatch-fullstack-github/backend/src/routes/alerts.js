const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// GET /api/alerts?vessel_id=TV-104&limit=20
router.get("/", async (req, res, next) => {
  try {
    const { vessel_id, limit = 20 } = req.query;
    const params = [];
    let where = "";
    if (vessel_id) {
      params.push(vessel_id);
      where = "WHERE vessel_id = $1";
    }
    params.push(Number(limit));
    const { rows } = await pool.query(
      `SELECT * FROM alerts ${where} ORDER BY created_at DESC LIMIT $${params.length}`,
      params
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/alerts/:id/acknowledge
router.patch("/:id/acknowledge", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `UPDATE alerts SET acknowledged = true WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Alert not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
