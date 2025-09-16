import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    displayName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    photoURL: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    paymentMedia: {
      method: { type: String, enum: ["bank", "bkash", "rocket", "nagad"] },
      accountNumber: { type: String },
    },
    favoriteAdds: [{ type: mongoose.Schema.Types.ObjectId, ref: "addsInfo" }],
  },
  { timestamps: true }
);

const profileInfo = mongoose.model("ProfileInfo", profileSchema);
export default profileInfo;
