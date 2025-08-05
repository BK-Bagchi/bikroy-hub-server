import express from "express";
import {
  getProfileInfo,
  postProfileInfo,
  postUserLogin,
} from "../controller/profileInfo.controller.js";

const bikroyDotComRoutes = express();

// ✔ Default Route
bikroyDotComRoutes.get("/", (req, res) =>
  res.send("Welcome to Bikroy.com backend")
);

// ✔ User Login / Register
bikroyDotComRoutes.post("/userLogin", postUserLogin);

// ✔ Get Profile Info
bikroyDotComRoutes.get("/getProfileInfo", getProfileInfo);

// ✔ Update Profile Info
bikroyDotComRoutes.post("/postProfileInfo", postProfileInfo);

export default bikroyDotComRoutes;
