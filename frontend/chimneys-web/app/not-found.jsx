'use client';

import { useState } from 'react';

export default function NotFound() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F9FAFA',
            padding: '20px'
        }}>
            <style>{`
                @keyframes smoke {
                    0% { transform: translateY(0) scale(1); opacity: 0.9; }
                    100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
                }
                
                .smoke {
                    animation: smoke 3s ease-in-out infinite;
                }
            `}</style>

            <div style={{
                textAlign: 'center',
                maxWidth: '700px',
                width: '100%',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 0
                }}>
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="smoke"
                            style={{
                                position: 'absolute',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(0, 66, 79, 0.3)',
                                left: `-${i * 10}px`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                <div style={{
                    fontSize: '100px',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    🏠
                </div>

                <h1 style={{
                    fontSize: '120px',
                    fontWeight: '800',
                    margin: '0',
                    color: '#00424F',
                    lineHeight: '1',
                    marginBottom: '20px'
                }}>
                    404
                </h1>

                <h2 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1F2A2E',
                    marginBottom: '16px',
                    marginTop: '0'
                }}>
                    Сторінку не знайдено :(
                </h2>

                <p style={{
                    fontSize: '18px',
                    color: '#5A6C72',
                    marginBottom: '40px',
                    lineHeight: '1.6'
                }}>
                    Схоже, цей димохід веде в нікуди, або сторінку було видалено. 💨
                </p>

                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        padding: '16px 40px',
                        backgroundColor: '#00424F',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                        boxShadow: isHovered
                            ? '0 4px 12px rgba(0, 66, 79, 0.3)'
                            : '0 2px 4px rgba(0, 66, 79, 0.2)'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    ← Повернутися на головну
                </a>

                <p style={{
                    marginTop: '30px',
                    fontSize: '14px',
                    color: '#8A9FA5'
                }}>
                    Можливо, ви шукали щось інше?
                </p>

                <div style={{
                    marginTop: '50px',
                    padding: '30px',
                    backgroundColor: '#E6F2F3',
                    borderRadius: '12px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                }}>
                    <div>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1F2A2E',
                            marginBottom: '12px'
                        }}>
                            Популярні сторінки
                        </h3>
                        <a href="/" style={{
                            display: 'block',
                            color: '#00424F',
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginBottom: '8px',
                            transition: 'color 0.2s'
                        }}>
                            → Каталог товарів
                        </a>
                        <a href="/about" style={{
                            display: 'block',
                            color: '#00424F',
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginBottom: '8px'
                        }}>
                            → Про нас
                        </a>
                        <a href="/contacts" style={{
                            display: 'block',
                            color: '#00424F',
                            textDecoration: 'none',
                            fontSize: '14px'
                        }}>
                            → Контакти
                        </a>
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1F2A2E',
                            marginBottom: '12px'
                        }}>
                            Потрібна допомога?
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#5A6C72',
                            margin: '0 0 8px 0'
                        }}>
                            📞 Зателефонуйте нам
                        </p>
                        <p style={{
                            fontSize: '14px',
                            color: '#5A6C72',
                            margin: '0'
                        }}>
                            📧 Напишіть на пошту
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
