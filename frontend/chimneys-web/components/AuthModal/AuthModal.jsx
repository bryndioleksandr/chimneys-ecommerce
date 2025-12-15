"use client";

import {useEffect, useState, useRef, useCallback} from "react";
import "./AuthModal.css";
import {setUser, getUser, backUrl} from "../../config/config";
import {loginUser, registerUser} from "@/services/auth";
import useEscapeKey from "@/hooks/useEscapeClose";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useDispatch } from "@/redux/store";
import { dispUser } from '@/redux/slices/user';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    useOnClickOutside(modalRef, useCallback(onClose, [onClose]));
    useEscapeKey(onClose, isOpen);

    const notifyError = (message) => toast.error(message);
    const notifySuccess = (message) => toast.success(message);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const [isVerifyStep, setIsVerifyStep] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

        if (!emailRegex.test(email)) {
            notifyError("Некоректний email");
            return false;
        }

        if (!passwordRegex.test(password)) {
            notifyError("Пароль має містити щонайменше 6 символів, хоча б одну літеру та одну цифру.");
            return false;
        }

        if (!isLogin && password !== confirmPassword) {
            notifyError("Паролі не збігаються");
            return false;
        }

        if (!isLogin && (name.trim().length < 2 || surname.trim().length < 2)) {
            notifyError("Ім'я та прізвище мають містити щонайменше 2 символи.");
            return false;
        }

        return true;
    };


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
        if (!validateForm()) return;

        try {
            const data = await registerUser({ name, surname, email, password });
            notifySuccess("Перевір код на пошті");
            setIsVerifyStep(true);
        } catch (err) {
            console.error("Register error", err);
            notifyError(err.message);
        }
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            const data = await loginUser(email, password);

            if (!data?.user) {
                throw new Error("Невірні дані. Спробуйте ще раз.");
            }

            await setUser(data.user);
            dispatch(dispUser(data.user));
            onClose();
            notifySuccess(`З поверненням!`);
        } catch (err) {
            notifyError(err.message);
            console.error("Login error", err);
        }
    };


    if (!isOpen) return null;

    const verifyEmailCode = async () => {
        try {
            const res = await fetch(`${backUrl}/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Verification failed");

            notifySuccess("Email успішно підтверджено!");
            await setUser(data.user);
            dispatch(dispUser(data.user));
            setIsVerifyStep(false);
            onClose();
        } catch (err) {
            notifyError(err.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <div className="tabs">
                    <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Вхід</button>
                    <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Реєстрація</button>
                </div>

                <div className="form-container">
                    {isLogin ? (
                        <div className="login" key="login">
                            <h2>Вхід</h2>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Пароль"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <label className="show-password">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                Показати пароль
                            </label>
                            <button className="auth-btn" onClick={handleLogin}>Увійти</button>
                        </div>
                    ) : isVerifyStep ? (
                        <div className="verify-step" key="verify">
                            <h2>Підтвердження Email</h2>
                            <p>Код підтвердження надіслано на <strong>{email}</strong></p>
                            <input
                                type="text"
                                placeholder="Введіть код"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                            <button className="auth-btn" onClick={verifyEmailCode}>Підтвердити</button>
                        </div>
                    ) : (
                        <div className="register" key="register">
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Пароль"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Підтвердьте пароль"
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            <label className="show-password">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                Показати пароль
                            </label>
                            <button className="auth-btn" onClick={handleRegister}>Зареєструватися</button>
                        </div>
                    )}
                </div>


            </div>
            <ToastContainer/>
        </div>
    );
};

export default AuthModal;
