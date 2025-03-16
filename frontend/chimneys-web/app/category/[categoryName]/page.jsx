"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../category.css";

const mockData = {
    mebli: {
        stoly: [{ id: 1, name: "Дерев'яний стіл", price: 3200 }],
        divany: [{ id: 2, name: "Кутовий диван", price: 8500 }]
    },
    odyag: {
        kurtki: [{ id: 3, name: "Зимова куртка", price: 2800 }],
        shtany: [{ id: 4, name: "Джинси", price: 1200 }]
    },
    tehnika: {
        telefony: [{ id: 5, name: "Смартфон", price: 15000 }],
        pilososy: [{ id: 6, name: "Пилосос", price: 4200 }]
    }
};

const CategoryPage = () => {
    const params = useParams();
    const router = useRouter();
    const { categoryId } = params;
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        if (categoryId && mockData[categoryId]) {
            setSubcategories(Object.keys(mockData[categoryId]));
        } else {
            setSubcategories([]);
        }
    }, [categoryId]);

    const handleSubcategoryClick = (subcategory) => {
        router.push(`/category/${categoryId}/${subcategory}`);
    };

    return (
        <div className="containerCat">
            <h1>Категорія: {categoryId}</h1>
            <ul>
                {subcategories.length > 0 ? (
                    subcategories.map((subcategory) => (
                        <li
                            key={subcategory}
                            onClick={() => handleSubcategoryClick(subcategory)}
                            className="subcategory-item"
                        >
                            {subcategory}
                        </li>
                    ))
                ) : (
                    <p>Підкатегорій не знайдено</p>
                )}
            </ul>
        </div>
    );
};

export default CategoryPage;
