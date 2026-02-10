import { backUrl as API_BASE } from '../config/config';

export const fetchSubCategories = async () => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/subcategories`, {credentials: 'include'});
        if (!response.ok) throw new Error('Failed to fetch subcategories');
        return await response.json();
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
    }
};

export const searchSubCategories = async (name) => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/search?name=${name}`, {credentials: 'include', next: { revalidate: 60 }});
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchSubCategoriesBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/search-slug?slug=${slug}`, {credentials: 'include', next: { revalidate: 60 }});
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchOneSubCategoryBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE}/subcategory/search-slug-one/${slug}`, {credentials: 'include', next: { revalidate: 60 }});
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
            credentials: 'include',
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
        const response = await fetch(`${API_BASE}/products/by-subcategory/${subCategoryId}`, {credentials: 'include', next: { revalidate: 60 }});
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export const searchSubCategoryProductsPaginated = async (subCategoryId, page = 1, limit = 12) => {
    try {
        const response = await fetch(`${API_BASE}/products/by-subcategory-paginated/${subCategoryId}?page=${page}&limit=${limit}`, {credentials: 'include', next: { revalidate: 60 }});
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        console.log('response pag:', data);
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    }
}
