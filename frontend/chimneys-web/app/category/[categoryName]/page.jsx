"use client";

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {searchSubCategories, searchSubCategoriesBySlug} from "../../../services/subcategory";
import {searchCategoryByName, searchCategoryProducts, searchCategoryBySlug } from "../../../services/category";
import StarRating from "../../../components/StarRating/StarRating";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "../category.css";
import Link from "next/link";
import ProductCard from "../../../components/ProductCard/ProductCard";
import FiltersPanel from "../../../components/FiltersPanel/FiltersPanel";

const CategoryPage = () => {
    const params = useParams();
    const router = useRouter();
    const {categoryName} = params;
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortOption, setSortOption] = useState("default");

    const categoryId = categoryName;

    console.log('params cat:', params);

    const getSortedProducts = () => {
        let sortedProducts = [...products];

        switch (sortOption) {
            case "price-asc":
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case "rating-desc":
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case "newest":
                sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }
        return sortedProducts;
    };

    const getFiltersByCategory = async (categoryId) => {
        const res = await fetch(`http://localhost:5501/filters/${categoryId}`);
        if (!res.ok) throw new Error('Не вдалося отримати фільтри');
        const data = await res.json();
        return data.filters;
    };

    useEffect(() => {
        const fetchSubcategories = async () => {
            const currentCategory = await searchCategoryBySlug(categoryId);
            console.log('current category:', currentCategory);
            console.log('_id:', currentCategory[0]._id);
            if (categoryId) {
                setLoading(true);
                setError(null);
                try {
                    const data = await searchSubCategoriesBySlug(categoryId);
                    const productData = await searchCategoryProducts(currentCategory[0]._id);
                    const filtersData = await getFiltersByCategory(currentCategory[0]._id);
                    console.log('filters received are: ', filtersData);
                    setFilters(filtersData);
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
        router.push(`/category/${categoryId}/${subcategory.slug}`);
    };

    return (
        <div className="category-page-wrapper">
            <aside className="sidebar-panel">
                <FiltersPanel filters={filters} onFilter={setProducts}/>
            </aside>

            <main className="content-section">
                <h1>Категорія: {categoryId}</h1>
                {loading && <p>Завантаження...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <ul className="subcategory-list">
                    {subcategories.length > 0 ? (
                        subcategories.map((subcategory) => (
                            <Link
                                className="subcategory-item"
                                href={`/category/${categoryId}/${subcategory.slug}`}
                                key={subcategory._id}
                            >
                                <li
                                    onClick={() => handleSubcategoryClick(subcategory)}
                                    className="subcategory-item"
                                >
                                    {subcategory.name}
                                </li>
                            </Link>
                        ))
                    ) : (
                        <p></p>
                    )}
                </ul>

                <div>
                    <div className="sort-options-container">
                        <span className="sort-label">Сортувати:</span>
                        <div className="sort-options">
                            <button
                                className={sortOption === "default" ? "active" : ""}
                                onClick={() => setSortOption("default")}
                            >
                                За замовчуванням
                            </button>
                            <button
                                className={sortOption === "price-asc" ? "active" : ""}
                                onClick={() => setSortOption("price-asc")}
                            >
                                Від найдешевших
                            </button>
                            <button
                                className={sortOption === "price-desc" ? "active" : ""}
                                onClick={() => setSortOption("price-desc")}
                            >
                                Від найдорожчих
                            </button>
                            <button
                                className={sortOption === "rating-desc" ? "active" : ""}
                                onClick={() => setSortOption("rating-desc")}
                            >
                                Найпопулярніші
                            </button>
                            <button
                                className={sortOption === "newest" ? "active" : ""}
                                onClick={() => setSortOption("newest")}
                            >
                                Новинки
                            </button>
                        </div>
                    </div>

                    <ul className="product-list">
                        {products.length > 0 ? (
                            getSortedProducts().map((product) => (
                                <ProductCard key={product._id} product={product}/>
                            ))
                        ) : (
                            <p>Товарів не знайдено ;(</p>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );

};

export default CategoryPage;
