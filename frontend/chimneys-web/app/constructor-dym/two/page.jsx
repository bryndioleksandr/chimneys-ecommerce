'use client';

import { useRef, useEffect, useState } from 'react';
import '../style.css';
import ModalWrapper from '@/components/ModalWrapper/ModalWrapper';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cart';
import {FaSearch} from "react-icons/fa";
import { backUrl } from '../../../config/config';
import {loadCartFromStorage} from "../../../redux/slices/cart";

const AREAS = [
    {
        id: 1,
        coords: "101,19,96,50,173,55,200,65,207,108,226,127,271,129,294,104,291,44,215,41,169,21"
    },
    { id: 2, coords: "22,53,88,55,139,100,189,110,185,139,166,148,130,144,84,88,22,85" },
    { id: 3, coords: "23,118,26,144,90,153,129,169,129,186,173,190,175,152,124,145,82,123" },
    { id: 4, coords: "317,27,319,102,336,125,376,125,385,101,423,66,528,61,530,29" },
    { id: 5, coords: "315,126,280,151,250,238,284,270,384,272,409,265,393,243,321,230,328,140" },
    { id: 6, coords: "365,172,435,167,435,209,483,221,535,222,542,251,482,257,435,255,408,230,370,226" },
    { id: 7, coords: "17,186,17,224,92,224,126,241,127,287,132,316,168,320,173,261,173,196,155,190,103,194" },
    { id: 8, coords: "21,253,19,285,90,285,120,322,133,335,184,335,186,320,138,321,111,274,104,256" },
    { id: 9, coords: "11,339,11,396,183,384,182,365,133,368,72,347" },
    { id: 10, coords: "98,338,198,340,208,316,295,305,304,340,325,370,343,384,426,379,517,380,534,403,527,432,348,436,314,407,193,367,178,361,135,365,96,352" },
    { id: 11, coords: "130,390,178,386,184,407,247,402,307,411,310,432,264,437,190,429,179,451,132,451" },
    { id: 12, coords: "110,457,111,479,185,481,228,477,332,473,519,473,521,444,369,444,190,460" },
    { id: 13, coords: "110,482,212,483,385,486,386,521,227,507,180,510,145,520,121,538,103,504" },
    { id: 14, coords: "127,538,127,580,205,575,226,562,349,567,411,563,393,528,274,535,180,515,146,521" },
    { id: 15, coords: "32,614,28,650,114,650,145,636,160,640,193,614,184,594,132,597,116,610" },
    { id: 16, coords: "138,582,193,581,262,590,307,581,414,579,424,605,411,619,291,614,263,662,253,688,221,717,211,706,235,682,245,655,260,621,237,624,213,631,196,631,172,656,157,643,196,620,221,608,239,601,188,593,140,595" },
    { id: 17, coords: "7,657,11,688,112,689,162,678,193,679,204,696,211,700,238,675,221,638,199,632,171,659" },
    { id: 18, coords: "225,720,261,687,316,651,415,653,423,672,413,690,311,691,287,715,287,740,247,743,227,732" },
    { id: 19, coords: "7,697,7,721,86,724,132,724,198,746,217,765,242,762,276,756,281,743,218,742,157,702,112,695" },
    { id: 20, coords: "338,753,373,750,409,697,432,677,512,677,518,697,514,711,449,709,422,707,391,771,399,800,401,807,395,824,378,835,347,839,329,804" },
    { id: 21, coords: "377,839,384,850,422,819,426,753,495,756,534,756,545,726,512,720,440,720,418,724,399,763,400,784,403,792,399,823" },
    { id: 22, coords: "19,727,18,758,98,758,134,762,176,774,222,792,225,802,229,813,233,824,274,823,279,793,277,763,230,765,226,771,140,734,103,727" },
    { id: 23, coords: "14,765,14,795,96,798,138,799,155,811,169,822,204,815,212,799,203,784,164,773,97,762" },
    { id: 24, coords: "27,804,31,843,93,849,136,847,178,859,210,853,206,826,197,818,158,823" },
    { id: 25, coords: "235,844,232,877,232,891,282,890,302,872,348,872,380,871,371,842,297,844" },
    { id: 26, coords: "386,852,421,822,451,783,454,762,541,762,545,796,492,800,458,797,446,828,438,870,404,874" },
    { id: 27, coords: "464,813,545,806,542,835,489,843,471,848,458,871,439,874,443,841" },
    { id: 28, coords: "306,889,280,921,292,933,338,931,367,953,382,965,454,962,541,964,547,913,479,915,401,911,343,881" },
    { id: 29, coords: "54,965,57,1000,114,1010,202,998,246,963,283,938,281,923,227,917,188,925,186,947,114,961" },
    { id: 30, coords: "14,876,11,922,54,928,127,923,176,922,205,914,219,911,269,918,288,904,290,890,225,893" }
];

