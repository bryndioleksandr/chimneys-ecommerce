'use client'

import {useState} from "react";
import axios from "axios";
import CategoryForm from "../../components/modals/CategoryCreate";
import ProductForm from "../../components/modals/ProductCreate";
import SubcategoryForm from "../../components/modals/SubcategoryCreate";
import SubsubcategoryForm from "../../components/modals/Subsubcategory";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import { backUrl as API_BASE } from '../../config/config';
import './style.css';

export default function AdminPage() {
    const [isCategoryFormVisible, setCategoryFormVisible] = useState(false);
    const [isProductFormVisible, setProductFormVisible] = useState(false);
    const [isSubcategoryFormVisible, setSubcategoryFormVisible] = useState(false);
    const [isSubsubcategoryFormVisible, setSubsubcategoryFormVisible] = useState(false);

    const handleCategoryFormToggle = () => setCategoryFormVisible(!isCategoryFormVisible);
    const handleProductFormToggle = () => setProductFormVisible(!isProductFormVisible);
    const handleSubcategoryFormToggle = () => setSubcategoryFormVisible(!isSubcategoryFormVisible);
    const handleSubsubcategoryFormToggle = () => setSubsubcategoryFormVisible(!isSubsubcategoryFormVisible);
    const handleFetchBasData = async () => {
        try{
            const response = await axios.post(`${API_BASE}/data-exchange`, );
            console.log('fetch data is:', response);
        } catch (error) {
            console.error('Помилка при оновленні товару:', error);
        }
    }

    return (
        <div className="admin-wrapper">
            <h1>Адмінка магазину</h1>
            <button className="fetch-bas" onClick={handleFetchBasData}>
                <h2>Завантажити дані з BAS</h2>
            </button>
            <p>Додай новий товар або змінюй існуючі!</p>

            <div className="admin-panel">
                <button onClick={handleCategoryFormToggle}>Додати категорію</button>
                <button onClick={handleProductFormToggle}>Додати товар</button>
                <button onClick={handleSubcategoryFormToggle}>Додати підкатегорію</button>
                <button onClick={handleSubsubcategoryFormToggle}>Додати підпідкатегорію</button>
            </div>
            <div className="panel-update">
                <p>Оновити або видалити</p>
                <div className="update-btns">
                    <a href='/admin/update/category'>Категорії товарів</a>
                    <a href='/admin/update/subcategory'>Підкатегорії товарів</a>
                    <a href='/admin/update/subsubcategory'>Підпідкатегорії товарів</a>
                </div>
                <div className="manage-banners">
                    <a href="/admin/banner-manager">Змінити основні баннери вебсайту</a>
                </div>
            </div>

            {isCategoryFormVisible && (
                <ModalWrapper onClose={handleCategoryFormToggle}>
                    <CategoryForm />
                </ModalWrapper>
            )}
            {isProductFormVisible && (
                <ModalWrapper onClose={handleProductFormToggle}>
                    <ProductForm />
                </ModalWrapper>
            )}
            {isSubcategoryFormVisible && (
                <ModalWrapper onClose={handleSubcategoryFormToggle}>
                    <SubcategoryForm />
                </ModalWrapper>
            )}
            {isSubsubcategoryFormVisible && (
                <ModalWrapper onClose={handleSubsubcategoryFormToggle}>
                    <SubsubcategoryForm />
                </ModalWrapper>
            )}
        </div>
    );
}
