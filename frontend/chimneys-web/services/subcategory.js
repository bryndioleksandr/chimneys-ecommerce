const API_BASE = 'http://localhost:5501';

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
        const response = await fetch(`http://localhost:5501/subcategory/search?name=${name}`);
        console.log('response from search:', response);
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (err) {
        console.error("Search error:", err);
        throw err;
    }
};


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
