"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import StarRating from "../StarRating/StarRating";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "./ProductCard.css";
import { addItemToCart } from "@/redux/slices/cart";
import { useDispatch } from "@/redux/store";
import axios from "axios";
import {deleteProductRequest} from "@/services/product";
import EditProductModal from "../modals/ProductEdit";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [role, setUserRole] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    useEffect(() => {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
            const user = JSON.parse(userRaw);
            setUserId(user.id);
            setUserRole(user.role);
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

    const hasDiscount = product.discount > 0;
    const discountedPrice = hasDiscount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    return (
        <li className="product-item" key={product._id}>
            <div className="productCardContainer">
                {product.discount > 0 && (
                    <div className="discount-badge">
                        -{product.discount}%
                    </div>
                )}
                <Link className="product-link" href={`/product/${product.slug}`}>
                    <img src={product.images[0]} alt={product.name}/>
                    <p className="productCardName">{product.name}</p>
                    <div className="productCard-review-stock">
                        <div className="card-reviews-div">
                            <StarRating rating={product.rating}/>
                            <span className="count-reviews">({product.reviews?.length || 0})</span>
                        </div>
                        {product.stock !== 0 ? (
                            <span className="card-in-stock">В наявності: {product.stock}</span>
                        ) : (
                            <span className="card-in-stock" style={{color: 'red'}}>Немає в наявності</span>
                        )}
                    </div>
                </Link>

                <div className="card-favorites" onClick={handleAddToFavorites}>
                    <FaHeart/>
                    <span className="card-heart">До вішлісту</span>
                </div>

                <div className="card-bottom">
                    <div className="card-price-cart">
                        {hasDiscount ? (
                            <div className="card-price-discount">
                                <span className="original-price">{product.price}₴</span>
                                <span className="discounted-price">{discountedPrice}₴</span>
                            </div>
                        ) : (
                            <span className="card-price">{product.price}₴</span>
                        )}
                        <FaShoppingCart onClick={() => handleAddToCart(product)}/>
                    </div>
                    {role === "user" && (
                        <div className="admin-buttons">
                            <button onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                            }}>Оновити</button>
                            <button style={{backgroundColor:"#C80106"}} onClick={() => {
                                if (confirm("Ви впевнені, що хочете видалити цей товар?")) {
                                    deleteProductRequest(product._id);
                                }
                            }}>Видалити
                            </button>
                        </div>
                    )}
                </div>

                <EditProductModal
                    isOpen={isModalOpen}
                    product={selectedProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(updatedProduct) => {
                        setSelectedProduct(updatedProduct);
                    }}
                />
                {/*{isEditing && <ProductForm />}*/}

                {/*{role === "admin" && (*/}
                {/*    <div className="admin-buttons">*/}
                {/*        <button onClick={() => setIsEditing(true)}>Оновити</button>*/}
                {/*        <button onClick={() => {*/}
                {/*            if (confirm("Ви впевнені, що хочете видалити цей товар?")) {*/}
                {/*                deleteProductRequest(product.id);*/}
                {/*            }*/}
                {/*        }}>Видалити*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </li>
    );

};

export default ProductCard;
