import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  buyerEmail: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  sender: { type: String, required: true }, // who sent this message
  text: { type: String, required: true },
  read: { type: Boolean, default: false }, // read/unread tracking
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
