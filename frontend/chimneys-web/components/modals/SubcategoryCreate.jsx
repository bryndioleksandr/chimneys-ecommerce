import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubCategoryForm = () => {
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [categories, setCategories] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5501/subcategory/subcategory', {
                category,
                name,
                img
            });
            alert('Підкатегорія додана!');
        } catch (error) {
            console.error('Помилка при додаванні підкатегорії:', error);
            alert('Помилка при додаванні підкатегорії');
        }
    };

    useEffect(() => {
        axios.get('http://localhost:5501/category/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(err => {
                console.error('Помилка при отриманні категорій:', err);
            });
    }, []);

    return (
        <div className="form-container">
            <h2>Створити підкатегорію</h2>
            <form onSubmit={handleSubmit}>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Виберіть категорію</option>
                    {categories && categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Назва підкатегорії"
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
                <button type="submit">Додати підкатегорію</button>
            </form>
        </div>
    );
};

export default SubCategoryForm;
