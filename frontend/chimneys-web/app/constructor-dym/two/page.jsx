'use client';

import { useRef, useEffect, useState } from 'react';
import '../style.css';
import ModalWrapper from '@/components/ModalWrapper/ModalWrapper';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cart';
import {FaSearch} from "react-icons/fa";
import { backUrl } from '../../../config/config';
import {loadCartFromStorage} from "../../../redux/slices/cart";
import {toast} from "react-toastify";
import {useSelector} from "../../../redux/store";
import {ConstructorList} from "../../../components/ConstructorList/ConstructorList";
import axios from "axios";

// const AREAS = [
//     {
//         id: 1,
//         coords: "101,19,96,50,173,55,200,65,207,108,226,127,271,129,294,104,291,44,215,41,169,21" // дефлектор
//     },
//     { id: 2, coords: "22,53,88,55,139,100,189,110,185,139,166,148,130,144,84,88,22,85" },// грибок
//     { id: 3, coords: "23,118,26,144,90,153,129,169,129,186,173,190,175,152,124,145,82,123" },// конус
//     { id: 4, coords: "317,27,319,102,336,125,376,125,385,101,423,66,528,61,530,29" },// іскрогасник
//     { id: 5, coords: "315,126,280,151,250,238,284,270,384,272,409,265,393,243,321,230,328,140" },// флюгер
//     { id: 6, coords: "365,172,435,167,435,209,483,221,535,222,542,251,482,257,435,255,408,230,370,226" },// термогрибок
//     { id: 7, coords: "17,186,17,224,92,224,126,241,127,287,132,316,168,320,173,261,173,196,155,190,103,194" },// труба 1м
//     { id: 8, coords: "21,253,19,285,90,285,120,322,133,335,184,335,186,320,138,321,111,274,104,256" },// окапник
//     { id: 9, coords: "11,339,11,396,183,384,182,365,133,368,72,347" },//  хомут обжимний
//     { id: 10, coords: "98,338,198,340,208,316,295,305,304,340,325,370,343,384,426,379,517,380,534,403,527,432,348,436,314,407,193,367,178,361,135,365,96,352" },// криза конусна
//     { id: 11, coords: "130,390,178,386,184,407,247,402,307,411,310,432,264,437,190,429,179,451,132,451" },// труба 0.5м
//     { id: 12, coords: "110,457,111,479,185,481,228,477,332,473,519,473,521,444,369,444,190,460" },// розватнажувальна платформа
//     { id: 13, coords: "110,482,212,483,385,486,386,521,227,507,180,510,145,520,121,538,103,504" },// кронштейн
//     { id: 14, coords: "127,538,127,580,205,575,226,562,349,567,411,563,393,528,274,535,180,515,146,521" },// труба 0.25м
//     { id: 15, coords: "32,614,28,650,114,650,145,636,160,640,193,614,184,594,132,597,116,610" },// коліно 45
//     { id: 16, coords: "138,582,193,581,262,590,307,581,414,579,424,605,411,619,291,614,263,662,253,688,221,717,211,706,235,682,245,655,260,621,237,624,213,631,196,631,172,656,157,643,196,620,221,608,239,601,188,593,140,595" },// хомут обжимний
//     { id: 17, coords: "7,657,11,688,112,689,162,678,193,679,204,696,211,700,238,675,221,638,199,632,171,659" },// труба 0.5м
//     { id: 18, coords: "225,720,261,687,316,651,415,653,423,672,413,690,311,691,287,715,287,740,247,743,227,732" },// коліно 45
//     { id: 19, coords: "7,697,7,721,86,724,132,724,198,746,217,765,242,762,276,756,281,743,218,742,157,702,112,695" },// хомут стінний
//     { id: 20, coords: "338,753,373,750,409,697,432,677,512,677,518,697,514,711,449,709,422,707,391,771,399,800,401,807,395,824,378,835,347,839,329,804" },// трійник 45
//     { id: 21, coords: "377,839,384,850,422,819,426,753,495,756,534,756,545,726,512,720,440,720,418,724,399,763,400,784,403,792,399,823" },// хомут обжимний
//     { id: 22, coords: "19,727,18,758,98,758,134,762,176,774,222,792,225,802,229,813,233,824,274,823,279,793,277,763,230,765,226,771,140,734,103,727" },// трійник 87
//     { id: 23, coords: "14,765,14,795,96,798,138,799,155,811,169,822,204,815,212,799,203,784,164,773,97,762" },// коліно 90
//     { id: 24, coords: "27,804,31,843,93,849,136,847,178,859,210,853,206,826,197,818,158,823" },// перехід
//     { id: 25, coords: "235,844,232,877,232,891,282,890,302,872,348,872,380,871,371,842,297,844" },// ревізія
//     { id: 26, coords: "386,852,421,822,451,783,454,762,541,762,545,796,492,800,458,797,446,828,438,870,404,874" },// коліно 45
//     { id: 27, coords: "464,813,545,806,542,835,489,843,471,848,458,871,439,874,443,841" },// стакан
//     { id: 28, coords: "306,889,280,921,292,933,338,931,367,953,382,965,454,962,541,964,547,913,479,915,401,911,343,881" },// підставка під ревізію підлогова вивід вбік
//     { id: 29, coords: "54,965,57,1000,114,1010,202,998,246,963,283,938,281,923,227,917,188,925,186,947,114,961" },// кронштейн
//     { id: 30, coords: "14,876,11,922,54,928,127,923,176,922,205,914,219,911,269,918,288,904,290,890,225,893" }// підставка під ревізію настінна вивід вниз
// ];

