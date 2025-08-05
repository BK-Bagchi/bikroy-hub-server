import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  aboutBusiness: { type: String },
  businessName: { type: String },
  displayName: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  photoURL: { type: String },
});

const profileInfo = mongoose.model("ProfileInfo", profileSchema);
export default profileInfo;
