import HeaderTop from "../components/HeaderTop/HeaderTop";
import HeaderMain from "@/components/HeaderMain/HeaderMain";
import Footer from "@/components/Footer/Footer";
import "../styles/globals.css";
import ClientProvider from "@/app/ClientProvider";
import { ToastContainer } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Inter, Manrope } from 'next/font/google';

export const metadata = {
    title: "Інтернет-магазин ДимоHIT",
    description:
        "Продаж якісних димоходів у Тернополі. Великий вибір димохідних систем, встановлення, консультації. Доставка по Україні. Гарантія якості.",
    keywords: [
        "димоходи",
        "димоходи тернопіль",
        "встановлення димоходів",
        "димохідні системи",
        "продаж димоходів",
        "димоходи україна",
    ],
    openGraph: {
        type: "website",
        title: "Димоходи Тернопіль - Продаж та встановлення димоходів",
        description:
            "Продаж якісних димоходів у Тернополі. Великий вибір димохідних систем, встановлення, консультації. Доставка по Україні.",
        url: "https://chimneys-shop.com",
        siteName: "Chimneys Shop - Димоходи Тернопіль",
        locale: "uk_UA",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Димоходи Тернопіль - Продаж димохідних систем",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Димоходи Тернопіль - Продаж та встановлення димоходів",
        description:
            "Продаж якісних димоходів у Тернополі. Великий вибір димохідних систем, встановлення, консультації.",
        images: ["/twitter-image.jpg"],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-32x32.png",
        apple: "/apple-touch-icon.png",
    },
    alternates: {
        canonical: "https://chimneys-shop.com",
        languages: {
            uk: "https://chimneys-shop.com",
            ru: "https://chimneys-shop.com/ru",
            en: "https://chimneys-shop.com/en",
            "x-default": "https://chimneys-shop.com",
        },
    },
    other: {
        "geo.region": "UA-61",
        "geo.placename": "Тернопіль",
        "geo.position": "49.5535;25.5948",
        ICBM: "49.5535, 25.5948",
    },
};

const mainFont = Inter({
    subsets: ['cyrillic', 'latin'], // Обов'язково додай cyrillic для укр мови
    weight: ['400', '500', '600', '700'], // Ваги, які тобі треба
    variable: '--font-main', // Створюємо CSS змінну (зручно для Tailwind або CSS)
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uk" suppressHydrationWarning>
        <body className={mainFont.className} style={styles.body}>
        <ClientProvider>
            <HeaderTop />
            <HeaderMain />
            {children}
            <Footer />
            <ToastContainer />
        </ClientProvider>
        </body>
        </html>
    );
}

const styles = {
    body: {
        height: "100%",
        margin: "0",
        padding: "0",
        backgroundColor: "var(--background-color)",
    },
};
