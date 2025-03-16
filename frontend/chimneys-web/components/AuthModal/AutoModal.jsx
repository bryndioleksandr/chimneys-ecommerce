"use client";

import { useEffect, useState, useRef } from "react";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <div className="tabs">
                    <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Вхід</button>
                    <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Реєстрація</button>
                </div>

                <div className="form-container">
                    {isLogin ? (
                        <>
                            <h2>Вхід</h2>
                            <input type="email" placeholder="Email" required />
                            <input type="password" placeholder="Пароль" required />
                            <button className="auth-btn">Увійти</button>
                        </>
                    ) : (
                        <>
                            <h2>Реєстрація</h2>
                            <input type="text" placeholder="Ім'я" required />
                            <input type="email" placeholder="Email" required />
                            <input type="password" placeholder="Пароль" required />
                            <input type="password" placeholder="Підтвердьте пароль" required />
                            <button className="auth-btn">Зареєструватися</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
