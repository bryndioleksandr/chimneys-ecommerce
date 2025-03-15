import React from "react";
import "./CategoriesGrid.css";

const categories = [
    { name: "Дача, сад та город", img: "/images/garden.png" },
    { name: "Одяг, взуття", img: "/images/clothes.png" },
    { name: "Меблі", img: "/images/furniture.png" },
    { name: "Дім та інтер'єр", img: "/images/interior.png" },
    { name: "Побутова хімія", img: "/images/chemicals.png" },
    { name: "Побутова техніка", img: "/images/appliances.png" },
    { name: "Будівництво та ремонт", img: "/images/construction.png" },
    { name: "Сантехніка", img: "/images/plumbing.png" },
    { name: "Автотовари", img: "/images/car.png" },
    { name: "Освітлення", img: "/images/lighting.png" },
];

const CategoriesGrid = () => {
    return (
        <div className="categories-grid">
            {categories.map((category, index) => (
                <div className="category-card" key={index}>
                    <img src={category.img} alt={category.name} />
                    <p>{category.name}</p>
                </div>
            ))}
        </div>
    );
};

export default CategoriesGrid;
