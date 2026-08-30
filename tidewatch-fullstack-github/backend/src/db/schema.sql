-- TideWatch: Sustainable Fisheries Platform
-- PostgreSQL schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE vessels (
  id            VARCHAR(16) PRIMARY KEY,        -- e.g. TV-104
  name          VARCHAR(120) NOT NULL,
  mmsi          VARCHAR(20) UNIQUE NOT NULL,     -- AIS identifier
  captain_name  VARCHAR(120),
  home_port     VARCHAR(120),
  license_no    VARCHAR(60),
  license_expiry DATE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Two-portal auth: 'fisherman' accounts are tied to a vessel_id, 'government'
-- accounts are tied to an officer_id + department. Only one side is populated
-- depending on role.
CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  role          VARCHAR(12) NOT NULL CHECK (role IN ('fisherman','government')),
  email         VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  vessel_id     VARCHAR(16) REFERENCES vessels(id),
  officer_id    VARCHAR(30),
  department    VARCHAR(120),
  license_file_path TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- One row per fishing trip: sea-entry / return times, direction fished,
-- and fuel level logged by the fisherman at departure.
CREATE TABLE trips (
  id            BIGSERIAL PRIMARY KEY,
  vessel_id     VARCHAR(16) REFERENCES vessels(id) ON DELETE CASCADE,
  direction     VARCHAR(1) NOT NULL CHECK (direction IN ('N','S','E','W')),
  entry_time    TIME NOT NULL,
  return_time   TIME NOT NULL,
  fuel_level_pct NUMERIC(4,1),
  trip_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE telemetry (
  id            BIGSERIAL PRIMARY KEY,
  vessel_id     VARCHAR(16) REFERENCES vessels(id) ON DELETE CASCADE,
  lat           DOUBLE PRECISION NOT NULL,
  lon           DOUBLE PRECISION NOT NULL,
  heading_deg   SMALLINT,
  speed_kn      NUMERIC(4,1),
  fuel_pct      NUMERIC(4,1),
  engine_temp_c NUMERIC(4,1),
  battery_pct   NUMERIC(4,1),
  recorded_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_telemetry_vessel_time ON telemetry (vessel_id, recorded_at DESC);

CREATE TABLE geofences (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  kind          VARCHAR(20) NOT NULL CHECK (kind IN ('allowed','restricted','seasonal_ban')),
  polygon_geojson JSONB NOT NULL,
  active_from   DATE,
  active_to     DATE
);

CREATE TABLE geofence_events (
  id            BIGSERIAL PRIMARY KEY,
  vessel_id     VARCHAR(16) REFERENCES vessels(id) ON DELETE CASCADE,
  geofence_id   INTEGER REFERENCES geofences(id),
  event_type    VARCHAR(10) NOT NULL CHECK (event_type IN ('enter','exit')),
  occurred_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE catches (
  id            BIGSERIAL PRIMARY KEY,
  vessel_id     VARCHAR(16) REFERENCES vessels(id) ON DELETE CASCADE,
  species       VARCHAR(80) NOT NULL,
  weight_kg     NUMERIC(8,2) NOT NULL,
  trip_id       UUID NOT NULL,
  logged_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quotas (
  id            SERIAL PRIMARY KEY,
  species       VARCHAR(80) NOT NULL,
  vessel_id     VARCHAR(16) REFERENCES vessels(id) ON DELETE CASCADE,
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  limit_kg      NUMERIC(8,2) NOT NULL
);

CREATE TABLE sustainability_scores (
  id            BIGSERIAL PRIMARY KEY,
  vessel_id     VARCHAR(16) REFERENCES vessels(id) ON DELETE CASCADE,
  score         SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 100),
  bycatch_ratio NUMERIC(5,2),
  computed_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE alerts (
  id            BIGSERIAL PRIMARY KEY,
  vessel_id     VARCHAR(16) REFERENCES vessels(id) ON DELETE CASCADE,
  severity      VARCHAR(10) NOT NULL CHECK (severity IN ('ok','warn','bad')),
  message       TEXT NOT NULL,
  acknowledged  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE weather_readings (
  id            BIGSERIAL PRIMARY KEY,
  region        VARCHAR(80) NOT NULL,
  wave_height_m NUMERIC(4,2),
  wind_speed_kn NUMERIC(4,1),
  visibility_km NUMERIC(5,1),
  recorded_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE compliance_checks (
  id            BIGSERIAL PRIMARY KEY,
  vessel_id     VARCHAR(16) REFERENCES vessels(id) ON DELETE CASCADE,
  license_ok    BOOLEAN,
  quota_ok      BOOLEAN,
  zone_ok       BOOLEAN,
  ais_ok        BOOLEAN,
  log_ok        BOOLEAN,
  checked_at    TIMESTAMPTZ DEFAULT now()
);
