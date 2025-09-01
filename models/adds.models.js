import mongoose from "mongoose";

const addsSchema = new mongoose.Schema(
  {
    brand: { type: String },
    category: { type: String },
    description: { type: String },
    email: { type: String },
    itemName: { type: String },
    phoneNumber: { type: String },
    photoURL: { type: String },
    deleteURL: { type: String },
    postingTime: { type: String },
    price: { type: String },
  },
  { timestamps: true }
);

const addsInfo = mongoose.model("AddsInfo", addsSchema);
export default addsInfo;
