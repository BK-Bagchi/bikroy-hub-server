import orderInfo from "../models/order.models.js";
import dotenv from "dotenv";
dotenv.config();

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
        ? `${process.env.FRONT_URL}/paymentSuccess`
        : `${process.env.FRONT_URL}/paymentFailed`
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
    res.redirect(`${process.env.FRONT_URL}/paymentFailed`);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
