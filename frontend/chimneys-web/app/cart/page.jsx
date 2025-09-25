"use client";

import React, {useState, useEffect} from "react";
import "./cart.css";
import {useRouter} from "next/navigation";
import productCard from "../../components/ProductCard/ProductCard";

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

    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.discountedPrice ?? item.price;
        return total + price * item.quantity;
    }, 0);
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Кошик порожній");
            return;
        }
        router.push("/order");
    };
    return (
        <section className="shopping-cart">
            <div className="container">
                <div className="card">
                    <h1 className="title">Кошик</h1>
                    <p className="items-count">{cartItems.length} товар(ів)</p>
                    <hr/>

                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item._id} className="wrapper-card">
                                <div className="wrap-img-name">
                                    <img src={item.images[0]} alt={item.name} className="item-image"/>
                                    <div className="item-details">
                                        <p className="item-category">{item.category.name}</p>
                                        <h6 className="item-name">{item.name}</h6>
                                    </div>
                                </div>
                                <div key={item._id} className="cart-item">
                                {item.discountedPrice ? (
                                        <p className="item-price" style={{color:"var(--discount-color)"}}>{item.discountedPrice * item.quantity} грн</p>
                                    ) : (
                                        <p className="item-price">{item.price * item.quantity} грн</p>
                                    )}
                                    <div className="quantity-controls">
                                        <button className="btn" onClick={() => updateQuantity(item._id, -1)}>-</button>
                                        <input type="number" value={item.quantity} readOnly className="quantity-input"/>
                                        <button className="btn" onClick={() => updateQuantity(item._id, 1)}>+</button>
                                    </div>
                                    <button className="remove-item" onClick={() => removeItem(item._id)}>×</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Кошик порожній</p>
                    )}

                    <div className="summary">
                        <h3>Підсумок</h3>
                        <hr/>
                        <div className="summary-item">
                            <p>Товари: {cartItems.length}</p>
                            <p>{totalPrice} грн</p>
                        </div>
                        {/*<label>Доставка</label>*/}
                        {/*<select className="shipping-options">*/}
                        {/*    <option value="1">Стандартна доставка - 50 грн</option>*/}
                        {/*    <option value="2">Експрес-доставка - 100 грн</option>*/}
                        {/*</select>*/}
                        {/*<label>Купон</label>*/}
                        {/*<input type="text" placeholder="Введіть код знижки" className="discount-code"/>*/}
                        <hr/>
                        <div className="summary-item total">
                            <p>Загальна сума</p>
                            <p>{totalPrice} грн</p>
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Оформити замовлення
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
