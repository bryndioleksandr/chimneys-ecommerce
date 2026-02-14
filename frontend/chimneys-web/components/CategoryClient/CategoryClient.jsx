// "use client";
//
// import React, {useState, useEffect} from "react";
// import {useRouter} from "next/navigation";
// import Link from "next/link";
// import ProductCard from "../ProductCard/ProductCard";
// import FiltersPanel from "../FiltersPanel/FiltersPanel";
// import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
// import Pagination from "../Pagination/Pagination";
// import "../../app/category/category.css";
//
// const CategoryClient = ({
//                             initialProducts,
//                             pagination,
//                             subcategories,
//                             category,
//                             filtersData,
//                             initialSort
//                         }) => {
//     const router = useRouter();
//     const [products, setProducts] = useState(initialProducts);
//     const [sortOption, setSortOption] = useState("default");
//
//     useEffect(() => {
//         setProducts(initialProducts);
//     }, [initialProducts]);
//
//     const getSortedProducts = () => {
//         let sortedProducts = [...products];
//         switch (sortOption) {
//             case "price-asc":
//                 sortedProducts.sort((a, b) => a.price - b.price);
//                 break;
//             case "price-desc":
//                 sortedProducts.sort((a, b) => b.price - a.price);
//                 break;
//             case "rating-desc":
//                 sortedProducts.sort((a, b) => b.rating - a.rating);
//                 break;
//             case "newest":
//                 sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//                 break;
//             default:
//                 break;
//         }
//         return sortedProducts;
//     };
//
//     const handleSubcategoryClick = (subcategory) => {
//         router.push(`/category/${category.slug}/${subcategory.slug}`);
//     };
//
//     return (
//         <div className="category-page-wrapper">
//             {products.length > 0 &&  (
//                 <aside className="sidebar-panel">
//                 <FiltersPanel
//                     filters={filtersData}
//                     onFilter={setProducts}
//                     categoryId={category._id}
//                     subCategoryId={null}
//                     subSubCategoryId={null}
//                 />
//             </aside>)}
//
//
//             <main className="content-section">
//                 <Breadcrumbs items={[{label: category?.name, href: null}]}/>
//                 <h1>{category.name}</h1>
//
//                 <ul className="subcategory-list">
//                     {subcategories.length > 0 && subcategories.map((subcategory) => (
//                         <Link
//                             className="subcategory-item"
//                             href={`/category/${category.slug}/${subcategory.slug}`}
//                             key={subcategory._id}
//                         >
//                             <li className="category-card-incomp" onClick={() => handleSubcategoryClick(subcategory)}>
//                                 <img src={subcategory.img} alt={subcategory.name}/>
//                                 <p className="p-incomp">{subcategory.name}</p>
//                             </li>
//                         </Link>
//                     ))}
//                 </ul>
//
//                 <div>
//                     <div className="sort-options-container">
//                         <select
//                             id="sortSelect"
//                             value={sortOption}
//                             onChange={(e) => setSortOption(e.target.value)}
//                             className="sort-select"
//                         >
//                             <option value="default">За замовчуванням</option>
//                             <option value="price-asc">Від найдешевших</option>
//                             <option value="price-desc">Від найдорожчих</option>
//                             <option value="rating-desc">Найпопулярніші</option>
//                             <option value="newest">Новинки</option>
//                         </select>
//                     </div>
//
//                     <ul className="product-list">
//                         {products.length > 0 ? (
//                             getSortedProducts().map((product) => (
//                                 <ProductCard key={product._id} product={product}/>
//                             ))
//                         ) : (
//                             <p>Товарів не знайдено ;(</p>
//                         )}
//                     </ul>
//                     <div className="pagination-wrapper"
//                          style={{marginTop: '30px', display: 'flex', justifyContent: 'center'}}>
//                         <Pagination
//                             totalPages={pagination.totalPages}
//                             currentPage={pagination.page}
//                         />
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };
//
// export default CategoryClient;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
                            filtersData,
                            initialSort
                        }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState(initialProducts);
    const [sortOption, setSortOption] = useState(initialSort || "new");
    const [limit, setLimit] = useState(Number(pagination?.limit) || 12);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        setProducts(initialProducts);
        setSortOption(initialSort || "new");
        if (pagination?.limit) {
            setLimit(pagination.limit);
        }
    }, [initialProducts, initialSort, pagination]);
    const handleSortChange = (e) => {
        const newSortValue = e.target.value;
        setSortOption(newSortValue);

        const params = new URLSearchParams(searchParams);

        params.set("sort", newSortValue);

        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleLimitChange = (e) => {
        const newLimit = e.target.value;
        setLimit(newLimit);

        const params = new URLSearchParams(searchParams);
        params.set("limit", newLimit);
        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleSubcategoryClick = (subcategory) => {
        router.push(`/category/${category.slug}/${subcategory.slug}`);
    };

    return (
        <div className="category-page-wrapper">
            <aside className="sidebar-panel">
                <FiltersPanel
                    filters={filtersData}
                    onFilter={setProducts}
                    categoryId={category._id}
                    subCategoryId={null}
                    subSubCategoryId={null}
                />
            </aside>

            <main className="content-section">
                <Breadcrumbs items={[{ label: category?.name, href: null }]} />
                <h1>{category.name}</h1>

                <ul className="subcategory-list">
                    {subcategories.length > 0 &&
                        subcategories.map((subcategory) => (
                            <Link
                                className="subcategory-item"
                                href={`/category/${category.slug}/${subcategory.slug}`}
                                key={subcategory._id}
                            >
                                <li
                                    className="category-card-incomp"
                                    onClick={() => handleSubcategoryClick(subcategory)}
                                >
                                    <img src={subcategory.img} alt={subcategory.name} />
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
                    <div className="select-wrapper">
                        <label htmlFor="limitSelect" style={{ marginRight: '5px' }}>Показати по:</label>
                        <select
                            id="limitSelect"
                            value={limit}
                            onChange={handleLimitChange}
                            className="sort-select"
                        >
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                            <option value="100">100</option>
                            <option value="3000">Усі товари</option>
                        </select>
                    </div>

                    <ul className="product-list">
                        {products.length > 0 ? (
                            products.map((product) => (
                                // <div key={product._id} style={{ position: 'relative' }}>
                                //     <div style={{
                                //         position: 'absolute',
                                //         top: '10px',
                                //         left: '10px',
                                //         zIndex: 10,
                                //         transform: 'scale(1.5)'
                                //     }}>
                                //         <input
                                //             type="checkbox"
                                //             checked={selectedIds.includes(product._id)}
                                //             // onChange={() => toggleProductSelection(product._id)}
                                //             style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                                //         />
                                //     </div>
                                <ProductCard key={product._id} product={product} />
                                // </div>
                            ))
                        ) : (
                            <p>Товарів не знайдено ;(</p>
                        )}
                    </ul>

                    <div
                        className="pagination-wrapper"
                        style={{
                            marginTop: "30px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
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
