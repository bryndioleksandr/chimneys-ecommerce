"use client"
import {useState, useEffect, useRef} from "react";
import {
    FaBars,
    FaTimes,
    FaInfoCircle,
    FaBuilding,
    FaExchangeAlt,
    FaCreditCard,
    FaPhoneAlt,
    FaCertificate,
    FaFileContract
} from "react-icons/fa";
import "./InfoMenu.css";
import axios from 'axios';
import {backUrl} from '../../config/config';
import Link from "next/link";
import CatalogDropdown from "@/components/CatalogDropdown/CatalogDropdown";

const InfoMenu = ({ categories = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);


    const toggleMenu = () => setIsOpen(!isOpen);


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
        <div className="info-container" ref={menuRef}>
            <button className="info-button" onClick={toggleMenu}>
                <span>ІНФО МЕНЮ</span>
                {isOpen ? <FaTimes/> : <FaInfoCircle/>}
            </button>

            {isOpen && (
                <>
                    <ul className="info-dropdown">
                        <li className="catalog-dropdown-li">
                            <CatalogDropdown categories={categories}/>
                        </li>
                        <li className="info-item">
                            <a href="/about">
                                <div className="info-div">
                                    <FaBuilding/>
                                    <span>Про нас</span>
                                </div>
                            </a>
                        </li>
                        <li className="info-item">
                            <a href="/exchange-return">
                                <div className="info-div">
                                    <FaExchangeAlt/>
                                    <span>Обмін та повернення</span>
                                </div>
                            </a>
                        </li>
                        <li className="info-item">
                            <a href="/pay-delivery">
                                <div className="info-div">
                                    <FaCreditCard/>
                                    <span>Оплата і доставка</span>
                                </div>
                            </a>
                        </li>
                        <li className="info-item">
                            <a href="/contacts">
                                <div className="info-div">
                                    <FaPhoneAlt/>
                                    <span>Контакти</span>
                                </div>
                            </a>
                        </li>
                        <li className="info-item">
                            <a href="/user-agreement">
                                <div className="info-div">
                                    <FaFileContract/>
                                    <span>Угода користувача</span>
                                </div>
                            </a>
                        </li>
                        <li className="info-item">
                            <a href="/certificates">
                                <div className="info-div">
                                    <FaCertificate/>
                                    <span>Сертифікати</span>
                                </div>
                            </a>
                        </li>
                        <li id="wrapper-info-dropdown">
                            <div className="address">
                                <span>Тернопіль</span>
                                <span>вул. Степана Будного, 37</span>
                            </div>
                            <div className="contacts">
                                <span>(012) 34-567-89</span>
                                <span>qwerty123@gmail.com</span>
                            </div>
                            <div className="schedule">
                                <span><b>Будні:</b> 09:00-18:00</span>
                                <span><b>Субота:</b> 09:00-15:00</span>
                            </div>
                        </li>
                    </ul>
                </>
            )}

        </div>
    );
};

export default InfoMenu;
