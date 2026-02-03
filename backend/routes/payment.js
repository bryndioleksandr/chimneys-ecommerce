import express from "express";
import dotenv from "dotenv";
import LiqPayConstructor from "../lib/liqpay.js";
import crypto from "crypto";
import Order from "../models/order.js";
import {sendInfoEmail, sendInfoEmailResend} from "../services/emailService.js";

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
    // const html = liqpay.cnb_form({
    //     action: "pay",
    //     amount,
    //     currency: "UAH",
    //     description,
    //     order_id,
    //     version: 3,
    //     result_url: "https://chimneys-ecommerce-bi38.vercel.app/payment-success",
    //     server_url: "https://chimneys-ecommerce.onrender.com/liqpay/payment-callback",
    //     language: "uk",
    //     sandbox: 1,
    // });
    // console.log('html is:', html);
    // res.send({ html });

    const params = liqpay.cnb_object({
        action: "pay",
        amount,
        currency: "UAH",
        description,
        order_id,
        version: 3,
        // result_url: "https://chimneys-ecommerce-bi38.vercel.app/payment-success",
        // server_url: "https://chimneys-ecommerce.onrender.com/liqpay/payment-callback",
        result_url: "http://localhost:3000/payment-success",
        server_url: "https://a4792b8ecef6.ngrok-free.app/liqpay/payment-callback",
        language: "uk",
        sandbox: 1,
    });

    res.json(params);
});
//
// liqpayRouter.post("/payment-callback", express.urlencoded({ extended: false }), async (req, res) => {
//     try {
//         console.log('we are in liq callback');
//         const { data, signature } = req.body;
//
//         const expectedSignature = crypto
//             .createHash("sha1")
//             .update(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
//             .digest("base64");
//
//         if (signature !== expectedSignature) {
//             console.warn("Невірна сигнатура LiqPay");
//             return res.status(403).send("Invalid signature");
//         }
//
//         const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
//         console.log("LiqPay callback:", decodedData);
//
//         const { order_id, status } = decodedData;
//
//         if (status === "success" || status === "sandbox") {
//             const order = await Order.findOne({ _id: order_id.replace("order_", "") });
//             if (!order) {
//                 return res.status(404).send("Order not found");
//             }
//
//             order.paymentInfo = {
//                 paymentId: +decodedData.payment_id || '',
//                 liqpayOrderId: decodedData.liqpay_order_id || '',
//                 liqpayStatus: decodedData.status || '',
//                 transactionId: +decodedData.transaction_id || '',
//                 amount: +decodedData.amount || '',
//                 currency: decodedData.currency || '',
//                 payType: decodedData.paytype || '',
//                 action: decodedData.action || '',
//                 description: decodedData.description || '',
//                 senderName: `${decodedData.sender_first_name || ''} ${decodedData.sender_last_name || ''}`.trim(),
//                 senderCardType: decodedData.sender_card_type || '',
//                 senderCardBank: decodedData.sender_card_bank || '',
//                 amountCredit: +decodedData.amount_credit || '',
//                 receiverCommission: +decodedData.receiver_commission || '',
//                 createdAt: new Date(decodedData.create_date || ''),
//                 endedAt: new Date(decodedData.end_date || '')
//             };
//             order.isPaid = true;
//             order.paidAt = new Date();
//             await order.save();
//         }
//
//         res.status(200).send("Callback received");
//     } catch (err) {
//         console.error("Error handling LiqPay callback:", err);
//         res.status(500).send("Server error");
//     }
// });

liqpayRouter.post("/payment-callback", express.urlencoded({ extended: false }), async (req, res) => {
    try {
        const { data, signature } = req.body;

        const expectedSignature = crypto
            .createHash("sha1")
            .update(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
            .digest("base64");

        if (signature !== expectedSignature) {
            return res.status(403).send("Invalid signature");
        }

        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
        const { order_id, status } = decodedData;

        const order = await Order.findOne({ _id: order_id.replace("order_", "") }).populate("user", "email");
        if (!order) {
            return res.status(404).send("Order not found");
        }

        order.paymentInfo = {
            paymentId: +decodedData.payment_id || '',
            liqpayOrderId: decodedData.liqpay_order_id || '',
            liqpayStatus: decodedData.status || '',
            transactionId: +decodedData.transaction_id || '',
            amount: +decodedData.amount || '',
            currency: decodedData.currency || '',
            payType: decodedData.paytype || '',
            action: decodedData.action || '',
            description: decodedData.description || '',
            senderName: `${decodedData.sender_first_name || ''} ${decodedData.sender_last_name || ''}`.trim(),
            errorDescription: decodedData.err_description || ''
        };

        if (status === "success" || status === "sandbox") {
            if (!order.isPaid) {
                order.isPaid = true;
                order.paidAt = new Date();

                if(order.email || order.user) await sendInfoEmailResend({
                    to: order.email || order.user.email,
                    subject: "Оплату отримано!",
                    text: `Ваше замовлення №${order.orderNumber} успішно оплачено. Ми вже пакуємо його!`
                });
            }
        }
        else if (status === "failure" || status === "error") {
            console.log(`Payment failed for order ${order_id}: ${decodedData.err_description}`);

            order.isPaid = false;
            if(order.email || order.user) await sendInfoEmailResend({
                to: order.email || order.user.email,
                subject: "Помилка оплати",
                text: `На жаль, оплата замовлення №${order.orderNumber} не пройшла. Причина: ${decodedData.err_description}. Спробуйте ще раз на сайті.`
            });
        }
        else if (status === "reversed") {
            order.isPaid = false;
        }

        await order.save();

        res.status(200).send("Callback received");
    } catch (err) {
        console.error("Error handling LiqPay callback:", err);
        res.status(500).send("Server error");
    }
});

export default liqpayRouter;
