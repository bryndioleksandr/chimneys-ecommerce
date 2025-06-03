"use client";

import React, {useState, useEffect} from "react";
import "./favorites.css";
import axios from "axios";
import {useSelector} from "react-redux";
import Link from "next/link";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useSelector((state) => state.user.user);
    const userId = user?.id;

    // const [userId, setUserId] = useState(null);
    //
    // useEffect(() => {
    //     const userRaw = localStorage.getItem("user");
    //     if (userRaw) {
    //         const user = JSON.parse(userRaw);
    //         setUserId(user.id);
    //     }
    // }, []);

    useEffect(() => {

        const fetchFavorites = async () => {
            try {
                const res = await axios.get(`http://localhost:5501/favorites/${userId}`);
                console.log('response from favorites is:', res.data);
                setFavorites(res.data || []);
            } catch (error) {
                console.error(error);
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [userId]);

    const removeFromFavorites = async (productId) => {
        try {
            const res = await axios.delete(`http://localhost:5501/favorites/${userId}/${productId}`);
            if (res.status === 200) {
                setFavorites((prev) => prev.filter((item) => item._id !== productId));
            } else {
                alert("Помилка при видаленні з улюблених");
            }
        } catch (error) {
            console.error(error);
            alert("Не вдалося видалити з улюблених");
        }
    };


    if (loading) return <p>Завантаження...</p>;

    return (
        <section className="favorites">
            <div className="container">
                <div className="card">
                    <h1 className="title">Список бажань</h1>
                    <p className="items-count">{favorites.length} улюблених товар(ів)</p>
                    <hr/>

                    {favorites.length > 0 ? (
                        favorites.map((item) => (
                            <div key={item._id} className="favorite-item">
                                <Link className="product-link" href={`/product/${item.slug}`}>
                                    <img src={item.images[0]} alt={item.name} className="item-image"/>
                                    <div className="item-details">
                                        <p className="item-category">{item.category.name}</p>
                                        <h6 className="item-name">{item.name}</h6>
                                    </div>
                                    <p className="item-price">{item.price} грн</p>
                                </Link>
                                <button
                                    className="remove-item"
                                    onClick={() => removeFromFavorites(item._id)}
                                    aria-label={`Видалити ${item.name} з улюблених`}
                                >
                                    ×
                                </button>
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
