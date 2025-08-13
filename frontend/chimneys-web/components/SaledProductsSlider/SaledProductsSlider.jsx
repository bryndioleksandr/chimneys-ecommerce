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

const SaledSlider = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchSaled = async () => {
            try {
                const res = await axios.get(`${backUrl}/products/for-sale`);
                setProducts(res.data);
            } catch (err) {
                console.error("Помилка при отриманні знижкових товарів", err);
            }
        };

        fetchSaled();
    }, []);

    return (
        <div className="sales-slider-wrapper">
            <h2 className="sales-slider-title">🔥 Товари на знижках</h2>
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
                    <SwiperSlide key={product._id} className="sales-slider-item">
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SaledSlider;
