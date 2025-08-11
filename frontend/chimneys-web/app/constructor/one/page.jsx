'use client';

import { useRef, useEffect, useState } from 'react';
import '../style.css';
import '../../../components/ModalWrapper/modal.css';
import ModalWrapper from '@/components/ModalWrapper/ModalWrapper';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cart';
import {FaSearch} from "react-icons/fa";
import {loadCartFromStorage} from "../../../redux/slices/cart";


const AREAS = [
    {
        id: 1,
        coords: "198,19,197,53,226,54,227,157,226,170,295,171,298,99,328,36,318,19"
    },
    { id: 2, coords: "113,76,215,70,193,145,208,176,208,219,171,233,123,219" },
    { id: 3, coords: "23,155,100,157,113,165,114,194,92,282,62,291,33,279" },
    { id: 4, coords: "383,118,467,118,467,149,408,159,369,280,338,293,317,285,339,214" },
    { id: 5, coords: "33,295,93,295,134,276,209,273,208,303,128,307,66,323,28,314" },
    { id: 6, coords: "59,328,108,334,264,334,264,362,135,371,81,396,34,385,5,364,19,342" },
    { id: 7, coords: "315,294,364,296,436,237,511,237,508,265,404,289,339,320,309,309" },
    { id: 8, coords: "362,319,269,340,272,360,306,376,412,368,434,328,491,324,495,286,401,308" },
    { id: 9, coords: "57,401,342,378,380,391,379,509,183,499,71,532,38,522,34,418" },
    { id: 10, coords: "53,542,100,541,148,517,212,514,210,548,134,556,89,597,64,609,44,598,35,557" },
    { id: 11, coords: "91,599,197,567,307,560,309,516,374,518,368,584,310,595,157,605,154,646,121,668,76,624" },
    { id: 12, coords: "142,660,202,645,295,628,299,663,203,674,185,717,135,715,122,684" },
    { id: 13, coords: "165,724,130,735,120,776,31,786,27,811,53,822,146,806,186,796,194,729" },
    { id: 14, coords: "36,856,142,845,141,810,167,806,183,807,192,815,197,826,195,835,191,841,191,849,193,857,193,862,185,872,173,880,145,878,124,878,37,880,29,869" },
    { id: 15, coords: "335,597,313,602,312,683,350,691,398,644,403,589,497,582,496,542,401,545,367,595" },
    { id: 16, coords: "200,828,195,837,192,846,197,864,207,869,225,869,239,865,235,853,239,841,242,827,251,816,293,816,297,793,264,783,209,783,193,793" },
    { id: 17, coords: "380,667,409,655,434,599,527,590,527,625,452,635,432,660,425,718,380,708,362,686" },
    { id: 18, coords: "210,714,213,752,292,771,360,784,359,697" },
    { id: 19, coords: "255,823,243,837,240,845,238,857,240,866,244,876,249,880,275,913,310,961,376,961,376,938,316,938,271,890,259,876,260,866,261,847,265,836" },
    { id: 20, coords: "271,831,295,836,316,861,318,882,336,910,418,899,425,912,422,931,385,933,334,929,306,899,283,899,279,876,264,869,260,857,264,843" },
    { id: 21, coords: "32,904,33,936,128,936,147,919,147,898" },
    { id: 22, coords: "89,942,80,978,160,982,198,961,187,937" },
    { id: 23, coords: "362,741,363,782,446,775,475,723,480,672,433,671,431,727" },
    { id: 24, coords: "387,783,388,803,469,804,497,731,496,667,482,666,478,722,462,777" },
    { id: 25, coords: "501,666,543,670,547,727,508,836,416,835,420,810,492,805,499,731" },
    { id: 26, coords: "146,885,147,937,184,935,182,962,213,951,214,930,270,930,270,910,196,886" },
];

const AREA_INFO = {
    1: { name: 'Деталь 1', price: 100 },
    2: { name: 'Деталь 2', price: 120 },
    3: { name: 'Деталь 3', price: 90 },
    4: { name: 'Деталь 4', price: 110 },
    5: { name: 'Деталь 5', price: 80 },
    6: { name: 'Деталь 6', price: 95 },
    7: { name: 'Деталь 7', price: 130 },
    8: { name: 'Деталь 8', price: 105 },
    9: { name: 'Деталь 9', price: 115 },
    10: { name: 'Деталь 10', price: 140 },
    11: { name: 'Деталь 11', price: 150 },
    12: { name: 'Деталь 12', price: 160 },
    13: { name: 'Деталь 13', price: 170 },
    14: { name: 'Деталь 14', price: 180 },
    15: { name: 'Деталь 15', price: 190 },
    16: { name: 'Деталь 16', price: 200 },
    17: { name: 'Деталь 17', price: 210 },
    18: { name: 'Деталь 18', price: 220 },
    19: { name: 'Деталь 19', price: 230 },
    20: { name: 'Деталь 20', price: 240 },
    21: { name: 'Деталь 21', price: 250 },
    22: { name: 'Деталь 22', price: 260 },
    23: { name: 'Деталь 23', price: 270 },
    24: { name: 'Деталь 24', price: 280 },
    25: { name: 'Деталь 25', price: 290 },
    26: { name: 'Деталь 26', price: 300 },
};

