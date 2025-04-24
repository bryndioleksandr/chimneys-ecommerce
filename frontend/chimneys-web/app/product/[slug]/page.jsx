"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProductPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log('slug is:', slug);

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
        <div className="container">
            <h1>{product.name}</h1>
            <p>Ціна: {product.price} грн</p>
            <p>Опис: {product.description}</p>
            {product.images?.length > 0 && (
                <img src={product.images[0]} alt={product.name} style={{ width: '300px' }} />
            )}
        </div>
    );
};

export default ProductPage;
