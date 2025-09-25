import BannerSection from "@/components/BannerSection/BannerSection";
import CategoriesGrid from "@/components/CategoriesGrid/CategoriesGrid";
import StoreDescription from "@/components/StoreDescription/StoreDescription";
import PopularSlider from "@/components/PopularProductsSlider/PopularProductsSlider";
import SaledProductsSlider from "@/components/SaledProductsSlider/SaledProductsSlider";
import Link from "next/link";

export default async function Home() {
    return (
        <div>
            <div className="contentWrapper" style={styles.contentWrapper}>
                <BannerSection />
                <div style={styles.constructorWrapper}>
                    <Link href="/constructor-dym" style={styles.constructorBtn}>
                        🛠 Створи свій димохід
                    </Link>
                </div>
                <CategoriesGrid />
                <PopularSlider />
                <SaledProductsSlider />
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
