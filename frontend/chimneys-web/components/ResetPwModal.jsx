import {useState} from "react";
import {backUrl} from "@/config/config";

export const ResetPwModal = ({ onClose, notifySuccess, notifyError }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${backUrl}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Помилка запиту");

            notifySuccess("Інструкції з відновлення надіслано на вашу пошту!");
            onClose();
        } catch (err) {
            notifyError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-pw-container">
            <h2>Відновлення пароля</h2>
            <p>Введіть ваш Email, і ми надішлемо вам посилання для зміни пароля.</p>
            <form onSubmit={handleResetRequest}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="modal-actions">
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Надсилаємо..." : "Надіслати"}
                    </button>
                    <button type="button" className="back-btn" onClick={onClose}>
                        Назад до входу
                    </button>
                </div>
            </form>
        </div>
    );
};
