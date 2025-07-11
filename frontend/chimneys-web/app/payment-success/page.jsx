import Link from "next/link";

export default function PaymentSuccessPage() {
    return (
        <div style={{
            maxWidth: 600,
            margin: "100px auto",
            padding: 40,
            textAlign: "center",
            backgroundColor: "#f3fdf5",
            borderRadius: 10,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
            <h1 style={{ color: "#2e7d32" }}>✅ Дякуємо за покупку!</h1>
            <p>Ваше замовлення успішно оплачено. Ми вже почали обробку.</p>
                <a href="/" style={{
                    display: "inline-block",
                    marginTop: 20,
                    padding: "10px 20px",
                    backgroundColor: "#2e7d32",
                    color: "white",
                    borderRadius: 5,
                    textDecoration: "none"
                }}>
                    Повернутися на головну
                </a>
        </div>
    );
}
