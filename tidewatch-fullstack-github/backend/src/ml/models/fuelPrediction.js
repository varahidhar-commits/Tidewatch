const { fitLinearRegression } = require("../utils/linearRegression");
const { fitRandomForestRegressor } = require("../utils/randomForestRegressor");
const { generateSeedTrips } = require("../data/seedTrips");

const FEATURES = ["distanceNm", "avgSpeedKn", "payloadKg", "waveHeightM", "windKn"];

let cache = null; // trained models are cheap to (re)build; cache per process

function trainModels() {
  const trips = generateSeedTrips(400);
  const X = trips.map((t) => FEATURES.map((f) => t[f]));
  const y = trips.map((t) => t.fuelPctConsumed);

  const linear = fitLinearRegression(X, y);
  const forest = fitRandomForestRegressor(X, y, { nTrees: 30, maxDepth: 7 });
  cache = { linear, forest, trainedAt: new Date().toISOString(), nSamples: trips.length };
  return cache;
}

function getModels() {
  return cache || trainModels();
}

/**
 * predictFuel — ML Model 1
 * @param {object} trip
 *   distanceNm, avgSpeedKn, payloadKg, waveHeightM, windKn : trip features
 *   currentFuelPct : fuel currently in the tank (0-100)
 * @param {"linear"|"randomForest"} algorithm
 */
function predictFuel(trip, algorithm = "randomForest") {
  const { linear, forest } = getModels();
  const features = FEATURES.map((f) => Number(trip[f]) || 0);

  let predictedFuelPct, low, high, method;
  if (algorithm === "linear") {
    predictedFuelPct = linear.predict(features);
    low = predictedFuelPct - 1.96 * linear.stdError;
    high = predictedFuelPct + 1.96 * linear.stdError;
    method = "Linear Regression (baseline)";
  } else {
    const { mean, std, min, max } = forest.predict(features);
    predictedFuelPct = mean;
    low = Math.max(min, mean - 1.96 * std);
    high = Math.min(max, mean + 1.96 * std);
    method = "Random Forest Regressor (30 trees)";
  }

  predictedFuelPct = Math.max(0, Math.round(predictedFuelPct * 10) / 10);
  low = Math.max(0, Math.round(low * 10) / 10);
  high = Math.round(high * 10) / 10;

  const currentFuelPct = trip.currentFuelPct != null ? Number(trip.currentFuelPct) : null;
  const expectedRemainingFuelPct = currentFuelPct != null ? Math.round((currentFuelPct - predictedFuelPct) * 10) / 10 : null;

  let returnRecommendation = null;
  if (expectedRemainingFuelPct != null) {
    if (expectedRemainingFuelPct < 5) returnRecommendation = "RETURN TO SHORE RECOMMENDED — insufficient reserve at current plan.";
    else if (expectedRemainingFuelPct < 12) returnRecommendation = "Caution — reserve will be thin. Consider shortening the trip.";
    else returnRecommendation = "Fuel plan looks sufficient for the trip as described.";
  }

  return {
    model: "fuel-consumption-prediction",
    algorithm: method,
    inputFeatures: Object.fromEntries(FEATURES.map((f, i) => [f, features[i]])),
    predictedFuelConsumedPct: predictedFuelPct,
    confidenceRangePct: { low, high },
    currentFuelPct,
    expectedRemainingFuelPct,
    returnToPortRecommendation: returnRecommendation,
    disclaimer: "Trained on demo/synthetic trip data for this prototype — replace src/ml/data/seedTrips.js with real trip history before production use.",
  };
}

module.exports = { predictFuel, trainModels, getModels, FEATURES };
