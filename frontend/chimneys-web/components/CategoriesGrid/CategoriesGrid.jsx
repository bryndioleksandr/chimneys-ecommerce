import React from "react";
import "./CategoriesGrid.css";
import Link from "next/link";

const categories = [
    { name: "Основні елементи, труби", img: "/images/garden.png" },
    { name: "Овальні і прямокутні", img: "/images/clothes.png" },
    { name: "Закінчення димоходу", img: "/images/furniture.png" },
    { name: "Кріплення і опори, тощо", img: "/images/interior.png" },
    { name: "Прохідні елементи", img: "/images/chemicals.png" },
    { name: "Спец елементи", img: "/images/appliances.png" },
    { name: "Чистка і сервіс", img: "/images/construction.png" },
    { name: "Для камінів, саун", img: "/images/plumbing.png" },
    { name: "Дефлектори", img: "/images/car.png" },
    { name: "Коліна, трійники", img: "/images/lighting.png" },
];

const CategoriesGrid = () => {
    return (
        <div className="categories-grid">
            {categories.map((category, index) => (
                <Link className="link" href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`} key={category.name}>
                    <div className="category-card" key={index}>
                        <img src={category.img} />
                        <p>{category.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default CategoriesGrid;
