const { fitIsolationForest } = require("../utils/isolationForest");

// Feature vector per observation: [speedKn, headingDeltaDeg, hourOfDay,
// distanceFromPlannedRouteNm, minutesStoppedRecently]
// Trained per-request against the vessel's own recent telemetry history
// so "normal" is calibrated to that vessel's usual behaviour, not the fleet
// average — this is what a real vessel-anomaly service should do.

function toFeatureVector(point) {
  return [
    Number(point.speedKn) || 0,
    Number(point.headingDeltaDeg) || 0,
    Number(point.hourOfDay) || 0,
    Number(point.distanceFromRouteNm) || 0,
    Number(point.minutesStopped) || 0,
  ];
}

const ANOMALY_THRESHOLD = 0.62; // empirical cutoff for isolation-forest score

/**
 * detectVesselAnomaly — ML Model 2
 * @param {object[]} history  recent telemetry points for this vessel (>=20 recommended)
 * @param {object} current    the point being evaluated
 * @param {object} context    { restrictedZoneNearbyNm, tripPlanExists, plannedReturnTime, nowIso }
 */
function detectVesselAnomaly(history, current, context = {}) {
  const findings = [];
  const historyPoints = (history || []).map(toFeatureVector);
  const currentPoint = toFeatureVector(current);

  let isolationScore = null;
  if (historyPoints.length >= 15) {
    const forest = fitIsolationForest(historyPoints, { nTrees: 120 });
    isolationScore = Math.round(forest.score(currentPoint) * 1000) / 1000;
    if (isolationScore >= ANOMALY_THRESHOLD) {
      findings.push({ type: "movement_pattern", severity: isolationScore >= 0.72 ? "high" : "medium", message: "Anomalous movement — review recommended." });
    }
  }

  // deterministic rule layer — fires even with too little history for the isolation forest
  if (context.restrictedZoneNearbyNm != null && context.restrictedZoneNearbyNm < 0.5) {
    findings.push({ type: "restricted_zone_proximity", severity: "high", message: "Repeated proximity to a restricted zone boundary — review recommended." });
  }
  if (current.minutesStopped != null && current.minutesStopped > 90 && current.distanceFromRouteNm > 2) {
    findings.push({ type: "unexpected_stop", severity: "medium", message: "Unexpected extended stop off the planned route — review recommended." });
  }
  if (current.distanceFromRouteNm != null && current.distanceFromRouteNm > 8) {
    findings.push({ type: "route_deviation", severity: "medium", message: "Significant deviation from the declared trip route — review recommended." });
  }
  const hour = current.hourOfDay;
  if (hour != null && (hour < 4 || hour > 23) && context.tripPlanExists === false) {
    findings.push({ type: "unplanned_night_operation", severity: "low", message: "Vessel active late at night with no trip plan on file — review recommended." });
  }

  return {
    model: "vessel-anomaly-detection",
    algorithm: historyPoints.length >= 15 ? "Isolation Forest + rule hybrid" : "Rule hybrid (insufficient history for isolation forest)",
    isolationScore,
    anomalous: findings.length > 0,
    findings,
    label: findings.length > 0 ? "Anomalous movement — review recommended." : "No anomaly detected.",
    note: "This model flags patterns for human review. It never asserts illegal activity.",
  };
}

module.exports = { detectVesselAnomaly, toFeatureVector, ANOMALY_THRESHOLD };
