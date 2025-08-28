import "dotenv/config";
import express from "express";
import cors from "cors";
import formsRouter from "./routes/forms.js";

const app = express();
app.use(express.json());

// Allow your Vercel domain + local dev
app.use(cors({
  origin: [
    "http://localhost:5173",
    "front-dami.vercel.app" // <-- replace later with your real Vercel URL
  ],
  methods: ["POST", "GET"]
}));

app.get("/health", (_, res) => res.send("ok"));
app.use("/api", formsRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API listening on :${port}`));
