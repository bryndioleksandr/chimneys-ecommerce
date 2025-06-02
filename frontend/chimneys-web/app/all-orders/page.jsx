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

    const handleStatusChange = (orderId, newStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order._id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const updateStatus = async (orderId, status) => {
        try {
            await axios.patch(`http://localhost:5501/order/update-status/${orderId}`, { status });
            alert("Статус оновлено!");
        } catch (err) {
            console.error("Помилка при оновленні статусу:", err);
            alert("Помилка при оновленні статусу");
        }
    };

    return (
        <section className="all-orders">
            <div className="container">
                <h1>Усі замовлення</h1>
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <h3>Замовлення №: {order._id}</h3>
                        <p><strong>Дата створення:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Користувач:</strong> {order.user?.email || "Гість"}</p>
                        <p><strong>Номер телефону:</strong> {order.phoneNumber}</p>
                        <p><strong>Спосіб доставки:</strong> {order.deliveryWay}</p>
                        <p><strong>Адреса:</strong> {`${order.address}, ${order.city}, ${order.country}, ${order.postalCode}`}</p>

                        <div className="products-list">
                            {order.products.map((item, index) => (
                                <div key={index} className="product-item">
                                    <h5>Товар №{index+1}</h5>
                                    <p><strong>Назва:</strong> {item.product?.name || "Невідомо"}</p>
                                    <p><strong>Ціна:</strong> {item.product?.price} грн</p>
                                    <p><strong>Кількість:</strong> {item.quantity}</p>
                                    <p><strong>Разом:</strong> {item.product?.price * item.quantity} грн</p>
                                </div>
                            ))}
                        </div>

                        <p><strong>Загальна сума замовлення:</strong> {order.totalPrice} грн</p>

                        <div className="status-control">
                            <label><strong>Статус:</strong></label>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            >
                                <option value="processing">processing</option>
                                <option value="shipped">shipped</option>
                                <option value="delivered">delivered</option>
                                <option value="cancelled">cancelled</option>
                                <option value="returned">returned</option>
                            </select>
                            <button onClick={() => updateStatus(order._id, order.status)}>
                                Зберегти
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
