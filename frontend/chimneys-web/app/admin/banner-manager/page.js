'use client';

import AdminBannerManager from '../../../components/AdminBannerManager/AdminBannerManager';

export default function BannerManagerPage() {
    return (
        <main style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Адмін: Керування банерами</h1>
            <AdminBannerManager />
        </main>
    );
}
