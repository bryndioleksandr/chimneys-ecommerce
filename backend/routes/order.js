import express from "express";
import {createOrder, getOrdersByUser} from "../controllers/order.js";

const orderRouter = express.Router();
const jsonParser = express.json();

orderRouter.post("/make", createOrder);
orderRouter.get("/user", getOrdersByUser);

export default orderRouter;

