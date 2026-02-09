"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { backUrl } from "../../../config/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './style.css';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const validatePasswords = () => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

        if (!passwordRegex.test(password)) {
            toast.error("Пароль має містити від 6 символів, літери та цифри.");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Паролі не збігаються.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswords()) return;

        setLoading(true);
        try {
            const res = await fetch(`${backUrl}/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Помилка оновлення пароля");

            toast.success("Пароль успішно змінено! Перенаправляємо на головну...");

            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page-container">
            <div className="reset-card">
                <h2>Новий пароль</h2>
                <p>
                    Встановіть новий пароль для входу в систему <strong>ДимоHIT</strong>.
                </p>

                <form onSubmit={handleSubmit} className="reset-form">
                    <input
                        className="reset-input"
                        type="password"
                        placeholder="Введіть новий пароль"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="reset-input"
                        type="password"
                        placeholder="Підтвердьте пароль"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="reset-button"
                        disabled={loading}
                    >
                        {loading ? "Оновлюємо..." : "Оновити пароль"}
                    </button>
                </form>
            </div>
            <ToastContainer position="bottom-right" theme="colored" />
        </div>
    );
}
