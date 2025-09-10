import dotenv from "dotenv";
import orderInfo from "../models/order.models.js";
import { payThroughSsl } from "./sslcomerz.controller.js";
dotenv.config();

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
    if (!orders)
      return res.status(404).json({ error: "Orders not found in db" });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSpecificOrderInfo = async (req, res) => {
  try {
    const order = await orderInfo.aggregate([
      { $match: { orderId: req.query.orderId } },
      {
        $lookup: {
          from: "addsinfos", // collection name
          localField: "productId", // field in orderInfo
          foreignField: "_id", // field in addsInfo
          as: "addInfo",
        },
      },
    ]);

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOrderStatusBySeller = async (req, res) => {
  try {
    const result = await orderInfo.updateOne(
      { orderId: req.query.orderId },
      { $set: { orderStatusBySeller: req.body.status } }
    );
    result.matchedCount > 0
      ? res.status(200).json({ message: "Order status updated" })
      : res.status(404).json({ message: "Order not found" });
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
