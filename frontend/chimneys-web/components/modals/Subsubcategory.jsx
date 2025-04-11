import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubSubCategoryForm = () => {
    const [subCategory, setSubCategory] = useState('');
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [subCategories, setSubCategories] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5501/subsubcategory/subsubcategory', {
                subCategory,
                name,
                img
            });
            alert('Підпідкатегорія додана!');
        } catch (error) {
            console.error('Помилка при додаванні підпідкатегорії:', error);
            alert('Помилка при додаванні підпідкатегорії');
        }
    };

    useEffect(() => {
        // Fetch subcategories for select dropdown
        axios.get('http://localhost:5501/subcategory/subcategories')
            .then(response => {
                setSubCategories(response.data);
            })
            .catch(err => {
                console.error('Помилка при отриманні підкатегорій:', err);
            });
    }, []);

    return (
        <div className="form-container">
            <h2>Створити підпідкатегорію</h2>
            <form onSubmit={handleSubmit}>
                <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
                    <option value="">Виберіть підкатегорію</option>
                    {subCategories && subCategories.map(subCat => (
                        <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Назва підпідкатегорії"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="URL зображення"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                />
                <button type="submit">Додати підпідкатегорію</button>
            </form>
        </div>
    );
};

export default SubSubCategoryForm;
