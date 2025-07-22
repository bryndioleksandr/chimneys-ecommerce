import Link from "next/link";

export default function Header() {
    return (
        <nav style={styles.nav}>
            <Link href="/" style={styles.link}>
                🏠 Головна
            </Link>
            <Link href="/admin" style={styles.link}>
                🔧 Адмінка
            </Link>
            <Link href="/about" style={styles.link}>
                ℹ️ Про магазин
            </Link>
        </nav>
    );
}

const styles = {
    nav: {
        backgroundColor: "var(--nav-bg)",
        padding: "10px",
        display: "flex",
        justifyContent: "space-around",
    },
    link: {
        color: "var(--highlight-color)",
        textDecoration: "none",
        fontSize: "18px",
    },
};
