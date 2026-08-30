// DEMO labeled data for the engine-risk classifier. Replace with real
// telemetry joined against incident/maintenance records once available —
// the labeling rule here documents the maritime-engineering heuristic
// used to bootstrap the classifier (this is exactly the deterministic
// fallback the model should degrade to if training data is thin).

function labelRisk(engineTempC, batteryPct, fuelBurnRate, vibrationIndex) {
  if (engineTempC > 96 || batteryPct < 20 || vibrationIndex > 0.85) return "HIGH";
  if (engineTempC > 87 || batteryPct < 45 || fuelBurnRate > 1.35 || vibrationIndex > 0.55) return "MEDIUM";
  return "LOW";
}

function generateSeedEngineData(n = 500, seedRng = Math.random) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const engineTempC = 62 + seedRng() * 42;
    const batteryPct = 8 + seedRng() * 92;
    const fuelBurnRate = 0.4 + seedRng() * 1.6; // liters/nm proxy
    const vibrationIndex = seedRng(); // 0-1 normalized proxy (accelerometer RMS, if available)
    rows.push({
      engineTempC, batteryPct, fuelBurnRate, vibrationIndex,
      risk: labelRisk(engineTempC, batteryPct, fuelBurnRate, vibrationIndex),
    });
  }
  return rows;
}

module.exports = { generateSeedEngineData, labelRisk };
