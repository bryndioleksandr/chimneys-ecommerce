import BannerSection from "@/components/BannerSection/BannerSection";
import CategoriesGrid from "@/components/CategoriesGrid/CategoriesGrid";
import StoreDescription from "@/components/StoreDescription/StoreDescription";
import PopularSlider from "@/components/PopularProductsSlider/PopularProductsSlider";
import SaledProductsSlider from "@/components/SaledProductsSlider/SaledProductsSlider";

export default async function Home() {

    return (
        <div>
            <div className="contentWrapper" style={styles.contentWrapper}>
                <BannerSection/>
                <CategoriesGrid/>
                <PopularSlider />
                <SaledProductsSlider />
                <StoreDescription/>
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
        boxSizing: "border-box" as "border-box",
    }
}
