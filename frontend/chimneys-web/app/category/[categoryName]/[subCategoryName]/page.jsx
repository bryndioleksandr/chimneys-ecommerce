"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { searchSubSubCategories } from "../../../../services/subsubcategory";
import "../../category.css";

const SubSubCategoryPage = () => {
    const { categoryName, subCategoryName } = useParams();
    const router = useRouter();
    const [subSubCategories, setSubSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    console.log('params cat is: ', categoryName);
    console.log('params sub are:', subCategoryName);

    useEffect(() => {
        const fetchSubcategory = async () => {
            if (subCategoryName) {
                setLoading(true);
                setError(null);
                try {
                    const data = await searchSubSubCategories(subCategoryName);
                    setSubSubCategories(data);
                    console.log('response:', data);
                } catch (err) {
                    setError("Не вдалося завантажити підкатегорії.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSubcategory();
    }, [subCategoryName]);

    const handleSubSubClick = (subSub) => {
        router.push(`/category/${categoryName}/${subCategoryName}/${subSub.slug}`);
    };

    return (
        <div className='containerCat'>
            <h1>Підкатегорія: {subCategoryName}</h1>
            {loading && <p>Завантаження...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {subSubCategories.length > 0 ? (
                    subSubCategories.map((item) => (
                        <li
                            key={item._id}
                            onClick={() => handleSubSubClick(item)}
                            style={{ cursor: "pointer" }}
                        >
                            {item.name}
                        </li>
                    ))
                ) : (
                    <p>Підпідкатегорій не знайдено</p>
                )}
            </ul>
        </div>
    );
};

export default SubSubCategoryPage;
