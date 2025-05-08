"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = localStorage.getItem("user");
                const res = await axios.get(`http://localhost:5501/order/user/${userId}`);
                setOrders(res.data);
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
                        <strong>Замовлення #{order._id.slice(-6).toUpperCase()}</strong> — {new Date(order.createdAt).toLocaleDateString()} — {order.status}
                    </li>
                ))}
            </ul>

            {selectedOrder && (
                <div className="order-details">
                    <h2>Деталі замовлення</h2>
                    <p><strong>Статус:</strong> {selectedOrder.status}</p>
                    <p><strong>Дата створення:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p><strong>Спосіб доставки:</strong> {selectedOrder.deliveryWay}</p>
                    <p><strong>Адреса:</strong> {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.country}, {selectedOrder.postalCode}</p>
                    <p><strong>Загальна сума:</strong> {selectedOrder.totalPrice} грн</p>

                    <h3>Товари:</h3>
                    <ul>
                        {selectedOrder.products.map((item, index) => (
                            <li key={index}>
                                {item.product?.name || "Товар"} — {item.quantity} × {item.product?.price || "?"} грн
                            </li>
                        ))}
                    </ul>

                    <button onClick={() => setSelectedOrder(null)}>Закрити</button>
                </div>
            )}
        </section>
    );
}
