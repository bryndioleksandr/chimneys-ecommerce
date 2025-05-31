"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import './style.css';
import ImageGallery from 'react-image-gallery';
import ReviewForm from "../../../components/modals/ReviewCreate";
import StarRating from "../../../components/StarRating/StarRating";

const ProductPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5501/products/by-slug/${slug}`);
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
                const res = await fetch(`http://localhost:5501/reviews/product-reviews/${product._id}`);
                const data = await res.json();
                console.log("reviews data:", data);
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
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    {images.length > 0 ? (
                        <ImageGallery items={images} showPlayButton={false} showFullscreenButton={true}/>
                    ) : (
                        <div className="bg-gray-200 h-64 w-full max-w-md rounded"/>
                    )}
                </div>

                <div className="flex-1 space-y-4 productInfo">
                    <h1 className="font-bold">{product.name}</h1>
                    <p className="productPrice">{product.price} грн</p>
                    <div className="flex gap-4">
                        <button className="buyButton px-4 py-2 npm install react-image-gallery
">Купити
                        </button>
                        <button className="wishlistButton px-4 py-2 rounded">Додати до вішлисту</button>
                    </div>
                    <p className="productMeta">Код товару: {product.productCode}</p>
                    <div className="space-y-2">
                        <h2 className="sectionTitle">Опис</h2>
                        <p>{product.description}</p>
                    </div>
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
                            {product.stock != null && <li>В наявності: {product.stock} шт</li>}
                        </ul>
                    </div>
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
            </div>

            <button
                className="leaveReviewButton px-4 py-2 mt-4"
                onClick={() => setShowReviewForm(prev => !prev)}
            >
                {showReviewForm ? 'Сховати форму відгуку' : 'Залишити відгук'}
            </button>

            {showReviewForm && (
                <div className="reviewFormWrapper mt-4">
                    <ReviewForm product={product._id} review={reviews} />
                </div>
            )}
        </div>

    );
};

export default ProductPage;
