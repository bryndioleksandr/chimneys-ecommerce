"use client";

import React, { useState, useEffect } from "react";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import ReviewForm from "../modals/ReviewCreate";
import StarRating from "../StarRating/StarRating";
import { ProductVariants } from "../ProductVariants/ProductVariants";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { addItemToCart } from "../../redux/slices/cart";
import { useDispatch } from "../../redux/store";
import axios from "axios";
import { backUrl } from '../../config/config';
import '../../app/product/[slug]/style.css';
import {toast} from "react-toastify";

const ProductClient = ({ product, reviews, productGroups }) => {
    const dispatch = useDispatch();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userCurrent, setUserCurrent] = useState(null);

    useEffect(() => {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
            const user = JSON.parse(userRaw);
            setUserId(user.id);
            setUserCurrent(user);
        }
    }, []);

    const handleAddToCart = (productItem) => {
        dispatch(addItemToCart(productItem));
        toast.success('Товар додано до кошика! ' + productItem.name);
    };

    const handleAddToFavorites = async () => {
        if (!userId) {
            toast.warning("Будь ласка, увійдіть, щоб додати улюблені.");
            return;
        }
        try {
            const res = await axios.post(`${backUrl}/favorites/${userId}`, {
                productId: product._id
            }, {withCredentials: true});
            if (res.status === 200) {
                toast.success("Товар додано у улюблені!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Не вдалося додати улюблені");
        }
    };

    const images = product.images?.map(url => ({
        original: url,
        thumbnail: url,
    })) || [];

    const breadcrumbsItems = [
        { label: product.category?.name, href: `/category/${product.category?.slug}` },
        { label: product.subCategory?.name, href: `/category/${product.category?.slug}/${product.subCategory?.slug}` },
        { label: product.subSubCategory?.name, href: `/category/${product.category?.slug}/${product.subCategory?.slug}/${product.subSubCategory?.slug}` },
        { label: product.name, href: null }
    ].filter(item => item.label);

    return (
        <div className="container mx-auto px-4 py-8 productContainer">
            <Breadcrumbs items={breadcrumbsItems}/>

            <div className="product-top-grid">
                <div className="product-gallery-section">
                    {images.length > 0 ? (
                        <ImageGallery items={images} showPlayButton={false} showFullscreenButton={true}/>
                    ) : (
                        <div className="bg-gray-200 h-64 w-full rounded"/>
                    )}
                </div>

                <div className="product-main-info-section">
                    <h1 className="product-title">{product.name}</h1>

                    <div className="product-meta-row">
                        <div className="rating-wrapper">
                            <StarRating rating={product.rating} totalStars={5}/>
                            <span className="review-count">({reviews.length} відгуків)</span>
                        </div>
                        <span className="product-code">Код: {product.productCode}</span>
                    </div>

                    <div className="price-block">
                        {product.discount ? (
                            <div className="price-discount-wrapper">
                                <span className="current-price discount">{product.discountedPrice}₴</span>
                                <span className="old-price">{product.price}₴</span>
                            </div>
                        ) : (
                            <span className="current-price">{product.price}₴</span>
                        )}
                        <span className="stock-status">
                            {product.stock > 0 ? (
                                <span className="text-green-600">✔ В наявності: {product.stock}</span>
                            ) : (
                                <span className="text-orange-500">⏳ Під замовлення</span>
                            )}
                        </span>
                    </div>

                    <div className="variants-wrapper">
                        {productGroups.length > 1 && (
                            <ProductVariants
                                currentProduct={product}
                                productGroup={productGroups}
                            />
                        )}
                    </div>

                    <div className="actions-block">
                        <button onClick={() => handleAddToCart(product)} className="buyButton big-btn">
                            Купити
                        </button>
                        <button onClick={handleAddToFavorites} className="wishlistButton big-btn-outline">
                            ❤
                        </button>
                    </div>

                    <div className="service-info-block">
                        <div className="service-item">
                            <span className="service-icon">🚚</span>
                            <div className="service-text">
                                <strong>Доставка</strong>
                                <span>Нова Пошта, Укрпошта, Самовивіз</span>
                            </div>
                        </div>
                        <div className="service-item">
                            <span className="service-icon">🛡️</span>
                            <div className="service-text">
                                <strong>Гарантія</strong>
                                <span>Від виробника / 12 міс.</span>
                            </div>
                        </div>
                        <div className="service-item">
                            <span className="service-icon">💳</span>
                            <div className="service-text">
                                <strong>Оплата</strong>
                                <span>Картою, Готівкою, LiqPay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-details-bottom">
                <div className="details-section">
                    <h2 className="sectionTitle">Опис</h2>
                    <p className="description-text">{product.description}</p>
                </div>

                <div className="details-section">
                    <h2 className="sectionTitle">Характеристики</h2>
                    <ul className="characteristicsList-grid">
                        {product.steelGrade && <li><span>Марка сталі:</span> <strong>{product.steelGrade}</strong></li>}
                        {product.thickness && <li><span>Товщина:</span> <strong>{product.thickness} мм</strong></li>}
                        {product.diameter && <li><span>Діаметр:</span> <strong>{product.diameter} мм</strong></li>}
                        {product.length && <li><span>Довжина:</span> <strong>{product.length} мм</strong></li>}
                        {product.weight && <li><span>Вага:</span> <strong>{product.weight} кг</strong></li>}
                        {product.angle && <li><span>Кут:</span> <strong>{product.angle}°</strong></li>}
                        {product.revision && <li><span>Ревізія:</span> <strong>Так</strong></li>}
                        {product.hasMesh && <li><span>Сітка:</span> <strong>Є</strong></li>}
                        {product.insulationThickness && <li><span>Утеплювач:</span> <strong>{product.insulationThickness} мм</strong></li>}
                    </ul>
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
                                    <StarRating rating={review.rating} totalStars={5}/>
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    className="leaveReviewButton"
                    onClick={() => setShowReviewForm(prev => !prev)}
                >
                    {showReviewForm ? 'Сховати форму' : 'Залишити відгук'}
                </button>

                {showReviewForm && (
                    <div className="reviewFormWrapper mt-4">
                        <ReviewForm user={userCurrent} product={product._id}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductClient;
