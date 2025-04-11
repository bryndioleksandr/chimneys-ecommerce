import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = () => {
    const [name, setName] = useState('');
    const [img, setImg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5501/category/category', {
                name,
                img
            });
            alert('Категорія додана!');
        } catch (error) {
            console.error('Помилка при додаванні категорії:', error);
            alert('Помилка при додаванні категорії');
        }
    };

    return (
        <div className="form-container">
            <h2>Створити категорію</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Назва категорії"
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
                <button type="submit">Додати категорію</button>
            </form>
        </div>
    );
};

export default CategoryForm;
