'use client'

import { useState } from "react";
import CategoryForm from "../../components/modals/CategoryCreate";
import ProductForm from "../../components/modals/ProductCreate";
import SubcategoryForm from "../../components/modals/SubcategoryCreate";
import SubsubcategoryForm from "../../components/modals/Subsubcategory";
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

    return (
        <div>
            <h1>Адмінка магазину</h1>
            <p>Додай новий товар або змінюй існуючі!</p>

            <div className="admin-panel">
                <button onClick={handleCategoryFormToggle}>Додати категорію</button>
                <button onClick={handleProductFormToggle}>Додати товар</button>
                <button onClick={handleSubcategoryFormToggle}>Додати підкатегорію</button>
                <button onClick={handleSubsubcategoryFormToggle}>Додати підпідкатегорію</button>
            </div>

            {isCategoryFormVisible && <CategoryForm />}
            {isProductFormVisible && <ProductForm />}
            {isSubcategoryFormVisible && <SubcategoryForm />}
            {isSubsubcategoryFormVisible && <SubsubcategoryForm />}
        </div>
    );
}
