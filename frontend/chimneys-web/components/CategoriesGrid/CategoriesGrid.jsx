"use client"
import React, { useEffect } from "react";
import "./CategoriesGrid.css";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { loadCartFromStorage } from '@/redux/slices/cart';

const CategoriesGrid = ({ categories = [] }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsedItems = JSON.parse(storedCart);
            dispatch(loadCartFromStorage(parsedItems));
        }
    }, [dispatch]);


    return (
        <div className="categories-grid">
            {categories.map((category, index) => (
                <Link
                    className="link"
                    href={`/category/${category.slug}`}
                    key={category._id || index}
                >
                    <div className="category-card">
                        <img src={category.img} alt={category.name} />
                        <p>{category.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};


export default CategoriesGrid;
