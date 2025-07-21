import HeaderTop from "../components/HeaderTop/HeaderTop";
import HeaderMain from "@/components/HeaderMain/HeaderMain";
import Footer from "@/components/Footer/Footer";
import "../styles/globals.css";
import ClientProvider from "@/app/ClientProvider";
import {ToastContainer} from "react-toastify";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// @ts-ignore
export default function RootLayout({children}) {
    return (
        <html lang="uk">
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"/>
        </head>
            <body style={styles.body}>
            <ClientProvider>
                <HeaderTop/>
                <HeaderMain/>
                {children}
                <Footer/>
                <ToastContainer />
            </ClientProvider>
            </body>
        </html>
    );
}

const styles = {
    html: {
        fontFamily: "Inter",
    },
    body: {
        height: "100%",
        margin: "0",
        padding: "0",
        backgroundColor: "#FFF7F0",
    },
    contentWrapper: {
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 15px",
        boxSizing: "border-box" as "border-box",
    }
}
