"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import './style.css';

const ProductPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5501/products/by-slug/${slug}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    if (loading) return <p>Завантаження...</p>;
    if (!product) return <p>Товар не знайдено</p>;

    return (
        <div className="container mx-auto px-4 py-8 productContainer">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    {product.images?.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full max-w-md productImage"
                        />
                    ) : (
                        <div className="bg-gray-200 h-64 w-full max-w-md rounded"/>
                    )}
                </div>

                <div className="flex-1 space-y-4 productInfo">
                    <h1 className="font-bold">{product.name}</h1>
                    <p className="productPrice">{product.price} грн</p>
                    <div className="flex gap-4">
                        <button className="buyButton px-4 py-2 rounded">Купити</button>
                        <button className="wishlistButton px-4 py-2 rounded">Додати до вішлисту</button>
                    </div>
                    <p className="productMeta">Код товару: {product.productCode}</p>
                    <div className="space-y-2">
                        <h2 className="sectionTitle">Опис</h2>
                        <p>{product.description}</p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="sectionTitle">Характеристики</h2>
                        <ul className="list-disc list-inside text-sm characteristicsList">
                            {product.steelGrade && <li>Марка сталі: {product.steelGrade}</li>}
                            {product.thickness && <li>Товщина: {product.thickness} мм</li>}
                            {product.diameter && <li>Діаметр: {product.diameter} мм</li>}
                            {product.length && <li>Довжина: {product.length} мм</li>}
                            {product.weight && <li>Вага: {product.weight} кг</li>}
                            {product.angle && <li>Кут: {product.angle}°</li>}
                            {product.revision && <li>Ревізія: Так</li>}
                            {product.hasMesh && <li>Сітка: Є</li>}
                            {product.insulationThickness &&
                                <li>Товщина утеплювача: {product.insulationThickness} мм</li>}
                            {product.stock != null && <li>В наявності: {product.stock} шт</li>}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="reviewsBlock">
                <h2 className="text-xl font-bold mb-2">Відгуки</h2>
                <p className="text-gray-600 italic">Відгуки поки що відсутні. Будьте першим!</p>
            </div>
        </div>

    );
};

export default ProductPage;
