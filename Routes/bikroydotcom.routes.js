import express from "express";
import dotenv from "dotenv";
dotenv.config();

const bikroyDotComRoutes = express();

// ─────────────────────────────── ROUTES ─────────────────────────────── //

// ✔ Default Route
bikroyDotComRoutes.get("/", (req, res) =>
  res.redirect(`${process.env.FRONT_URL}`)
);

// ───────────────────── SSLCommerz Order ───────────────────── //

// ───────────────────── SSLCommerz Order ───────────────────── //

// ─────────────────────────────── ROUTES ─────────────────────────────── //

export default bikroyDotComRoutes;
