import Header from "../components/Header";
//import "../styles/globals.css";

export const metadata = {
    title: "Магазин на Next.js + Node.js",
    description: "Інтернет-магазин",
};

// @ts-ignore
export default function RootLayout({ children }) {
    return (
        <html lang="uk">
        <body>
        <Header />
        {children}
        </body>
        </html>
    );
}
