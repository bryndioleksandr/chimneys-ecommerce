import axios from "axios";
import {backUrl as API_BASE} from '../config/config';

export const updateProductRequest = async(productId, data) => {
    try{
        const response = await axios.put(`${API_BASE}/products/update/${productId}`, data);
    }catch (error) {
        console.error('Помилка при оновленні товару:', error);
    }
}

export const deleteProductRequest = async(productId) => {
    try{
        await axios.delete(`${API_BASE}/products/delete/${productId}`);
    }catch (error) {
        console.error('Помилка при видаленні товару:', error);
    }
}

export const getProductsByGroupId = async (groupId) => {
    try {
        console.log('groupId here is: ', groupId)
        const { data } = await axios.get(`${API_BASE}/products/by-group-id/${groupId}`);
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export async function getProductBySlug(slug) {
    try {
        const res = await fetch(`${API_BASE}/products/by-slug/${slug}`, {
            next: { revalidate: 60 }
        });
        if (!res.ok) return null;
        return res.json();
    } catch (err) {
        console.error("Get Product Error", err);
        return null;
    }
}

export async function getProductReviews(productId) {
    try {
        const res = await fetch(`${API_BASE}/reviews/product-reviews/${productId}`, {
            next: { revalidate: 60 }
        });
        if (!res.ok) return [];
        return res.json();
    } catch (err) {
        return [];
    }
}

export async function getProductGroup(groupId) {
    if (!groupId) return [];
    try {
        const res = await fetch(`${API_BASE}/products/by-group-id/${groupId}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        return res.json();
    } catch (err) {
        return [];
    }
}
