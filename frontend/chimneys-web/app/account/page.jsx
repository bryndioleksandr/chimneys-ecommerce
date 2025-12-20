'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import './style.css';
import { backUrl } from '../../config/config';
import {toast} from "react-toastify";

export default function AccountPage() {
    const user = useSelector(state => state.user.user);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                surname: user.surname || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backUrl}/user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success('Профіль успішно оновлено!');
                setIsEditing(false);
            } else {
                const error = await response.json();
                toast.error(error.message || 'Помилка при оновленні профілю');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Помилка при оновленні профілю');
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                surname: user.surname || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="account-container">
                <div className="account-content">
                    <h1>Мій акаунт</h1>
                    <p>Будь ласка, увійдіть в систему для перегляду вашого профілю.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="account-container">
            <div className="account-content">
                <div className="account-header">
                    <h1>Мій акаунт</h1>
                </div>

                <div className="account-info">
                    <div className="info-section">
                        <h2>Особиста інформація</h2>
                        <div className="form-group">
                            <label>Ім'я:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            ) : (
                                <span className="info-value">{user.name || 'Не вказано'}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Прізвище:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            ) : (
                                <span className="info-value">{user.surname || 'Не вказано'}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            ) : (
                                <span className="info-value">{user.email}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Телефон:</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="+380"
                                />
                            ) : (
                                <span className="info-value">{user.phone || 'Не вказано'}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Адреса:</label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    rows="3"
                                    placeholder="Введіть вашу адресу"
                                />
                            ) : (
                                <span className="info-value">{user.address || 'Не вказано'}</span>
                            )}
                        </div>
                    </div>

                    <div className="account-links">
                        <h2>Швидкі посилання</h2>
                        <div className="links-grid">
                            <Link href="/my-orders" className="account-link">
                                <div className="link-card">
                                    <div className="link-icon">📦</div>
                                    <div className="link-content">
                                        <h3>Мої замовлення</h3>
                                        <p>Переглянути історію замовлень</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/favorites" className="account-link">
                                <div className="link-card">
                                    <div className="link-icon">❤️</div>
                                    <div className="link-content">
                                        <h3>Обране</h3>
                                        <p>Збережені товари</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/cart" className="account-link">
                                <div className="link-card">
                                    <div className="link-icon">🛒</div>
                                    <div className="link-content">
                                        <h3>Кошик</h3>
                                        <p>Переглянути кошик</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
