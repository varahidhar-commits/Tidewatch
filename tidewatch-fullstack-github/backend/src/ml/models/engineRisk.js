const { fitRandomForestClassifier } = require("../utils/randomForestClassifier");
const { generateSeedEngineData, labelRisk } = require("../data/seedEngineIncidents");

const FEATURES = ["engineTempC", "batteryPct", "fuelBurnRate", "vibrationIndex"];
let cache = null;

function trainModel() {
  const rows = generateSeedEngineData(500);
  const X = rows.map((r) => FEATURES.map((f) => r[f]));
  const y = rows.map((r) => r.risk);
  cache = { forest: fitRandomForestClassifier(X, y, { nTrees: 30, maxDepth: 5 }), trainedAt: new Date().toISOString(), nSamples: rows.length };
  return cache;
}

function getModel() {
  return cache || trainModel();
}

/**
 * assessEngineRisk — ML Model 3
 * @param {object} telemetry { engineTempC, batteryPct, fuelBurnRate, vibrationIndex? }
 */
function assessEngineRisk(telemetry) {
  const hasVibration = telemetry.vibrationIndex != null;
  const engineTempC = Number(telemetry.engineTempC) || 0;
  const batteryPct = Number(telemetry.batteryPct) || 0;
  const fuelBurnRate = telemetry.fuelBurnRate != null ? Number(telemetry.fuelBurnRate) : 0.9; // fleet-typical default
  const vibrationIndex = hasVibration ? Number(telemetry.vibrationIndex) : 0.3; // assume nominal if unmeasured

  const { forest } = getModel();
  const features = [engineTempC, batteryPct, fuelBurnRate, vibrationIndex];
  const result = forest.predict(features);

  const factors = [];
  if (engineTempC > 87) factors.push(`Engine temperature elevated (${engineTempC.toFixed(0)}°C)`);
  if (batteryPct < 45) factors.push(`Battery reserve low (${batteryPct.toFixed(0)}%)`);
  if (fuelBurnRate > 1.35) factors.push(`Fuel burn rate above normal (${fuelBurnRate.toFixed(2)})`);
  if (hasVibration && vibrationIndex > 0.55) factors.push(`Vibration index elevated (${vibrationIndex.toFixed(2)})`);
  if (factors.length === 0) factors.push("All monitored parameters within normal range");

  return {
    model: "engine-equipment-risk",
    algorithm: "Random Forest Classifier (30 trees)",
    engineRisk: result.label,
    confidence: Math.round(result.confidence * 1000) / 1000,
    probabilities: Object.fromEntries(Object.entries(result.probs).map(([k, v]) => [k, Math.round(v * 1000) / 1000])),
    contributingFactors: factors,
    ruleBasedCrossCheck: labelRisk(engineTempC, batteryPct, fuelBurnRate, vibrationIndex),
    note: hasVibration ? undefined : "vibrationIndex not supplied — defaulted to a nominal value; supply real accelerometer data for a sharper read.",
  };
}

module.exports = { assessEngineRisk, trainModel, getModel, FEATURES };
