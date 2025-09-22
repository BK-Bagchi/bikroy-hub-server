import express from "express";
import {
  postPaymentFail,
  postPaymentSuccess,
} from "../controller/sslcomerz.controller.js";

const sslcomerzRouter = express.Router();

// ✔ Payment Success//
sslcomerzRouter.post(
  "/payment/success/:orderId/:customerEmail",
  postPaymentSuccess
);

// ✔ Payment Failed//
sslcomerzRouter.post("/payment/fail/:orderId/:customerEmail", postPaymentFail);

export default sslcomerzRouter;
