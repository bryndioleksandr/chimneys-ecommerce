"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import ProductCard from "../ProductCard/ProductCard";
import FiltersPanel from "../FiltersPanel/FiltersPanel";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Pagination from "../Pagination/Pagination";
import "../../app/category/category.css";

const CategoryClient = ({
                            initialProducts,
                            pagination,
                            subcategories,
                            category,
                            filtersData
                        }) => {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

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

    const handleSubcategoryClick = (subcategory) => {
        router.push(`/category/${category.slug}/${subcategory.slug}`);
    };

    return (
        <div className="category-page-wrapper">
            {products.length > 0 &&  (
                <aside className="sidebar-panel">
                <FiltersPanel
                    filters={filtersData}
                    onFilter={setProducts}
                    categoryId={category._id}
                    subCategoryId={null}
                    subSubCategoryId={null}
                />
            </aside>)}


            <main className="content-section">
                <Breadcrumbs items={[{label: category?.name, href: null}]}/>
                <h1>{category.name}</h1>

                <ul className="subcategory-list">
                    {subcategories.length > 0 && subcategories.map((subcategory) => (
                        <Link
                            className="subcategory-item"
                            href={`/category/${category.slug}/${subcategory.slug}`}
                            key={subcategory._id}
                        >
                            <li className="category-card-incomp" onClick={() => handleSubcategoryClick(subcategory)}>
                                <img src={subcategory.img} alt={subcategory.name}/>
                                <p className="p-incomp">{subcategory.name}</p>
                            </li>
                        </Link>
                    ))}
                </ul>

                <div>
                    <div className="sort-options-container">
                        <select
                            id="sortSelect"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="sort-select"
                        >
                            <option value="default">За замовчуванням</option>
                            <option value="price-asc">Від найдешевших</option>
                            <option value="price-desc">Від найдорожчих</option>
                            <option value="rating-desc">Найпопулярніші</option>
                            <option value="newest">Новинки</option>
                        </select>
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
                    <div className="pagination-wrapper"
                         style={{marginTop: '30px', display: 'flex', justifyContent: 'center'}}>
                        <Pagination
                            totalPages={pagination.totalPages}
                            currentPage={pagination.page}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CategoryClient;
