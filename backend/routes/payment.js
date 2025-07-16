import express from "express";
import dotenv from "dotenv";
import LiqPayConstructor from "../lib/liqpay.js";
import crypto from "crypto";
import Order from "../models/order.js";


dotenv.config();

const liqpay = new LiqPayConstructor(
    process.env.LIQPAY_PUBLIC_KEY,
    process.env.LIQPAY_PRIVATE_KEY
);

const liqpayRouter = express.Router();

liqpayRouter.post("/create-payment", (req, res) => {
    const { amount, description, orderId } = req.body;
    const order_id = "order_" + orderId;
    console.log('hello liqpay');
    const html = liqpay.cnb_form({
        action: "pay",
        amount,
        currency: "UAH",
        description,
        order_id,
        version: 3,
        result_url: "http://localhost:3000/payment-success",
        server_url: "https://682e2a93a40d.ngrok-free.app/liqpay/payment-callback",
        language: "uk",
        sandbox: 1,
    });
    console.log('html is:', html);
    res.send({ html });
});

liqpayRouter.post("/payment-callback", express.urlencoded({ extended: false }), async (req, res) => {
    try {
        console.log('we are in liq callback');
        const { data, signature } = req.body;

        // Перевірка підпису
        const expectedSignature = crypto
            .createHash("sha1")
            .update(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
            .digest("base64");

        if (signature !== expectedSignature) {
            console.warn("Невірна сигнатура LiqPay");
            return res.status(403).send("Invalid signature");
        }

        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
        console.log("LiqPay callback:", decodedData);

        const { order_id, status } = decodedData;

        if (status === "success" || status === "sandbox") {
            // Знаходимо замовлення по order_id
            const order = await Order.findOne({ _id: order_id.replace("order_", "") });
            if (!order) {
                return res.status(404).send("Order not found");
            }

            order.isPaid = true;
            order.paidAt = new Date();
            await order.save();
        }

        res.status(200).send("Callback received");
    } catch (err) {
        console.error("Error handling LiqPay callback:", err);
        res.status(500).send("Server error");
    }
});

export default liqpayRouter;
