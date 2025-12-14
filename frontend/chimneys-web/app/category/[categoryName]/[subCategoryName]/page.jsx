import React from "react";
import { notFound } from "next/navigation";
import { searchOneSubCategoryBySlug, searchSubCategoryProducts } from "../../../../services/subcategory";
import { searchCategoryBySlug } from "../../../../services/category";
import { searchSubSubCategoriesBySlug } from "../../../../services/subsubcategory";
import { backUrl } from '../../../../config/config';
import SubCategoryClient from "../../../../components/CategoryClient/SubCategoryClient";

async function getFiltersByCategory(categoryId, subCategoryId) {
    try {
        const res = await fetch(`${backUrl}/filters/${categoryId}/${subCategoryId}`, {
            next: { revalidate: 60 }
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
    const { subCategoryName } = await params;
    const subCatData = await searchOneSubCategoryBySlug(subCategoryName);
    const subCategory = subCatData[0];

    if (!subCategory) return { title: "Підкатегорія не знайдена" };

    return {
        title: `${subCategory.name} | Купити в ДимоHIT`,
        description: `Якісні товари з категорії ${subCategory.name}. Найкращі ціни, доставка.`
    };
}

export default async function SubCategoryPage({ params }) {
    const { categoryName, subCategoryName } = await params;

    const [subCatData, parentCatData] = await Promise.all([
        searchOneSubCategoryBySlug(subCategoryName),
        searchCategoryBySlug(categoryName)
    ]);

    const subCategory = subCatData[0];
    const parentCategory = parentCatData[0];

    if (!subCategory) return notFound();

    const [products, filters, subSubCategories] = await Promise.all([
        searchSubCategoryProducts(subCategory._id),
        getFiltersByCategory(parentCategory?._id, subCategory._id),
        searchSubSubCategoriesBySlug(subCategoryName)
    ]);

    return (
        <SubCategoryClient
            initialProducts={products}
            subCategory={subCategory}
            subSubCategories={subSubCategories}
            filters={filters}
            parentCategoryId={parentCategory?._id}
            categoryName={categoryName}
        />
    );
}
