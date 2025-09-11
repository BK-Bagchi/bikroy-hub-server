import orderInfo from "../models/order.models.js";

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
    console.error("Error in disputeManagement:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
