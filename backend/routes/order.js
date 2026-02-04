import express from "express";
import {
    createOrder, deleteOrder,
    getOrders,
    getOrdersByStatus,
    getOrdersByUser,
    getPaidOrders,
    updateOrderStatus
} from "../controllers/order.js";
import {isAdmin, verifyToken} from "../middleware/auth.js";
import {validate} from "../middleware/validate.js";
import {orderSchema} from "../utils/validation.js";

const orderRouter = express.Router();
const jsonParser = express.json();

orderRouter.post("/make", validate(orderSchema), createOrder);
orderRouter.get("/user/:userId", getOrdersByUser);
orderRouter.get("/all-orders", verifyToken, isAdmin, getOrders);
orderRouter.get("/by-status/:status", verifyToken, isAdmin, getOrdersByStatus);
orderRouter.get("/paid-orders/:isPaid", verifyToken, isAdmin, getPaidOrders);
orderRouter.patch("/update-status/:orderId", verifyToken, isAdmin, updateOrderStatus);
orderRouter.delete("/:orderId", verifyToken, isAdmin, deleteOrder);


export default orderRouter;

