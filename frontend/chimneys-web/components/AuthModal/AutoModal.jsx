"use client";

import { useEffect, useState, useRef } from "react";
import "./AuthModal.css";
import {setUser, getUser} from "@/app/config";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const modalRef = useRef(null);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    const handleRegister = async() => {
        if(password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try{
            const response = await fetch('http://localhost:5501/user/register', {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials: "include",
                mode: "cors",
                body: JSON.stringify({name, surname, email, password})
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("Помилка: " + errorData.message);
                return;
            }

            const responseData = await response.json();
            const {accessToken, refreshToken, user} = responseData;
            console.log(responseData);
            console.log(accessToken);
            console.log('user data:', user);
            await setUser(user);
            const userOur = await getUser();
            console.log('user is', userOur);
            alert("Реєстрація успішна");
            onClose();

        } catch(err){
            console.error('Error:', err);
        }
    }

    const handleLogin = async() => {
        try {
            const response = await fetch('http://localhost:5501/user/login', {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials: "include",
                mode: "cors",
                body: JSON.stringify({email, password})
            })
            if (!response.ok) {
                console.error('Here is error with login man');
                return;
            }
            const responseData = await response.json();
            const {accessToken, refreshToken, user} = responseData;
            console.log(responseData);
            console.log(accessToken);
            console.log('user data:', user);
            await setUser(user);
            const userOur = await getUser();
            console.log('user is', userOur);
        }
        catch (err){
            console.error('Error:', err);
        }
    }
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
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button className="auth-btn" onClick={handleLogin}>Увійти</button>
                        </>
                    ) : (
                        <>
                            <h2>Реєстрація</h2>
                            <input
                                type="text"
                                placeholder="Ім'я"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Прізвище"
                                required
                                value={surname}
                                onChange={e => setSurname(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Підтвердьте пароль"
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            <button className="auth-btn" onClick={handleRegister}>Зареєструватися</button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AuthModal;
