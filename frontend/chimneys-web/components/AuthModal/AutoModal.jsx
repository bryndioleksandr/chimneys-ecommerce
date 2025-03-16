"use client";

import {useRef, useState} from "react";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const ref = useRef(null);
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Перемикання між вкладками */}
                <div className="tabs">
                    <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Вхід</button>
                    <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Реєстрація</button>
                </div>

                {/* Форма входу */}
                {isLogin ? (
                    <div>
                        <h2>Вхід</h2>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Пароль" />
                        <button className="auth-btn">Увійти</button>
                    </div>
                ) : (
                    <div>
                        <h2>Реєстрація</h2>
                        <input type="text" placeholder="Ім'я" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Пароль" />
                        <input type="password" placeholder="Підтвердьте пароль" />
                        <button className="auth-btn">Зареєструватися</button>
                    </div>
                )}

                {/* Кнопка закриття */}
                <button className="close-btn" onClick={onClose}>Закрити</button>
            </div>
        </div>
    );
};

export default AuthModal;
