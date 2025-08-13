import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backUrl } from '../../config/config';

const SubSubCategoryForm = () => {
    const [subCategory, setSubCategory] = useState('');
    const [name, setName] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [subCategories, setSubCategories] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('subCategory', subCategory);
        formData.append('name', name);
        formData.append('subsubcategoryImage', imgFile);

        try {
            const response = await axios.post(
                `${backUrl}/subsubcategory/subsubcategory`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            alert('Підпідкатегорія додана!');
        } catch (error) {
            console.error('Помилка при додаванні підпідкатегорії:', error);
            alert('Помилка при додаванні підпідкатегорії');
        }
    };

    useEffect(() => {
        axios.get(`${backUrl}/subcategory/subcategories`)
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
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImgFile(e.target.files[0])}
                    required
                />
                <button type="submit">Додати підпідкатегорію</button>
            </form>
        </div>
    );
};

export default SubSubCategoryForm;
