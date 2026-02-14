import React from "react";
import { notFound } from "next/navigation";
import {
    searchCategoryBySlug,
    searchCategoryProducts,
    searchCategoryProductsPaginated
} from "../../../services/category";
import { searchSubCategoriesBySlug } from "../../../services/subcategory";
import { backUrl } from '../../../config/config';
import CategoryClient from "../../../components/CategoryClient/CategoryClient";

async function getFiltersByCategory(categoryId) {
    try {
        const res = await fetch(`${backUrl}/filters/${categoryId}`, { next: { revalidate: 60 }, credentials: 'include' });
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

export default async function CategoryPage({ params, searchParams }) {
    const { categoryName } = await params;
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page) || 1;
    const limit = Number(resolvedSearchParams?.limit) || 12;
    const sort = resolvedSearchParams?.sort || 'new';

    const categoryData = await searchCategoryBySlug(categoryName);
    const currentCat = categoryData[0];

    if (!currentCat) {
        return notFound();
    }

    const [subcategories, productsData, filtersData] = await Promise.all([
        searchSubCategoriesBySlug(categoryName),
        // searchCategoryProducts(currentCat._id),
        searchCategoryProductsPaginated(currentCat._id, page, limit, sort),
        getFiltersByCategory(currentCat._id)
    ]);

    return (
        <CategoryClient
            initialProducts={productsData.products}
            pagination={productsData.pagination}
            subcategories={subcategories}
            category={currentCat}
            filtersData={filtersData}
            initialSort={sort}
        />
    );
}
