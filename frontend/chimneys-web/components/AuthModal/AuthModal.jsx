"use client";

import { useEffect, useState, useRef } from "react";
import "./AuthModal.css";
import {setUser, getUser} from "@/config/config";
import {loginUser, registerUser} from "@/services/auth";
import useEscapeKey from "@/hooks/useEscapeClose";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useDispatch } from "@/redux/store";
import { dispUser } from '@/redux/slices/user';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    useOutsideClick(modalRef, onClose, isOpen);
    useEscapeKey(onClose, isOpen);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (modalRef.current && !modalRef.current.contains(event.target)) {
    //             onClose();
    //         }
    //     };
    //
    //     if (isOpen) {
    //         document.addEventListener("mousedown", handleClickOutside);
    //     }
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [isOpen]);
    //
    // useEffect(() => {
    //     const handleKeyDown = (event) => {
    //         if (event.key === "Escape") {
    //             onClose();
    //         }
    //     };
    //
    //     if (isOpen) {
    //         document.addEventListener("keydown", handleKeyDown);
    //     }
    //     return () => {
    //         document.removeEventListener("keydown", handleKeyDown);
    //     };
    // }, [isOpen]);

    const resetForm = () => {
        setName("");
        setSurname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const data = await registerUser({ name, surname, email, password });
            await setUser(data.user);
            dispatch(dispUser(data.user));
            onClose();
        } catch (err) {
            console.error("Register error", err);
        }
    };

    const handleLogin = async () => {
        try {
            const data = await loginUser(email, password);
            console.log('here is user data:', data);
            await setUser(data.user);
            dispatch(dispUser(data.user));
            onClose();
        } catch (err) {
            console.error("Login error", err);
        }
    };

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
