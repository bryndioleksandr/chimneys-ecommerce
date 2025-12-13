// "use client";
//
// import {useParams} from "next/navigation";
// import React, {useEffect, useState} from "react";
// import "react-image-gallery/styles/css/image-gallery.css";
// import './style.css';
// import ImageGallery from 'react-image-gallery';
// import ReviewForm from "../../../components/modals/ReviewCreate";
// import StarRating from "../../../components/StarRating/StarRating";
// import LiqPayButton from "../../../components/LiqPayBtn/LiqPayBtn";
// import {addItemToCart} from "../../../redux/slices/cart";
// import axios from "axios";
// import {backUrl} from '../../../config/config';
// import {useDispatch} from "../../../redux/store";
// import {getProductsByGroupId} from "../../../services/product";
// import {ProductVariants} from "../../../components/ProductVariants/ProductVariants";
// import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
//
//
// // <Breadcrumbs items={[
// //     { label: 'Каталог', href: '/catalog' },
// //     { label: 'Я', href: '/account' }
// // ]}/>
//
//
// const ProductPage = () => {
//     const {slug} = useParams();
//     const [product, setProduct] = useState(null);
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showReviewForm, setShowReviewForm] = useState(false);
//     const [productGroups, setProductGroup] = useState([]);
//     const [groupId, setGroupId] = useState('');
//     const dispatch = useDispatch();
//     const [userId, setUserId] = useState(null);
//     const [role, setUserRole] = useState(null);
//     const [userCurrent, setUserCurrent] = useState(null);
//
//     useEffect(() => {
//         const userRaw = localStorage.getItem("user");
//         if (userRaw) {
//             const user = JSON.parse(userRaw);
//             setUserId(user.id);
//             setUserRole(user.role);
//             setUserCurrent(user);
//         }
//     }, []);
//
//
//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const res = await fetch(`${backUrl}/products/by-slug/${slug}`);
//                 if (!res.ok) throw new Error("Product not found");
//                 const data = await res.json();
//                 setProduct(data);
//                 console.log('group id on page:', data?.groupId);
//                 setGroupId(data?.groupId);
//             } catch (err) {
//                 console.error(err);
//                 setProduct(null);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         if (slug) fetchProduct();
//     }, [slug]);
//
//     useEffect(() => {
//         const fetchReviews = async () => {
//             if (!product?._id) return;
//             try {
//                 const res = await fetch(`${backUrl}/reviews/product-reviews/${product._id}`);
//                 const data = await res.json();
//                 setReviews(Array.isArray(data) ? data : []);
//             } catch (err) {
//                 console.error("Помилка при завантаженні відгуків:", err);
//             }
//         };
//
//         fetchReviews();
//     }, [product]);
//
//     useEffect(() => {
//         const fetchProductGroup = async () => {
//             try {
//                 if (!groupId) return;
//                 const data = await getProductsByGroupId(groupId);
//                 console.log('group product is:', data);
//                 setProductGroup(data);
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//
//         fetchProductGroup();
//     }, [groupId]);
//
//
//     const handleAddToCart = (product) => {
//         dispatch(addItemToCart(product));
//         alert('Товар додано до кошика! ' + product.name);
//     };
//
//     const handleAddToFavorites = async () => {
//         if (!userId) {
//             alert("Будь ласка, увійдіть, щоб додати улюблені.");
//             alert(`id is ${userId}`);
//             return;
//         }
//         try {
//             const res = await axios.post(`${backUrl}/favorites/${userId}`, {
//                 productId: product._id
//             });
//
//             if (res.status === 200) {
//                 alert("Товар додано у улюблені!");
//             } else {
//                 alert("Помилка при додаванні у улюблені");
//             }
//         } catch (error) {
//             console.error(error);
//             alert("Не вдалося додати улюблені");
//         }
//     };
//
//
//     if (loading) return <p>Завантаження...</p>;
//     if (!product) return <p>Товар не знайдено</p>;
//
//
//     const images = product.images?.map(url => ({
//         original: url,
//         thumbnail: url,
//     })) || [];
//
//
//     return (
//         <div className="container mx-auto px-4 py-8 productContainer">
//             <Breadcrumbs items={[
//                 { label: product.category?.name, href: `/category/${product.category?.slug}` },
//                 { label: product.subCategory?.name, href: `/category/${product.category?.slug}/${product.subCategory?.slug}` },
//                 { label: product.subSubCategory?.name, href: `/category/${product.category?.slug}/${product.subCategory?.slug}/${product.subSubCategory?.slug}` },
//                 { label: product.name, href: `/product/${product.slug}` }
//             ].filter(item => item.label)}/>
//             <h1 className="product-title">{product.name}</h1>
//             <div className="product-wrapper">
//                 <div className="gallery-main-info">
//                     <div className="gallery-wrapper">
//                         {images.length > 0 ? (
//                             <ImageGallery items={images} showPlayButton={false} showFullscreenButton={true}/>
//                         ) : (
//                             <div className="bg-gray-200 h-64 w-full max-w-md rounded"/>
//                         )}
//                     </div>
//                     <div className="under-image">
//                         {product.discount ? (
//                             <div className="card-price-discount">
//                                 <span className="original-price">{product.price}₴</span>
//                                 <span className="discounted-price">{product.discountedPrice}₴</span>
//                             </div>
//                         ) : (
//                             <span className="card-price">{product.price}₴</span>
//                         )}
//                         {productGroups.length > 1 && (
//                             <ProductVariants
//                                 currentProduct={product}
//                                 productGroup={productGroups}
//                             />
//                         )}
//                         <div className="btns-buy-wish flex gap-4">
//                             <button onClick={() => handleAddToCart(product)} className="buyButton">Купити</button>
//                             <button onClick={handleAddToFavorites} className="wishlistButton px-4 py-2 rounded">Додати
//                                 до
//                                 вішлисту
//                             </button>
//                         </div>
//                         <div className="rating-wrapper">
//                             <StarRating rating={product.rating} totalStars={5}/>
//                             <span className="prod-rating">({product.reviews.length})</span>
//                         </div>
//                         <p className="productMeta">Код товару: {product.productCode}</p>
//                     </div>
//                 </div>
//
//                 <div className="flex-1 space-y-4 productInfo">
//                     <hr/>
//                     <div className="space-y-2">
//                         <h2 className="sectionTitle">Опис</h2>
//                         <p>{product.description}</p>
//                     </div>
//                     <hr/>
//                     <div className="space-y-2">
//                         <h2 className="sectionTitle">Характеристики</h2>
//                         <ul className="list-disc list-inside text-sm characteristicsList">
//                             {product.steelGrade && <li>Марка сталі: {product.steelGrade}</li>}
//                             {product.thickness && <li>Товщина: {product.thickness} мм</li>}
//                             {product.diameter && <li>Діаметр: {product.diameter} мм</li>}
//                             {product.length && <li>Довжина: {product.length} мм</li>}
//                             {product.weight && <li>Вага: {product.weight} кг</li>}
//                             {product.angle && <li>Кут: {product.angle}°</li>}
//                             {product.revision && <li>Ревізія: Так</li>}
//                             {product.hasMesh && <li>Сітка: Є</li>}
//                             {product.insulationThickness &&
//                                 <li>Товщина утеплювача: {product.insulationThickness} мм</li>}
//                             {product.stock > 0 ? (<li>В наявності</li>) : (
//                                 <li>Під замовлення (Термін постачання 3-5 днів)</li>)}
//                         </ul>
//                     </div>
//                     <hr/>
//                 </div>
//             </div>
//
//             <div className="reviewsBlock">
//                 <h2 className="reviewsTitle">Відгуки</h2>
//
//                 {reviews.length === 0 ? (
//                     <p className="noReviewsText">Відгуки поки що відсутні. Будьте першим!</p>
//                 ) : (
//                     <div className="reviewsList">
//                         {reviews.map((review, index) => (
//                             <div key={index} className="reviewCard">
//                                 <div className="reviewHeader">
//                                     <strong>{review.name}</strong>
//                                     {role === "admin" ? (
//                                         <div className="user-email">
//                                             {review.email}
//                                         </div>
//                                     ) : null
//                                     }
//                                     <StarRating rating={review.rating} totalStars={5}/>
//                                 </div>
//                                 <p>{review.comment}</p>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//
//             <button
//                 className="leaveReviewButton"
//                 onClick={() => setShowReviewForm(prev => !prev)}
//             >
//                 {showReviewForm ? 'Сховати форму відгуку' : 'Залишити відгук'}
//             </button>
//
//             {showReviewForm && (
//                 <div className="reviewFormWrapper mt-4">
//                     <ReviewForm user={userCurrent} product={product._id}/>
//                 </div>
//             )}
//         </div>
//
//     );
// };
//
// export default ProductPage;

