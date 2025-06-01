'use client'

import { useState } from "react";

export default function StoreDescription() {
    const [expanded, setExpanded] = useState(false);

    const fullText = `
🏪 **Магазин димоходів у Тернополі “Димарі”** — це місце, де ви знайдете надійні рішення для безпечного та ефективного димовідведення. Ми пропонуємо:

- Димоходи з нержавіючої сталі (одно- і двостінні)
- Сендвіч-димоходи для котлів, камінів, саун
- Коаксіальні труби, вентиляційні системи та комплектуючі
- Гарантія якості, сертифікація, технічна підтримка

🚚 **Доставка по всій Україні**, зручна консультація і чесні ціни — все це ви отримаєте, звернувшись до нас. Обирайте “Комфорт Димар” — обирайте **надійність, довговічність та професіоналізм**.
    `.trim();

    const previewText = fullText.slice(0, 250) + '...';

    return (
        <div style={styles.wrapper}>
            <div style={styles.text}>
                {(expanded ? fullText : previewText)
                    .split('\n')
                    .map((line, index) => (
                        <p key={index} style={styles.paragraph}>
                            {line}
                        </p>
                    ))}
            </div>
            <button style={styles.button} onClick={() => setExpanded(!expanded)}>
                {expanded ? "Згорнути" : "Читати далі"}
            </button>
        </div>
    );
}

const styles = {
    wrapper: {
        marginTop: "40px",
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        lineHeight: 1.75,
        fontSize: "17px",
        color: "#222",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto"
    },
    text: {
        marginBottom: "15px",
    },
    paragraph: {
        marginBottom: "10px",
    },
    button: {
        background: "#0070f3",
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 500,
        transition: "background 0.3s ease",
    }
};
