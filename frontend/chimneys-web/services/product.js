import axios from "axios";
import { backUrl as API_BASE } from '../config/config';

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
