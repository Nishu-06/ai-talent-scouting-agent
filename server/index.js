import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import jdRoutes from "./routes/jdRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import resultsRoutes from "./routes/resultsRoutes.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/jd", jdRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/results", resultsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: "Something went wrong while processing the recruitment workflow.",
  });
});

app.listen(env.port, () => {
  console.log(`Talent agent API listening on port ${env.port}`);
});
