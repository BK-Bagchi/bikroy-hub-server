import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    isReported: { type: Boolean, default: false },
    reportedBy: { type: String, enum: ["buyer", "seller"] },
    reason: { type: String, trim: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    resolution: { type: String },
    resolvedAt: { type: Date },
  },
  { _id: false }
);
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "addsInfo" },
    sellerEmail: { type: String },
    customerEmail: { type: String },
    orderCredentials: { type: Object },
    paymentStatus: { type: Boolean, default: false },
    orderStatusByAdmin: {
      type: String,
      enum: ["running", "aborted"],
      default: "running",
    },
    orderStatusByBuyer: {
      type: String,
      enum: ["ordered", "cancelled"],
      default: "ordered",
    },
    orderStatusBySeller: {
      type: String,
      enum: ["pending", "accepted", "cancelled"],
      efault: "pending",
    },
    shipmentStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    dispute: disputeSchema,
  },
  { timestamps: true }
);

const orderInfo = mongoose.model("OrderInfo", orderSchema);
export default orderInfo;