"use client";

import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import './style.css';
import ImageGallery from 'react-image-gallery';
import ReviewForm from "../../../components/modals/ReviewCreate";
import StarRating from "../../../components/StarRating/StarRating";
import {addItemToCart} from "../../../redux/slices/cart";
import axios from "axios";
import {backUrl} from '../../../config/config';
import {useDispatch} from "../../../redux/store";
import {getProductsByGroupId} from "../../../services/product";
import {ProductVariants} from "../../../components/ProductVariants/ProductVariants";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";

const ProductPage = () => {
    const {slug} = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [productGroups, setProductGroup] = useState([]);
    const [groupId, setGroupId] = useState('');
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${backUrl}/products/by-slug/${slug}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
                setGroupId(data?.groupId);
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

    useEffect(() => {
        const fetchProductGroup = async () => {
            try {
                if (!groupId) return;
                const data = await getProductsByGroupId(groupId);
                setProductGroup(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProductGroup();
    }, [groupId]);

    const handleAddToCart = (product) => {
        dispatch(addItemToCart(product));
        alert('Товар додано до кошика! ' + product.name);
    };

    const handleAddToFavorites = async () => {
        if (!userId) {
            alert("Будь ласка, увійдіть, щоб додати улюблені.");
            return;
        }
        try {
            const res = await axios.post(`${backUrl}/favorites/${userId}`, {
                productId: product._id
            });
            if (res.status === 200) {
                alert("Товар додано у улюблені!");
            }
        } catch (error) {
            console.error(error);
            alert("Не вдалося додати улюблені");
        }
    };

    if (loading) return <p>Завантаження...</p>;
    if (!product) return <p>Товар не знайдено</p>;

    const images = product.images?.map(url => ({
        original: url,
        thumbnail: url,
    })) || [];

    return (
        <div className="container mx-auto px-4 py-8 productContainer">
            <Breadcrumbs items={[
                { label: product.category?.name, href: `/category/${product.category?.slug}` },
                { label: product.subCategory?.name, href: `/category/${product.category?.slug}/${product.subCategory?.slug}` },
                { label: product.subSubCategory?.name, href: `/category/${product.category?.slug}/${product.subCategory?.slug}/${product.subSubCategory?.slug}` },
                { label: product.name, href: `/product/${product.slug}` }
            ].filter(item => item.label)}/>

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
                                <span className="text-green-600">✔ В наявності</span>
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
                        {product.insulationThickness &&
                            <li><span>Утеплювач:</span> <strong>{product.insulationThickness} мм</strong></li>}
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

export default ProductPage;
