import mongoose from "mongoose";
import orderInfo from "../models/order.models.js";

//postPlaceOrder, postPaymentSuccess, postPaymentFail together works wil SSLCommerz
// import { postPlaceOrder } from "./order.controller.js";
export const postPaymentSuccess = async (req, res) => {
  try {
    const result = await orderInfo.updateOne(
      { orderId: req.params.orderId, customerInfo: req.params.userId },
      { $set: { paymentStatus: true } }
    );

    res.redirect(
      result.modifiedCount > 0
        ? "https://bikroy-com.netlify.app//paymentSuccess"
        : "https://bikroy-com.netlify.app//paymentFailed"
    );
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const postPaymentFail = async (req, res) => {
  try {
    await orderInfo.deleteOne({
      orderId: req.params.orderId,
      customerInfo: req.params.userId,
    });
    res.redirect("https://bikroy-com.netlify.app/paymentFailed");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
