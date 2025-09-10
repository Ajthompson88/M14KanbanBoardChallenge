// src/server.ts
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Sequelize } from "sequelize";

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_URL || "", {
  dialect: "postgres",
  logging: false,
});
const app = express();

// --- middlewares ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"], credentials: true }));

// --- routes ---
// Add .js extension for ES modules
import mainRouter from "./routes/index.js";
app.use(mainRouter);

// Simple health endpoint
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

// --- bootstrap & listen ---
const PORT = Number(process.env.PORT) || 3001;

async function start() {
  try {
    console.log("🔌 Connecting DB…");
    await sequelize.authenticate();
    console.log("🔄 Syncing DB…");
    await sequelize.sync();
    console.log("✅ DB ready");

    const server = app.listen(PORT, () => {
      console.log(`✅ API listening on http://localhost:${PORT}`);
    });

    server.on("error", (err) => {
      console.error("❌ Server listen error:", err);
      process.exit(1);
    });

    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled promise rejection:", err);
    });
    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught exception:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("❌ Fatal startup error:", err);
    process.exit(1);
  }
}

start();