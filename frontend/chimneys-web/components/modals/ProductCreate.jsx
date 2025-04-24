import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {searchSubCategories} from "../../services/subcategory";
import {searchSubSubCategories} from "../../services/subsubcategory";

const ProductForm = () => {
    const [productCode, setProductCode] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subSubCategory, setSubSubCategory] = useState('');
    const [img, setImg] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);

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
            console.log('response: ', response);
        } catch (error) {
            console.error('Помилка при додаванні товару:', error);
            console.log('error is:', error);
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
                <select value={category} onChange={async (e) => {
                    const selectedCategory = e.target.value;
                    setCategory(selectedCategory);
                    setSubCategory('');
                    setSubSubCategory('');
                    setSubSubCategories([]);
                    if (selectedCategory) {
                        try {
                            const categoryObj = categories.find(cat => cat._id === selectedCategory);
                            const categoryName = categoryObj?.name;
                            const data = await searchSubCategories(categoryName);
                            setSubCategories(data);
                        } catch (err) {
                            console.log('Error caught in res:', err);

                        }
                    } else {
                        setSubCategories([]);
                    }
                }
                } required>
                    <option value="">Виберіть категорію</option>
                    {categories && categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <select value={subCategory} onChange={async (e) => {
                    const selectedSubCategory = e.target.value;
                    setSubCategory(selectedSubCategory);
                    setSubSubCategory('');
                    if (selectedSubCategory) {
                        try {
                            const subCategoryObj = subCategories.find(cat => cat._id === selectedSubCategory);
                            const subCategoryName = subCategoryObj?.name;
                            const data = await searchSubSubCategories(subCategoryName);
                            setSubSubCategories(data);
                        } catch (err) {
                            console.log('Error caught in res:', err);

                        }
                    } else {
                        setSubSubCategories([]);
                    }
                }
                }>
                    <option value="">Виберіть підкатегорію</option>
                    {subCategories && subCategories.map(subCat => (
                        <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                    ))}
                </select>
                <select value={subSubCategory} onChange={(e) => setSubSubCategory(e.target.value)}>
                    <option value="">Виберіть підпідкатегорію</option>
                    {subSubCategories && subSubCategories.map(subSubCat => (
                        <option key={subSubCat._id} value={subSubCat._id}>{subSubCat.name}</option>
                    ))}
                </select>
                <input
                    type="file"
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
