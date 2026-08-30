require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { router: authRouter, requireAuth } = require("./routes/auth");
const vesselsRouter = require("./routes/vessels");
const catchesRouter = require("./routes/catches");
const sustainabilityRouter = require("./routes/sustainability");
const weatherRouter = require("./routes/weather");
const geofencingRouter = require("./routes/geofencing");
const alertsRouter = require("./routes/alerts");
const complianceRouter = require("./routes/compliance");
const tripsRouter = require("./routes/trips");
const mlRouter = require("./routes/ml");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 300, // generous limit — IoT devices poll frequently
  })
);

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRouter);

// Both portals read vessel/catch/weather/alert data; writes to compliance
// checks are government-only. Tighten further (e.g. a fisherman may only
// POST telemetry/catches for their own vessel_id) as you build out the UI.
app.use("/api/vessels", vesselsRouter);
app.use("/api/catches", catchesRouter);
app.use("/api/sustainability", sustainabilityRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/geofencing", geofencingRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/compliance", requireAuth(["government"]), complianceRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/ml", mlRouter);

// centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`TideWatch API listening on port ${PORT}`);
  // pre-train the tree-based models so the first live request isn't slow
  try {
    require("./ml/models/fuelPrediction").trainModels();
    require("./ml/models/engineRisk").trainModel();
    require("./ml/models/safetyRisk").trainModel();
    console.log("ML models warmed up (fuel, engine risk, safety risk)");
  } catch (err) {
    console.error("ML warmup failed (models will lazily train on first request instead):", err.message);
  }
});

module.exports = app;
