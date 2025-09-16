import express from "express";
import dotenv from "dotenv";
import {
  getFavoriteAdds,
  getProfileInfo,
  patchAddToFavorites,
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
  updateOrderStatusByPerson,
  getSpecificOrderInfo,
  getPostedOrGotOrdersByABuyerOrSeller,
} from "../controller/order.controller.js";
import {
  postPaymentFail,
  postPaymentSuccess,
} from "../controller/sslcomerz.controller.js";
import { authenticateJWTToken } from "../middleware/authJWT.middleware.js";
import {
  adminResolveDispute,
  disputeManagement,
  getDisputesInfo,
  postAdminPaymentFail,
  postAdminPaymentSuccess,
} from "../controller/dispute.controller.js";
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

// ✔ Adds ad to favorites
bikroyDotComRoutes.patch("/addToFavorites", patchAddToFavorites);

// ✔ Get favorites ads
bikroyDotComRoutes.get("/getFavoriteAdds", getFavoriteAdds);

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
  "/payment/success/:orderId/:customerEmail",
  postPaymentSuccess
);

// ✔ Payment Failed
bikroyDotComRoutes.post(
  "/payment/fail/:orderId/:customerEmail",
  postPaymentFail
);

// ───────────────────── SSLCommerz Order ───────────────────── //

// ✔ Get All Orders
bikroyDotComRoutes.get("/getOrdersInfo", getOrdersInfo);

// ✔ Get A Specific Order
bikroyDotComRoutes.get(
  "/getSpecificOrderInfo", //byOrderInfo
  getSpecificOrderInfo
);

// ✔ Orders by a Specific User (Buyer or Seller)
bikroyDotComRoutes.get("/ordersByAnUser", getOrdersByAnUser);

// ✔ Orders posted by a Specific Buyer or Orders got by a Specific Seller
bikroyDotComRoutes.get(
  "/postedOrGotOrdersByABuyerOrSeller",
  getPostedOrGotOrdersByABuyerOrSeller
);

// ✔ Order status update by admin or buyer or seller
bikroyDotComRoutes.patch(
  "/updateOrderStatusByPerson",
  updateOrderStatusByPerson
);

// ✔ Delete Order
bikroyDotComRoutes.post("/deleteOrder", postDeleteOrder);

// Get disputes info
bikroyDotComRoutes.get("/getDisputesInfo", getDisputesInfo);
// Dispute management
bikroyDotComRoutes.patch("/disputeManagement", disputeManagement);
// Admin resolve dispute (through refund or fund disbursement)
bikroyDotComRoutes.patch("/adminResolveDispute", adminResolveDispute);
// ✔ admin Payment Success
bikroyDotComRoutes.post("/admin/success/:_id", postAdminPaymentSuccess);
// ✔ Admin Payment Failed
bikroyDotComRoutes.post("/admin/fail/:_id", postAdminPaymentFail);

// ─────────────────────────────── ROUTES ─────────────────────────────── //

export default bikroyDotComRoutes;
