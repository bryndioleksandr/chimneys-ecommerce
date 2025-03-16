"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
//import "../subcategory.css";

const mockData = {
    mebli: {
        krisla: [{ id: 1, name: "Офісне крісло", price: 1200 }],
        stoly: [{ id: 2, name: "Письмовий стіл", price: 2500 }],
    },
    tehnika: {
        telefony: [{ id: 3, name: "Смартфон", price: 10000 }],
        pilososy: [{ id: 4, name: "Пилосос LG", price: 4000 }],
    },
};

const SubcategoryPage = () => {
    const { categoryName, subcategoryName } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (categoryName && subcategoryName && mockData[categoryName]?.[subcategoryName]) {
            setProducts(mockData[categoryName][subcategoryName]);
        } else {
            setProducts([]);
        }
    }, [categoryName, subcategoryName]);

    return (
        <div className="containerSubcat">
            <h1>Підкатегорія: {subcategoryName}</h1>
            <ul>
                {products.length > 0 ? (
                    products.map((product) => (
                        <li key={product.id}>
                            {product.name} - {product.price} грн
                        </li>
                    ))
                ) : (
                    <p>Товарів не знайдено</p>
                )}
            </ul>
        </div>
    );
};

export default SubcategoryPage;
