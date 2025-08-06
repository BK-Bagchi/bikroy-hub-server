import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId },
    customerEmail: { type: String },
    customerCredentials: { type: Object },
    paymentStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const orderInfo = mongoose.model("OrderInfo", orderSchema);
export default orderInfo;
