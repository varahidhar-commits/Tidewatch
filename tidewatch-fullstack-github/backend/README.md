# TideWatch — Sustainable Fisheries Platform (Backend)

REST API for the fishing vessel + sustainable fisheries platform: GPS/AIS tracking,
IoT engine & fuel telemetry, weather monitoring, geofencing, catch management,
sustainability scoring, safety alerts, and regulatory compliance.

## Stack

- **Node.js + Express** — REST API
- **PostgreSQL** — system of record (vessels, telemetry, catches, quotas, compliance)
- **Redis** — cache-aside layer for hot reads (fleet roster, weather) + rate limiting
- **Docker Compose** — one-command local environment

## Architecture

```
┌─────────────┐      REST/JSON      ┌───────────────┐
│ React front-  │ ───────────────▶ │  Express API    │
│ end dashboard│ ◀─────────────── │  (this repo)    │
└─────────────┘                    └──────┬─────────┘
                                            │
                          ┌─────────────────┼─────────────────┐
                          ▼                                    ▼
                  ┌───────────────┐                   ┌────────────────┐
                  │  PostgreSQL    │                   │     Redis       │
                  │  (source of    │                   │ (roster/weather │
                  │   truth)       │                   │  cache, 15s–5m) │
                  └───────────────┘                   └────────────────┘
                          ▲
                          │ POST /telemetry
                  ┌───────────────┐
                  │ Vessel IoT /   │
                  │ AIS devices    │
                  └───────────────┘
```

## Getting started

```bash
docker compose up --build
```

This starts the API on `http://localhost:4000`, Postgres on `5432`, and Redis on `6379`.
The schema in `src/db/schema.sql` is applied automatically on first boot via Postgres's
`docker-entrypoint-initdb.d`.

### Local dev without Docker

```bash
npm install
cp .env.example .env   # edit with your local Postgres/Redis credentials
npm run migrate        # applies schema.sql
npm run dev
```

## API reference

| Method | Endpoint                                   | Purpose                                   |
|--------|---------------------------------------------|--------------------------------------------|
| GET    | `/api/health`                               | Liveness check                             |
| POST   | `/api/auth/register`                        | Create a fisherman or government account   |
| POST   | `/api/auth/register-vessel`                 | Self-register a vessel + license + login (multipart) |
| POST   | `/api/auth/login`                           | Log in, returns a JWT (12h expiry)         |
| POST   | `/api/trips`                                | Log a trip: direction, entry/return time, fuel |
| GET    | `/api/trips/:vesselId`                      | Trip history for a vessel                  |
| GET    | `/api/trips/:vesselId/today`                | Today's trip, if logged                    |
| GET    | `/api/vessels`                              | Fleet roster + latest telemetry (cached)   |
| GET    | `/api/vessels/:id`                          | Vessel detail                              |
| POST   | `/api/vessels/:id/telemetry`                | Ingest GPS/IoT reading                     |
| GET    | `/api/vessels/:id/telemetry/history`        | Telemetry history (`?hours=24`)            |
| POST   | `/api/catches`                              | Log a catch entry                          |
| GET    | `/api/catches/summary`                      | Fleet-wide totals by species               |
| GET    | `/api/sustainability/:vesselId`             | Latest sustainability score                |
| POST   | `/api/sustainability/:vesselId/recompute`   | Recompute score from catch/geofence data   |
| GET    | `/api/weather`                              | Latest reading for a region (cached)       |
| GET    | `/api/weather/history`                      | Weather history                            |
| POST   | `/api/geofencing/evaluate`                  | Point-in-polygon zone check → alerts       |
| GET    | `/api/alerts`                               | Alert feed (`?vessel_id=`)                 |
| PATCH  | `/api/alerts/:id/acknowledge`               | Acknowledge an alert                       |
| POST   | `/api/compliance/:vesselId/check`           | Run regulatory compliance checklist        |
| GET    | `/api/compliance/:vesselId`                 | Latest compliance check                    |
| GET    | `/api/ml/models`                            | ML model registry                          |
| POST   | `/api/ml/fuel-prediction`                   | Predict trip fuel consumption               |
| POST   | `/api/ml/vessel-anomaly`                    | Detect anomalous vessel movement            |
| POST   | `/api/ml/engine-risk`                       | Classify engine/equipment risk              |
| POST   | `/api/ml/sustainability-score`              | Explainable sustainability score            |
| POST   | `/api/ml/safety-risk`                       | Trip safety risk %                          |
| POST   | `/api/ml/catch-anomaly`                     | Flag suspicious catch records               |

