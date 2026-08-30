const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed: ${response.status}`
    );
  }

  return data;
}

export const api = {
  health: () => request("/health"),
  vessels: () => request("/vessels"),
  trips: () => request("/trips"),
  catches: () => request("/catches"),
  weather: () => request("/weather"),

  fuelPrediction: (data) =>
    request("/ml/fuel-prediction", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  engineRisk: (data) =>
    request("/ml/engine-risk", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  sustainabilityScore: (data) =>
    request("/ml/sustainability-score", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  safetyRisk: (data) =>
    request("/ml/safety-risk", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  vesselAnomaly: (data) =>
    request("/ml/vessel-anomaly", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  catchAnomaly: (data) =>
    request("/ml/catch-anomaly", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  mlModels: () => request("/ml/models"),
};

export default api;
