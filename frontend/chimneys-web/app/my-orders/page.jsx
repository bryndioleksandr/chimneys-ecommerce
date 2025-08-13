"use client";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { backUrl } from '../../config/config';
import "./style.css";

const deliveryWayMap = {
    nova_poshta_branch: "Нова Пошта (відділення)",
    nova_poshta_courier: "Нова Пошта (кур'єр)",
    ukrposhta: "Укрпошта",
    pickup: "Самовивіз"
};

const statusMap = {
    pending: "Очікує обробки",
    processing: "В обробці",
    shipped: "Відправлено",
    delivered: "Доставлено",
    cancelled: "Скасовано"
};

const paymentStatusMap = {
    paid: "Оплачено",
    unpaid: "Не оплачено"
};

const paymentMethodMap = {
    liqpay: "LiqPay",
    on_delivery_place: "Оплата при отриманні",
    bank_transfer: "Банківський переказ"
};


export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userRaw = localStorage.getItem("user");
                if (userRaw) {
                    const user = JSON.parse(userRaw);
                    const userId = user.id;
                    const res = await axios.get(`${backUrl}/order/user/${userId}`);
                    const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(sorted);
                }
            } catch (err) {
                console.error("Помилка при завантаженні замовлень", err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <section className="my-orders container">
            <h1>Мої замовлення</h1>

            {orders.length === 0 && <p>У вас ще немає замовлень.</p>}

            <ul className="order-list">
                {orders.map(order => (
                    <li key={order._id} onClick={() => setSelectedOrder(order)}>
                        <strong>Замовлення
                            #{order._id.slice(-6).toUpperCase()}</strong> — {new Date(order.createdAt).toLocaleDateString()} — {statusMap[order.status] || order.status}
                    </li>
                ))}
            </ul>

            {selectedOrder && (
                <div className="order-details">
                    <h2>Деталі замовлення</h2>
                    <p><strong>Статус:</strong> {statusMap[selectedOrder.status] || selectedOrder.status}</p>
                    <p><strong>Оплата:</strong> {paymentStatusMap[selectedOrder.isPaid ? "paid" : "unpaid"]}</p>
                    <p><strong>Дата створення:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p><strong>Спосіб
                        доставки:</strong> {deliveryWayMap[selectedOrder.deliveryWay] || selectedOrder.deliveryWay}</p>
                    <p><strong>Спосіб
                        оплати:</strong> {paymentMethodMap[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}
                    </p>
                    <p>
                        <strong>Адреса:</strong> {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.country}, {selectedOrder.postalCode}
                    </p>
                    <p><strong>Загальна сума:</strong> {selectedOrder.totalPrice} грн</p>

                    <h3>Товари:</h3>
                    <ul className="products-list">
                        {selectedOrder.products.map((item, index) => (
                            <li key={index} className="product-item">
                                <img
                                    src={item.product?.images[0]}
                                    alt={item.product?.name}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <span>{item.product?.name || "Товар"}</span>
                                    <span>{item.quantity} × {item.product?.price || "?"} грн</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button className="close-btn" onClick={() => setSelectedOrder(null)}>Закрити</button>
                </div>
            )}
        </section>
    );
}
