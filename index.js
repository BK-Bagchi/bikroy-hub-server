import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dbConnection from "./config/database.js";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import SSLCommerzPayment from "sslcommerz-lts";
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

// ✔ Get All Orders
app.get("/getOrdersInfo", async (_, res) => {
  try {
    const orders = await placedOrders.find().toArray();
    res.send(orders);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ Ads by User
app.get("/adsByAnUser", async (req, res) => {
  try {
    const userAds = await postAds
      .find({ userEmail: req.query.userEmail })
      .toArray();
    userAds.length
      ? res.json({ userAds })
      : res.status(404).json({ error: "No ads found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ───────────────────── Server ───────────────────── //
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
