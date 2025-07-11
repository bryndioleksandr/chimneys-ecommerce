import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newName, setNewName] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5501/category/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Помилка при отриманні категорій:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Точно видалити категорію?')) return;
        try {
            await axios.delete(`http://localhost:5501/category/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Помилка при видаленні:', error);
        }
    };

    const handleEdit = async (id) => {
        try {
            await axios.put(`http://localhost:5501/category/${id}`, { name: newName });
            setEditingCategory(null);
            setNewName('');
            fetchCategories();
        } catch (error) {
            console.error('Помилка при оновленні:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <h2>Категорії</h2>
            <ul>
                {categories.map(cat => (
                    <li key={cat._id}>
                        {editingCategory === cat._id ? (
                            <>
                                <input
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                                <button onClick={() => handleEdit(cat._id)}>Зберегти</button>
                                <button onClick={() => setEditingCategory(null)}>Скасувати</button>
                            </>
                        ) : (
                            <>
                                {cat.name}
                                <button onClick={() => {
                                    setEditingCategory(cat._id);
                                    setNewName(cat.name);
                                }}>Редагувати</button>
                                <button onClick={() => handleDelete(cat._id)}>Видалити</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManager;
