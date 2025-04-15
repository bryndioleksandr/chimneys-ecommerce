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
