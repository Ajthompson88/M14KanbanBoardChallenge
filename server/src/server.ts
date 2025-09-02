// src/server.ts
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser"; // ok to keep even if not used yet
import cors from "cors"; // not required when using Vite proxy in dev
import { Sequelize } from "sequelize"; // Adjust the path as needed

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || "", {
  dialect: "postgres", // Adjust the dialect to match your database
  logging: false, // Disable logging or customize as needed
});
const app = express();

// --- middlewares ---
app.use(express.json());
app.use(cookieParser());
// If you still want CORS during dev, you can enable it (harmless with proxy):
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"], credentials: true }));

// --- routes ---
// Mount your routers here:
import authRouter from "./routes/auth-routes";
import apiRouter from "./routes/api";
app.use("/auth", authRouter);
app.use("/api", apiRouter);

// Simple health endpoint (handy for testing/wait-on)
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

// --- bootstrap & listen ---
const PORT = Number(process.env.PORT) || 3001;

async function start() {
  try {
    // If you initialize a DB before listen, log around it so hangs are obvious:
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
