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

export const updateOrderStatusByPerson = async (req, res) => {
  const { person } = req.body;
  let orderStatusByPerson = "";
  if (person === "buyer") orderStatusByPerson = "orderStatusByBuyer";
  else if (person === "seller") orderStatusByPerson = "orderStatusBySeller";
  else if (person === "admin") orderStatusByPerson = "orderStatusByAdmin";

  try {
    const result = await orderInfo.updateOne(
      { orderId: req.query.orderId },
      { $set: { [orderStatusByPerson]: req.body.status } }
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
  const { person } = req.query;
  let personEmail = "";
  if (person === "buyer") personEmail = "customerEmail";
  else if (person === "seller") personEmail = "sellerEmail";
  else return res.status(400).json({ error: "Invalid person type" });

  try {
    const userOrders = await orderInfo.find({
      [personEmail]: req.query.userEmail,
    });
    res.json({ userOrders });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostedOrGotOrdersByABuyerOrSeller = async (req, res) => {
  const { person } = req.query;
  let personEmail = "";
  if (person === "buyer") personEmail = "customerEmail";
  else if (person === "seller") personEmail = "sellerEmail";
  try {
    const response = await orderInfo.aggregate([
      { $match: { [personEmail]: req.query.userEmail } },
      {
        $lookup: {
          from: "addsinfos", // collection name
          localField: "productId", // field in addsInfo
          foreignField: "_id", // field in orderInfo
          as: "addsInfo",
        },
      },
    ]);

    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
