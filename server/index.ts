// Load environment variables FIRST before anything else
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Force load .env file and override any existing environment variables
const envConfig = dotenv.parse(
  readFileSync(path.resolve(__dirname, "../.env"))
);

// Override process.env with .env values
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../src/lib/auth";

console.log("🔧 Environment loaded from .env file");
console.log("📍 PORT:", process.env.PORT);
console.log("📍 BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log("📍 VITE_API_URL:", process.env.VITE_API_URL);
console.log("📍 DATABASE_URL configured:", !!process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(
  cors({
    origin: process.env.VITE_API_URL?.replace(':3001', ':5173') || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log("✅ CORS configured for:", process.env.VITE_API_URL?.replace(':3001', ':5173') || "http://localhost:5173");

// Better Auth handler - must be before body parser
// Use a route that captures all paths under /api/auth/
app.use("/api/auth", toNodeHandler(auth));

// Body parser for other routes
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoints available at http://localhost:${PORT}/api/auth/*`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});
