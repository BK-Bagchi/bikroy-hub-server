import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import dbConnection from "./config/database.js";
import bikroyDotComRoutes from "./Routes/bikroydotcom.routes.js";

// Load environment variables
dotenv.config();

//define app and port
const app = express();
const port = process.env.DB_PORT || 4000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); // app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); // app.use(bodyParser.urlencoded({ extended: false }));

// Initialize MongoDB Connection
dbConnection();

// ─────────────────────────────── ROUTES ─────────────────────────────── //
app.use("/", bikroyDotComRoutes);

// ───────────────────── Server ───────────────────── //
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
