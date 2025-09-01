import "dotenv/config";
import express from "express";
import cors from "cors";
import formsRouter from "./routes/forms.js";

const app = express();

/**
 * CORS — allow your Vercel app + localhost (scheme-aware)
 * Add any other hosts you deploy to (custom domain, preview URLs, etc.)
 */
const allowedHosts = new Set([
  "localhost:5173",
  "front-dami.vercel.app",
  "heartandcarecleaningservices.ca",
               
]);

const corsOptions = {
  origin(origin, cb) {
    // Allow curl/server-to-server requests (no Origin header)
    if (!origin) return cb(null, true);
    try {
      const { host } = new URL(origin);
      return cb(null, allowedHosts.has(host));
    } catch {
      return cb(null, false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  optionsSuccessStatus: 204,
};

// Apply CORS globally + handle preflight on /api/*
app.use(cors(corsOptions));
app.options("/api/*", cors(corsOptions));

// Parse JSON bodies (must be before routes)
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
  console.log("Allowed CORS hosts:", [...allowedHosts].join(", "));
});
