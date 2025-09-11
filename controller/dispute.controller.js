import orderInfo from "../models/order.models.js";

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
