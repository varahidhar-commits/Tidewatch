# TideWatch — Intelligent Fisheries Monitoring Platform

TideWatch is a full-stack prototype for connecting fishermen, fishing vessels, cooperatives and government fisheries authorities through one intelligent maritime monitoring platform.

## Current capabilities

### Fisherman experience
- Fisherman registration and login prototype flow
- Pre-trip safety status: Safe / Caution / Do Not Sail
- Trip details and sailing approval workflow
- Catch logging and quota visibility
- Multilingual UI: English, Tamil, Hindi, Malayalam and Telugu
- Voice-assisted alerts using the browser Web Speech API
- Live ML cards for fuel prediction, engine risk and sustainability
- Network/offline indicator with local catch queueing
- SOS action with nearest patrol recommendation
- Digital Sea Pass after approval with QR generation
- Real vessel map using Leaflet + OpenStreetMap

### Government command centre
- Fleet monitoring and vessel console
- Live operations map with fishing and patrol vessels
- Restricted / approved / weather-risk zones
- Sail approval / denial workflow
- Explainable AI intelligence page
- Vessel movement anomaly and catch anomaly findings
- Command alert strip
- Smart patrol dispatch UI
- Decision analytics
- Trip replay
- Document-expiry intelligence
- Cooperative-network operational view

### ML / intelligence backend
The backend exposes working ML / scoring endpoints for:
- Fuel consumption prediction
- Vessel anomaly detection
- Engine / equipment risk
- Sustainability scoring
- Safety risk scoring
- Catch / quota anomaly detection

The included prototype models are trained on demo / synthetic data. Replace the seeded datasets with real historical operational data before production use.

## Repository structure

```text
tidewatch-fullstack/
├─ frontend/                 React + Vite frontend
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ api/client.js
│  ├─ .env.example
│  └─ package.json
├─ backend/                  Node.js + Express backend
│  ├─ src/
│  │  ├─ routes/
│  │  ├─ ml/
│  │  ├─ db/
│  │  └─ server.js
│  ├─ .env.example
│  ├─ docker-compose.yml
│  └─ package.json
├─ .gitignore
├─ package.json
└─ README.md
```

## Requirements
- Node.js 18+
- npm
- PostgreSQL for database-backed backend routes
- Redis if using the Redis-backed features in the backend configuration
- Docker Desktop is optional; the backend includes Docker configuration

## Quick start

### 1. Clone
```bash
git clone <your-github-repository-url>
cd tidewatch-fullstack
```

### 2. Frontend
```bash
cd frontend
npm install
```

Copy the example environment file:

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Then run:
```bash
npm run dev
```

Frontend: `http://localhost:5173`

### 3. Backend
Open another terminal:

```bash
cd backend
npm install
```

Copy:

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Start the API:
```bash
npm run dev
```

Backend: `http://localhost:4000`

Health check:
```text
http://localhost:4000/api/health
```

### Windows PowerShell note
If `npm` is blocked by the PowerShell execution policy, use:

```powershell
npm.cmd install
npm.cmd run dev
```

## ML verification

Registry:
```powershell
Invoke-RestMethod http://localhost:4000/api/ml/models
```

The frontend calls the same `/api/ml/*` endpoints through `frontend/src/api/client.js`.

## Database / Docker
The backend package contains:
- PostgreSQL schema and seed files
- Dockerfile
- docker-compose.yml

Read `backend/README.md` and `backend/.env.example` for the backend-specific database configuration.

## Important prototype / production note
This repository is an industry-demo prototype. The frontend still contains some demo-state workflows for registration, approval and operational simulation. The backend already exposes database, authentication, vessel, trip, catch, compliance, alert, weather and ML routes, but not every visible frontend interaction has been migrated to persistent server-side storage or WebSocket synchronization yet.

Before production deployment, complete:
1. Persistent API-backed authentication for all frontend login/registration flows
2. PostgreSQL persistence for every trip, approval, catch, SOS and notification interaction
3. Role- and vessel-scoped authorization
4. Socket.IO/WebSocket real-time synchronization
5. Server-side offline reconciliation
6. Production map/weather/AIS data providers
7. Real operational training data and ML validation
8. HTTPS, secrets management, audit logging and monitoring

## GitHub publishing

From the repository root:

```bash
git init
git add .
git commit -m "Initial TideWatch full-stack release"
git branch -M main
git remote add origin <your-github-repository-url>
git push -u origin main
```

## License
Add the license appropriate for your event, institution or organization before public distribution.
