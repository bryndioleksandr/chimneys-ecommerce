"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { searchSubCategories } from "../../../services/subcategory";
import "../category.css";
import Link from "next/link";

const CategoryPage = () => {
    const params = useParams();
    const router = useRouter();
    const { categoryName } = params;
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const categoryId = categoryName;
    console.log('category id is: ', categoryId);
    console.log('params are: ', params);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (categoryId) {
                setLoading(true);
                setError(null);
                try {
                    const data = await searchSubCategories(categoryId);
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
            {error && <p style={{ color: "red" }}>{error}</p>}
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
        </div>
    );
};

export default CategoryPage;
