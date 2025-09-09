import express from "express";
import dotenv from "dotenv";
import {
  getProfileInfo,
  postProfileInfo,
  postUserLogin,
} from "../controller/profileInfo.controller.js";

import {
  getAddsInfo,
  getSpecificAdd,
  postAdds,
  getPostedAdsByAnUser,
  editPostedAddsByAnUser,
  putUpdateAdds,
  postDeleteAdds,
  putUpdateAddStatus,
} from "../controller/adds.controller.js";

import {
  getOrdersByAnUser,
  getOrdersInfo,
  postPlaceOrder,
  postDeleteOrder,
} from "../controller/order.controller.js";
import {
  postPaymentFail,
  postPaymentSuccess,
} from "../controller/sslcomerz.controller.js";
import { authenticateJWTToken } from "../middleware/authJWT.middleware.js";
dotenv.config();

const bikroyDotComRoutes = express();

// ─────────────────────────────── ROUTES ─────────────────────────────── //

// ✔ Default Route
bikroyDotComRoutes.get("/", (req, res) =>
  res.redirect(`${process.env.FRONT_URL}`)
);

// ✔ User Login / Register
bikroyDotComRoutes.post("/userLogin", postUserLogin);

// ✔ Get Profile Info
bikroyDotComRoutes.get("/getProfileInfo", authenticateJWTToken, getProfileInfo);

// ✔ Update Profile Info
bikroyDotComRoutes.post("/postProfileInfo", postProfileInfo);

// ✔ Get All Ads
bikroyDotComRoutes.get("/getAddsInfo", getAddsInfo);

// ✔ Get Specific Ad
bikroyDotComRoutes.get("/getSpecificAdd", getSpecificAdd);

// ✔ Post New Add
bikroyDotComRoutes.post("/postAdds", postAdds);

// ✔ View Posted Adds by User
bikroyDotComRoutes.get("/getPostedAddsByAnUser", getPostedAdsByAnUser);

// ✔ Edit Specific Ad
bikroyDotComRoutes.get("/editPostedAddsByAnUser", editPostedAddsByAnUser);

// ✔ Update Ad
bikroyDotComRoutes.put("/updateAdds", putUpdateAdds);
bikroyDotComRoutes.put("/updateAddStatus", putUpdateAddStatus);

// ✔ Delete Ad + Orders
bikroyDotComRoutes.post("/deleteAdds", postDeleteAdds);

// ───────────────────── SSLCommerz Order ───────────────────── //

// ✔ Place Orders
bikroyDotComRoutes.post("/placeOrder", postPlaceOrder);

// ✔ Payment Success
bikroyDotComRoutes.post(
  "/payment/success/:orderId/:userId",
  postPaymentSuccess
);

// ✔ Payment Failed
bikroyDotComRoutes.post("/payment/fail/:orderId/:userId", postPaymentFail);

// ───────────────────── SSLCommerz Order ───────────────────── //

// ✔ Get All Orders
bikroyDotComRoutes.get("/getOrdersInfo", getOrdersInfo);

// ✔ Orders by a Specific User
bikroyDotComRoutes.get("/ordersByAnUser", getOrdersByAnUser);

// ✔ Delete Order
bikroyDotComRoutes.post("/deleteOrder", postDeleteOrder);

// ─────────────────────────────── ROUTES ─────────────────────────────── //

export default bikroyDotComRoutes;
