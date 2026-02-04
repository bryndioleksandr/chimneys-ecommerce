"use client";

import React, {useState, useEffect} from "react";
import "./cart.css";
import {useRouter} from "next/navigation";
import productCard from "../../components/ProductCard/ProductCard";
import {toast} from "react-toastify";
import Link from "next/link";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    const router = useRouter();
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const sanitizedCart = storedCart.map((item) => ({
            ...item,
            quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        }));
        setCartItems(sanitizedCart);
    }, []);

    const updateQuantity = (_id, change) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) => {
                if (item._id === _id) {
                    const currentQty = Number(item.quantity) || 1;
                    return {
                        ...item,
                        quantity: Math.max(1, currentQty + change),
                    };
                }
                return item;
            });
            localStorage.setItem("cart", JSON.stringify(updatedItems));
            return updatedItems;
        });
    };


    const removeItem = (_id) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter((item) => item._id !== _id);
            localStorage.setItem("cart", JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.discountedPrice ?? item.price;
        return total + price * item.quantity;
    }, 0);
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warning("Кошик порожній");
            return;
        }
        router.push("/order");
    };
    return (
        <section className="shopping-cart">
            <div className="container">
                <div className="card">
                    <h1 className="title">Кошик</h1>
                    <p className="items-count">{totalQuantity} товар(ів)</p>
                    <hr/>

                    {cartItems.length > 0 ? (
                        <div className="cart-list">
                            {cartItems.map((item) => (
                                <div key={item._id} className="wrapper-card">

                                    <div className="wrap-img-name">
                                        <div className="image-wrapper">
                                            <img src={item.images[0]} alt={item.name} className="item-image"/>
                                            {item.stock <= 0 && (
                                                <span className="item-stock-badge overlay">Під замовлення</span>
                                            )}
                                        </div>
                                        <div className="item-details">
                                            <p className="item-category">{item.category?.name}</p>
                                            <h6 className="item-name">{item.name}</h6>
                                            {item.stock <= 0 && (
                                                <p className="delivery-hint">ℹ️ Виготовлення до 7 робочих днів</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="item-actions">
                                        <div className="price-block">
                                            <p className={`item-price ${item.discountedPrice ? 'discount' : ''}`}>
                                                {(item.discountedPrice ?? item.price) * item.quantity} грн
                                            </p>
                                        </div>

                                        <div className="quantity-controls">
                                            <button className="btn" onClick={() => updateQuantity(item._id, -1)}>-</button>
                                            <input type="number" value={item.quantity} readOnly className="quantity-input"/>
                                            <button className="btn" onClick={() => updateQuantity(item._id, 1)}>+</button>
                                        </div>

                                        <button className="remove-item" onClick={() => removeItem(item._id)} title="Видалити">
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-cart">
                            <div className="empty-cart-icon">🛒</div>
                            <h3>Ваш кошик порожній</h3>
                            <p>Здається, ви ще нічого не додали до кошика.</p>
                            <Link href="/" className="back-to-home-btn">
                                Повернутися до покупок
                            </Link>
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="summary">
                            <h3>Підсумок</h3>
                            <hr/>
                            <div className="summary-item">
                                <p>Кількість товарів: {totalQuantity}</p>
                                <p>{totalPrice} грн</p>
                            </div>

                            {cartItems.some(item => item.stock <= 0) && (
                                <div className="order-notice">
                                    <p>У замовленні є товари "під замовлення". Термін відправки може скласти до 7 робочих днів.</p>
                                </div>
                            )}

                            <hr/>
                            <div className="summary-item total">
                                <p>Загальна сума</p>
                                <p>{totalPrice} грн</p>
                            </div>
                            <button className="checkout-btn" onClick={handleCheckout}>
                                Оформити замовлення
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