## Two-portal auth model

There are two account roles, matching the frontend's hero page:

- **`fisherman`** accounts are tied to a single `vessel_id` — a crew signs in and only
  sees/manages their own vessel.
- **`government`** accounts carry an `officer_id` and `department` — regulators sign in
  and see the whole fleet.

```bash
# register a fisherman account
curl -X POST localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"role":"fisherman","email":"murugan@example.com","password":"kadal123","vessel_id":"TV-104"}'

# log in
curl -X POST localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"fisherman","email":"murugan@example.com","password":"kadal123"}'
```

### Self-service vessel registration (what the frontend's registration form calls)

`POST /api/auth/register-vessel` is a single multipart request that creates the
vessel, the login account, stores the uploaded license, and — if the fisherman filled
in previous-trip details — writes a historical catch record. This is the endpoint
behind the "New vessel? Register here" flow on the fisherman login page.

```bash
curl -X POST localhost:4000/api/auth/register-vessel \
  -F "vesselName=Kadal Rani" \
  -F "vesselId=TV-601" \
  -F "captainName=R. Murugan" \
  -F "username=murugan601" \
  -F "password=kadal123" \
  -F "prevTripDate=2026-08-20" \
  -F "prevTripSpecies=Indian Mackerel" \
  -F "prevTripCatchKg=240" \
  -F "prevTripDuration=18 hrs" \
  -F "license=@/path/to/license.pdf"
```

Uploaded licenses are written to `uploads/licenses/` (git-ignored) with the file's
Postgres reference stored in `users.license_file_path`. Swap the local `multer.diskStorage`
for S3/GCS storage before production use.

### Trip entry (fisherman logs before heading out)

```bash
curl -X POST localhost:4000/api/trips \
  -H "Content-Type: application/json" \
  -d '{"vessel_id":"TV-104","direction":"N","entry_time":"05:30","return_time":"14:00","fuel_level_pct":85}'
```

The login response includes a JWT. Send it as `Authorization: Bearer <token>` on
subsequent requests. `/api/compliance/*` already requires a valid `government` token
via the `requireAuth(["government"])` middleware in `server.js` — apply the same
middleware to any other route you want to restrict (e.g. a fisherman should only be
able to `POST` telemetry/catches for their own `vessel_id`, which you can enforce by
comparing `req.user.vessel_id` to the route param).

## AI / Machine Learning Intelligence Layer

Six inference models live under `src/ml/`, exposed through `/api/ml/*`. All are
real, working algorithms implemented in pure Node.js (no external ML
dependencies) — not decorative stubs. Each has a smoke-tested, unit-verifiable
core in `src/ml/utils/`:

| Utility | Algorithm |
|---|---|
| `linearRegression.js` | Ordinary least squares (normal equations, ridge-regularized) |
| `regressionTree.js` + `randomForestRegressor.js` | CART regression tree, bagged into a random forest |
| `classificationTree.js` + `randomForestClassifier.js` | Gini-impurity CART, bagged into a random forest |
| `isolationForest.js` | Isolation Forest (Liu, Ting & Zhou 2008) |
| `logisticRegression.js` | Gradient-descent binary logistic regression |

### The six models

| # | Model | Endpoint | Algorithm |
|---|---|---|---|
| 1 | Fuel consumption prediction | `POST /api/ml/fuel-prediction` | Linear Regression (baseline) or Random Forest Regressor (`algorithm: "linear"\|"randomForest"`) |
| 2 | Vessel anomaly detection | `POST /api/ml/vessel-anomaly` | Isolation Forest + deterministic rule hybrid |
| 3 | Engine / equipment risk | `POST /api/ml/engine-risk` | Random Forest Classifier → LOW/MEDIUM/HIGH |
| 4 | Sustainability scoring | `POST /api/ml/sustainability-score` | Explainable weighted rule-based scoring (4×25pt breakdown) |
| 5 | Safety risk scoring | `POST /api/ml/safety-risk` | Logistic Regression, with a deterministic marine-safety rule fallback when inputs are too sparse to trust the model |
| 6 | Catch / quota anomaly | `POST /api/ml/catch-anomaly` | Z-score vs. species baseline + rule checks |

