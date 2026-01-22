"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import ProductCard from "../ProductCard/ProductCard";
import FiltersPanel from "../FiltersPanel/FiltersPanel";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Pagination from "../Pagination/Pagination";
import "../../app/category/category.css";

const SubCategoryClient = ({
                               initialProducts,
                               pagination,
                               subCategory,
                               subSubCategories,
                               filters,
                               parentCategoryId,
                               categoryName
                           }) => {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

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

    const handleSubSubcategoryClick = (subsubcategory) => {
        router.push(`/category/${categoryName}/${subCategory.slug}/${subsubcategory.slug}`);
    };

    return (
        <div className="category-page-wrapper">
            <aside className="sidebar-panel">
                <FiltersPanel
                    filters={filters}
                    onFilter={setProducts}
                    categoryId={parentCategoryId}
                    subCategoryId={subCategory._id}
                />
            </aside>

            <main className="content-section">
                <Breadcrumbs items={[
                    {label: subCategory?.category?.name || "Категорія", href: `/category/${categoryName}`},
                    {label: subCategory?.name, href: null},
                ].filter(item => item.label)}/>

                <h1>{subCategory.name}</h1>

                <ul className="subcategory-list">
                    {subSubCategories.length > 0 && subSubCategories.map((subsubcategory) => (
                        <Link
                            className="subsubcategory-item"
                            href={`/category/${categoryName}/${subCategory.slug}/${subsubcategory.slug}`}
                            key={subsubcategory._id}
                        >
                            <li onClick={() => handleSubSubcategoryClick(subsubcategory)}>
                                {subsubcategory.name}
                            </li>
                        </Link>
                    ))}
                </ul>

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
                    {products?.length > 0 ? (
                        getSortedProducts().map((product) => (
                            <ProductCard key={product._id} product={product}/>
                        ))
                    ) : (
                        <p>Товарів не знайдено ;(</p>
                    )}
                </ul>
                <div className="pagination-wrapper"
                     style={{marginTop: '30px', display: 'flex', justifyContent: 'center'}}>
                    <Pagination
                        totalPages={pagination.totalPages}
                        currentPage={pagination.page}
                    />
                </div>
            </main>
        </div>
    );
};

export default SubCategoryClient;
