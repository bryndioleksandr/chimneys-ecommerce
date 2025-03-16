"use client"
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./CatalogDropdown.css";

const categories = ["Меблі", "Одяг", "Техніка", "Інструменти", "Канцелярія"];

const CatalogDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Закривати меню при кліку поза блоком
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="catalog-container" ref={menuRef}>
            <button className="catalog-button" onClick={toggleMenu}>
                <span>КАТАЛОГ ТОВАРІВ</span>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {isOpen && (
                <ul className="catalog-dropdown">
                    {categories.map((category, index) => (
                        <li key={index} onClick={() => alert(`Вибрано: ${category}`)}>
                            {category}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CatalogDropdown;
