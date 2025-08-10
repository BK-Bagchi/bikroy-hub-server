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
const allowedOrigins = [
  "https://bikroy-com.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json()); // app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); // app.use(bodyParser.urlencoded({ extended: false }));

// Initialize MongoDB Connection
dbConnection();

// ─────────────────────────────── ROUTES ─────────────────────────────── //
app.use("/", bikroyDotComRoutes);

// ───────────────────── Server ───────────────────── //
app.listen(port, () => {
  console.log(`🚀 Server is running on ${port}`);
});
