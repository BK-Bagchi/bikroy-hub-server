import Message from "../models/message.models.js";

// Keep track of connected users: email → socket.id
let users = {};

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ User connected", socket.id);

    // Registration per conversation
    // payload = { email: currentUserEmail, partnerEmail: otherUserEmail }
    socket.on("register", async ({ email, partnerEmail }) => {
      users[email] = socket.id;
      console.log(`${email} registered for chat with ${partnerEmail}`);

      // Load only messages between current user and partner
      const messages = await Message.find({
        buyerEmail: email,
        sellerEmail: partnerEmail,
      }).sort({ createdAt: 1 });

      // Send chat history to the connected user
      socket.emit("loadMessages", messages);
    });

    // Private messaging
    // payload = { buyerEmail, sellerEmail, sender, text }
    socket.on(
      "privateMessage",
      async ({ buyerEmail, sellerEmail, sender, text }) => {
        const newMessage = new Message({
          buyerEmail,
          sellerEmail,
          sender,
          text,
        });
        await newMessage.save();

        // Deliver message to both participants if online
        [buyerEmail, sellerEmail].forEach((email) => {
          const targetSocketId = users[email];
          if (targetSocketId) {
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
      console.log("❌ User disconnected:", socket.id);
      for (let email in users) {
        if (users[email] === socket.id) {
          delete users[email];
          break;
        }
      }
    });
  });
}
