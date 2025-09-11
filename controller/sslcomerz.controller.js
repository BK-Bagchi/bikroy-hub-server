import mongoose from "mongoose";
import SSLCommerzPayment from "sslcommerz-lts";
import orderInfo from "../models/order.models.js";
import addsInfo from "../models/adds.models.js";
import dotenv from "dotenv";
dotenv.config();

// SSLCommerz Config
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false; // Change to true in production

export const payThroughSsl = async (req, res) => {
  const orderId = new mongoose.Types.ObjectId().toString();
  const product = await addsInfo.findById(req.body._id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const data = {
    total_amount: Number(product.price),
    currency: "BDT",
    tran_id: orderId,
    success_url: `${process.env.BASE_URL}/payment/success/${orderId}/${req.body.customerEmail}`,
    fail_url: `${process.env.BASE_URL}/payment/fail/${orderId}/${req.body.customerEmail}`,
    cancel_url: `${process.env.FRONT_URL}/cancel`,
    ipn_url: `${process.env.FRONT_URL}/ipn`,
    shipping_method: "Courier",
    product_name: req.body.itemName,
    product_category: req.body.category,
    product_profile: "general",
    cus_name: req.body.userName || "BikroyHub Admin",
    cus_email: req.body.customerEmail || "addmin@bikroyhub.com",
    cus_add1: req.body.shippingAddress || "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: req.body.postCode,
    cus_country: "Bangladesh",
    cus_phone: req.body.phoneNumber || "01711111111",
    ship_name: req.body.userName,
    ship_add1: req.body.shippingAddress,
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: req.body.postCode,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);

  // Redirect user to payment page
  if (apiResponse.GatewayPageURL) {
    await orderInfo.create({
      orderId,
      productId: new mongoose.Types.ObjectId(req.body._id),
      sellerEmail: req.body.sellerEmail,
      customerEmail: req.body.customerEmail,
      orderCredentials: data,
      dispute: {
        isReported: false,
        report: [
          {
            reportedBy: null,
            reason: null,
          },
        ],
        status: "pending",
        resolution: null,
        resolvedAt: null,
      },
    });
    return res.json({ url: apiResponse.GatewayPageURL });
  } else return res.status(400).send("SSLCommerz session failed!");
};

export const postPaymentSuccess = async (req, res) => {
  try {
    const result = await orderInfo.updateOne(
      { orderId: req.params.orderId, customerEmail: req.params.customerEmail },
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
      customerEmail: req.params.customerEmail,
    });
    res.redirect(`${process.env.FRONT_URL}/paymentFailed`);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
