'use client'

import React, { useEffect, useState } from "react";
import RoleGuard from "../../components/auth/RoleGuard";
import "./style.css";
import { backUrl } from '../../config/config';
import {toast} from "react-toastify";

const API_URL = `${backUrl}/info-page`;

// export const metadata = {
//     title: "Про нас | Димарі",
//     description: "Дізнайтесь більше про магазин димоходів Димарі у Тернополі.",
// };

export default function AboutPage() {

    const [page, setPage] = useState(null);
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        fetch(API_URL + '/about')
            .then((res) => res.json())
            .then((data) => {
                setPage(data);
                setTitle(data.title ?? "");
                setContent(data.content ?? "");
            })
            .catch(() => {
                setPage({ title: "Про нас", content: "" });
            });
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch(`${API_URL}/about`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.message || errorText);
                } catch {
                    throw new Error(`Помилка збереження: ${res.status} ${res.statusText}`);
                }
            }

            const updated = await res.json();
            setPage(updated);
            setEditing(false);
            toast.success("Збережено!");
        } catch (err) {
            console.error("error is:", err);
            toast.error("Не вдалося зберегти: " + err.message);
        }
    };

    if (!page) return <div>Завантаження...</div>;

    return (
        <section className="info-page">
            <div className="container">
                {editing ? (
                    <RoleGuard role="admin">
                        <>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ fontSize: "2rem", width: "100%", marginBottom: 12 }}
                            />
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={10}
                                style={{ width: "100%", fontSize: "1rem" }}
                            />
                            <button onClick={handleSave} style={{ marginTop: 12 }}>
                                Зберегти
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                style={{ marginLeft: 8 }}
                            >
                                Відмінити
                            </button>
                        </>
                    </RoleGuard>
                ) : (
                    <>
                        <h1>{page.title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: page.content }} />
                        <RoleGuard role="admin">
                            <button
                                onClick={() => setEditing(true)}
                                style={{ marginTop: 12 }}
                            >
                                Редагувати
                            </button>
                        </RoleGuard>
                    </>
                )}
            </div>
        </section>
    );
}

