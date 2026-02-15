"use client";

import React, {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import ProductCard from "../ProductCard/ProductCard";
import FiltersPanel from "../FiltersPanel/FiltersPanel";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Pagination from "../Pagination/Pagination";
import "../../app/category/category.css";
import {useSelector} from "react-redux";
import {useDispatch} from "../../redux/store";
import {clearProductSelection, toggleProductSelection} from "../../redux/slices/adminProducts";
import {ProductsActions} from "../ProductsActions/ProductsActions";

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
    const dispatch = useDispatch();

    const user = useSelector(state => state.user.user);
    const {productIds} = useSelector(state => state.adminProducts);

    const [products, setProducts] = useState(initialProducts);

    const [sortOption, setSortOption] = useState(initialSort || "new");
    const [limit, setLimit] = useState(Number(pagination?.limit) || 12);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

        router.push(`${pathname}?${params.toString()}`, {scroll: false});
    };

    const handleLimitChange = (e) => {
        const newLimit = e.target.value;
        setLimit(newLimit);

        const params = new URLSearchParams(searchParams);
        params.set("limit", newLimit);
        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`, {scroll: false});
    };

    const handleSubSubcategoryClick = (subsubcategory) => {
        router.push(`/category/${categoryName}/${subCategory.slug}/${subsubcategory.slug}`);
    };

    const handleCheckboxChange = (id) => {
        dispatch(toggleProductSelection(id))
    };

    const handleClearSelection = () => {
        dispatch(clearProductSelection());
    }

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
                    <div className="select-sort-wrapper">
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
                    <div className="select-limit-wrapper">
                        <label htmlFor="limitSelect" style={{marginRight: '5px'}}>Показати по:</label>
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
                            {isMounted && user?.role === "admin" && <option value="3000">Усі товари</option>}
                        </select>
                    </div>
                    {/*//ProductsActions*/}
                    {isMounted && user?.role === "admin" && productIds && productIds.length > 0 && (<button className='sort-select' onClick={handleClearSelection}>Очистити вибрані товари</button>)}
                    {isMounted && user?.role === "admin" && productIds && productIds.length > 0 && <ProductsActions selectedIds={productIds} />}

                </div>

                <ul className="product-list">
                    {products?.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} style={{ position: 'relative' }}>
                                {isMounted && user?.role === "admin" &&
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        zIndex: 10,
                                        transform: 'scale(1.5)'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={productIds.includes(product._id)}
                                            onChange={() => handleCheckboxChange(product._id)}
                                            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                                        />
                                    </div> }
                                <ProductCard key={product._id} product={product}/>
                            </div>
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
