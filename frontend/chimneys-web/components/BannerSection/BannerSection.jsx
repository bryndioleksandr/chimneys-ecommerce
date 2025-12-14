'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './BannerSection.css';

export default function BannerSection({ banners = [] }) {
    if (!banners.length) return null;

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
