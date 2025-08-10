import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import orderInfo from "../models/order.models.js";
import addsInfo from "../models/adds.models.js";
import SSLCommerzPayment from "sslcommerz-lts";

// SSLCommerz Config
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false; // Change to true in production

export const postPlaceOrder = async (req, res) => {
  try {
    const orderId = new mongoose.Types.ObjectId().toString();
    const product = await addsInfo.findById(req.body._id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const data = {
      total_amount: product.price,
      currency: "BDT",
      tran_id: orderId,
      success_url: `http://localhost:4000/payment/success/${orderId}/${req.body.customerEmail}`,
      fail_url: `http://localhost:4000/payment/fail/${orderId}/${req.body.customerEmail}`,
      cancel_url: "http://localhost:3000/cancel",
      ipn_url: "http://localhost:3000/ipn",
      shipping_method: "Courier",
      product_name: req.body.itemName,
      product_category: req.body.category,
      product_profile: "general",
      cus_name: req.body.userName,
      cus_email: req.body.customerEmail,
      cus_add1: req.body.shippingAddress,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: req.body.postCode,
      cus_country: "Bangladesh",
      cus_phone: req.body.phoneNumber,
      ship_name: req.body.userName,
      ship_add1: req.body.shippingAddress,
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: req.body.postCode,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    await orderInfo.create({
      orderId,
      productId: new mongoose.Types.ObjectId(req.body._id),
      sellerEmail: req.body.sellerEmail,
      customerCredentials: data,
      paymentStatus: false,
    });
    // console.log(console.log({ body: req.body, data: data }));

    res.send({ url: apiResponse.GatewayPageURL });
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
      "customerCredentials.cus_email": req.query.userEmail,
    });
    userOrders.length
      ? res.json({ userOrders })
      : res.status(404).json({ error: "No orders found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
