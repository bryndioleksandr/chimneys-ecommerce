import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductReviews, getProductGroup } from "../../../services/product";
import ProductClient from "../../../components/CategoryClient/ProductClient";

const BASE_URL = 'https://chimneys-ecommerce-bi38.vercel.app';


export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    let imageUrl = product.images && product.images[0] ? product.images[0] : null;

    if (!product) return { title: "Товар не знайдено" };

    return {
        title: `${product.name} | Купити в ДимоHIT`,
        description: product.description ? product.description.slice(0, 160) : `Купити ${product.name} за найкращою ціною.`,
        openGraph: {
            title: product.name,
            description: product.description ? product.description.slice(0, 160) : `Найкращі димоходи.`,
            url: `${BASE_URL}/product/${slug}`,
            siteName: 'ДимоHIT',
            locale: 'uk_UA',
            type: 'website',
            images: imageUrl ? [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: product.name,
                }
            ] : [],
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
