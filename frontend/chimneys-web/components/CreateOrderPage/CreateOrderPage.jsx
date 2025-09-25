"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { backUrl } from '../../config/config';
import "./order.css";

export default function CreateOrderPage() {
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        phoneNumber: "",
        country: "",
        city: "",
        postalCode: "",
        address: "",
        deliveryWay: "pickup",
    });

    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.discountedPrice ?? item.price;
        return total + price * item.quantity;
    }, 0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const products = cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
            }));

            await axios.post(`${backUrl}/order/make`, {
                user: null,
                ...formData,
                deliveryWay: formData.deliveryWay,
                products,
                totalPrice,
            });

            localStorage.removeItem("cart");
            alert("Замовлення оформлено!");
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("Помилка при оформленні замовлення");
        }
    };

    return (
        <section className="order-form">
            <div className="container">
                <h1>Оформлення замовлення</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="phoneNumber" placeholder="Номер телефону" required onChange={handleChange} />
                    <input type="text" name="country" placeholder="Країна" required onChange={handleChange} />
                    <input type="text" name="city" placeholder="Місто" required onChange={handleChange} />
                    <input type="text" name="postalCode" placeholder="Поштовий індекс" required onChange={handleChange} />
                    <input type="text" name="address" placeholder="Адреса доставки" required onChange={handleChange} />
                    <select name="deliveryWay" onChange={handleChange}>
                        <option value="standard">Стандартна доставка - 50 грн</option>
                        <option value="express">Експрес-доставка - 100 грн</option>
                    </select>
                    <p>Загальна сума: {totalPrice} грн</p>
                    <button type="submit">Підтвердити замовлення</button>
                </form>
            </div>
        </section>
    );
}
