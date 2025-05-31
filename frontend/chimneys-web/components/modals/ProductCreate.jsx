import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {searchSubCategories} from "../../services/subcategory";
import {searchSubSubCategories} from "../../services/subsubcategory";

const ProductForm = () => {
   // const [productCode, setProductCode] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subSubCategory, setSubSubCategory] = useState('');
    // const [img, setImg] = useState('');
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);

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


    const generateProductCode = () => {
        const now = new Date();
        const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.floor(100000 + Math.random() * 900000);
        return `DMR-TER-${datePart}-${randomPart}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productCode = generateProductCode();
        const formData = new FormData();
        formData.append("productCode", productCode);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("subCategory", subCategory || "");
        formData.append("subSubCategory", subSubCategory || "");

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
            const response = await axios.post('http://localhost:5501/products/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Товар доданий!');
            console.log('response:', response);
        } catch (error) {
            console.error('Помилка при додаванні товару:', error);
            alert('Помилка при додаванні товару');
        }
    };


    useEffect(() => {
        axios.get('http://localhost:5501/category/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(err => {
                console.error('Помилка при отриманні категорій:', err);
            });
    }, []);


    return (
        <div className="form-container">
            <h2>Створити товар</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Назва товару"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Ціна"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <select value={category} onChange={async (e) => {
                    const selectedCategory = e.target.value;
                    setCategory(selectedCategory);
                    setSubCategory('');
                    setSubSubCategory('');
                    setSubSubCategories([]);
                    if (selectedCategory) {
                        try {
                            const categoryObj = categories.find(cat => cat._id === selectedCategory);
                            const categoryName = categoryObj?.name;
                            const data = await searchSubCategories(categoryName);
                            setSubCategories(data);
                        } catch (err) {
                            console.log('Error caught in res:', err);

                        }
                    } else {
                        setSubCategories([]);
                    }
                }
                } required>
                    <option value="">Виберіть категорію</option>
                    {categories && categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <select value={subCategory} onChange={async (e) => {
                    const selectedSubCategory = e.target.value;
                    setSubCategory(selectedSubCategory);
                    setSubSubCategory('');
                    if (selectedSubCategory) {
                        try {
                            const subCategoryObj = subCategories.find(cat => cat._id === selectedSubCategory);
                            const subCategoryName = subCategoryObj?.name;
                            const data = await searchSubSubCategories(subCategoryName);
                            setSubSubCategories(data);
                        } catch (err) {
                            console.log('Error caught in res:', err);

                        }
                    } else {
                        setSubSubCategories([]);
                    }
                }
                }>
                    <option value="">Виберіть підкатегорію</option>
                    {subCategories && subCategories.map(subCat => (
                        <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                    ))}
                </select>
                <select value={subSubCategory} onChange={(e) => setSubSubCategory(e.target.value)}>
                    <option value="">Виберіть підпідкатегорію</option>
                    {subSubCategories && subSubCategories.map(subSubCat => (
                        <option key={subSubCat._id} value={subSubCat._id}>{subSubCat.name}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Опис"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Знижка (%)"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Марка сталі (наприклад AISI 304)"
                    value={steelGrade}
                    onChange={(e) => setSteelGrade(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Товщина (мм)"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Діаметр (мм)"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Довжина (мм)"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Вага (кг)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />

                <select value={angle} onChange={(e) => setAngle(Number(e.target.value))}>
                    <option value="">Кут (для колін/тройників)</option>
                    <option value={30}>30°</option>
                    <option value={45}>45°</option>
                    <option value={60}>60°</option>
                    <option value={90}>90°</option>
                </select>

                <label>
                    <input type="checkbox" checked={revision} onChange={(e) => setRevision(e.target.checked)}/>
                    Ревізія
                </label>

                <label>
                    <input type="checkbox" checked={hasMesh} onChange={(e) => setHasMesh(e.target.checked)}/>
                    Наявність сітки
                </label>

                <input
                    type="number"
                    placeholder="Товщина утеплювача (мм)"
                    value={insulationThickness}
                    onChange={(e) => setInsulationThickness(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="В наявності (шт.)"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                />
                <button type="submit">Додати товар</button>
            </form>
        </div>
    );
};

export default ProductForm;
