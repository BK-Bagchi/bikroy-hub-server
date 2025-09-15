import SSLCommerzPayment from "sslcommerz-lts";
import dotenv from "dotenv";
import orderInfo from "../models/order.models.js";
import addsInfo from "../models/adds.models.js";
dotenv.config();

// SSLCommerz Config
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false; // Change to true in production

export const adminResolveDispute = async (req, res) => {
  try {
    const orderDetails = await orderInfo.findById(req.query.id);
    if (!orderDetails)
      return res.status(404).json({ error: "Order not found" });

    const orderId = orderDetails.orderId;
    const product = await addsInfo.findById(req.body._id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const data = {
      total_amount: Number(product.price),
      currency: "BDT",
      tran_id: orderId,
      success_url: `${process.env.BASE_URL}/admin/success/${orderDetails._id}`,
      fail_url: `${process.env.BASE_URL}/admin/fail/${orderDetails._id}`,
      cancel_url: `${process.env.FRONT_URL}/cancel`,
      ipn_url: `${process.env.FRONT_URL}/ipn`,
      shipping_method: "Courier",
      product_name: product.itemName || "BikroyHubItem",
      product_category: product.category || "BikroyHubCategory",
      product_profile: "general",
      cus_name: product.userName || "BikroyHub Admin",
      cus_email: req.body.customerEmail || "addmin@bikroyhub.com",
      cus_add1: req.body.shippingAddress || "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      ship_name: "BikroyHub Admin",
      ship_add1: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
    };

    //refund through sslcommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    // Redirect user to payment page
    if (apiResponse.GatewayPageURL)
      return res.json({ url: apiResponse.GatewayPageURL });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDisputesInfo = async (req, res) => {
  try {
    const result = await orderInfo.aggregate([
      { $match: { "dispute.isReported": true } },
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
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const disputeManagement = async (req, res) => {
  try {
    const result = await orderInfo.updateOne(
      { orderId: req.query.orderId },
      {
        $set: { "dispute.isReported": true },
        $push: {
          "dispute.report": {
            reportedBy: req.body.reportedBy,
            reason: req.body.reason,
          },
        },
      }
    );

    if (result.matchedCount > 0) {
      res.status(200).json({ message: "Dispute updated successfully" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postAdminPaymentSuccess = async (req, res) => {
  try {
    const result = await orderInfo.updateOne(
      { _id: req.params._id },
      {
        $set: {
          "dispute.status": "resolved",
          "dispute.resolution": req.body.resolution,
          "dispute.resolvedAt": new Date(),
        },
      }
    );
    res.redirect(
      result.modifiedCount > 0
        ? `${process.env.FRONT_URL}/admin/success`
        : `${process.env.FRONT_URL}/admin/fail`
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postAdminPaymentFail = async (req, res) => {
  try {
    res.redirect(`${process.env.FRONT_URL}/admin/fail`);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