const AREAS = [
    {
        id: 1,
        coords: "101,19,96,50,173,55,200,65,207,108,226,127,271,129,294,104,291,44,215,41,169,21",
        name: "Дефлектор"
    },
    {
        id: 2,
        coords: "22,53,88,55,139,100,189,110,185,139,166,148,130,144,84,88,22,85",
        name: "Грибок"
    },
    {
        id: 3,
        coords: "23,118,26,144,90,153,129,169,129,186,173,190,175,152,124,145,82,123",
        name: "Конус"
    },
    {
        id: 4,
        coords: "317,27,319,102,336,125,376,125,385,101,423,66,528,61,530,29",
        name: "Іскрогасник"
    },
    {
        id: 5,
        coords: "315,126,280,151,250,238,284,270,384,272,409,265,393,243,321,230,328,140",
        name: "Флюгер"
    },
    {
        id: 6,
        coords: "365,172,435,167,435,209,483,221,535,222,542,251,482,257,435,255,408,230,370,226",
        name: "Термогрибок"
    },
    {
        id: 7,
        coords: "17,186,17,224,92,224,126,241,127,287,132,316,168,320,173,261,173,196,155,190,103,194",
        name: "Труба 1м"
    },
    {
        id: 8,
        coords: "21,253,19,285,90,285,120,322,133,335,184,335,186,320,138,321,111,274,104,256",
        name: "Окапник"
    },
    {
        id: 9,
        coords: "11,339,11,396,183,384,182,365,133,368,72,347",
        name: "Хомут обжимний"
    },
    {
        id: 10,
        coords: "98,338,198,340,208,316,295,305,304,340,325,370,343,384,426,379,517,380,534,403,527,432,348,436,314,407,193,367,178,361,135,365,96,352",
        name: "Криза конусна"
    },
    {
        id: 11,
        coords: "130,390,178,386,184,407,247,402,307,411,310,432,264,437,190,429,179,451,132,451",
        name: "Труба 0.5м"
    },
    {
        id: 12,
        coords: "110,457,111,479,185,481,228,477,332,473,519,473,521,444,369,444,190,460",
        name: "Розвантажувальна платформа"
    },
    {
        id: 13,
        coords: "110,482,212,483,385,486,386,521,227,507,180,510,145,520,121,538,103,504",
        name: "Кронштейн"
    },
    {
        id: 14,
        coords: "127,538,127,580,205,575,226,562,349,567,411,563,393,528,274,535,180,515,146,521",
        name: "Труба 0.25м"
    },
    {
        id: 15,
        coords: "32,614,28,650,114,650,145,636,160,640,193,614,184,594,132,597,116,610",
        name: "Коліно 45°"
    },
    {
        id: 16,
        coords: "138,582,193,581,262,590,307,581,414,579,424,605,411,619,291,614,263,662,253,688,221,717,211,706,235,682,245,655,260,621,237,624,213,631,196,631,172,656,157,643,196,620,221,608,239,601,188,593,140,595",
        name: "Хомут обжимний"
    },
    {
        id: 17,
        coords: "7,657,11,688,112,689,162,678,193,679,204,696,211,700,238,675,221,638,199,632,171,659",
        name: "Труба 0.5м"
    },
    {
        id: 18,
        coords: "225,720,261,687,316,651,415,653,423,672,413,690,311,691,287,715,287,740,247,743,227,732",
        name: "Коліно 45°"
    },
    {
        id: 19,
        coords: "7,697,7,721,86,724,132,724,198,746,217,765,242,762,276,756,281,743,218,742,157,702,112,695",
        name: "Хомут стінний"
    },
    {
        id: 20,
        coords: "338,753,373,750,409,697,432,677,512,677,518,697,514,711,449,709,422,707,391,771,399,800,401,807,395,824,378,835,347,839,329,804",
        name: "Трійник 45°"
    },
    {
        id: 21,
        coords: "377,839,384,850,422,819,426,753,495,756,534,756,545,726,512,720,440,720,418,724,399,763,400,784,403,792,399,823",
        name: "Хомут обжимний"
    },
    {
        id: 22,
        coords: "19,727,18,758,98,758,134,762,176,774,222,792,225,802,229,813,233,824,274,823,279,793,277,763,230,765,226,771,140,734,103,727",
        name: "Трійник 87°"
    },
    {
        id: 23,
        coords: "14,765,14,795,96,798,138,799,155,811,169,822,204,815,212,799,203,784,164,773,97,762",
        name: "Коліно 90°"
    },
    {
        id: 24,
        coords: "27,804,31,843,93,849,136,847,178,859,210,853,206,826,197,818,158,823",
        name: "Перехід"
    },
    {
        id: 25,
        coords: "235,844,232,877,232,891,282,890,302,872,348,872,380,871,371,842,297,844",
        name: "Ревізія"
    },
    {
        id: 26,
        coords: "386,852,421,822,451,783,454,762,541,762,545,796,492,800,458,797,446,828,438,870,404,874",
        name: "Коліно 45°"
    },
    {
        id: 27,
        coords: "464,813,545,806,542,835,489,843,471,848,458,871,439,874,443,841",
        name: "Стакан"
    },
    {
        id: 28,
        coords: "306,889,280,921,292,933,338,931,367,953,382,965,454,962,541,964,547,913,479,915,401,911,343,881",
        name: "Підставка під ревізію підлогова вивід вбік"
    },
    {
        id: 29,
        coords: "54,965,57,1000,114,1010,202,998,246,963,283,938,281,923,227,917,188,925,186,947,114,961",
        name: "Кронштейн"
    },
    {
        id: 30,
        coords: "14,876,11,922,54,928,127,923,176,922,205,914,219,911,269,918,288,904,290,890,225,893",
        name: "Підставка під ревізію настінна вивід вниз"
    }
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
    const user = useSelector((state) => state.user.user);

    const dispatch = useDispatch();

    const [areaName, setAreaName] = useState("");
    const [chimneyD, setChimneyD] = useState("");
    const [foundProducts, setFoundProducts] = useState([]);

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

    const handlePolygonClick = (areaId, name) => {
        setAreaName(name);
        setSelectedArea(areaId);
    };

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

    useEffect(() => {
        if (!searchQuery.trim()) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);



    const scaleCoords = (coords) => {
        if (!size.width || !size.height) return coords;
        const scaleX = size.width / ORIGINAL_WIDTH;
        const scaleY = size.height / ORIGINAL_HEIGHT;

        return coords
            .split(",")
            .map((c, i) => (i % 2 === 0 ? c * scaleX : c * scaleY))
            .join(",");
    };

    const smartSearch = async (queryString) => {
        try{
            const res = await axios.get(`${backUrl}/products/search-constructor`, {
                params: {
                    searchQuery: queryString
                }
            });
            return res.data;
        }
        catch(error) {
            console.log(error);
            return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!areaName) return;
            let queryString = '';

            if (areaName === 'Кронштейн' || !chimneyD) queryString = `${areaName}`;
            else queryString = `${chimneyD} ${areaName}`;

            const products = await smartSearch(queryString);

            console.log('found products:', products);

            if (products && products.length > 0) {
                const sortedProducts = [...products].sort((a, b) => {
                    const catA = a.category?.name;
                    const catB = b.category?.name;

                    if (!catA && catB) return 1;

                    if (catA && !catB) return -1;

                    if (!catA && !catB) return 0;

                    return catA.localeCompare(catB);
                });
                setFoundProducts(sortedProducts);
            } else {
                setFoundProducts([]);
            }
        };

        fetchData();

    }, [selectedArea])


    const handleChangeDiameter = (diameter) => {
        setChimneyD('Ф' + diameter);
    };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ marginBottom: 16, textAlign: 'center' }}>
                Це конструктор двостінного димоходу. Наведіть курсор на елемент, натисніть — і з'явиться вікно з інформацією про деталь. Ви можете додати обрану деталь до кошика.
            </h2>
            <div className="properties">
                <label htmlFor="diameter" className="input-label">
                    Діаметр
                </label>
                <div className="input-wrapper">
                    <input
                        id="diameter"
                        type="number"
                        min="80"
                        max="900"
                        step="10"
                        placeholder="0"
                        className="styled-input"
                        onChange={(e) => handleChangeDiameter(e.target.value)}
                    />
                    <span className="input-suffix">мм</span>
                </div>
            </div>
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
                                onClick={() => handlePolygonClick(area.id, area.name)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </svg>
                )}
            </div>
                {selectedArea && (
                    <ModalWrapper onClose={() => setSelectedArea(null)}>
                        {(foundProducts && foundProducts.length > 0) ?
                            (
                                <>
                                    <h2>{chimneyD.length > 1 ? chimneyD : ''} {areaName}</h2>
                                    <ConstructorList products={foundProducts}/>
                                </>)
                            :
                            (
                                <h2>На жаль, не було знайдено необхідних товарів</h2>
                            )
                        }
                    </ModalWrapper>
                )}
        </div>
    );
}
