"use client";

import React, { useState, useEffect } from "react";
import "./favorites.css"

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);

    // Завантаження улюблених товарів з локального сховища
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    const removeFromFavorites = (id) => {
        const updatedFavorites = favorites.filter((item) => item.id !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    return (
        <section className="favorites">
            <div className="container">
                <div className="card">
                    <h1 className="title">Список бажань</h1>
                    <p className="items-count">{favorites.length} улюблених товар(ів)</p>
                    <hr />

                    {favorites.length > 0 ? (
                        favorites.map((item) => (
                            <div key={item.id} className="favorite-item">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-details">
                                    <p className="item-category">{item.category}</p>
                                    <h6 className="item-name">{item.name}</h6>
                                </div>
                                <p className="item-price">{item.price} грн</p>
                                <button className="remove-item" onClick={() => removeFromFavorites(item.id)}>×</button>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">Список бажань порожній.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
