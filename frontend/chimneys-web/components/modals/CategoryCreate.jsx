import React, { useState } from 'react';
import axios from 'axios';
import { backUrl } from '../../config/config';

const CategoryForm = () => {
    const [name, setName] = useState('');
    const [imgFile, setImgFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('categoryImage', imgFile); // 'img' має відповідати імені поля у Multer

        try {
            const response = await axios.post(
                `${backUrl}/category/category`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                }
            );
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
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImgFile(e.target.files[0])}
                    required
                />
                <button type="submit">Додати категорію</button>
            </form>
        </div>
    );
};

export default CategoryForm;
