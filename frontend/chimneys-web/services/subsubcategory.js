const API_BASE = 'http://localhost:5501';

export const fetchSubSubCategories = async () => {
    try {
        const response = await fetch(`${API_BASE}/subsubcategory/subsubcategories`);
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
        const response = await fetch(`http://localhost:5501/subsubcategory/search?name=${formattedName}`);
        console.log('response from search sub:', response);
        console.log("searchSubSubCategories response body:", await response.clone().json());
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchSubSubCategoriesBySlug = async (slug) => {
    try {
        const response = await fetch(`http://localhost:5501/subsubcategory/search-all?slug=${slug}`);
        console.log('response from search:', response);
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};

export const searchSubSubCategoryProducts = async (subSubCategoryId) => {
    try {
        const response = await fetch(`${API_BASE}/products/by-subsubcategory/${subSubCategoryId}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}
