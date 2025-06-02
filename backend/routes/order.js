import express from "express";
import {createOrder, getOrders, getOrdersByUser, updateOrderStatus} from "../controllers/order.js";

const orderRouter = express.Router();
const jsonParser = express.json();

orderRouter.post("/make", createOrder);
orderRouter.get("/user/:userId", getOrdersByUser);
orderRouter.get("/all-orders", getOrders);
orderRouter.patch("/update-status/:orderId", updateOrderStatus);


export default orderRouter;

