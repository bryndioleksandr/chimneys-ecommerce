"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import StarRating from "../StarRating/StarRating";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "./ProductCard.css";
import { addItemToCart } from "../../redux/slices/cart";
import { useDispatch } from "../../redux/store";
import axios from "axios";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
            const user = JSON.parse(userRaw);
            setUserId(user.id);
        }
    }, []);

    const handleAddToCart = (product) => {
        dispatch(addItemToCart(product));
        alert('Товар додано до кошика! ' + product.name);
    };

    const handleAddToFavorites = async () => {
        if (!userId) {
            alert("Будь ласка, увійдіть, щоб додати улюблені.");
            alert(`id is ${userId}`);
            return;
        }
        try {
            const res = await axios.post(`http://localhost:5501/favorites/${userId}`, {
                productId: product._id
            });

            if (res.status === 200) {
                alert("Товар додано у улюблені!");
            } else {
                alert("Помилка при додаванні у улюблені");
            }
        } catch (error) {
            console.error(error);
            alert("Не вдалося додати улюблені");
        }
    };


    return (
        <li className="product-item" key={product._id}>
            <Link className="product-link" href={`/product/${product.slug}`}>
                <div className="productCardContainer">
                    <img src={product.images[0]} alt={product.name} />
                    <p className="productCardName">{product.name}</p>
                    <div className="productCard-review-stock">
                        <div className="card-reviews-div">
                            <StarRating rating={product.rating} />
                            <span className="count-reviews">({product.reviews?.length || 0})</span>
                        </div>
                        {product.stock !== 0 ? (
                            <span className="card-in-stock">В наявності: {product.stock}</span>
                        ) : (
                            <span className="card-in-stock" style={{ color: 'red' }}>Немає в наявності</span>
                        )}
                    </div>
                    <div className="card-favorites" onClick={(e) => { e.preventDefault(); handleAddToFavorites(); }} style={{cursor: 'pointer'}}>
                        <FaHeart />
                        <span className="card-heart">До вішлісту</span>
                    </div>
                    <div className="card-price-cart">
                        <span className="card-price">{product.price}₴</span>
                        <FaShoppingCart onClick={() => handleAddToCart(product)} />
                    </div>
                </div>
            </Link>
        </li>
    );
};

export default ProductCard;
