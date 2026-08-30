// Per-trip catch-weight baselines (mean/stdev, kg) and metadata used by the
// catch-anomaly model. DEMO values approximating small-trawler trip catches
// for the Thoothukudi coast — replace with statistics computed from the
// `catches` table once enough real history accumulates
// (see /api/ml/catch-anomaly docs for the recompute endpoint contract).

const SPECIES_BASELINE = {
  "Indian Mackerel": { meanKg: 180, stdKg: 70, maxPlausibleKg: 600, protected: false, typicalZones: ["N", "S", "E"] },
  "Sardine": { meanKg: 220, stdKg: 90, maxPlausibleKg: 700, protected: false, typicalZones: ["N", "S"] },
  "Pomfret": { meanKg: 90, stdKg: 40, maxPlausibleKg: 350, protected: false, typicalZones: ["E", "W"] },
  "Tuna (Skipjack)": { meanKg: 140, stdKg: 65, maxPlausibleKg: 500, protected: false, typicalZones: ["E"] },
  "Prawn": { meanKg: 60, stdKg: 30, maxPlausibleKg: 250, protected: false, typicalZones: ["S", "W"] },
};

// species that should never appear in a legal catch record
const PROTECTED_SPECIES = ["Whale Shark", "Sea Turtle", "Dugong"];

module.exports = { SPECIES_BASELINE, PROTECTED_SPECIES };
