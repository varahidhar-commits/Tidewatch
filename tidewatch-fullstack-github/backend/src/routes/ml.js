const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

const { predictFuel } = require("../ml/models/fuelPrediction");
const { detectVesselAnomaly } = require("../ml/models/vesselAnomaly");
const { assessEngineRisk } = require("../ml/models/engineRisk");
const { scoreSustainability } = require("../ml/models/sustainabilityScoring");
const { scoreSafetyRisk } = require("../ml/models/safetyRisk");
const { detectCatchAnomaly } = require("../ml/models/catchAnomaly");

// GET /api/ml/models — registry of available models, for the frontend/docs to introspect
router.get("/models", (req, res) => {
  res.json([
    { id: "fuel-consumption-prediction", endpoint: "POST /api/ml/fuel-prediction", algorithms: ["Linear Regression", "Random Forest Regressor"] },
    { id: "vessel-anomaly-detection", endpoint: "POST /api/ml/vessel-anomaly", algorithms: ["Isolation Forest", "rule hybrid"] },
    { id: "engine-equipment-risk", endpoint: "POST /api/ml/engine-risk", algorithms: ["Random Forest Classifier"] },
    { id: "sustainability-scoring", endpoint: "POST /api/ml/sustainability-score", algorithms: ["Explainable weighted rule-based scoring"] },
    { id: "safety-risk-scoring", endpoint: "POST /api/ml/safety-risk", algorithms: ["Logistic Regression", "deterministic rule fallback"] },
    { id: "catch-quota-anomaly-detection", endpoint: "POST /api/ml/catch-anomaly", algorithms: ["z-score statistical", "rule checks"] },
  ]);
});

// POST /api/ml/fuel-prediction
// body: { distanceNm, avgSpeedKn, payloadKg, waveHeightM, windKn, currentFuelPct?, algorithm? }
router.post("/fuel-prediction", (req, res, next) => {
  try {
    const { distanceNm, avgSpeedKn } = req.body;
    if (distanceNm == null || avgSpeedKn == null) {
      return res.status(400).json({ error: "distanceNm and avgSpeedKn are required" });
    }
    const algorithm = req.body.algorithm === "linear" ? "linear" : "randomForest";
    res.json(predictFuel(req.body, algorithm));
  } catch (err) {
    next(err);
  }
});

// POST /api/ml/vessel-anomaly
// body: { vesselId, history: [{speedKn, headingDeltaDeg, hourOfDay, distanceFromRouteNm, minutesStopped}, ...],
//         current: {...same shape}, context?: {restrictedZoneNearbyNm, tripPlanExists} }
// If `history` is omitted, the last 6 hours of telemetry for vesselId is pulled from Postgres.
router.post("/vessel-anomaly", async (req, res, next) => {
  try {
    const { vesselId, current, context } = req.body;
    if (!current) return res.status(400).json({ error: "current observation is required" });

    let history = req.body.history;
    if (!history && vesselId) {
      const { rows } = await pool.query(
        `SELECT speed_kn, heading_deg, recorded_at FROM telemetry
         WHERE vessel_id = $1 AND recorded_at > now() - interval '6 hours'
         ORDER BY recorded_at ASC`,
        [vesselId]
      );
      history = rows.map((r, i, arr) => ({
        speedKn: r.speed_kn,
        headingDeltaDeg: i > 0 ? Math.abs((r.heading_deg ?? 0) - (arr[i - 1].heading_deg ?? 0)) : 0,
        hourOfDay: new Date(r.recorded_at).getHours(),
        distanceFromRouteNm: 0,
        minutesStopped: 0,
      }));
    }

    res.json(detectVesselAnomaly(history || [], current, context || {}));
  } catch (err) {
    next(err);
  }
});

// POST /api/ml/engine-risk
// body: { engineTempC, batteryPct, fuelBurnRate?, vibrationIndex? }
router.post("/engine-risk", (req, res, next) => {
  try {
    const { engineTempC, batteryPct } = req.body;
    if (engineTempC == null || batteryPct == null) {
      return res.status(400).json({ error: "engineTempC and batteryPct are required" });
    }
    res.json(assessEngineRisk(req.body));
  } catch (err) {
    next(err);
  }
});

// POST /api/ml/sustainability-score
// body: { catchKg, quotaKg, geofenceBreachesLast30d?, seasonalBanViolation?,
//         juvenileCatchRatio?, protectedSpeciesEvent?, gearSelectivityOk?,
//         bycatchRatio?, releasedAliveRatio? }
router.post("/sustainability-score", (req, res, next) => {
  try {
    res.json(scoreSustainability(req.body));
  } catch (err) {
    next(err);
  }
});

// POST /api/ml/safety-risk
// body: 0-1 normalized features — see src/ml/models/safetyRisk.js FEATURES
router.post("/safety-risk", (req, res, next) => {
  try {
    res.json(scoreSafetyRisk(req.body));
  } catch (err) {
    next(err);
  }
});

// POST /api/ml/catch-anomaly
// body: { species, weightKg, zoneDirection?, vesselId?, tripId? }
router.post("/catch-anomaly", async (req, res, next) => {
  try {
    const { species, weightKg, vesselId, tripId } = req.body;
    if (!species || weightKg == null) {
      return res.status(400).json({ error: "species and weightKg are required" });
    }

    let recentRecords = req.body.recentRecords;
    if (!recentRecords && vesselId && tripId) {
      const { rows } = await pool.query(
        `SELECT species, weight_kg AS "weightKg" FROM catches WHERE vessel_id = $1 AND trip_id = $2`,
        [vesselId, tripId]
      );
      recentRecords = rows;
    }

    res.json(detectCatchAnomaly(req.body, recentRecords || []));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
