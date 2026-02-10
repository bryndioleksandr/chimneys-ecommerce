"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backUrl } from '../../config/config';
import '../CategoryManager/style.css';
import {toast} from "react-toastify";

const SubCategoryManager = () => {
    const [subcategories, setSubCategories] = useState([]);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState(null);
    const notifySuccess = (msg) => toast.success(msg);
    const notifyError = (msg) => toast.error(msg);

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get(`${backUrl}/subcategory/subcategories`, {withCredentials: true});
            setSubCategories(response.data);
        } catch (error) {
            console.error('Помилка при отриманні категорій:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Точно видалити категорію?')) return;
        try {
            await axios.delete(`${backUrl}/subcategory/${id}`, {withCredentials: true});
            notifySuccess("Категорію успішно видалено!");
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

            await axios.patch(`${backUrl}/subcategory/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            notifySuccess("Категорію успішно змінено!");
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
