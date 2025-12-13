"use client";

import React, {useEffect, useState} from "react";
import axios from "axios";
import {backUrl} from '../../config/config';
import "./style.css";

const deliveryWayMap = {
    nova_poshta_branch: "Нова Пошта (відділення)",
    nova_poshta_courier: "Нова Пошта (кур'єр)",
    ukrposhta: "Укрпошта",
    pickup: "Самовивіз"
};

const statusLabels = {
    pending: "Очікує обробки",
    processing: "Опрацьовується",
    shipped: "Відправлено",
    delivered: "Доставлено",
    cancelled: "Скасовано",
    returned: "Повернено"
};

export default function AllOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [showPaidOnly, setShowPaidOnly] = useState(false);
    const [sortNewestFirst, setSortNewestFirst] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState([]);


    const fetchOrders = async () => {
        try {
            let url = `${backUrl}/order/all-orders`;

            if (statusFilter) {
                url = `${backUrl}/order/by-status/${statusFilter}`;
            } else if (showPaidOnly) {
                url = `${backUrl}/order/paid-orders/true`;
            }

            const res = await axios.get(url);
            let fetchedOrders = res.data;

            fetchedOrders.sort((a, b) =>
                sortNewestFirst
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt)
            );

            setOrders(fetchedOrders);
        } catch (err) {
            console.error("Помилка при завантаженні замовлень:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, showPaidOnly, sortNewestFirst]);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order._id === orderId ? {...order, status: newStatus} : order
            )
        );
    };

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };

    const updateStatus = async (orderId, status) => {
        try {
            await axios.patch(`${backUrl}/order/update-status/${orderId}`, {status});
            alert("Статус оновлено!");
        } catch (err) {
            console.error("Помилка при оновленні статусу:", err);
            alert("Помилка при оновленні статусу");
        }
    };

    const resetFilters = () => {
        setStatusFilter("");
        setShowPaidOnly(false);
        setSortNewestFirst(true);
    };

    const paymentMethodLabels = {
        liqpay: "LiqPay (онлайн оплата)",
        on_delivery_place: "Оплата при отриманні",
        bank_transfer: "Банківський переказ"
    };


    const handleOrderDelete = async (orderId) => {
        try {
            if(confirm('Чи дійсно видалити замовлення?')) {
                await axios.delete(`${backUrl}/order/${orderId}`);
                alert('Замовлення видалено успішно!')
                setOrders(prevOrders => prevOrders.filter(item => item._id !== orderId));
            }
        }
        catch(e) {
            console.error("Помилка при видаленні замовлення:", e);
            alert("Помилка при видаленні замовлення");
        }
    }

    return (
        <section className="all-orders">
            <div className="container">
                <h1>Усі замовлення</h1>

                {/* Панель фільтрів */}
                <div className="filters">
                    <label>
                        Статус:
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">Усі</option>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>


                    <label>
                        <input
                            type="checkbox"
                            checked={showPaidOnly}
                            onChange={(e) => setShowPaidOnly(e.target.checked)}
                        />
                        Лише оплачені
                    </label>

                    <label>
                        Сортувати:
                        <select value={sortNewestFirst ? "desc" : "asc"}
                                onChange={(e) => setSortNewestFirst(e.target.value === "desc")}>
                            <option value="desc">Новіші спочатку</option>
                            <option value="asc">Старіші спочатку</option>
                        </select>
                    </label>

                    <button onClick={resetFilters}>Скинути фільтри</button>
                </div>

                {orders.length === 0 ? (
                    <p style={{marginTop: "2rem"}}>Немає замовлень для відображення.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <h3>
                                {order.status === "pending"
                                    ? `НОВЕ замовлення №: ${order.orderNumber || order._id} потребує обробки!`
                                    : `Замовлення №: ${order._id}`}
                            </h3>
                            <p><strong>Дата створення:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Користувач:</strong> {order.user?.email || "Гість"}</p>
                            <p><strong>Номер телефону:</strong> {order.phoneNumber}</p>
                            <p><strong>Спосіб
                                доставки:</strong> {deliveryWayMap[order.deliveryWay] || order.deliveryWay}</p>
                            <p>
                                <strong>Адреса:</strong> {`${order.address}, ${order.city}`}
                            </p>
                            <p><strong>Спосіб
                                оплати:</strong> {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</p>
                            <p><strong>Оплата:</strong> {order.isPaid ? "✅ Оплачено" : "❌ Не оплачено"}</p>

                            <button
                                onClick={() => toggleExpand(order._id)}
                                style={{margin: "1rem 0"}}
                            >
                                {expandedOrders.includes(order._id) ? "Приховати товари" : "Показати товари"}
                            </button>

                            {expandedOrders.includes(order._id) && (
                                <div className="products-list">
                                    {order.products.map((item, index) => (
                                        <div key={index} className="product-item">
                                            <h5>Товар №{index + 1}</h5>
                                            <img src={item.product?.images[0]} alt="" width={80} height={80}/>
                                            <p><strong>Назва:</strong> {item.product?.name || "Невідомо"}</p>
                                            {item.product?.discountedPrice ? (
                                                <>
                                                    <p><strong>Ціна зі
                                                        знижкою:</strong> {item.product?.discountedPrice} грн</p>
                                                    <p><strong>Кількість:</strong> {item.quantity}</p>
                                                    <p>
                                                        <strong>Разом:</strong> {item.product?.discountedPrice * item.quantity} грн
                                                    </p>
                                                </>) : (
                                                <>
                                                    <p><strong>Ціна:</strong> {item.product?.price} грн</p>
                                                    <p><strong>Кількість:</strong> {item.quantity}</p>
                                                    <p><strong>Разом:</strong> {item.product?.price * item.quantity} грн
                                                    </p>
                                                </>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            )}

                            <p><strong>Загальна сума замовлення:</strong> {order.totalPrice} грн</p>

                            <div className="status-control">
                                <p><strong>Поточний статус:</strong> {statusLabels[order.status] || order.status}</p>
                                <div className="wrap-space">
                                    <div className="manage-status">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        >
                                            {Object.entries(statusLabels).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                        <button onClick={() => updateStatus(order._id, order.status)}>
                                            Зберегти
                                        </button>
                                    </div>
                                    <div className="delete-order">
                                        <button onClick={() => handleOrderDelete(order._id)}>
                                            Видалити ❌
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
        ;
}
