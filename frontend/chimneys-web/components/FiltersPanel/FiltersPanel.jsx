"use client";
import React, { useState, useEffect } from "react";
import './FiltersPanel.css';
import axios from "axios";

const FILTER_LABELS = {
    diameter: "Діаметр(мм)",
    hasMesh: "Наявність сітки",
    revision: "Наявність ревізії",
    steelGrade: "Марка сталі",
    thickness: "Товщина(мм)",
    weight: "Вага(кг)",
    price: "Ціна",
    stock: "У наявності",
    length: "Довжина(мм)",
    angle: "Кут(°)"
};

const FiltersPanel = ({ filters = {}, onFilter }) => {
    const [selectedFilters, setSelectedFilters] = useState({});
    const [collapsed, setCollapsed] = useState({});
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
    const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: 0 });
    const [isInStock, setIsInStock] = useState(false);
    const [isOutStock, setIsOutStock] = useState(false);


    useEffect(() => {
        if (filters.price?.length) {
            const min = Math.min(...filters.price);
            const max = Math.max(...filters.price);
            setPriceRange({ min, max });
            setSelectedPrice({ min, max });
        }
    }, [filters.price]);

    useEffect(() => {
        if (!filters.stock) return;

        const hasInStock = filters.stock.some(v => Number(v) > 0);
        const hasOutOfStock = filters.stock.some(v => Number(v) <= 0);

        setIsInStock(hasInStock);
        setIsOutStock(hasOutOfStock);
    }, [filters.stock]);

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
            if (onFilter) {
                onFilter(data);
            }
            console.log("Отримані продукти:", data);
        } catch (error) {
            console.error("Помилка при запиті на бекенд:", error);
        }
    };

    const handleResetFilters = () => {
        const resetFilters = {};
        const resetPrice = { min: priceRange.min, max: priceRange.max };

        setSelectedFilters(resetFilters);
        setSelectedPrice(resetPrice);

        const finalFilters = {
            ...resetFilters,
            price: [resetPrice.min, resetPrice.max],
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

        axios
            .get(`http://localhost:5501/products/filtered-products?${queryParams.toString()}`)
            .then((response) => {
                const data = response.data;
                if (onFilter) {
                    onFilter(data);
                }
                console.log("Отримані продукти:", data);
            })
            .catch((error) => {
                console.error("Помилка при запиті на бекенд:", error);
            });
    };


    return (
        <div className="filters-panel">
            <h3>Фільтри</h3>
            <button onClick={handleResetFilters} className="reset-button">Скинути фільтри</button>
            {filters.stock && (
                <div className="filter-group">
                    <div
                        className="filter-header"
                        onClick={() => handleToggleCollapse("stock")}
                        style={{cursor: "pointer"}}
                    >
                        <strong>{FILTER_LABELS["stock"]}</strong>{" "}
                        {collapsed["stock"] ? "▶" : "▼"}
                    </div>

                    {!collapsed["stock"] && (
                        <div className="filter-options">
                            {isInStock && (
                                <div className="filter-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={true}
                                            checked={selectedFilters["stock"]?.includes(true) || false}
                                            onChange={() => handleCheckboxChange("stock", true)}
                                        />
                                        так
                                    </label>
                                </div>
                            )}
                            {isOutStock && (
                                <div className="filter-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={false}
                                            checked={selectedFilters["stock"]?.includes(false) || false}
                                            onChange={() => handleCheckboxChange("stock", false)}
                                        />
                                        ні
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {Object.entries(filters).map(([key, values]) => {
                if (key === "price" || key === "stock") return null;

                return (
                    <div key={key} className="filter-group">
                        <div className="filter-header" onClick={() => handleToggleCollapse(key)}
                             style={{cursor: "pointer"}}>
                            <strong>{FILTER_LABELS[key] || key}</strong> {collapsed[key] ? "▶" : "▼"}
                        </div>

                        {!collapsed[key] && (
                            <div className="filter-options">
                                {values.map((v, idx) => {
                                    let displayValue = v;

                                    if (key === "hasMesh" || key === "revision") {
                                        displayValue = v === true || v === "true" ? "так" : "ні";
                                    }

                                    if (key === "stock") {
                                        Number(v) > 0 ? setIsInStock(true) : setIsOutStock(true);
                                    }

                                    return (
                                        <div key={idx} className="filter-option">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={v}
                                                    checked={selectedFilters[key]?.includes(v) || false}
                                                    onChange={() => handleCheckboxChange(key, v)}
                                                />
                                                {displayValue}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            {filters.price?.length > 0 && (
                <div className="filter-group">
                    <div className="filter-header" onClick={() => handleToggleCollapse("price")}
                         style={{cursor: "pointer"}}>
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

            <button onClick={handleApplyFilters} className="apply-btn">Застосувати</button>
        </div>
    );
};

export default FiltersPanel;
