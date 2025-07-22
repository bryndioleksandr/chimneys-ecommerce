'use client';

import { useRef, useEffect, useState } from 'react';
import '../style.css';
import ModalWrapper from '@/components/ModalWrapper/ModalWrapper';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cart';

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
    const dispatch = useDispatch();

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

    const handleAddToCart = () => {
        if (selectedArea) {
            const info = AREA_INFO[selectedArea];
            dispatch(addItemToCart({
                _id: `one-${selectedArea}`,
                name: info.name,
                price: info.price,
                quantity: 1,
            }));
            setSelectedArea(null);
        }
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
                    <h3>{AREA_INFO[selectedArea]?.name || `Деталь ${selectedArea}`}</h3>
                    <p>Ціна: {AREA_INFO[selectedArea]?.price || 100} грн</p>
                    <button onClick={handleAddToCart} style={{ marginTop: 16 }}>
                        Додати до кошика
                    </button>
                </ModalWrapper>
            )}
        </div>
    );
}
