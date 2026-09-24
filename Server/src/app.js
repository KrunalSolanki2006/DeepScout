import express from "express";
import cors from "cors";

import investigationRoutes from "./Routes/investigation.routes.js";

const app = express();

app.use(cors());

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "DeepScout API",
  });
});

app.use("/api", investigationRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    error: "Internal server error",
  });
});

export default app;
