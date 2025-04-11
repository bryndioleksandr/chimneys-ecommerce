import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ subCategories, subSubCategories }) => {
    const [productCode, setProductCode] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subSubCategory, setSubSubCategory] = useState('');
    const [img, setImg] = useState('');
    const [categories, setCategories] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5501/products/product', {
                productCode,
                name,
                price,
                category,
                subCategory,
                subSubCategory,
                img,
            });
            alert('Товар доданий!');
        } catch (error) {
            console.error('Помилка при додаванні товару:', error);
            alert('Помилка при додаванні товару');
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
            <h2>Створити товар</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Код товару"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Назва товару"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Ціна"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Виберіть категорію</option>
                    {categories && categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
                    <option value="">Виберіть підкатегорію</option>
                    {subCategories && subCategories.map(subCat => (
                        <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                    ))}
                </select>
                <select value={subSubCategory} onChange={(e) => setSubSubCategory(e.target.value)} required>
                    <option value="">Виберіть підпідкатегорію</option>
                    {subSubCategories && subSubCategories.map(subSubCat => (
                        <option key={subSubCat._id} value={subSubCat._id}>{subSubCat.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="URL зображення"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                />
                <button type="submit">Додати товар</button>
            </form>
        </div>
    );
};

export default ProductForm;
