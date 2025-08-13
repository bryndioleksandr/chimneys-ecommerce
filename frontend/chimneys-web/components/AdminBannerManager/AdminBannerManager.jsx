'use client';
import { useEffect, useState } from 'react';
import { backUrl } from '../../config/config';

export default function AdminBannerManager() {
    const [banners, setBanners] = useState([]);
    const [file, setFile] = useState(null);
    const [alt, setAlt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${backUrl}/banner/banners`);
            const data = await res.json();
            setBanners(data);
        } catch (error) {
            console.error('Помилка при завантаженні банерів', error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt', alt);

        try {
            setIsLoading(true);
            const res = await fetch(`${backUrl}/banner/banners`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (res.ok) {
                setAlt('');
                setFile(null);
                await fetchBanners();
            } else {
                console.error('Помилка при завантаженні банера');
            }
        } catch (err) {
            console.error('Помилка:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Точно видалити банер?')) return;

        try {
            await fetch(`${backUrl}/banner/banners/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            await fetchBanners();
        } catch (err) {
            console.error('Помилка при видаленні банера');
        }
    };

    return (
        <div style={styles.wrapper}>
            <h2>🖼️ Керування банерами</h2>

            <form onSubmit={handleUpload} style={styles.form}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <input
                    type="text"
                    placeholder="Alt текст"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Завантаження...' : 'Додати банер'}
                </button>
            </form>

            <div style={styles.bannerList}>
                {banners.map((banner) => (
                    <div key={banner._id} style={styles.bannerItem}>
                        <img
                            src={banner.image}
                            alt={banner.alt}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                        <p><strong>Alt:</strong> {banner.alt}</p>
                        <button onClick={() => handleDelete(banner._id)} style={styles.deleteBtn}>
                            ❌ Видалити
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        background: '#fff',
    },
    form: {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '8px',
        fontSize: '16px',
    },
    button: {
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        padding: '10px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    bannerList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
    },
    bannerItem: {
        background: '#f9f9f9',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    deleteBtn: {
        marginTop: '10px',
        background: '#ff4d4f',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};
