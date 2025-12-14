import React from "react";
import { notFound } from "next/navigation";
import { searchCategoryBySlug, searchCategoryProducts } from "../../../services/category";
import { searchSubCategoriesBySlug } from "../../../services/subcategory";
import { backUrl } from '../../../config/config';
import CategoryClient from "../../../components/CategoryClient/CategoryClient"; // Імпортуємо клієнтську частину

async function getFiltersByCategory(categoryId) {
    try {
        const res = await fetch(`${backUrl}/filters/${categoryId}`, { next: { revalidate: 60 } });
        if (!res.ok) return {};
        const data = await res.json();
        return data.filters || {};
    } catch (e) {
        console.error(e);
        return {};
    }
}

export async function generateMetadata({ params }) {
    const { categoryName } = await params;
    const categoryData = await searchCategoryBySlug(categoryName);
    const category = categoryData[0];

    if (!category) return { title: "Категорія не знайдена" };

    return {
        title: `${category.name} | ДимоHIT`,
        description: `Купити ${category.name} у Тернополі. Найкращі ціни.`
    };
}

export default async function CategoryPage({ params }) {
    const { categoryName } = await params;

    const categoryData = await searchCategoryBySlug(categoryName);
    const currentCat = categoryData[0];

    if (!currentCat) {
        return notFound();
    }

    const [subcategories, products, filtersData] = await Promise.all([
        searchSubCategoriesBySlug(categoryName),
        searchCategoryProducts(currentCat._id),
        getFiltersByCategory(currentCat._id)
    ]);

    return (
        <CategoryClient
            initialProducts={products}
            subcategories={subcategories}
            category={currentCat}
            filtersData={filtersData}
        />
    );
}
