const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// Ray-casting point-in-polygon check against a GeoJSON polygon's outer ring.
function pointInPolygon(lat, lon, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

// POST /api/geofencing/evaluate — called after each telemetry ingest
// body: { vessel_id, lat, lon }
router.post("/evaluate", async (req, res, next) => {
  try {
    const { vessel_id, lat, lon } = req.body;
    const { rows: zones } = await pool.query(
      `SELECT * FROM geofences WHERE kind = 'restricted'
       AND (active_from IS NULL OR now()::date >= active_from)
       AND (active_to IS NULL OR now()::date <= active_to)`
    );

    const breaches = [];
    for (const zone of zones) {
      const ring = zone.polygon_geojson.coordinates[0];
      if (pointInPolygon(lat, lon, ring)) {
        breaches.push(zone);
        await pool.query(
          `INSERT INTO geofence_events (vessel_id, geofence_id, event_type) VALUES ($1,$2,'enter')`,
          [vessel_id, zone.id]
        );
        await pool.query(
          `INSERT INTO alerts (vessel_id, severity, message) VALUES ($1,'bad',$2)`,
          [vessel_id, `Entered restricted zone: ${zone.name}`]
        );
      }
    }

    res.json({ vessel_id, breaches: breaches.map((z) => z.name) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
