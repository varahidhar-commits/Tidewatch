const { SPECIES_BASELINE, PROTECTED_SPECIES } = require("../data/speciesBaseline");

/**
 * detectCatchAnomaly — ML Model 6
 * @param {object} record { species, weightKg, zoneDirection, vesselId, tripId }
 * @param {object[]} recentRecords  this vessel's other records in the same trip/day, for repetition checks
 */
function detectCatchAnomaly(record, recentRecords = []) {
  const findings = [];
  const { species, weightKg, zoneDirection } = record;

  if (PROTECTED_SPECIES.includes(species)) {
    findings.push({ type: "protected_species", severity: "critical", message: `Protected species recorded (${species}) — manual verification required.` });
  }

  const baseline = SPECIES_BASELINE[species];
  if (baseline) {
    if (weightKg > baseline.maxPlausibleKg) {
      findings.push({ type: "impossible_weight", severity: "high", message: `Catch record anomaly — manual verification recommended (${weightKg}kg exceeds a plausible single-trip catch for ${species}).` });
    } else {
      const z = (weightKg - baseline.meanKg) / baseline.stdKg;
      if (Math.abs(z) >= 3) {
        findings.push({ type: "statistical_outlier", severity: "medium", message: `Catch record anomaly — manual verification recommended (weight is a ${z.toFixed(1)}σ statistical outlier for ${species}).`, zScore: Math.round(z * 100) / 100 });
      }
    }
    if (zoneDirection && baseline.typicalZones && !baseline.typicalZones.includes(zoneDirection)) {
      findings.push({ type: "zone_species_mismatch", severity: "low", message: `${species} is not typically logged in the ${zoneDirection} zone — manual verification recommended.` });
    }
  } else if (species) {
    findings.push({ type: "unknown_species", severity: "low", message: `No baseline on file for "${species}" — manual verification recommended.` });
  }

  // repeated-record check: same species+near-identical weight logged multiple times same day
  const duplicates = recentRecords.filter(
    (r) => r.species === species && Math.abs(r.weightKg - weightKg) < Math.max(1, weightKg * 0.02)
  );
  if (duplicates.length >= 2) {
    findings.push({ type: "repeated_suspicious_record", severity: "medium", message: `${duplicates.length} near-identical ${species} records logged this trip — manual verification recommended.` });
  }

  const requiresReview = findings.length > 0;
  return {
    model: "catch-quota-anomaly-detection",
    algorithm: "Statistical (z-score vs species baseline) + rule checks",
    requiresReview,
    findings,
    label: requiresReview ? "Catch record anomaly — manual verification recommended." : "No anomaly detected.",
    note: "This model flags records for human review. It never imposes a penalty automatically.",
  };
}

module.exports = { detectCatchAnomaly };
