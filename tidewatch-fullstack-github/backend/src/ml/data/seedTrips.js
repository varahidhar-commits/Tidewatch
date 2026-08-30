// DEMO training data for the fuel-consumption model. In production this
// should be replaced with real historical trip + telemetry records pulled
// from the `trips` and `telemetry` tables (see src/db/schema.sql). The
// generation rule below is a documented, labeled approximation of how
// distance/speed/payload/sea-state affect fuel burn for small trawlers —
// swap this module for a real query against trip history without touching
// the model code.

function generateSeedTrips(n = 400, seedRng = Math.random) {
  const trips = [];
  for (let i = 0; i < n; i++) {
    const distanceNm = 3 + seedRng() * 45;
    const avgSpeedKn = 4 + seedRng() * 10;
    const durationHrs = distanceNm / avgSpeedKn + seedRng() * 2;
    const payloadKg = seedRng() * 450;
    const waveHeightM = seedRng() * 2.2;
    const windKn = seedRng() * 22;

    // baseline burn model: distance + speed dominate, payload and sea-state add drag
    const fuelPct =
      0.55 * distanceNm +
      1.1 * avgSpeedKn +
      0.015 * payloadKg +
      3.2 * waveHeightM +
      0.25 * windKn +
      (seedRng() - 0.5) * 4; // measurement noise

    trips.push({
      distanceNm,
      avgSpeedKn,
      durationHrs,
      payloadKg,
      waveHeightM,
      windKn,
      fuelPctConsumed: Math.max(2, Math.min(100, fuelPct)),
    });
  }
  return trips;
}

module.exports = { generateSeedTrips };
