const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { pool } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRY = "12h";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

const upload = multer({
  dest: path.join(__dirname, "../../uploads/licenses"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = ["application/pdf", "image/jpeg", "image/png"].includes(file.mimetype);
    cb(ok ? null : new Error("License must be a PDF, JPG, or PNG"), ok);
  },
});

// POST /api/auth/register-vessel  (multipart/form-data)
// fields: vesselName, vesselId, captainName, username, password,
//         prevTripDate?, prevTripSpecies?, prevTripCatchKg?, prevTripDuration?
// file:   license
// One request creates the vessel, the fisherman's login account, the
// uploaded license reference, and an optional historical trip/catch record —
// mirroring the single registration form on the frontend.
router.post("/register-vessel", upload.single("license"), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const {
      vesselName, vesselId, captainName, username, password,
      prevTripDate, prevTripSpecies, prevTripCatchKg, prevTripDuration,
    } = req.body;

    if (!vesselName || !vesselId || !captainName || !username || !password) {
      return res.status(400).json({ error: "vesselName, vesselId, captainName, username, password are required" });
    }
    if (!req.file) return res.status(400).json({ error: "Fishing license file is required" });

    await client.query("BEGIN");

    const mmsi = `4190${Math.floor(Math.random() * 90000 + 10000)}`;
    await client.query(
      `INSERT INTO vessels (id, name, mmsi, captain_name, home_port)
       VALUES ($1,$2,$3,$4,'Thoothukudi Harbor')
       ON CONFLICT (id) DO NOTHING`,
      [vesselId.toUpperCase(), vesselName, mmsi, captainName]
    );

    const password_hash = await bcrypt.hash(password, 10);
    const { rows: userRows } = await client.query(
      `INSERT INTO users (role, email, password_hash, vessel_id, license_file_path)
       VALUES ('fisherman', $1, $2, $3, $4)
       RETURNING id, role, email, vessel_id`,
      [username, password_hash, vesselId.toUpperCase(), req.file.path]
    );

    if (prevTripDate && prevTripSpecies && prevTripCatchKg) {
      await client.query(
        `INSERT INTO catches (vessel_id, species, weight_kg, trip_id, logged_at)
         VALUES ($1,$2,$3, gen_random_uuid(), $4)`,
        [vesselId.toUpperCase(), prevTripSpecies, prevTripCatchKg, prevTripDate]
      );
    }

    await client.query("COMMIT");

    const user = userRows[0];
    const token = signToken({ sub: user.id, role: "fisherman", vessel_id: user.vessel_id });
    res.status(201).json({ user, token });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") return res.status(409).json({ error: "Vessel ID or username already registered" });
    next(err);
  } finally {
    client.release();
  }
});

// POST /api/auth/register
// body: { role: 'fisherman'|'government', email, password, vessel_id?, officer_id?, department? }
router.post("/register", async (req, res, next) => {
  try {
    const { role, email, password, vessel_id, officer_id, department } = req.body;
    if (!role || !email || !password) {
      return res.status(400).json({ error: "role, email, password are required" });
    }
    if (role === "fisherman" && !vessel_id) {
      return res.status(400).json({ error: "vessel_id is required for fisherman accounts" });
    }
    if (role === "government" && (!officer_id || !department)) {
      return res.status(400).json({ error: "officer_id and department are required for government accounts" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (role, email, password_hash, vessel_id, officer_id, department)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, role, email, vessel_id, officer_id, department`,
      [role, email, password_hash, vessel_id || null, officer_id || null, department || null]
    );

    const user = rows[0];
    const token = signToken({ sub: user.id, role: user.role, vessel_id: user.vessel_id, officer_id: user.officer_id });
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already registered" });
    next(err);
  }
});

// POST /api/auth/login
// body: { role: 'fisherman'|'government', email, password }
router.post("/login", async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
      return res.status(400).json({ error: "role, email, password are required" });
    }
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND role = $2`,
      [email, role]
    );
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ sub: user.id, role: user.role, vessel_id: user.vessel_id, officer_id: user.officer_id });
    delete user.password_hash;
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

// middleware other routers can use to require a valid session
function requireAuth(allowedRoles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing bearer token" });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ error: "Not authorized for this resource" });
      }
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = { router, requireAuth };
