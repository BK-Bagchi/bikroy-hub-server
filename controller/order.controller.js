import mongoose from "mongoose";
import dotenv from "dotenv";
import addsInfo from "../models/adds.models.js";
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
    const orders = await orderInfo.aggregate([
      {
        $lookup: {
          from: "profileinfos",
          localField: "customerEmail",
          foreignField: "email",
          as: "customerInfo",
        },
      },
      {
        $lookup: {
          from: "profileinfos",
          localField: "sellerEmail",
          foreignField: "email",
          as: "sellerInfo",
        },
      },
    ]);
    if (!orders)
      return res.status(404).json({ error: "Orders not found in db" });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSpecificOrderInfoByOrderInfo = async (req, res) => {
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

export const getSpecificOrderInfoByAdInfo = async (req, res) => {
  try {
    const add = await addsInfo.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.query.addId) } },
      {
        $lookup: {
          from: "orderinfos", // collection name
          localField: "_id", // field in addsInfo
          foreignField: "productId", // field in orderInfo
          as: "orderInfo",
        },
      },
    ]);

    if (!add || add.length === 0)
      return res.status(404).json({ error: "Order not found" });

    res.json(add);
  } catch (err) {
    console.error("Error in getSpecificOrderInfoByAdInfo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOrderStatusByBuyer = async (req, res) => {
  try {
    const result = await orderInfo.updateOne(
      { orderId: req.query.orderId },
      { $set: { orderStatusByBuyer: req.body.status } }
    );
    result.matchedCount > 0
      ? res.status(200).json({ message: "Order status updated" })
      : res.status(404).json({ message: "Order not found" });
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

export const updateOrderStatusByAdmin = async (req, res) => {
  try {
    const result = await orderInfo.updateOne(
      { orderId: req.query.orderId },
      { $set: { orderStatusByAdmin: req.body.status } }
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
