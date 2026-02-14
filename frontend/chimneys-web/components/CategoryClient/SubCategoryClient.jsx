"use client";

import React, {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
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
                               categoryName,
    initialSort
                           }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState(initialProducts);

    const [sortOption, setSortOption] = useState(initialSort || "new");

    useEffect(() => {
        setProducts(initialProducts);
        setSortOption(initialSort || "new");
    }, [initialProducts, initialSort]);

    const handleSortChange = (e) => {
        const newSortValue = e.target.value;
        setSortOption(newSortValue);

        const params = new URLSearchParams(searchParams);

        params.set("sort", newSortValue);

        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
                            <li className="category-card-incomp" onClick={() => handleSubSubcategoryClick(subsubcategory)}>
                                <img src={subsubcategory.img} alt={subsubcategory.name}/>
                                <p className="p-incomp">{subsubcategory.name}</p>
                            </li>
                        </Link>
                    ))}
                </ul>

                <div className="sort-options-container">
                    <select
                        id="sortSelect"
                        value={sortOption}
                        onChange={handleSortChange}
                        className="sort-select"
                    >
                        <option value="new">Новинки (За замовчуванням)</option>
                        <option value="cheap">Від найдешевших</option>
                        <option value="expensive">Від найдорожчих</option>
                        <option value="popular">Популярні</option>
                        <option value="name_asc">За назвою (А-Я)</option>
                    </select>
                </div>

                <ul className="product-list">
                    {products?.length > 0 ? (
                        products.map((product) => (
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
