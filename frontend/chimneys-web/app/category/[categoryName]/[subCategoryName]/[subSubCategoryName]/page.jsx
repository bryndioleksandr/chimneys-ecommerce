import React from "react";
import { notFound } from "next/navigation";
import { searchCategoryBySlug } from "../../../../../services/category";
import { searchOneSubCategoryBySlug } from "../../../../../services/subcategory";
import {
    searchOneSubSubCategoryBySlug,
    searchSubSubCategoryProducts,
    searchSubSubCategoryProductsPaginated
} from "../../../../../services/subsubcategory";
import { backUrl } from '../../../../../config/config';
import SubSubCategoryClient from "../../../../../components/CategoryClient/SubSubCategoryClient";


async function getFiltersByCategory(categoryId, subCategoryId, subSubCategoryId) {
    try {
        const res = await fetch(`${backUrl}/filters/${categoryId}/${subCategoryId}/${subSubCategoryId}`, {
            next: { revalidate: 60 },
            credentials: 'include'
        });
        if (!res.ok) return {};
        const data = await res.json();
        return data.filters || {};
    } catch (e) {
        console.error(e);
        return {};
    }
}

export async function generateMetadata({ params }) {
    const { subSubCategoryName } = await params;
    const data = await searchOneSubSubCategoryBySlug(subSubCategoryName);
    const subSubCategory = data[0];

    if (!subSubCategory) return { title: "Сторінка не знайдена" };

    return {
        title: `${subSubCategory.name} | Купити в ДимоHIT`,
        description: `Великий вибір товарів у категорії ${subSubCategory.name}. Якість, гарантія, доставка.`
    };
}

export default async function SubSubCategoryPage({ params, searchParams }) {
    const { categoryName, subCategoryName, subSubCategoryName } = await params;

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page) || 1;
    const limit = 12;

    const [catData, subCatData, subSubCatData] = await Promise.all([
        searchCategoryBySlug(categoryName),
        searchOneSubCategoryBySlug(subCategoryName),
        searchOneSubSubCategoryBySlug(subSubCategoryName)
    ]);

    const category = catData[0];
    const subCategory = subCatData[0];
    const subSubCategory = subSubCatData[0];

    if (!subSubCategory) return notFound();

    const [productsData, filters] = await Promise.all([
        //searchSubSubCategoryProducts(subSubCategory._id),
        searchSubSubCategoryProductsPaginated(subSubCategory._id, page, limit),
        getFiltersByCategory(category?._id, subCategory?._id, subSubCategory._id)
    ]);

    return (
        <SubSubCategoryClient
            initialProducts={productsData.products}
            pagination={productsData.pagination}
            subSubCategory={subSubCategory}
            filters={filters}
            categoryName={categoryName}
            subCategoryName={subCategoryName}
        />
    );
}
