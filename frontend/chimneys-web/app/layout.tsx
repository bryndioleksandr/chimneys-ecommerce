import HeaderTop from "../components/HeaderTop/HeaderTop";
import HeaderMain from "@/components/HeaderMain/HeaderMain";
import BannerSection from "@/components/BannerSection/BannerSection";
import CategoriesGrid from "@/components/CategoriesGrid/CategoriesGrid";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";
import "../styles/globals.css";

export const metadata = {
    title: "Магазин на Next.js + Node.js",
    description: "Інтернет-магазин",
};

// @ts-ignore
export default function RootLayout({children}) {
    return (
        <html lang="uk">
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"/>
        </head>
        <body style={styles.body}>
        <HeaderTop/>
        <HeaderMain/>
        <div className="contentWrapper" style={styles.contentWrapper}>
            <BannerSection/>
            <CategoriesGrid/>
        </div>
        {children}
        <Footer/>
        </body>
        </html>
    );
}

const styles = {
    html: {
        fontFamily: "Inter",
    },
    body: {
        margin: "0",
        padding: "0",
        backgroundColor: "#f5f5f5",
},
    contentWrapper: {
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 15px",
        boxSizing: "border-box" as "border-box",
    }
}
