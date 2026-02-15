import React, {useEffect, useState} from "react";
import {fetchCategories} from "../../services/category";
import {searchSubCategoriesBySlug} from '../../services/subcategory';
import {searchSubSubCategoriesBySlug} from '../../services/subsubcategory';
import {updateCategoriesMany} from "../../services/product";
import {toast} from "react-toastify";
import {useDispatch} from "../../redux/store";
import {clearProductSelection} from "../../redux/slices/adminProducts";
import { useRouter } from "next/navigation";

export const ProductsActions = ({selectedIds}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    // single
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subSubCategory, setSubSubCategory] = useState('');

    // all
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);

    useEffect(() => {
        console.log('cate', category);
    }, [category]);
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchCategories();
            if (res) setCategories(res);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const loadSubs = async () => {
            if (category && categories.length > 0) {
                const cat = categories.find(c => c._id === category);
                const sub = await searchSubCategoriesBySlug(cat?.slug || '');
                setSubCategories(sub);
            } else setSubCategories([]);
        };
        loadSubs();
    }, [category, categories]);

    useEffect(() => {
        const loadSubSubs = async () => {
            if (subCategory && subCategories.length > 0 && category && categories.length > 0) {
                const subCat = subCategories.find(s => s._id === subCategory);
                if (subCat?.slug) {
                    const subSub = await searchSubSubCategoriesBySlug(subCat?.slug || '');
                    setSubSubCategories(subSub);
                } else setSubSubCategories([]);
            } else setSubSubCategories([]);
        };
        loadSubSubs();
    }, [subCategory, subCategories]);

    const handleUpdateCategories = async() => {
        if(!category) return toast.error("Оберіть категорію!");
        if (selectedIds.length === 0) return toast.error("Товари не вибрані!");

        const updatePromise = updateCategoriesMany(selectedIds, category, subCategory, subSubCategory);

        await toast.promise(
            updatePromise,
            {
                pending: 'Оновлення категорій...',
                success: 'Категорії успішно оновлено!',
                error: 'Помилка при оновленні'
            }
        );
        dispatch(clearProductSelection());
        router.refresh();
    }

    return (
        <>
            <div className="cats-wrapper">
                <div className="form-group">
                    <label>Категорія (Головна)</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Оберіть категорію</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Підкатегорія</label>
                    <select value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                        <option value="">Не обрано</option>
                        {subCategories.map(sc => <option key={sc._id} value={sc._id}>{sc.name}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Під-підкатегорія</label>
                    <select value={subSubCategory} onChange={e => setSubSubCategory(e.target.value)}>
                        <option value="">Не обрано</option>
                        {subSubCategories.map(ssc => <option key={ssc._id} value={ssc._id}>{ssc.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="actions-wrapper">
                {category && <button className="update-cats" onClick={handleUpdateCategories}>Оновити категорію вибраних товарів</button>}
            </div>
        </>
    )
}
