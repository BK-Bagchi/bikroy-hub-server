import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dbConnection from "./config/database.js";
// import bikroyDotComRoutes from "./Routes/bikroydotcom.routes.js";
import addsRouter from "./Routes/adds.routes.js";
import disputeRouter from "./Routes/dispute.routes.js";
import orderRouter from "./Routes/order.routes.js";
import profileInfoRouter from "./Routes/profileInfo.routes.js";
import sslcomerzRouter from "./Routes/sslcomerz..routes.js";
import chatSocket from "./socket/chatSocket.js";

// Load environment variables
dotenv.config();

//define app and port
const app = express();
const port = process.env.DB_PORT || 4000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // allow all origins dynamically
    credentials: true,
  })
);

app.use(express.json()); // app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); // app.use(bodyParser.urlencoded({ extended: false }));

// ───────────────────── Socket.io ───────────────────── //
// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
  },
});
chatSocket(io);

// Initialize MongoDB Connection
dbConnection();

// ─────────────────────────────── ROUTES ─────────────────────────────── //
app.get("/", (req, res) => res.redirect(`${process.env.FRONT_URL}`));
app.use("/adds", addsRouter);
app.use("/dispute", disputeRouter);
app.use("/order", orderRouter);
app.use("/profileInfo", profileInfoRouter);
app.use("/sslcomerz", sslcomerzRouter);

// ───────────────────── Server ───────────────────── //
server.listen(port, () => {
  console.log(`🚀 Server is running on ${port}`);
});
