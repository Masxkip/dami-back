// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import formsRouter from "./routes/forms.js";

const app = express();

// --- CORS: allow your site(s), localhost, and (optionally) Vercel previews ---
const allowlist = new Set([
  "localhost:5173",
  "heartandcarecleaningservices.ca",
  "www.heartandcarecleaningservices.ca",
  "front-dami.vercel.app", // keep if you still use it
]);

function isAllowedOrigin(origin) {
  // Allow requests without an Origin header (curl, server-to-server)
  if (!origin) return true;

  try {
    const { protocol, hostname, host } = new URL(origin);

    // Only allow http/https origins
    if (!/^https?:$/.test(protocol)) return false;

    // Exact host match (host includes port for localhost)
    if (allowlist.has(host) || allowlist.has(hostname)) return true;

    // (Optional) Allow any Vercel preview domain
    if (hostname.endsWith(".vercel.app")) return true;

    return false;
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, cb) {
    cb(null, isAllowedOrigin(origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  optionsSuccessStatus: 204,
  maxAge: 60 * 60 * 24, // cache preflight for 24h
};

// Apply CORS globally (covers normal + preflight)
app.use(cors(corsOptions));
// Be explicit for any OPTIONS path (wildcard catches all)
app.options("*", cors(corsOptions));

// Parse JSON bodies before routes
app.use(express.json());

// Health check
app.get("/health", (_, res) => res.send("ok"));

// API routes
app.use("/api", formsRouter);

// 404 fallback (JSON)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

// Listen
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
  console.log("Allowed CORS hosts:", [...allowlist].join(", "));
});
