"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CategoryManager/style.css';

const SubSubCategoryManager = () => {
    const [subsubcategories, setSubSubCategories] = useState([]);
    const [editingSubSubCategory, setEditingSubSubCategory] = useState(null);
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState(null);

    const fetchSubSubCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5501/subsubcategory/subsubcategories');
            setSubSubCategories(response.data);
        } catch (error) {
            console.error('Помилка при отриманні категорій:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Точно видалити категорію?')) return;
        try {
            await axios.delete(`http://localhost:5501/subsubcategory/${id}`);
            fetchSubSubCategories();
        } catch (error) {
            console.error('Помилка при видаленні:', error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const formData = new FormData();
            if (newName) formData.append('name', newName);
            if (newImage) formData.append('subsubcategoryImage', newImage);

            await axios.patch(`http://localhost:5501/subsubcategory/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            setEditingSubSubCategory(null);
            setNewName('');
            setNewImage(null);
            fetchSubSubCategories();
        } catch (error) {
            console.error('Помилка при оновленні:', error);
        }
    };

    useEffect(() => {
        fetchSubSubCategories();
    }, []);

    return (
        <div className="container-update">
            <h2>Категорії</h2>
            <ul>
                {subsubcategories.map(cat => (
                    <li key={cat._id}>
                        {editingSubSubCategory === cat._id ? (
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
                                    setEditingSubSubCategory(null);
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
                                        setEditingSubSubCategory(cat._id);
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

export default SubSubCategoryManager;
