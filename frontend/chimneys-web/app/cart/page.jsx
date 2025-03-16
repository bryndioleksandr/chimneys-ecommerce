"use client";

import React, { useState, useEffect } from "react";
import "./cart.css";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    // Завантаження товарів з локального сховища або API
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    // Оновлення кількості товару
    const updateQuantity = (id, change) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
            )
        );
    };

    // Видалення товару з кошика
    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Підрахунок загальної суми
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <section className="shopping-cart">
            <div className="container">
                <div className="card">
                    <h1 className="title">Кошик</h1>
                    <p className="items-count">{cartItems.length} товар(ів)</p>
                    <hr />

                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-details">
                                    <p className="item-category">{item.category}</p>
                                    <h6 className="item-name">{item.name}</h6>
                                </div>
                                <div className="quantity-controls">
                                    <button className="btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <input type="number" value={item.quantity} readOnly className="quantity-input" />
                                    <button className="btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                </div>
                                <p className="item-price">{item.price * item.quantity} грн</p>
                                <button className="remove-item" onClick={() => removeItem(item.id)}>×</button>
                            </div>
                        ))
                    ) : (
                        <p>Кошик порожній</p>
                    )}

                    <hr />
                    <div className="summary">
                        <h3>Підсумок</h3>
                        <hr />
                        <div className="summary-item">
                            <p>Товари: {cartItems.length}</p>
                            <p>{totalPrice} грн</p>
                        </div>
                        <label>Доставка</label>
                        <select className="shipping-options">
                            <option value="1">Стандартна доставка - 50 грн</option>
                            <option value="2">Експрес-доставка - 100 грн</option>
                        </select>
                        <label>Купон</label>
                        <input type="text" placeholder="Введіть код знижки" className="discount-code" />
                        <hr />
                        <div className="summary-item total">
                            <p>Загальна сума</p>
                            <p>{totalPrice} грн</p>
                        </div>
                        <button className="checkout-btn">Оформити замовлення</button>
                    </div>
                </div>
            </div>
            <style>{`
        .shopping-cart { background-color: #eee; padding: 20px; text-align: center; }
        .container { max-width: 800px; margin: auto; }
        .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .cart-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; }
        .item-image { width: 80px; border-radius: 5px; }
        .quantity-controls { display: flex; align-items: center; }
        .quantity-input { width: 50px; text-align: center; margin: 0 5px; }
        .summary {color:black; margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px; }
        .summary h3 {color: black;}
        .summary-item { display: flex; justify-content: space-between; }
        .total { font-weight: bold; }
        .checkout-btn { width: 100%; padding: 10px; background: black; color: white; border: none; cursor: pointer; }
        .checkout-btn:hover { background: #333; }
      `}</style>
        </section>
    );
}
