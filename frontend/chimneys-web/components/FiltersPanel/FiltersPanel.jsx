"use client";

import React, { useState } from "react";
import './FiltersPanel.css';

const FiltersPanel = ({ onFilterChange }) => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("");

    const handleApplyFilters = () => {
        onFilterChange({ minPrice, maxPrice, sortBy });
    };

    return (
        <div className="filters-panel">
            <h3>Фільтри</h3>

            <label>Мінімальна ціна</label>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />

            <label>Максимальна ціна</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

            <label>Сортувати за:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">-- Вибрати --</option>
                <option value="price_asc">Ціна ↑</option>
                <option value="price_desc">Ціна ↓</option>
                <option value="rating_desc">Рейтинг</option>
            </select>

            <button onClick={handleApplyFilters}>Застосувати</button>
        </div>
    );
};

export default FiltersPanel;
