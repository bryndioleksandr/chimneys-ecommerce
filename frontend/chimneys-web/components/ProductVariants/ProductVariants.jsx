import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import './ProductVariants.css';

const VARIANT_FIELDS = [
    {key: 'diameter', label: 'Діаметр', unit: 'мм'},
    {key: 'thickness', label: 'Товщина сталі', unit: 'мм'},
    {key: 'steelGrade', label: 'Марка сталі', unit: ''},
    {key: 'length', label: 'Довжина', unit: 'мм'},
    {key: 'angle', label: 'Кут', unit: '°'},
    {key: 'insulationThickness', label: 'Утеплювач', unit: 'мм'}
];

export const ProductVariants = ({currentProduct, productGroup}) => {
    const router = useRouter();

    const [selections, setSelections] = useState({});

    const [foundProduct, setFoundProduct] = useState(null);

    const activeAttributes = VARIANT_FIELDS.filter(attr => {
        const uniqueValues = new Set(productGroup.map(p => p[attr.key]));
        uniqueValues.delete(undefined);
        uniqueValues.delete(null);
        return uniqueValues.size > 1;
    });

    useEffect(() => {
        const initialSelections = {};
        activeAttributes.forEach(attr => {
            initialSelections[attr.key] = currentProduct[attr.key];
        });
        setSelections(initialSelections);
    }, [currentProduct, productGroup]);

    useEffect(() => {
        const match = productGroup.find(p => {
            return activeAttributes.every(attr => {
                if (!selections[attr.key]) return false;
                return String(p[attr.key]) === String(selections[attr.key]);
            });
        });
        console.log('selections are: ', selections);
        console.log('found product is: ', match);
        setFoundProduct(match || null);
    }, [selections, productGroup]);

    // code below for choose-redirect feat
    // useEffect(() => {
    //     if (foundProduct && foundProduct.slug !== currentProduct.slug) {
    //         router.push(`/product/${foundProduct.slug}`);
    //     }
    // }, [foundProduct, currentProduct, router]);

    const getOptionsForAttribute = (attributeKey, index) => {
        let availableProducts = productGroup;

        for (let i = 0; i < index; i++) {
            const prevAttrKey = activeAttributes[i].key;
            const prevValue = selections[prevAttrKey];

            if (prevValue) {
                availableProducts = availableProducts.filter(p =>
                    String(p[prevAttrKey]) === String(prevValue)
                );
            }
        }

        const options = [...new Set(availableProducts.map(p => p[attributeKey]))]
            .filter(val => val !== null && val !== undefined && val !== "")
            .sort((a, b) => a - b);

        return options;
    };

    const handleSelectionChange = (key, value, index) => {
        const newSelections = {...selections, [key]: value};

        for (let i = index + 1; i < activeAttributes.length; i++) {
            const nextKey = activeAttributes[i].key;
            newSelections[nextKey] = "";
        }

        setSelections(newSelections);
    };

    const handleGoToProduct = () => {
        if (foundProduct) {
            router.push(`/product/${foundProduct.slug}`);
        }
    };

    if (!productGroup || productGroup.length <= 1) return null;

    return (
        <div className="product-variants-container">
            <div className="variants-list">
                {activeAttributes.map((attr) => {
                    const options = getOptionsForAttribute(attr.key);

                    return (
                        <div key={attr.key} className="variant-group">
                            <label className="variant-label">
                                <b>{attr.label}:</b>
                            </label>
                            <select
                                className="variant-select"
                                value={selections[attr.key] || ''}
                                onChange={(e) => handleSelectionChange(attr.key, e.target.value)}
                            >
                                <option value="" disabled>-- Оберіть --</option>
                                {options.map(val => (
                                    <option key={val} value={val}>
                                        {val} {attr.unit}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                })}
            </div>

            <div className="variants-actions">
                {foundProduct ? (
                    foundProduct.slug === currentProduct.slug ? (
                        <button disabled className="btn-action disabled">
                            Це поточний товар
                        </button>
                    ) : (
                        <button
                            onClick={handleGoToProduct}
                            className="btn-action primary"
                        >
                            Перейти до товару ({foundProduct.price} грн)
                        </button>
                    )
                ) : (
                    <div className="message-error">
                        Такої комбінації немає в наявності. <br/>
                        Спробуйте змінити параметри.
                    </div>
                )}
            </div>

            {/*code below for choose-redirect feat*/}
            {/*<div className="variants-actions">*/}
            {/*    {foundProduct ? (*/}
            {/*        <button disabled className="btn-action disabled">*/}
            {/*            Це поточний товар*/}
            {/*        </button>*/}
            {/*    ) : (*/}
            {/*        <div className="message-error">*/}
            {/*            Такої комбінації немає в наявності. <br/>*/}
            {/*            Спробуйте змінити параметри.*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}
        </div>
    );
};
