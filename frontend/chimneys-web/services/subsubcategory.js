import { backUrl as API_BASE } from '../config/config';

export const fetchSubSubCategories = async () => {
    try {
        const response = await fetch(`${API_BASE}/subsubcategory/subsubcategories`, {credentials: 'include'});
        if (!response.ok) throw new Error('Failed to fetch subsubcategories');
        return await response.json();
    } catch (error) {
        console.error('Error fetching subsubcategories:', error);
        throw error;
    }
};

export const createSubSubCategory = async (subSubCategoryData) => {
    try {
        const response = await fetch(`${API_BASE}/subsubcategory/subsubcategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(subSubCategoryData),
        });
        if (!response.ok) throw new Error('Failed to create subsubcategory');
        return await response.json();
    } catch (error) {
        console.error('Error creating subsubcategory:', error);
        throw error;
    }
};

export const searchSubSubCategories = async (name) => {
    try {
        const formattedName = name.replace(/-/g, ' ');
        console.log('formatted name:', formattedName);
        const response = await fetch(`${API_BASE}/subsubcategory/search?name=${formattedName}`, {credentials: 'include'});
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchSubSubCategoriesBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE}/subsubcategory/search-all?slug=${slug}`, {credentials: 'include'});
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchOneSubSubCategoryBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE}/subsubcategory/search-one?slug=${slug}`, {credentials: 'include'});
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchSubSubCategoryProducts = async (subSubCategoryId) => {
    try {
        const response = await fetch(`${API_BASE}/products/by-subsubcategory/${subSubCategoryId}`, {credentials: 'include'});
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export const searchSubSubCategoryProductsPaginated = async (subSubCategoryId, page = 1, limit = 12) => {
    try {
        const response = await fetch(`${API_BASE}/products/by-subsubcategory-paginated/${subSubCategoryId}?page=${page}&limit=${limit}`, {credentials: 'include'});
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        console.log('response pag:', data);
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return {products: [], pagination: {total: 0, page: 1, totalPages: 1}};
    }
}
