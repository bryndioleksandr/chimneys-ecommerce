import Link from "next/link";
import BannerSection from "@/components/BannerSection/BannerSection";
import CategoriesGrid from "@/components/CategoriesGrid/CategoriesGrid";
import StoreDescription from "@/components/StoreDescription/StoreDescription";

export default async function Home() {

    return (
        <div>
            <div className="contentWrapper" style={styles.contentWrapper}>
                <BannerSection/>
                <CategoriesGrid/>
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
