import express from "express";
import {
    createOrder, deleteOrder,
    getOrders,
    getOrdersByStatus,
    getOrdersByUser,
    getPaidOrders,
    updateOrderStatus
} from "../controllers/order.js";

const orderRouter = express.Router();
const jsonParser = express.json();

orderRouter.post("/make", createOrder);
orderRouter.get("/user/:userId", getOrdersByUser);
orderRouter.get("/all-orders", getOrders);
orderRouter.get("/by-status/:status", getOrdersByStatus);
orderRouter.get("/paid-orders/:isPaid", getPaidOrders);
orderRouter.patch("/update-status/:orderId", updateOrderStatus);
orderRouter.delete("/:orderId", deleteOrder);


export default orderRouter;

