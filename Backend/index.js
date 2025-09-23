import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import tripsRouter from "./routes/trips.routes.js";
import responseRouter from "./responses/trips.respons.js";

const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000", "*"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", tripsRouter); // POST /api/trips
app.use("/api", responseRouter); // GET /api/trips/:email

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});