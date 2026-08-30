// DEMO labeled data for the trip safety-risk logistic model. Each feature
// is pre-normalized to [0,1] (higher = worse) so learned weight signs are
// directly interpretable. Replace with real historical trip outcomes
// (near-misses, SOS events, safe returns) once logged by the platform.

function generateSeedSafetyTrips(n = 600, seedRng = Math.random) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const weatherSeverity = seedRng();       // 0 calm .. 1 severe
    const waveNorm = seedRng();              // 0 .. 1 (relative to 3m cap)
    const windNorm = seedRng();              // 0 .. 1 (relative to 35kn cap)
    const lowVisibility = seedRng();         // 0 clear .. 1 fog/near-zero visibility
    const lowFuel = seedRng();               // 0 full .. 1 near-empty
    const engineIssue = seedRng() > 0.85 ? seedRng() : seedRng() * 0.2; // mostly low, occasionally elevated
    const distanceNorm = seedRng();          // 0 near shore .. 1 far offshore
    const connectivityLoss = seedRng() > 0.8 ? seedRng() : seedRng() * 0.15;
    const complianceRestricted = seedRng() > 0.9 ? 1 : 0;

    const riskScore =
      2.4 * weatherSeverity + 2.1 * waveNorm + 1.6 * windNorm + 1.2 * lowVisibility +
      1.9 * lowFuel + 1.7 * engineIssue + 1.1 * distanceNorm + 1.3 * connectivityLoss +
      2.6 * complianceRestricted - 5.2 + (seedRng() - 0.5) * 1.2;

    const unsafe = riskScore > 0 ? 1 : 0;

    rows.push({
      weatherSeverity, waveNorm, windNorm, lowVisibility, lowFuel,
      engineIssue, distanceNorm, connectivityLoss, complianceRestricted, unsafe,
    });
  }
  return rows;
}

module.exports = { generateSeedSafetyTrips };