export default function ChimneyMapOne() {
    const imgRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [selectedArea, setSelectedArea] = useState(null);
    const [products, setProducts] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef(null);
    const [attachedProduct, setAttachedProduct] = useState(null);
    const [selectedAreaForLinking, setSelectedAreaForLinking] = useState(null);


    const dispatch = useDispatch();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                dispatch(loadCartFromStorage(parsedCart));
            }
        }
    }, []);

    useEffect(() => {
        const updateSize = () => {
            if (imgRef.current) {
                const { width, height } = imgRef.current.getBoundingClientRect();
                setSize({ width, height });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const handlePolygonClick = (areaId) => {
        setSelectedArea(areaId);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('now fetch');
                const res = await fetch(`http://localhost:5501/products/products`);
                if (!res.ok) throw new Error("Products not found");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setProducts(null);
            }
        };
        fetchProducts();
        }, []);

    useEffect(() => {
        const fetchAttachedProduct = async () => {
            if (!selectedArea) return;

            try {
                const res = await fetch(`http://localhost:5501/constructor-one/constructor/element/${selectedArea}`);
                if (res.ok) {
                    const data = await res.json();
                    setAttachedProduct(data.product);
                } else {
                    setAttachedProduct(null);
                }
            } catch (err) {
                console.error("Error fetching attached product:", err);
                setAttachedProduct(null);
            }
        };

        fetchAttachedProduct();
    }, [selectedArea]);

    const handleSearch = async () => {
        console.log('search query is:', searchQuery);
        if (!searchQuery.trim()) return;
        try {
            const res = await fetch(`http://localhost:5501/products/search?query=${searchQuery}`);
            const data = await res.json();
            console.log('data is:', data);
            setProducts(data);
        } catch (error) {
            console.error("Search error:", error);
        }
    };


    const handleLinkProduct = async (productId, areaId) => {
        console.log("Прив’язано продукт:", productId, " || area: ", areaId);
        if (!productId || !areaId) return;

        try {
            const res = await fetch(`http://localhost:5501/constructor-one/constructor/element`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    area: areaId,
                    product: productId
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error response:", errorData);
                alert("Не вдалося прив’язати продукт");
                return;
            }

            const updatedConstructor = await res.json();
            console.log("Оновлений конструктор:", updatedConstructor);
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Сталася помилка при зверненні до сервера");
        } finally {
            setIsProductModalOpen(false);
            setSelectedAreaForLinking(null);
        }
    };


    const handleAddToCart = (product) => {
        console.log('attached product is: ', product);
            dispatch(addItemToCart(product));
            setSelectedArea(null);
    };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ marginBottom: 16, textAlign: 'center' }}>
                Це конструктор одностінного димоходу. Наведіть курсор на елемент, натисніть — і з’явиться вікно з інформацією про деталь. Ви можете додати обрану деталь до кошика.
            </h2>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                    ref={imgRef}
                    src="/one_sided.jpg"
                    useMap="#image-map-one_sided"
                    alt="One sided"
                    className="chimney-image"
                />
                <map name="image-map-one_sided">
                    {AREAS.map(area => (
                        <area
                            key={area.id}
                            data-area={area.id}
                            shape="poly"
                            coords={area.coords}
                            alt={`Area ${area.id}`}
                        />
                    ))}
                </map>

                {size.width > 0 && (
                    <svg
                        width={size.width}
                        height={size.height}
                        className="overlay"
                    >
                        {AREAS.map(area => (
                            <polygon
                                key={area.id}
                                points={area.coords}
                                className="hover-region"
                                onClick={() => handlePolygonClick(area.id)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </svg>
                )}
            </div>
            {selectedArea && (
                <ModalWrapper onClose={() => setSelectedArea(null)}>
                    {attachedProduct ? (
                        <div className="product-details">
                            <img
                                src={attachedProduct.images[0]}
                                alt="Product image"
                                className="product-image"
                            />
                            <div className="product-info">
                                <p className="product-name">{attachedProduct.name}</p>
                                <p className="product-price">Ціна: {attachedProduct.price} грн</p>
                                <button
                                    className="primary-button"
                                    onClick={() => handleAddToCart(attachedProduct)}
                                >
                                    Додати до кошика
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="not-linked-message">Продукт ще не прив'язаний.</p>
                    )}

                    <button
                        className="secondary-button"
                        onClick={() => {
                            setIsProductModalOpen(true);
                            setSelectedAreaForLinking(selectedArea);
                            setSelectedArea(null);
                        }}
                    >
                        Прив’язати продукт
                    </button>
                </ModalWrapper>
            )}
            {isProductModalOpen && (
                <ModalWrapper onClose={() => setIsProductModalOpen(false)}>
                    <h3>Виберіть продукт для прив’язки</h3>

                    <div
                        className="headerSearchBarContainer"
                        style={{ marginBottom: 16 }}
                        ref={searchRef}
                    >
                        <div className="headerSearchBar" style={{ display: 'flex', gap: 8 }}>
                            <input
                                placeholder="Пошук товарів"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: 4,
                                    border: '1px solid #ccc'
                                }}
                            />
                            <div
                                className="searchButton"
                                onClick={handleSearch}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#D14900',
                                    color: 'white',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <FaSearch />
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gap: '16px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            paddingRight: 8
                        }}
                    >
                        {products.map(product => (
                            <div
                                key={product._id}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: 8,
                                    padding: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16
                                }}
                            >
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 4
                                    }}
                                />
                                <div style={{ flexGrow: 1 }}>
                                    <h4 style={{ margin: 0 }}>{product.name}</h4>
                                    <p style={{ margin: 0 }}>{product.price} грн</p>
                                </div>
                                <button onClick={() => handleLinkProduct(product._id, selectedAreaForLinking)}>
                                    Прив’язати
                                </button>
                            </div>
                        ))}
                    </div>
                </ModalWrapper>
            )}
        </div>
    );
}
