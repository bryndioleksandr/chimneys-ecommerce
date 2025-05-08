const API_BASE = 'http://localhost:5501';

export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE}/category/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await fetch(`${API_BASE}/category/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });
        if (!response.ok) throw new Error('Failed to create category');
        return await response.json();
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const searchCategoryByName = async (name) => {
    try {
        const response = await fetch(`${API_BASE}/category/by-name/${name}`);
        console.log('res onecat:', response);
        if (!response.ok) throw new Error('Failed to fetch category');
        return await response.json();
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}

export const searchCategoryBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE}/category/by-slug/${slug}`);
        console.log('res onecat:', response);
        if (!response.ok) throw new Error('Failed to fetch category');
        return await response.json();
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}

export const searchCategoryProducts = async (categoryId) => {
    try {
        const response = await fetch(`${API_BASE}/products/by-category/${categoryId}`);
        console.log('res prod:', response);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}
