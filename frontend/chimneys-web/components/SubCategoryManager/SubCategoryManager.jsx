"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CategoryManager/style.css';

const SubCategoryManager = () => {
    const [subcategories, setSubCategories] = useState([]);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState(null);

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5501/subcategory/subcategories');
            setSubCategories(response.data);
        } catch (error) {
            console.error('Помилка при отриманні категорій:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Точно видалити категорію?')) return;
        try {
            await axios.delete(`http://localhost:5501/subcategory/${id}`);
            fetchSubCategories();
        } catch (error) {
            console.error('Помилка при видаленні:', error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const formData = new FormData();
            if (newName) formData.append('name', newName);
            if (newImage) formData.append('subcategoryImage', newImage);

            await axios.patch(`http://localhost:5501/subcategory/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            setEditingSubCategory(null);
            setNewName('');
            setNewImage(null);
            fetchSubCategories();
        } catch (error) {
            console.error('Помилка при оновленні:', error);
        }
    };

    useEffect(() => {
        fetchSubCategories();
    }, []);

    return (
        <div className="container-update">
            <h2>Категорії</h2>
            <ul>
                {subcategories.map(cat => (
                    <li key={cat._id}>
                        {editingSubCategory === cat._id ? (
                            <>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setNewImage(e.target.files[0])}
                                />
                                <button onClick={() => handleEdit(cat._id)}>Зберегти</button>
                                <button onClick={() => {
                                    setEditingSubCategory(null);
                                    setNewName('');
                                    setNewImage(null);
                                }}>Скасувати
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="category-info">
                                    {cat.img && (
                                        <img
                                            src={cat.img}
                                            alt={cat.name}
                                            className="category-image"
                                        />
                                    )}
                                    <span>{cat.name}</span>
                                </div>
                                <div>
                                    <button onClick={() => {
                                        setEditingSubCategory(cat._id);
                                        setNewName(cat.name);
                                    }}>Редагувати
                                    </button>
                                    <button onClick={() => handleDelete(cat._id)}>Видалити</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubCategoryManager;
