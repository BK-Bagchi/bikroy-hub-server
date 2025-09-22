import Message from "../models/message.models.js";
import profileInfo from "../models/profile.models.js";

// Keep track of connected users: email → socket.id
let users = {};

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 User connected", socket.id);

    // Registration per conversation
    socket.on("register", async ({ email, partnerEmail }) => {
      if (!users[email]) users[email] = [];
      users[email].push(socket.id);
      // console.log(`${email} registered for chat with ${partnerEmail}`);

      // Load only messages between current user and partner
      const messages = await Message.find({
        $or: [
          { buyerEmail: email, sellerEmail: partnerEmail },
          { buyerEmail: partnerEmail, sellerEmail: email },
        ],
      }).sort({ createdAt: 1 });

      //Load profile into of both buyer and seller
      const info = await profileInfo
        .find({
          email: { $in: [email, partnerEmail] },
        })
        .select("email displayName photoURL");
      const buyerInfo = await info.find((u) => u.email === email);
      const sellerInfo = await info.find((u) => u.email === partnerEmail);

      // Send profile info to the connected user
      socket.emit("loadProfile", { buyerInfo, sellerInfo });

      // Send chat history to the connected user
      socket.emit("loadMessages", messages);
    });

    // Private messaging
    socket.on(
      "privateMessage",
      async ({ buyerEmail, sellerEmail, sender, text }) => {
        const newMessage = new Message({
          buyerEmail,
          sellerEmail,
          sender,
          text,
        });
        // Save message to database
        await newMessage.save();

        // Deliver message to both participants if online
        [buyerEmail, sellerEmail].forEach((email) => {
          const targetSocketId = users[email];
          if (targetSocketId) {
            // console.log("🟡 Message sent");
            io.to(targetSocketId).emit("privateMessage", newMessage);
          }
        });
      }
    );

    // Mark messages as read
    // payload = { buyerEmail, sellerEmail, reader }
    socket.on("markRead", async ({ buyerEmail, sellerEmail, reader }) => {
      await Message.updateMany(
        {
          buyerEmail,
          sellerEmail,
          sender: { $ne: reader },
          read: false,
        },
        { $set: { read: true } }
      );
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
      for (let email in users) {
        if (users[email] === socket.id) {
          delete users[email];
          break;
        }
      }
    });
  });
}
