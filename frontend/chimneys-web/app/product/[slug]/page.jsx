"use client";

import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import './style.css';
import ImageGallery from 'react-image-gallery';
import ReviewForm from "../../../components/modals/ReviewCreate";
import StarRating from "../../../components/StarRating/StarRating";
import LiqPayButton from "../../../components/LiqPayBtn/LiqPayBtn";
import {addItemToCart} from "../../../redux/slices/cart";
import axios from "axios";
import {backUrl} from '../../../config/config';
import {useDispatch} from "../../../redux/store";

const ProductPage = () => {
    const {slug} = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [role, setUserRole] = useState(null);
    const [userCurrent, setUserCurrent] = useState(null);

    useEffect(() => {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
            const user = JSON.parse(userRaw);
            setUserId(user.id);
            setUserRole(user.role);
            setUserCurrent(user);
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
            const res = await axios.post(`${backUrl}/favorites/${userId}`, {
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${backUrl}/products/by-slug/${slug}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!product?._id) return;
            try {
                const res = await fetch(`${backUrl}/reviews/product-reviews/${product._id}`);
                const data = await res.json();
                setReviews(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Помилка при завантаженні відгуків:", err);
            }
        };

        fetchReviews();
    }, [product]);

    if (loading) return <p>Завантаження...</p>;
    if (!product) return <p>Товар не знайдено</p>;


    const images = product.images?.map(url => ({
        original: url,
        thumbnail: url,
    })) || [];


    return (
        <div className="container mx-auto px-4 py-8 productContainer">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-wrapper">
                <div className="gallery-main-info">
                    <div className="gallery-wrapper">
                        {images.length > 0 ? (
                            <ImageGallery items={images} showPlayButton={false} showFullscreenButton={true}/>
                        ) : (
                            <div className="bg-gray-200 h-64 w-full max-w-md rounded"/>
                        )}
                    </div>
                    <div className="under-image">
                        {product.discount ? (
                            <div className="card-price-discount">
                                <span className="original-price">{product.price}₴</span>
                                <span className="discounted-price">{product.discountedPrice}₴</span>
                            </div>
                        ) : (
                            <span className="card-price">{product.price}₴</span>
                        )}
                        <div className="btns-buy-wish flex gap-4">
                            <button onClick={() => handleAddToCart(product)} className="buyButton">Купити</button>
                            <button onClick={handleAddToFavorites} className="wishlistButton px-4 py-2 rounded">Додати
                                до
                                вішлисту
                            </button>
                        </div>
                        <div className="rating-wrapper">
                            <StarRating rating={product.rating} totalStars={5}/>
                            <span className="prod-rating">({product.reviews.length})</span>
                        </div>
                        <p className="productMeta">Код товару: {product.productCode}</p>
                    </div>
                </div>

                <div className="flex-1 space-y-4 productInfo">
                    <hr/>
                    <div className="space-y-2">
                        <h2 className="sectionTitle">Опис</h2>
                        <p>{product.description}</p>
                    </div>
                    <hr/>
                    <div className="space-y-2">
                        <h2 className="sectionTitle">Характеристики</h2>
                        <ul className="list-disc list-inside text-sm characteristicsList">
                            {product.steelGrade && <li>Марка сталі: {product.steelGrade}</li>}
                            {product.thickness && <li>Товщина: {product.thickness} мм</li>}
                            {product.diameter && <li>Діаметр: {product.diameter} мм</li>}
                            {product.length && <li>Довжина: {product.length} мм</li>}
                            {product.weight && <li>Вага: {product.weight} кг</li>}
                            {product.angle && <li>Кут: {product.angle}°</li>}
                            {product.revision && <li>Ревізія: Так</li>}
                            {product.hasMesh && <li>Сітка: Є</li>}
                            {product.insulationThickness &&
                                <li>Товщина утеплювача: {product.insulationThickness} мм</li>}
                            {product.stock > 0 ? (<li>В наявності</li>) : (<li>Під замовлення (Термін постачання 3-5 днів)</li>)}
                        </ul>
                    </div>
                    <hr/>
                </div>
            </div>

            <div className="reviewsBlock">
                <h2 className="reviewsTitle">Відгуки</h2>

                {reviews.length === 0 ? (
                    <p className="noReviewsText">Відгуки поки що відсутні. Будьте першим!</p>
                ) : (
                    <div className="reviewsList">
                        {reviews.map((review, index) => (
                            <div key={index} className="reviewCard">
                                <div className="reviewHeader">
                                    <strong>{review.name}</strong>
                                    {role === "admin" ? (
                                            <div className="user-email">
                                                {review.email}
                                            </div>
                                        ) : null
                                    }
                                    <StarRating rating={review.rating} totalStars={5}/>
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                className="leaveReviewButton"
                onClick={() => setShowReviewForm(prev => !prev)}
            >
                {showReviewForm ? 'Сховати форму відгуку' : 'Залишити відгук'}
            </button>

            {showReviewForm && (
                <div className="reviewFormWrapper mt-4">
                    <ReviewForm user={userCurrent} product={product._id}/>
                </div>
            )}
        </div>

    );
};

export default ProductPage;
