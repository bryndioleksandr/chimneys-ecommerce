import axios from "axios";

const API_BASE = 'http://localhost:5501';

export const updateProductRequest = async(productId, data) => {
    try{
        const response = await axios.put(`${API_BASE}/products/update/${productId}`, data);
        console.log('updated data is:', response);
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
