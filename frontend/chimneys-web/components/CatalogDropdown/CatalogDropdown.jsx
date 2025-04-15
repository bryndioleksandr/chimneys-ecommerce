"use client"
import {useState, useEffect, useRef} from "react";
import {FaBars, FaTimes} from "react-icons/fa";
import "./CatalogDropdown.css";
import axios from 'axios';

const categories = [
    "Основні елементи, труби",
    "Овальні і прямокутні",
    "Закінчення димоходу",
    "Кріплення і опори, тощо",
    "Прохідні елементи",
    "Спец елементи",
    "Чистка і сервіс",
    "Для камінів, саун",
    "Дефлектори",
    "Коліна, трійники",
];

const CatalogDropdown = () => {
    const [categoriess, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get("http://localhost:5501/category/categories");
            setCategories(response.data);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        console.log("Categories from back:", categoriess);
    }, [categoriess]);


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
                {isOpen ? <FaTimes/> : <FaBars/>}
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
