import express from "express";
import {
  adminResolveDispute,
  disputeManagement,
  getDisputesInfo,
  postAdminPaymentFail,
  postAdminPaymentSuccess,
} from "../controller/dispute.controller.js";

const disputeRouter = express.Router();

// Get disputes info//
disputeRouter.get("/getDisputesInfo", getDisputesInfo);

// Dispute management//
disputeRouter.patch("/disputeManagement", disputeManagement);

// Admin resolve dispute (through refund or fund disbursement)//
disputeRouter.patch("/adminResolveDispute", adminResolveDispute);

// ✔ Admin Payment Success//
disputeRouter.post("/admin/success/:_id", postAdminPaymentSuccess);

// ✔ Admin Payment Failed//
disputeRouter.post("/admin/fail/:_id", postAdminPaymentFail);

export default disputeRouter;
