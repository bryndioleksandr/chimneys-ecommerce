import express from "express";
import {createOrder, getOrders, getOrdersByUser} from "../controllers/order.js";

const orderRouter = express.Router();
const jsonParser = express.json();

orderRouter.post("/make", createOrder);
orderRouter.get("/user", getOrdersByUser);
orderRouter.get("/all-orders", getOrders);

export default orderRouter;

