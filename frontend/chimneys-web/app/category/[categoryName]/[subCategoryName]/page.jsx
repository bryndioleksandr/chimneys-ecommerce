"use client";

import {useParams, useRouter} from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    searchOneSubCategoryBySlug, searchSubCategoriesBySlug,
    searchSubCategoryBySlug,
    searchSubCategoryProducts,
} from "../../../../services/subcategory";
import ProductCard from "../../../../components/ProductCard/ProductCard";
import FiltersPanel from "../../../../components/FiltersPanel/FiltersPanel";
import "../../category.css";
import {searchCategoryBySlug} from "../../../../services/category";
import Link from "next/link";
import {searchSubSubCategoriesBySlug} from "../../../../services/subsubcategory";
import { backUrl } from '../../../../config/config';
import Breadcrumbs from "../../../../components/Breadcrumbs/Breadcrumbs";

const SubCategoryPage = () => {
    const { categoryName, subCategoryName } = useParams();
    const router = useRouter();
    const [subCatName, setSubCatName] = useState("");
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({});
    const [sortOption, setSortOption] = useState("default");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [subSubCategories, setSubSubCategories] = useState([]);
    const [parentCat, setParentCat] = useState('');
    const [currentSubCat, setCurrentSubCat] = useState('');
    const [subCatObject, setSubCatObject] = useState({});


    const getFiltersByCategory = async (categoryId, subCategoryId) => {
        console.log('filters id:', categoryId, "and as well ", subCategoryId);
        const res = await fetch(`${backUrl}/filters/${categoryId}/${subCategoryId}`);
        if (!res.ok) throw new Error('Не вдалося отримати фільтри');
        const data = await res.json();
        return data.filters;
    };


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const subSubCategories = await searchSubSubCategoriesBySlug(subCategoryName);
                setSubSubCategories(subSubCategories);
                const subCategoryData = await searchOneSubCategoryBySlug(subCategoryName);
                const subCategoryId = subCategoryData[0]._id;
                setSubCatName(subCategoryData[0].name);
                setCurrentSubCat(subCategoryId);
                setSubCatObject(subCategoryData[0]);
                const productData = await searchSubCategoryProducts(subCategoryId);
                const parentCategory = await searchCategoryBySlug(categoryName);
                setParentCat(parentCategory[0]._id);
                const filtersData = await getFiltersByCategory(parentCategory[0]._id, subCategoryId);

                setProducts(productData);
                setFilters(filtersData);
            } catch (err) {
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

    const handleSubSubcategoryClick = (subsubcategory) => {
        router.push(`/category/${categoryName}/${subCategoryName}/${subsubcategory.slug}`);
    };

    return (
        <div className="category-page-wrapper">
            <aside className="sidebar-panel">
                <FiltersPanel filters={filters} onFilter={setProducts} categoryId={parentCat} subCategoryId={currentSubCat}/>
            </aside>

            <main className="content-section">
                <Breadcrumbs items={[
                    { label: subCatObject?.category?.name, href: `/category/${subCatObject?.category?.slug}` },
                    { label: subCatObject?.name, href: `/category/${subCatObject?.category?.slug}/${subCatObject?.slug}/${subCatObject?.slug}` },
                ].filter(item => item.label)}/>
                <h1>{subCatName}</h1>
                {loading && <p>Завантаження...</p>}
                {error && <p style={{color: "red"}}>{error}</p>}

                <ul className="subcategory-list">
                    {subSubCategories.length > 0 ? (
                        subSubCategories.map((subsubcategory) => (
                            <Link
                                className="subsubcategory-item"
                                href={`/category/${categoryName}/${subCategoryName}/${subsubcategory.slug}`}
                                key={subsubcategory._id}
                            >
                                <li
                                    onClick={() => handleSubSubcategoryClick(subsubcategory)}
                                    className="subsubcategory-item"
                                >
                                    {subsubcategory.name}
                                </li>
                            </Link>
                        ))
                    ) : (
                        <p></p>
                    )}
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

export default SubCategoryPage;
