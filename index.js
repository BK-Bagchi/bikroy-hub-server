import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dbConnection from "./config/database.js";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import SSLCommerzPayment from "sslcommerz-lts";
import bikroyDotComRoutes from "./Routes/bikroydotcom.routes.js";

// Load environment variables
dotenv.config();

//define app and port
const app = express();
const port = process.env.DB_PORT || 4000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); // app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); // app.use(bodyParser.urlencoded({ extended: false }));

// SSLCommerz Config
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false; // Change to true in production

// Initialize MongoDB Connection
dbConnection();

// ─────────────────────────────── ROUTES ─────────────────────────────── //
app.use("/", bikroyDotComRoutes);

// ✔ Get All Ads
app.get("/getAdsInfo", async (_, res) => {
  try {
    const ads = await postAds.find().toArray();
    res.send(ads);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ Get All Orders
app.get("/getOrdersInfo", async (_, res) => {
  try {
    const orders = await placedOrders.find().toArray();
    res.send(orders);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ Get Posted Ads by User
app.get("/getPostedAdsByAnUser", async (req, res) => {
  const { userEmail } = req.query;
  try {
    const userAds = await postAds.find({ userEmail }).toArray();
    if (userAds.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ userAds });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ Edit Specific Ad
app.get("/editPostedAdsByAnUser", async (req, res) => {
  try {
    const { userEmail, _id } = req.query;
    const ad = await postAds.findOne({ _id: new ObjectId(_id), userEmail });
    ad
      ? res.json({ editableAd: ad })
      : res.status(404).json({ error: "Ad not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ User Orders
app.get("/ordersByAnUser", async (req, res) => {
  try {
    const userOrders = await placedOrders
      .find({ customerInfo: req.query.userEmail })
      .toArray();
    userOrders.length
      ? res.json({ userOrders })
      : res.status(404).json({ error: "No orders found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ Ads by User
app.get("/adsByAnUser", async (req, res) => {
  try {
    const userAds = await postAds
      .find({ userEmail: req.query.userEmail })
      .toArray();
    userAds.length
      ? res.json({ userAds })
      : res.status(404).json({ error: "No ads found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ Update Ad
app.put("/updateAds", async (req, res) => {
  try {
    const adId = new ObjectId(req.query.adId);
    const updateData = req.body;
    delete updateData._id;

    const result = await postAds.updateOne({ _id: adId }, { $set: updateData });
    result.matchedCount
      ? res.status(200).json({ message: "Ad updated successfully" })
      : res.status(404).json({ message: "Ad not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ Delete Ad + Orders
app.post("/deleteAds", async (req, res) => {
  try {
    const objectId = new ObjectId(req.body.adId);
    const result = await postAds.deleteOne({ _id: objectId });

    if (!result.deletedCount)
      return res.status(404).json({ message: "Ad not found" });

    await placedOrders.deleteMany({ productId: req.body.adId });
    res
      .status(200)
      .json({ message: "Ad and related orders deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✔ Post New Ad
app.post("/postAds", async (req, res) => {
  try {
    const result = await postAds.insertOne(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ───────────────────── SSLCommerz Order ───────────────────── //

app.post("/orderNow", async (req, res) => {
  try {
    const orderId = new ObjectId().toString();
    const product = await postAds.findOne({ _id: new ObjectId(req.body._id) });

    const data = {
      total_amount: product.price,
      currency: "BDT",
      tran_id: orderId,
      success_url: `http://localhost:4000/payment/success/${orderId}/${req.body.userEmail}`,
      fail_url: `http://localhost:4000/payment/fail/${orderId}/${req.body.userEmail}`,
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: req.body.itemName,
      product_category: req.body.category,
      product_profile: "general",
      cus_name: req.body.userName,
      cus_email: req.body.userEmail,
      cus_add1: req.body.shippingAddress,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: req.body.postCode,
      cus_country: "Bangladesh",
      cus_phone: req.body.contactNumber,
      ship_name: req.body.userName,
      ship_add1: req.body.shippingAddress,
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: req.body.postCode,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    await placedOrders.insertOne({
      orderId,
      productId: req.body._id,
      customerInfo: req.body.userEmail,
      customerCredentials: data,
      paymentStatus: false,
    });

    res.send({ url: apiResponse.GatewayPageURL });
  } catch (err) {
    res.status(500).json({ error: "Order initiation failed" });
  }
});

// ✔ Payment Success
app.post("/payment/success/:orderId/:userId", async (req, res) => {
  try {
    const result = await placedOrders.updateOne(
      { orderId: req.params.orderId, customerInfo: req.params.userId },
      { $set: { paymentStatus: true } }
    );

    res.redirect(
      result.modifiedCount > 0
        ? "http://localhost:3000/paymentSuccess"
        : "http://localhost:3000/paymentFailed"
    );
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// ✔ Payment Failed
app.post("/payment/fail/:orderId/:userId", async (req, res) => {
  try {
    await placedOrders.deleteOne({
      orderId: req.params.orderId,
      customerInfo: req.params.userId,
    });
    res.redirect("http://localhost:3000/paymentFailed");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// ✔ Delete Order
app.post("/deleteOrder", async (req, res) => {
  try {
    const result = await placedOrders.deleteOne({ orderId: req.body.orderId });
    result.deletedCount > 0
      ? res.status(200).json({ message: "Order deleted" })
      : res.status(404).json({ message: "Order not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ───────────────────── Server ───────────────────── //
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
