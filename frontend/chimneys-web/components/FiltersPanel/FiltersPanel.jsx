"use client";
import React, { useState, useEffect } from "react";
import './FiltersPanel.css';
import axios from "axios";

const FILTER_LABELS = {
    diameter: "Діаметр",
    hasMesh: "Наявність сітки",
    revision: "Ревізія",
    steelGrade: "Марка сталі",
    thickness: "Товщина",
    weight: "Вага",
    price: "Ціна",
};

const FiltersPanel = ({ filters = {}}) => {
    const [selectedFilters, setSelectedFilters] = useState({});
    const [collapsed, setCollapsed] = useState({});
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
    const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: 0 });

    useEffect(() => {
        if (filters.price?.length) {
            const min = Math.min(...filters.price);
            const max = Math.max(...filters.price);
            setPriceRange({ min, max });
            setSelectedPrice({ min, max });
        }
    }, [filters.price]);

    const handleCheckboxChange = (key, value) => {
        setSelectedFilters((prev) => {
            const current = prev[key] || [];
            const isSelected = current.includes(value);
            return {
                ...prev,
                [key]: isSelected
                    ? current.filter((v) => v !== value)
                    : [...current, value],
            };
        });
    };

    const handleToggleCollapse = (key) => {
        setCollapsed((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handlePriceChange = (type, value) => {
        setSelectedPrice((prev) => ({
            ...prev,
            [type]: Number(value),
        }));
    };

    const handleApplyFilters = async() => {
        const finalFilters = {
            ...selectedFilters,
            price: [selectedPrice.min, selectedPrice.max],
        };
        const queryParams = new URLSearchParams();
        for (const key in finalFilters) {
            const value = finalFilters[key];
            if (Array.isArray(value)) {
                value.forEach((val) => {
                    queryParams.append(key, val);
                });
            } else {
                queryParams.append(key, value);
            }
        }
        console.log('final filters are: ', finalFilters)
        try {
            const response = await axios.get(`http://localhost:5501/products/filtered-products?${queryParams.toString()}`);
            const data = response.data;
            console.log("Отримані продукти:", data);
        } catch (error) {
            console.error("Помилка при запиті на бекенд:", error);
        }
    };

    return (
        <div className="filters-panel">
            <h3>Фільтри</h3>

            {Object.entries(filters).map(([key, values]) => {
                if (key === "price") return null;

                return (
                    <div key={key} className="filter-group">
                        <div className="filter-header" onClick={() => handleToggleCollapse(key)} style={{ cursor: "pointer" }}>
                            <strong>{FILTER_LABELS[key] || key}</strong> {collapsed[key] ? "▶" : "▼"}
                        </div>

                        {!collapsed[key] && (
                            <div className="filter-options">
                                {values.map((v, idx) => (
                                    <div key={idx} className="filter-option">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={v}
                                                checked={selectedFilters[key]?.includes(v) || false}
                                                onChange={() => handleCheckboxChange(key, v)}
                                            />
                                            {v.toString()}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {filters.price?.length > 0 && (
                <div className="filter-group">
                    <div className="filter-header" onClick={() => handleToggleCollapse("price")} style={{ cursor: "pointer" }}>
                        <strong>Ціна(₴)</strong> {collapsed.price ? "▶" : "▼"}
                    </div>

                    {!collapsed.price && (
                        <div className="price-filter">
                            <div className="price-inputs">
                                <label>
                                    Від: <input
                                    type="number"
                                    value={selectedPrice.min}
                                    min={priceRange.min}
                                    max={selectedPrice.max}
                                    onChange={(e) => handlePriceChange("min", e.target.value)}
                                />
                                </label>
                                <label>
                                    До: <input
                                    type="number"
                                    value={selectedPrice.max}
                                    min={selectedPrice.min}
                                    max={priceRange.max}
                                    onChange={(e) => handlePriceChange("max", e.target.value)}
                                />
                                </label>
                            </div>

                            <div className="price-sliders">
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    value={selectedPrice.min}
                                    onChange={(e) => handlePriceChange("min", e.target.value)}
                                />
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    value={selectedPrice.max}
                                    onChange={(e) => handlePriceChange("max", e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button onClick={handleApplyFilters}>Застосувати</button>
        </div>
    );
};

export default FiltersPanel;