const AREA_INFO = {
    1: { name: 'Деталь 1', price: 110 },
    2: { name: 'Деталь 2', price: 130 },
    3: { name: 'Деталь 3', price: 95 },
    4: { name: 'Деталь 4', price: 120 },
    5: { name: 'Деталь 5', price: 85 },
    6: { name: 'Деталь 6', price: 100 },
    7: { name: 'Деталь 7', price: 140 },
    8: { name: 'Деталь 8', price: 110 },
    9: { name: 'Деталь 9', price: 120 },
    10: { name: 'Деталь 10', price: 150 },
    11: { name: 'Деталь 11', price: 160 },
    12: { name: 'Деталь 12', price: 170 },
    13: { name: 'Деталь 13', price: 180 },
    14: { name: 'Деталь 14', price: 190 },
    15: { name: 'Деталь 15', price: 200 },
    16: { name: 'Деталь 16', price: 210 },
    17: { name: 'Деталь 17', price: 220 },
    18: { name: 'Деталь 18', price: 230 },
    19: { name: 'Деталь 19', price: 240 },
    20: { name: 'Деталь 20', price: 250 },
    21: { name: 'Деталь 21', price: 260 },
    22: { name: 'Деталь 22', price: 270 },
    23: { name: 'Деталь 23', price: 280 },
    24: { name: 'Деталь 24', price: 290 },
    25: { name: 'Деталь 25', price: 300 },
    26: { name: 'Деталь 26', price: 310 },
    27: { name: 'Деталь 27', price: 320 },
    28: { name: 'Деталь 28', price: 330 },
    29: { name: 'Деталь 29', price: 340 },
    30: { name: 'Деталь 30', price: 350 },
};

export default function ChimneyMapTwo() {
    const imgRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [selectedArea, setSelectedArea] = useState(null);
    const [products, setProducts] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef(null);
    const [attachedProduct, setAttachedProduct] = useState(null);
    const [selectedAreaForLinking, setSelectedAreaForLinking] = useState(null);
    const ORIGINAL_WIDTH = 550;
    const ORIGINAL_HEIGHT = 1073;

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
                const res = await fetch(`${backUrl}/products/products`, {credentials: 'include'});
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
                const res = await fetch(`${backUrl}/constructor-two/constructor/element/${selectedArea}`, {credentials: 'include'});
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
        if (!searchQuery.trim()) return;
        try {
            const res = await fetch(`${backUrl}/products/search?query=${searchQuery}`, {credentials: 'include'});
            const data = await res.json();
            console.log('data is:', data);
            setProducts(data);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const scaleCoords = (coords) => {
        if (!size.width || !size.height) return coords;
        const scaleX = size.width / ORIGINAL_WIDTH;
        const scaleY = size.height / ORIGINAL_HEIGHT;

        return coords
            .split(",")
            .map((c, i) => (i % 2 === 0 ? c * scaleX : c * scaleY))
            .join(",");
    };

    const handleLinkProduct = async (productId, areaId) => {
        console.log("Прив'язано продукт:", productId, " || area: ", areaId);
        if (!productId || !areaId) return;

        try {
            const res = await fetch(`${backUrl}/constructor-two/constructor/element`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    area: areaId,
                    product: productId
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error response:", errorData);
                alert("Не вдалося прив'язати продукт");
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
        dispatch(addItemToCart(product));
        setSelectedArea(null);
    };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ marginBottom: 16, textAlign: 'center' }}>
                Це конструктор двостінного димоходу. Наведіть курсор на елемент, натисніть — і з'явиться вікно з інформацією про деталь. Ви можете додати обрану деталь до кошика.
            </h2>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                    ref={imgRef}
                    src="/two_sided.jpg"
                    useMap="#image-map-two_sided"
                    alt="Two sided"
                    className="chimney-image"
                />
                <map name="image-map-two_sided">
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
                                points={scaleCoords(area.coords)}
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
                    <h3>Виберіть продукт для прив'язки</h3>

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
                                    Прив'язати
                                </button>
                            </div>
                        ))}
                    </div>
                </ModalWrapper>
            )}
        </div>
    );
}
