import { backUrl as API_BASE } from '../config/config';

export const fetchSubCategories = async () => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/subcategories`);
        if (!response.ok) throw new Error('Failed to fetch subcategories');
        return await response.json();
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
    }
};

export const searchSubCategories = async (name) => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/search?name=${name}`);
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchSubCategoriesBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/search-slug?slug=${slug}`);
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchOneSubCategoryBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/search-slug-one/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch subcategory');
        return await response.json();
    } catch (error) {
        console.error('Error fetching subcategory:', error);
        throw error;
    }
}


export const createSubCategory = async (subCategoryData) => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/subcategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subCategoryData),
        });
        if (!response.ok) throw new Error('Failed to create subcategory');
        return await response.json();
    } catch (error) {
        console.error('Error creating subcategory:', error);
        throw error;
    }
};

export const searchSubCategoryProducts = async (subCategoryId) => {
    try {
        const response = await fetch(`${API_BASE}/products/by-subcategory/${subCategoryId}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}
