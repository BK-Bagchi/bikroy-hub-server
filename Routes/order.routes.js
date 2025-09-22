import express from "express";
import {
  getOrdersByAnUser,
  getOrdersInfo,
  postPlaceOrder,
  postDeleteOrder,
  updateOrderStatusByPerson,
  getSpecificOrderInfo,
  getPostedOrGotOrdersByABuyerOrSeller,
  updateShipmentStatusBySeller,
} from "../controller/order.controller.js";

const orderRouter = express.Router();

// ✔ Get All Orders//
orderRouter.get("/getOrdersInfo", getOrdersInfo);

// ✔ Get A Specific Order//
orderRouter.get(
  "/getSpecificOrderInfo", //byOrderInfo
  getSpecificOrderInfo
);

// ✔ Orders by a Specific User (Buyer or Seller)xx
orderRouter.get("/ordersByAnUser", getOrdersByAnUser);

// ✔ Orders posted by a Specific Buyer or Orders got by a Specific Seller//
orderRouter.get(
  "/postedOrGotOrdersByABuyerOrSeller",
  getPostedOrGotOrdersByABuyerOrSeller
);

// ✔ Order status update by admin or buyer or seller//
orderRouter.patch("/updateOrderStatusByPerson", updateOrderStatusByPerson);

// ✔ Shipment status update by seller//
orderRouter.patch(
  "/updateShipmentStatusBySeller",
  updateShipmentStatusBySeller
);

// ✔ Place Orders//
orderRouter.post("/placeOrder", postPlaceOrder);

// ✔ Delete Order
orderRouter.post("/deleteOrder", postDeleteOrder);

export default orderRouter;
