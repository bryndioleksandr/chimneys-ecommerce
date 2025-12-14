"use client";

import React, { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import FiltersPanel from "../FiltersPanel/FiltersPanel";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import "../../app/category/category.css";
const SubSubCategoryClient = ({
                                  initialProducts,
                                  subSubCategory,
                                  filters,
                                  categoryName,
                                  subCategoryName
                              }) => {
    const [products, setProducts] = useState(initialProducts);
    const [sortOption, setSortOption] = useState("default");

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

    const breadcrumbsItems = [
        {
            label: subSubCategory?.subCategory?.category?.name || "Категорія",
            href: `/category/${categoryName}`
        },
        {
            label: subSubCategory?.subCategory?.name || "Підкатегорія",
            href: `/category/${categoryName}/${subCategoryName}`
        },
        {
            label: subSubCategory?.name,
            href: null
        },
    ].filter(item => item.label);

    return (
        <div className="category-page-wrapper">
            <aside className="sidebar-panel">
                <FiltersPanel
                    filters={filters}
                    onFilter={setProducts}
                />
            </aside>

            <main className="content-section">
                <Breadcrumbs items={breadcrumbsItems}/>
                <h1>{subSubCategory.name}</h1>

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
                        getSortedProducts().map((product) => (
                            <ProductCard key={product._id} product={product}/>
                        ))
                    ) : (
                        <p>Товарів не знайдено ;(</p>
                    )}
                </ul>
            </main>
        </div>
    );
};

export default SubSubCategoryClient;
