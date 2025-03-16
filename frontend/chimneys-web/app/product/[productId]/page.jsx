"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const mockData = {
    mebli: [{ id: 1, name: "Крісло", price: 1200, description: "Зручне крісло для дому" }],
    odyag: [{ id: 2, name: "Куртка", price: 2500, description: "Тепла зимова куртка" }],
    tehnika: [
        { id: 3, name: "Пилосос", price: 4000, description: "Потужний пилосос для будинку" },
        { id: 2, name: "Куртка", price: 2500, description: "Тепла зимова куртка" },
    ],
};

const ProductPage = () => {
    const params = useParams();
    const productId = params.id;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        let foundProduct = null;
        Object.values(mockData).forEach((category) => {
            const item = category.find((prod) => prod.id === productId);
            if (item) foundProduct = item;
        });

        setProduct(foundProduct);
    }, [productId]);

    if (!product) {
        return <p>Товар {productId} не знайдено</p>;
    }

    return (
        <div className="container">
            <h1>{product.name}</h1>
            <p>Ціна: {product.price} грн</p>
            <p>Опис: {product.description}</p>
        </div>
    );
};

export default ProductPage;
