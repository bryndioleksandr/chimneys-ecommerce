import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductReviews, getProductGroup } from "../../../services/product";
import ProductClient from "../../../components/CategoryClient/ProductClient";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) return { title: "Товар не знайдено" };

    return {
        title: `${product.name} | Купити в ДимоHIT`,
        description: product.description ? product.description.slice(0, 160) : `Купити ${product.name} за найкращою ціною.`,
        openGraph: {
            images: product.images && product.images[0] ? [product.images[0]] : [],
        },
    };
}

export default async function ProductPage({ params }) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        return notFound();
    }


    const [reviews, productGroups] = await Promise.all([
        getProductReviews(product._id),
        getProductGroup(product.groupId)
    ]);

    return (
        <ProductClient
            product={product}
            reviews={reviews}
            productGroups={productGroups}
        />
    );
}
