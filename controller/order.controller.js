import orderInfo from "../models/order.models.js";
import { payThroughSsl } from "./sslcomerz.controller.js";

export const postPlaceOrder = async (req, res) => {
  try {
    payThroughSsl(req, res);
  } catch (err) {
    res.status(500).json({ error: "Order initiation failed" });
  }
};

export const getOrdersInfo = async (req, res) => {
  try {
    const orders = await orderInfo.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postDeleteOrder = async (req, res) => {
  try {
    const result = await orderInfo.deleteOne({ orderId: req.query.orderId });
    result.deletedCount > 0
      ? res.status(200).json({ message: "Order deleted" })
      : res.status(404).json({ message: "Order not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrdersByAnUser = async (req, res) => {
  try {
    const userOrders = await orderInfo.find({
      customerEmail: req.query.userEmail,
    });
    res.json({ userOrders });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
