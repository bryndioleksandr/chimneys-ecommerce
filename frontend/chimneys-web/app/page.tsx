import Link from 'next/link';
import BannerSection from '../components/BannerSection/BannerSection';
import CategoriesGrid from '../components/CategoriesGrid/CategoriesGrid';
import PopularSlider from '../components/PopularProductsSlider/PopularProductsSlider';
import SaledProductsSlider from '../components/SaledProductsSlider/SaledProductsSlider';
import StoreDescription from '../components/StoreDescription/StoreDescription';
import { getBanners, getCategories, getPopularProducts, getSaleProducts } from '@/services/homePageData';

export default async function Home() {
    const [banners, categories, popularProducts, saleProducts] = await Promise.all([
        getBanners(),
        getCategories(),
        getPopularProducts(),
        getSaleProducts()
    ]);

    return (
        <div>
            <div className="contentWrapper" style={styles.contentWrapper}>
                <BannerSection banners={banners} />

                <div style={styles.constructorWrapper}>
                    <Link href="/constructor-dym" style={styles.constructorBtn}>
                        🛠 Створи свій димохід
                    </Link>
                </div>

                <CategoriesGrid categories={categories} />
                <SaledProductsSlider products={saleProducts} />
                <PopularSlider products={popularProducts} />
                <StoreDescription />
            </div>
        </div>
    );
}

const styles = {
    contentWrapper: {
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 15px",
        boxSizing: "border-box" as const,
    },
    constructorWrapper: {
        display: "flex",
        justifyContent: "center",
        margin: "20px 0",
    },
    constructorBtn: {
        display: "inline-block",
        background: "linear-gradient(to bottom, var(--primary-color), var(--hover-navbtn-color))",
        color: "var(--card-bg)",
        padding: "14px 28px",
        fontSize: "18px",
        fontWeight: "600",
        borderRadius: "50px",
        textDecoration: "none",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
    },
} as const;
