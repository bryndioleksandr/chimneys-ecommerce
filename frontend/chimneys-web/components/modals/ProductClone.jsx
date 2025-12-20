import React, {useState} from 'react';
import axios from 'axios';
import {toast} from "react-toastify";
import {backUrl} from "@/config/config";
import "./edit.css";
import ReactDOM from "react-dom";

const ProductCloneModal = ({product, onClose}) => {
    const [name, setName] = useState(product.name || '');
    const [price, setPrice] = useState(product.price || '');
    const [category, setCategory] = useState(product.category?._id || '');
    const [subCategory, setSubCategory] = useState(product.subCategory?._id || '');
    const [subSubCategory, setSubSubCategory] = useState(product.subSubCategory?._id || '');
    const [images, setImages] = useState(product.images || []);

    const [description, setDescription] = useState(product.description || '');
    const [discount, setDiscount] = useState(product.discount || '');
    const [steelGrade, setSteelGrade] = useState(product.steelGrade || '');
    const [thickness, setThickness] = useState(product.thickness || '');
    const [diameter, setDiameter] = useState(product.diameter || '');
    const [length, setLength] = useState(product.length || '');
    const [weight, setWeight] = useState(product.weight || '');
    const [angle, setAngle] = useState(product.angle || '');
    const [revision, setRevision] = useState(product.revision || false);
    const [hasMesh, setHasMesh] = useState(product.hasMesh || false);
    const [insulationThickness, setInsulationThickness] = useState(product.insulationThickness || '');
    const [stock, setStock] = useState(product.stock || '');


    const generateProductCode = () => {
        const now = new Date();
        const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.floor(100000 + Math.random() * 900000);
        return `DMR-TER-${datePart}-${randomPart}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(name === product.name) {
            toast.warning('Назва товару повинна відрізнятися');
            return;
        }
        const productCode = generateProductCode();
        const formData = new FormData();
        formData.append("productCode", productCode);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("subCategory", subCategory || "");
        formData.append("subSubCategory", subSubCategory || "");
        formData.append("groupId", product.groupId || "");

        formData.append("description", description);
        formData.append("discount", discount);
        formData.append("steelGrade", steelGrade);
        formData.append("thickness", thickness);
        formData.append("diameter", diameter);
        formData.append("length", length);
        formData.append("weight", weight);
        formData.append("angle", angle);
        formData.append("revision", revision);
        formData.append("hasMesh", hasMesh);
        formData.append("insulationThickness", insulationThickness);
        formData.append("stock", stock);


        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            const response = await axios.post(`${backUrl}/products/product-clone`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            toast.success('Товар клоновано!');
            console.log('response:', response);
            onClose();
        } catch (error) {
            console.error('Помилка при додаванні товару:', error);
            toast.error('Помилка при додаванні товару');
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="wrap-head">
                    <h2>Клонування товару</h2>
                    <button type="button" onClick={onClose}>X</button>
                </div>
                {/*<form onSubmit={handleSubmit}>*/}
                {/*<input*/}
                {/*        type="text"*/}
                {/*        placeholder="Назва товару"*/}
                {/*        value={name}*/}
                {/*        onChange={(e) => setName(e.target.value)}*/}
                {/*        required*/}
                {/*    />*/}
                {/*    <input*/}
                {/*        type="number"*/}
                {/*        placeholder="Діаметр (мм)"*/}
                {/*        value={diameter}*/}
                {/*        onChange={(e) => setDiameter(e.target.value)}*/}
                {/*    />*/}
                {/*    <input*/}
                {/*        type="number"*/}
                {/*        placeholder="Товщина (мм)"*/}
                {/*        value={thickness}*/}
                {/*        onChange={(e) => setThickness(e.target.value)}*/}
                {/*    />*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        placeholder="Марка сталі (наприклад AISI 304)"*/}
                {/*        value={steelGrade}*/}
                {/*        onChange={(e) => setSteelGrade(e.target.value)}*/}
                {/*    />*/}
                {/*    <select value={angle} onChange={(e) => setAngle(Number(e.target.value))}>*/}
                {/*        <option value="">Кут (для колін/тройників)</option>*/}
                {/*        <option value={30}>30°</option>*/}
                {/*        <option value={45}>45°</option>*/}
                {/*        <option value={60}>60°</option>*/}
                {/*        <option value={90}>90°</option>*/}
                {/*    </select>*/}

                {/*    <input*/}
                {/*        type="number"*/}
                {/*        placeholder="Довжина (мм)"*/}
                {/*        value={length}*/}
                {/*        onChange={(e) => setLength(e.target.value)}*/}
                {/*    />*/}
                {/*    <input*/}
                {/*        type="number"*/}
                {/*        placeholder="Ціна"*/}
                {/*        value={price}*/}
                {/*        onChange={(e) => setPrice(e.target.value)}*/}
                {/*        required*/}
                {/*    />*/}
                {/*    <textarea*/}
                {/*        placeholder="Опис"*/}
                {/*        value={description}*/}
                {/*        onChange={(e) => setDescription(e.target.value)}*/}
                {/*    />*/}

                {/*    <input*/}
                {/*        type="number"*/}
                {/*        placeholder="Знижка (%)"*/}
                {/*        value={discount}*/}
                {/*        onChange={(e) => setDiscount(e.target.value)}*/}
                {/*    />*/}
                {/*    <input*/}
                {/*        type="number"*/}
                {/*        placeholder="Вага (кг)"*/}
                {/*        value={weight}*/}
                {/*        onChange={(e) => setWeight(e.target.value)}*/}
                {/*    />*/}
                {/*    <label>*/}
                {/*        <input type="checkbox" checked={revision} onChange={(e) => setRevision(e.target.checked)}/>*/}
                {/*        Ревізія*/}
                {/*    </label>*/}

                {/*    <label>*/}
                {/*        <input type="checkbox" checked={hasMesh} onChange={(e) => setHasMesh(e.target.checked)}/>*/}
                {/*        Наявність сітки*/}
                {/*    </label>*/}
                {/*    <input*/}
                {/*        type="number"*/}
                {/*        placeholder="Товщина утеплювача (мм)"*/}
                {/*        value={insulationThickness}*/}
                {/*        onChange={(e) => setInsulationThickness(e.target.value)}*/}
                {/*    />*/}
                {/*    <input*/}
                {/*        type="number"*/}
                {/*        placeholder="В наявності (шт.)"*/}
                {/*        value={stock}*/}
                {/*        onChange={(e) => setStock(e.target.value)}*/}
                {/*    />*/}
                {/*    <button type="submit">Клонувати товар</button>*/}
                {/*</form>*/}
                <form onSubmit={handleSubmit} className="clone-form-grid">
                    {/* Назва на всю ширину */}
                    <div className="form-group full-width">
                        <label>Назва товару</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                    </div>

                    {/* Група характеристик */}
                    <div className="form-group">
                        <label>Діаметр (мм)</label>
                        <input type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Товщина (мм)</label>
                        <input type="number" value={thickness} onChange={(e) => setThickness(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Марка сталі</label>
                        <input type="text" value={steelGrade} onChange={(e) => setSteelGrade(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Кут (градуси)</label>
                        <select value={angle} onChange={(e) => setAngle(Number(e.target.value))}>
                            <option value="">Без кута</option>
                            <option value={30}>30°</option>
                            <option value={45}>45°</option>
                            <option value={60}>60°</option>
                            <option value={90}>90°</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Довжина (мм)</label>
                        <input type="number" value={length} onChange={(e) => setLength(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Товщ. утеплювача</label>
                        <input type="number" value={insulationThickness}
                               onChange={(e) => setInsulationThickness(e.target.value)}/>
                    </div>

                    {/* Група Ціна/Наявність */}
                    <div className="form-group">
                        <label>Ціна (грн)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label>Знижка (%)</label>
                        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>В наявності (шт)</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Вага (кг)</label>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}/>
                    </div>

                    {/* Чекбокси */}
                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" checked={revision} onChange={(e) => setRevision(e.target.checked)}/>
                            Ревізія
                        </label>
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" checked={hasMesh} onChange={(e) => setHasMesh(e.target.checked)}/>
                            Сітка
                        </label>
                    </div>

                    {/* Опис на всю ширину */}
                    <div className="form-group full-width">
                        <label>Опис</label>
                        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>

                    <div className="form-actions full-width">
                        <button type="submit" className="submit-btn">Клонувати товар</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ProductCloneModal;
