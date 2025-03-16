import Link from "next/link";
import BannerSection from "@/components/BannerSection/BannerSection";
import CategoriesGrid from "@/components/CategoriesGrid/CategoriesGrid";

async function getProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  return res.json();
}

export default async function Home() {
  const products: any[] = [];

  return (
      <div>
        <div className="contentWrapper" style={styles.contentWrapper}>
          <BannerSection/>
          <CategoriesGrid/>
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
