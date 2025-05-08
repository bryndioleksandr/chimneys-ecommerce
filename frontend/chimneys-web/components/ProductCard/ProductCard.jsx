"use client";

import React from "react";
import Link from "next/link";
import StarRating from "../StarRating/StarRating";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "./ProductCard.css";
import {addToCart} from "../../services/cartService";
import { addItemToCart } from "../../redux/slices/cart";
import { useDispatch } from "../../redux/store";




const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const handleAddToCart = (product) => {
        addToCart(product);
        dispatch(addItemToCart(product));
        alert('Товар додано до кошика!'+ product.name);
    };
    return (
        <li className="product-item" key={product._id}>
            <Link
                className="product-link"
                href={`/product/${product.slug}`}
            >
                <div className="productCardContainer">
                    <img src={product.images[0]} alt={product.name}/>
                    <p className="productCardName">{product.name}</p>
                    <div className="productCard-review-stock">
                        <div className="card-reviews-div">
                            <StarRating rating={4.8} />
                            <span className="count-reviews">({product.reviews?.length || 0})</span>
                        </div>
                        <span className="card-in-stock">В наявності: {product.stock}</span>
                    </div>
                    <div className="card-favorites">
                        <FaHeart/>
                        <span className="card-heart">До вішлісту</span>
                    </div>
                    <div className="card-price-cart">
                        <span className="card-price">{product.price}₴</span>
                        <FaShoppingCart onClick={() => handleAddToCart(product)}/>
                    </div>
                </div>
            </Link>
        </li>
    );
};

export default ProductCard;
