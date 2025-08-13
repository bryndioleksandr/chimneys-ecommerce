"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    searchOneSubCategoryBySlug
} from "../../../../../services/subcategory";
import ProductCard from "../../../../../components/ProductCard/ProductCard";
import FiltersPanel from "../../../../../components/FiltersPanel/FiltersPanel";
import "../../../category.css";
import {searchCategoryBySlug} from "../../../../../services/category";

import {searchOneSubSubCategoryBySlug, searchSubSubCategoryProducts} from "../../../../../services/subsubcategory";
import { backUrl } from '../../../../../config/config';

const SubSubCategoryPage = () => {
    const { categoryName, subCategoryName, subSubCategoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({});
    const [sortOption, setSortOption] = useState("default");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getFiltersByCategory = async (categoryId, subCategoryId, subSubCategoryId) => {
        console.log('filters id:', categoryId, "and as well ", subCategoryId, "and as well ", subSubCategoryId);
        const res = await fetch(`${backUrl}/filters/${categoryId}/${subCategoryId}/${subSubCategoryId}`);
        if (!res.ok) throw new Error('Не вдалося отримати фільтри');
        const data = await res.json();
        return data.filters;
    };


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                console.log('subsubname:', subSubCategoryName);
                const subSubCategoryData = await searchOneSubSubCategoryBySlug(subSubCategoryName);
                const subSubCategoryId = subSubCategoryData[0]._id;
                console.log('subsub data:', subSubCategoryData);
                console.log('subsub id:', subSubCategoryId);
                const productData = await searchSubSubCategoryProducts(subSubCategoryId);
                const parentCategory = await searchCategoryBySlug(categoryName);
                const parentSubCategory = await searchOneSubCategoryBySlug(subCategoryName);
                console.log('parent category:', parentCategory);
                console.log('parent category id:', parentCategory[0]._id);
                const filtersData = await getFiltersByCategory(parentCategory[0]._id, parentSubCategory[0]._id, subSubCategoryId);

                setProducts(productData);
                setFilters(filtersData);
            } catch (err) {
                console.log('error subsub:', err);
                setError("Не вдалося завантажити дані.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [subCategoryName]);

    const getSortedProducts = () => {
        let sorted = [...products];
        switch (sortOption) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "rating-desc":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case "newest":
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }
        return sorted;
    };

    return (
        <div className="category-page-wrapper">
            <aside className="sidebar-panel">
                <FiltersPanel filters={filters} onFilter={setProducts} />
            </aside>

            <main className="content-section">
                <h1>Підпідкатегорія: {subSubCategoryName}</h1>
                {loading && <p>Завантаження...</p>}
                {error && <p style={{color: "red"}}>{error}</p>}


                <div className="sort-options-container">
                    <span className="sort-label">Сортувати:</span>
                    <div className="sort-options">
                        <button onClick={() => setSortOption("default")}
                                className={sortOption === "default" ? "active" : ""}>За замовчуванням
                        </button>
                        <button onClick={() => setSortOption("price-asc")}
                                className={sortOption === "price-asc" ? "active" : ""}>Від найдешевших
                        </button>
                        <button onClick={() => setSortOption("price-desc")}
                                className={sortOption === "price-desc" ? "active" : ""}>Від найдорожчих
                        </button>
                        <button onClick={() => setSortOption("rating-desc")}
                                className={sortOption === "rating-desc" ? "active" : ""}>Найпопулярніші
                        </button>
                        <button onClick={() => setSortOption("newest")}
                                className={sortOption === "newest" ? "active" : ""}>Новинки
                        </button>
                    </div>
                </div>

                <ul className="product-list">
                    {products.length > 0 ? (
                        getSortedProducts().map((product) => <ProductCard key={product._id} product={product}/>)
                    ) : (
                        <p>Товарів не знайдено ;(</p>
                    )}
                </ul>
            </main>
        </div>
    );
};

export default SubSubCategoryPage;
