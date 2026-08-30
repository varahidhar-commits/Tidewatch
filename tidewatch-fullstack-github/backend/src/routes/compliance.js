const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// POST /api/compliance/:vesselId/check — run the compliance checklist for a vessel
router.post("/:vesselId/check", async (req, res, next) => {
  try {
    const vesselId = req.params.vesselId;

    const [{ rows: vesselRows }, { rows: breachRows }, { rows: overQuotaRows }] = await Promise.all([
      pool.query(`SELECT * FROM vessels WHERE id = $1`, [vesselId]),
      pool.query(
        `SELECT COUNT(*) FROM geofence_events WHERE vessel_id = $1 AND event_type = 'enter'
         AND occurred_at > now() - interval '30 days'`,
        [vesselId]
      ),
      pool.query(
        `SELECT q.species FROM quotas q
         JOIN (
           SELECT species, SUM(weight_kg) kg FROM catches WHERE vessel_id = $1 GROUP BY species
         ) c ON c.species = q.species AND c.kg > q.limit_kg
         WHERE q.vessel_id = $1`,
        [vesselId]
      ),
    ]);

    if (!vesselRows.length) return res.status(404).json({ error: "Vessel not found" });
    const vessel = vesselRows[0];

    const check = {
      vessel_id: vesselId,
      license_ok: !vessel.license_expiry || new Date(vessel.license_expiry) > new Date(),
      quota_ok: overQuotaRows.length === 0,
      zone_ok: Number(breachRows[0].count) === 0,
      ais_ok: true,
      log_ok: true,
    };

    const { rows } = await pool.query(
      `INSERT INTO compliance_checks (vessel_id, license_ok, quota_ok, zone_ok, ais_ok, log_ok)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [vesselId, check.license_ok, check.quota_ok, check.zone_ok, check.ais_ok, check.log_ok]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/compliance/:vesselId — latest check
router.get("/:vesselId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM compliance_checks WHERE vessel_id = $1 ORDER BY checked_at DESC LIMIT 1`,
      [req.params.vesselId]
    );
    res.json(rows[0] || null);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
