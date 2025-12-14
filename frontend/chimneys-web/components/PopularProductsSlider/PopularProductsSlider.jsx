"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../ProductCard/ProductCard";
import "./style.css";

const PopularSlider = ({ products = [] }) => {

    if (!products.length) return null;

    return (
        <div className="popular-slider-wrapper">
            <h2 className="popular-slider-title">⭐ Найпопулярніші товари</h2>
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
