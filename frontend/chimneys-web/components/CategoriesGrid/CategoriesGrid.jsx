"use client"

import React, { useEffect, useState } from "react";
import "./CategoriesGrid.css";
import Link from "next/link";
import { fetchCategories } from "@/services/category";
import { useDispatch } from 'react-redux';
import {addItemToCart, loadCartFromStorage} from '@/redux/slices/cart';

const CategoriesGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsedItems = JSON.parse(storedCart);
            console.log('all parsed items are: ', parsedItems);
            dispatch(loadCartFromStorage(parsedItems));
        }
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError("Не вдалося завантажити категорії.");
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return <p>Завантаження категорій...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div className="categories-grid">
            {categories.map((category, index) => (
                <Link
                    className="link"
                    href={`/category/${category.slug}`}
                    key={category.name}
                >
                    <div className="category-card" key={index}>
                        <img src={category.img} alt={category.name} />
                        <p>{category.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default CategoriesGrid;
