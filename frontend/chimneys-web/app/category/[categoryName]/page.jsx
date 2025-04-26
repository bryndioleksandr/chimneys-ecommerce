"use client";

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {searchSubCategories} from "../../../services/subcategory";
import {searchCategoryByName, searchCategoryProducts} from "../../../services/category";
import StarRating from "../../../components/StarRating/StarRating";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "../category.css";
import Link from "next/link";
import ProductCard from "../../../components/ProductCard/ProductCard";

const CategoryPage = () => {
    const params = useParams();
    const router = useRouter();
    const {categoryName} = params;
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const categoryId = categoryName;

    useEffect(() => {
        const fetchSubcategories = async () => {
            const currentCategory = await searchCategoryByName(categoryId);
            console.log('current category:', currentCategory);
            console.log('_id:', currentCategory[0]._id);
            if (categoryId) {
                setLoading(true);
                setError(null);
                try {
                    const data = await searchSubCategories(categoryId);
                    const productData = await searchCategoryProducts(currentCategory[0]._id);
                    console.log('response products category:', productData);
                    setProducts(productData);
                    setSubcategories(data);
                    console.log('response:', data);
                } catch (err) {
                    setError("Не вдалося завантажити підкатегорії.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSubcategories();
    }, [categoryId]);

    const handleSubcategoryClick = (subcategory) => {
        router.push(`/category/${categoryId}/${subcategory.name}`);
    };

    return (
        <div className="containerCat">
            <h1>Категорія: {categoryId}</h1>
            {loading && <p>Завантаження...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            <ul>
                {subcategories.length > 0 ? (
                    subcategories.map((subcategory) => (
                        <Link
                            className="subcategory-item"
                            href={`/category/${categoryId}/${subcategory.name.toLowerCase().replace(/\s+/g, "-")}`}
                            key={subcategory.name}
                        >
                            <li
                                key={subcategory._id}
                                onClick={() => handleSubcategoryClick(subcategory)}
                                className="subcategory-item"
                            >
                                {subcategory.name}
                            </li>
                        </Link>
                    ))
                ) : (
                    <p>Підкатегорій не знайдено</p>
                )}
            </ul>
            <div>
                <h2>Products:</h2>
                <ul className="product-list">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <p>There are no products with this category ;(</p>
                    )}
                </ul>

            </div>
        </div>
    );
};

export default CategoryPage;
