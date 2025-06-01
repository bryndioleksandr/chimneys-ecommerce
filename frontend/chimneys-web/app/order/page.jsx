"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

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

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id;
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

            console.log('userid', userId);
            console.log('formdata:', formData);
            console.log('prod:', products);
            console.log('total price:', totalPrice);
            await axios.post("http://localhost:5501/order/make", {
                user: userId,
                ...formData,
                deliveryWay: formData.deliveryWay,
                products,
                totalPrice,
            });

            localStorage.removeItem("cart");
            alert("Замовлення оформлено!");
            window.location.href = "/";
        } catch (err) {
            console.log('error in create order is:', err);
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
                        <option value="nova_poshta_branch">Доставка у відділення нової пошти</option>
                        <option value="nova_poshta_courier">Доставка кур'єром нової пошти</option>
                        <option value="ukrposhta">Доставка УкрПоштою</option>
                        <option value="pickup">Самовивіз із магазину</option>
                    </select>
                    <p>Загальна сума: {totalPrice} грн</p>
                    <button type="submit">Підтвердити замовлення</button>
                </form>
            </div>
        </section>
    );
}
