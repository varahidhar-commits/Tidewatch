// Explainable, additive sustainability score. Deliberately NOT a black-box
// model: each of the four 25-point components is computed from a documented
// rule, so the total is always traceable to specific behaviour — this is
// what "explainable" means in the spec, as opposed to a single opaque number.

function scoreQuotaCompliance({ catchKg, quotaKg }) {
  if (!quotaKg) return { score: 25, detail: "No active quota on file" };
  const ratio = catchKg / quotaKg;
  let score;
  if (ratio <= 0.9) score = 25;
  else if (ratio <= 1.0) score = 22;
  else if (ratio <= 1.1) score = 14;
  else if (ratio <= 1.25) score = 6;
  else score = 0;
  return { score, detail: `${Math.round(ratio * 100)}% of quota used` };
}

function scoreZoneCompliance({ geofenceBreachesLast30d = 0, seasonalBanViolation = false }) {
  let score = 25 - geofenceBreachesLast30d * 8;
  if (seasonalBanViolation) score -= 12;
  score = Math.max(0, score);
  return { score, detail: `${geofenceBreachesLast30d} restricted-zone entr${geofenceBreachesLast30d === 1 ? "y" : "ies"} in the last 30 days${seasonalBanViolation ? "; seasonal ban violation on file" : ""}` };
}

function scoreSpeciesSustainability({ juvenileCatchRatio = 0, protectedSpeciesEvent = false, gearSelectivityOk = true }) {
  let score = 25;
  score -= Math.round(juvenileCatchRatio * 25); // 0-1 ratio directly reduces score
  if (protectedSpeciesEvent) score -= 15;
  if (!gearSelectivityOk) score -= 5;
  score = Math.max(0, score);
  return { score, detail: `Juvenile catch ratio ${Math.round(juvenileCatchRatio * 100)}%${protectedSpeciesEvent ? "; protected-species event on file" : ""}` };
}

function scoreBycatchPerformance({ bycatchRatio = 0, releasedAliveRatio = 1 }) {
  let score = 25 - Math.round(bycatchRatio * 30);
  score += Math.round((releasedAliveRatio - 1) * 10); // penalize low release-alive rate, cap at 0 bonus
  score = Math.max(0, Math.min(25, score));
  return { score, detail: `Bycatch ${Math.round(bycatchRatio * 100)}% of trip catch, ${Math.round(releasedAliveRatio * 100)}% released alive` };
}

/**
 * scoreSustainability — ML Model 4
 * Every input field is optional; missing fields default to a neutral/best
 * case so a partial submission never unfairly tanks the score.
 */
function scoreSustainability(input = {}) {
  const quota = scoreQuotaCompliance(input);
  const zone = scoreZoneCompliance(input);
  const species = scoreSpeciesSustainability(input);
  const bycatch = scoreBycatchPerformance(input);

  const total = quota.score + zone.score + species.score + bycatch.score;

  return {
    model: "sustainability-scoring",
    algorithm: "Explainable weighted rule-based scoring (4 components, 25 pts each)",
    total,
    breakdown: {
      quotaCompliance: { ...quota, max: 25 },
      zoneCompliance: { ...zone, max: 25 },
      speciesSustainability: { ...species, max: 25 },
      bycatchPerformance: { ...bycatch, max: 25 },
    },
    summaryLine: `Quota compliance: ${quota.score}/25 · Zone compliance: ${zone.score}/25 · Species sustainability: ${species.score}/25 · Bycatch performance: ${bycatch.score}/25 · Total: ${total}/100`,
  };
}

module.exports = { scoreSustainability };
