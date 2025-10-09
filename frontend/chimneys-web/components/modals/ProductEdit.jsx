import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backUrl } from '../../config/config';
import {searchSubCategories, searchSubCategoriesBySlug} from '../../services/subcategory';
import {searchSubSubCategories, searchSubSubCategoriesBySlug} from '../../services/subsubcategory';
import ReactDOM from 'react-dom';

// import "./style.css";
import "./edit.css";

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subSubCategory, setSubSubCategory] = useState('');
    const [description, setDescription] = useState('');
    const [discount, setDiscount] = useState('');
    const [steelGrade, setSteelGrade] = useState('');
    const [thickness, setThickness] = useState('');
    const [diameter, setDiameter] = useState('');
    const [length, setLength] = useState('');
    const [weight, setWeight] = useState('');
    const [angle, setAngle] = useState('');
    const [revision, setRevision] = useState(false);
    const [hasMesh, setHasMesh] = useState(false);
    const [insulationThickness, setInsulationThickness] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);

    useEffect(() => {
        if (!product) return;

        setName(product.name || '');
        setPrice(product.price || '');
        setCategory(product.category?._id || '');
        setSubCategory(product.subCategory?._id || '');
        setSubSubCategory(product.subSubCategory?._id || '');
        setDescription(product.description || '');
        setDiscount(product.discount || '');
        setSteelGrade(product.steelGrade || '');
        setThickness(product.thickness || '');
        setDiameter(product.diameter || '');
        setLength(product.length || '');
        setWeight(product.weight || '');
        setAngle(product.angle || '');
        setRevision(product.revision || false);
        setHasMesh(product.hasMesh || false);
        setInsulationThickness(product.insulationThickness || '');
        setStock(product.stock || '');
        setImages([]);
    }, [product]);

    useEffect(() => {
        axios.get(`${backUrl}/category/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error('Помилка при завантаженні категорій:', err));
    }, []);

    useEffect(() => {
        const loadSubs = async () => {
            if (category) {
                const cat = categories.find(c => c._id === category);
                console.log('cats to find');
                console.log('cat in state', category);
                console.log('cat in subcat', cat);
                const sub = await searchSubCategoriesBySlug(cat?.slug || '');
                console.log('before setting subcats:', sub);
                setSubCategories(sub);
            }
            else setSubCategories([]);
        };
        loadSubs();
    }, [category]);

    useEffect(() => {
        const loadSubSubs = async () => {
            if (subCategory && subCategories.length > 0) {
                console.log('subcats are ', subCategories);
                const subCat = subCategories.find(s => s._id === subCategory);
                console.log('subcat is ', subCat);
                const subSub = await searchSubSubCategoriesBySlug(subCat?.slug || '');
                setSubSubCategories(subSub);
            }
            else setSubSubCategories([]);
        };
        loadSubSubs();
    }, [subCategory, subCategories]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("subCategory", subCategory || '');
        formData.append("subSubCategory", subSubCategory || '');
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
            const res = await axios.put(`${backUrl}/products/update/${product._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Продукт оновлено');
            onSave(res.data);
            onClose();
        } catch (err) {
            console.error('Помилка при оновленні:', err);
            alert('Помилка при оновленні продукту');
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Редагувати продукт</h3>
                <form onSubmit={handleUpdate}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Назва" />
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ціна" />

                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Категорія</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>

                    <select value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                        <option value="">Підкатегорія</option>
                        {subCategories.map(sc => <option key={sc._id} value={sc._id}>{sc.name}</option>)}
                    </select>

                    <select value={subSubCategory} onChange={e => setSubSubCategory(e.target.value)}>
                        <option value="">Підпідкатегорія</option>
                        {subSubCategories.map(ssc => <option key={ssc._id} value={ssc._id}>{ssc.name}</option>)}
                    </select>

                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Опис" />

                    <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Знижка" />
                    <input type="text" value={steelGrade} onChange={e => setSteelGrade(e.target.value)} placeholder="Марка сталі" />
                    <input type="number" value={thickness} onChange={e => setThickness(e.target.value)} placeholder="Товщина" />
                    <input type="number" value={diameter} onChange={e => setDiameter(e.target.value)} placeholder="Діаметр" />
                    <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="Довжина" />
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Вага" />
                    <input type="number" value={insulationThickness} onChange={e => setInsulationThickness(e.target.value)} placeholder="Утеплювач" />
                    <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="Наявність" />

                    <select value={angle} onChange={e => setAngle(e.target.value)}>
                        <option value="">Кут</option>
                        <option value={30}>30°</option>
                        <option value={45}>45°</option>
                        <option value={60}>60°</option>
                        <option value={90}>90°</option>
                    </select>

                    <label><input type="checkbox" checked={revision} onChange={e => setRevision(e.target.checked)} /> Ревізія</label>
                    <label><input type="checkbox" checked={hasMesh} onChange={e => setHasMesh(e.target.checked)} /> Сітка</label>

                    <input type="file" accept="image/*" multiple onChange={(e) => setImages([...e.target.files])} />

                    <div className="modal-buttons">
                        <button type="submit">Оновити</button>
                        <button type="button" onClick={onClose}>Закрити</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditProductModal;
