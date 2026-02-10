import { backUrl } from '../config/config';

export async function getBanners() {
    const res = await fetch(`${backUrl}/banner/banners`, {
        next: { revalidate: 3600, tags: ['banners'] },
        credentials: 'include'
    });
    if (!res.ok) return [];
    return res.json();
}

export async function getCategories() {
    const res = await fetch(`${backUrl}/category/categories`, {
        next: { revalidate: 3600, tags: ['categories'] },
        credentials: 'include'
    });
    if (!res.ok) return [];
    return res.json();
}

export async function getPopularProducts() {
    const res = await fetch(`${backUrl}/products/popular`, {
        next: { revalidate: 60 },
        credentials: 'include'
    });
    if (!res.ok) return [];
    return res.json();
}

export async function getSaleProducts() {
    const res = await fetch(`${backUrl}/products/for-sale`, {
        next: { revalidate: 60 },
        credentials: 'include'
    });
    if (!res.ok) return [];
    return res.json();
}