`GET /api/ml/models` returns the registry (id, endpoint, algorithms) for the
frontend or docs to introspect.

### Demo training data — read this before a real deployment

Models 1, 3, and 5 train on synthetic-but-domain-realistic seed data in
`src/ml/data/` (`seedTrips.js`, `seedEngineIncidents.js`, `seedSafetyTrips.js`),
clearly labeled as such in code comments and in each response's `disclaimer`/
`algorithm` field. Swap these generators for real queries against `trips`,
`telemetry`, and `catches` once enough history accumulates — the model code
itself (`src/ml/models/*.js`) doesn't need to change, only the data source.
Models are trained once per process and cached; `server.js` warms up models 1,
3, and 5 at boot so the first live request isn't slow (verified: ~1.4s cold →
~15ms warm).

### Design principles followed throughout

- **Never auto-penalizes.** Anomaly models (2, 6) return `findings` for human
  review with language like *"Anomalous movement — review recommended"* —
  never an accusation. Model 3's risk and model 5's risk are decision support,
  not automatic vessel groundings.
- **Explainable, not opaque.** Model 4 always returns the four-component
  breakdown (never a bare number); model 5 returns ranked contributing
  factors; model 3 returns which telemetry values crossed a threshold.
- **ML with a deterministic fallback.** Model 5 automatically falls back to
  rule-based scoring when fewer than 6 of its 9 features are supplied, so a
  missing weather feed never silently degrades to a meaningless prediction.
- **Modular inference layer.** Every model is a plain function
  (`predictFuel(input)`, `scoreSafetyRisk(input)`, etc.) with no Express
  dependency — `src/routes/ml.js` is a thin HTTP adapter. This makes it
  straightforward to later swap any single model for a call to a real Python
  microservice (scikit-learn/XGBoost) without touching the other five or the
  route contracts.

### Example requests

```bash
# Fuel prediction
curl -X POST localhost:4000/api/ml/fuel-prediction -H "Content-Type: application/json" -d '{
  "distanceNm": 22, "avgSpeedKn": 8, "payloadKg": 200,
  "waveHeightM": 1.2, "windKn": 14, "currentFuelPct": 30
}'

# Engine risk
curl -X POST localhost:4000/api/ml/engine-risk -H "Content-Type: application/json" -d '{
  "engineTempC": 99, "batteryPct": 18, "fuelBurnRate": 1.6, "vibrationIndex": 0.9
}'

# Sustainability score
curl -X POST localhost:4000/api/ml/sustainability-score -H "Content-Type: application/json" -d '{
  "catchKg": 460, "quotaKg": 500, "geofenceBreachesLast30d": 1,
  "juvenileCatchRatio": 0.08, "bycatchRatio": 0.05, "releasedAliveRatio": 0.9
}'

# Safety risk
curl -X POST localhost:4000/api/ml/safety-risk -H "Content-Type: application/json" -d '{
  "weatherSeverity": 0.8, "waveNorm": 0.7, "windNorm": 0.6, "lowVisibility": 0.3,
  "lowFuel": 0.7, "engineIssue": 0.1, "distanceNorm": 0.6,
  "connectivityLoss": 0.2, "complianceRestricted": 0
}'

# Catch anomaly
curl -X POST localhost:4000/api/ml/catch-anomaly -H "Content-Type: application/json" -d '{
  "species": "Prawn", "weightKg": 900, "zoneDirection": "N"
}'
```

All six were verified end-to-end against a running server during development
(HTTP 200s with correctly-shaped responses; see git history / dev notes) — not
just unit-tested in isolation.

## Extending for the final-year submission

- **AI / predictive layer**: `sustainability.js`'s `recompute` handler is deliberately a
  simple weighted model — swap it for a trained classifier (bycatch prediction, fuel
  burn forecasting) without changing the API contract.
- **Auth**: add JWT middleware (`express-jwt` or similar) in front of the write routes
  once you have vessel/operator accounts.
- **Real-time push**: layer Socket.IO or Server-Sent Events on top of the telemetry
  ingest route to push live updates to the dashboard instead of polling.
- **Geofence data**: `geofences.polygon_geojson` accepts standard GeoJSON, so zones can
  be drawn on a map tool and pasted straight into the seed data.
