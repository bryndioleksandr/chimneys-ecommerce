import "./ConstructorList.css"
import {addItemToCart} from "../../redux/slices/cart";
import {toast} from "react-toastify";
import axios from "axios";
import {backUrl} from "../../config/config";
import {useDispatch} from "../../redux/store";
import {useState} from "react";
import {FaShoppingCart} from "react-icons/fa";
import Link from "next/link";

export const ConstructorList = ({products}) => {
    const dispatch = useDispatch();

    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (id, delta) => {
        setQuantities(prev => {
            const currentQty = prev[id] || 1;
            const newQty = currentQty + delta;

            if (newQty < 1) return prev;

            return { ...prev, [id]: newQty };
        });
    };

    const handleAddToCart = (product) => {
        const count = quantities[product._id] || 1;

        dispatch(addItemToCart({ ...product, quantity: count }));

        toast.success(`Додано в кошик: ${product.name} (${count} шт.)`);
    };


    return (
        <div className="constructor-list">
            {products && products.length > 0 && (
                products.map((product) => (
                    <div key={product._id} className="constructor-product">
                        <div className="product-image-wrapper">
                            <Link
                                href={`/product/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={product.images && product.images[0] ? product.images[0] : '/placeholder.png'}
                                    alt={product.name}
                                    className="product-img"
                                />
                            </Link>
                        </div>

                        <div className="product-info">
                            <div className="product-categories">
                                {product.category?.name && <span className="cat-badge">{product.category.name}</span>}
                                {product.subCategory?.name && <span className="cat-badge sub">{product.subCategory.name}</span>}
                            </div>

                            <Link
                                href={`/product/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="product-title-link"
                            >
                                <h4 className="product-title">{product.name}</h4>
                            </Link>

                            {product.stock > 0 ? (
                                <span className="stock-status in-stock">✓ {product.stock}шт.</span>
                            ) : (
                                <span className="stock-status out-stock">Під замовлення</span>
                            )}

                            <div className="product-code">Код: {product.productCode || '---'}</div>
                        </div>

                        <div className="product-actions">
                            <div className="price-tag">{product.price} ₴</div>

                            <div className="quantity-control">
                                <button onClick={() => handleQuantityChange(product._id, -1)}>-</button>

                                <span>{quantities[product._id] || 1}</span>

                                <button onClick={() => handleQuantityChange(product._id, 1)}>+</button>
                            </div>

                            <FaShoppingCart className='add-btn' onClick={() => handleAddToCart(product)} />
                        </div>
                    </div>
                   )
                )
            )}
        </div>
    )
}
