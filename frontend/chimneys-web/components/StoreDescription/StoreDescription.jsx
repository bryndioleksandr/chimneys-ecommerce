'use client'

import { useState } from "react";
import './StoreDescription.css';

export default function StoreDescription() {
    const [expanded, setExpanded] = useState(false);

    const fullText = `
🏪 Магазин димоходів у Тернополі “ДимоHIT” — це місце, де ви знайдете надійні рішення для безпечного та ефективного димовідведення. Ми пропонуємо:

- Димоходи з нержавіючої сталі (одно- і двостінні)
- Сендвіч-димоходи для котлів, камінів, саун
- Коаксіальні труби, вентиляційні системи та комплектуючі
- Гарантія якості, сертифікація, технічна підтримка

🚚 **Доставка по всій Україні**, зручна консультація і чесні ціни — все це ви отримаєте, звернувшись до нас. Обирайте “Димарі” — отримуйте **надійність, довговічність та професіоналізм**.
    `.trim();

    const previewText = fullText.slice(0, 250) + '...';

    return (
        <div style={styles.wrapperDescription}>
            <div style={styles.textDescription}>
                {(expanded ? fullText : previewText)
                    .split('\n')
                    .map((line, index) => (
                        <p key={index} style={styles.paragraphDescription}>
                            {line}
                        </p>
                    ))}
            </div>
            <button style={styles.buttonDescription} onClick={() => setExpanded(!expanded)}>
                {expanded ? "Згорнути" : "Читати далі"}
            </button>
        </div>
    );
}

const styles = {
    wrapperDescription: {
        marginTop: "40px",
        backgroundColor: "var(--card-bg)",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        lineHeight: 1.75,
        fontSize: "17px",
        color: "var(--text-color)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto"
    },
    textDescription: {
        marginBottom: "15px",
    },
    paragraphDescription: {
        marginBottom: "10px",
    },
    buttonDescription: {
        background: "var(--primary-color)",
        color: "var(--card-bg)",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 500,
        transition: "background 0.3s ease",
    }
};
