"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { backUrl } from '../../config/config';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../ProductCard/ProductCard";
import "./style.css";

const PopularSlider = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get(`${backUrl}/products/popular`);
                setProducts(res.data);
            } catch (err) {
                console.error("Помилка при отриманні популярних товарів", err);
            }
        };

        fetchPopular();
    }, []);

    return (
        <div className="popular-slider-wrapper">
            <h2 className="popular-slider-title">🔥 Найпопулярніші товари</h2>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {products.map(product => (
                    <SwiperSlide key={product._id} className="popular-slider-item">
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default PopularSlider;
