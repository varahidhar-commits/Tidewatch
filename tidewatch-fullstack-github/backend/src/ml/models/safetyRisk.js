const { fitLogisticRegression } = require("../utils/logisticRegression");
const { generateSeedSafetyTrips } = require("../data/seedSafetyTrips");

const FEATURES = ["weatherSeverity", "waveNorm", "windNorm", "lowVisibility", "lowFuel", "engineIssue", "distanceNorm", "connectivityLoss", "complianceRestricted"];
let cache = null;

function trainModel() {
  const rows = generateSeedSafetyTrips(600);
  const X = rows.map((r) => FEATURES.map((f) => r[f]));
  const y = rows.map((r) => r.unsafe);
  cache = { model: fitLogisticRegression(X, y, { epochs: 900, lr: 0.25 }), trainedAt: new Date().toISOString(), nSamples: rows.length };
  return cache;
}

function getModel() {
  return cache || trainModel();
}

// deterministic fallback used when critical inputs are missing (e.g. no
// weather feed reachable) — per spec: "ML where adequate data exists,
// deterministic marine-safety rules as a fallback."
function ruleBasedFallback(input) {
  const reasons = [];
  let risk = 0;
  if (input.weatherSeverity >= 0.8) { risk += 40; reasons.push("Severe weather advisory active"); }
  if (input.waveNorm >= 0.8) { risk += 25; reasons.push("Wave height near/above small-craft limit"); }
  if (input.lowFuel >= 0.8) { risk += 25; reasons.push("Fuel critically low for the planned distance"); }
  if (input.complianceRestricted) { risk += 20; reasons.push("Vessel has an active compliance restriction"); }
  risk = Math.min(100, risk);
  return { risk, reasons, method: "Deterministic marine-safety rules (fallback — insufficient data for the trained model)" };
}

function hasSufficientData(input) {
  return FEATURES.filter((f) => input[f] != null).length >= 6;
}

/**
 * scoreSafetyRisk — ML Model 5
 * Every feature is expected pre-normalized to 0-1 (higher = worse) by the
 * caller; see FEATURES for the expected keys.
 */
function scoreSafetyRisk(input = {}) {
  if (!hasSufficientData(input)) {
    const fb = ruleBasedFallback(input);
    return {
      model: "safety-risk-scoring",
      algorithm: fb.method,
      tripRiskPct: fb.risk,
      riskLevel: fb.risk >= 60 ? "HIGH" : fb.risk >= 30 ? "MEDIUM" : "LOW",
      contributingFactors: fb.reasons.length ? fb.reasons : ["No elevated risk factors identified"],
    };
  }

  const { model } = getModel();
  const normalized = FEATURES.map((f) => (input[f] != null ? Number(input[f]) : 0));
  const probability = model.predictProba(normalized);
  const tripRiskPct = Math.round(probability * 1000) / 10;

  const contributions = model.contributions(normalized).map((c, i) => ({ feature: FEATURES[i], contribution: c }));
  contributions.sort((a, b) => b.contribution - a.contribution);
  const topFactors = contributions.filter((c) => c.contribution > 0.15).slice(0, 4).map((c) => FEATURE_LABELS[c.feature] || c.feature);

  const riskLevel = tripRiskPct >= 60 ? "HIGH" : tripRiskPct >= 30 ? "MEDIUM" : "LOW";

  return {
    model: "safety-risk-scoring",
    algorithm: "Logistic Regression",
    tripRiskPct,
    riskLevel,
    contributingFactors: topFactors.length ? topFactors : ["No single factor dominates — conditions are broadly favourable"],
  };
}

const FEATURE_LABELS = {
  weatherSeverity: "Weather severity",
  waveNorm: "Wave height",
  windNorm: "Wind speed",
  lowVisibility: "Reduced visibility",
  lowFuel: "Low fuel reserve",
  engineIssue: "Engine condition",
  distanceNorm: "Distance from harbour",
  connectivityLoss: "Weak connectivity / GPS signal",
  complianceRestricted: "Active compliance restriction",
};

module.exports = { scoreSafetyRisk, trainModel, getModel, FEATURES };
