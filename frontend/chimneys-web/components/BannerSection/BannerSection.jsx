'use client';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { backUrl } from '../../config/config';

import 'swiper/css';
import 'swiper/css/navigation';
import './BannerSection.css';

export default function BannerSection() {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch(`${backUrl}/banner/banners`);
                const data = await res.json();
                setBanners(data);
            } catch (error) {
                console.error('Помилка при завантаженні банерів', error);
            }
        };
        fetchBanners();
    }, []);

    return (
        <div className="banner-slider-container">
            <Swiper
                navigation
                autoplay={{ delay: 5000 }}
                loop
                modules={[Autoplay, Navigation]}
                className="banner-swiper"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                        <div
                            className="banner-slide"
                            style={{ backgroundImage: `url(${banner.image})` }}
                            title={banner.alt}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
