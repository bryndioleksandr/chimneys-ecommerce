"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

export default function AllOrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:5501/order/all-orders");
                const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sorted);
            } catch (err) {
                console.error("Помилка при завантаженні замовлень:", err);
            }
        };
        fetchOrders();
    }, []);

    return (
        <section className="all-orders">
            <div className="container">
                <h1>Усі замовлення</h1>
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Користувач:</strong> {order.user?.email || "Гість"}</p>
                        <p><strong>Ціна першого товару:</strong> {order.products[0].product.price} грн</p>
                        <p><strong>Сума:</strong> {order.totalPrice} грн</p>
                        <p><strong>Статус:</strong> {order.status}</p>
                        <p><strong>Місто:</strong> {order.city}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
