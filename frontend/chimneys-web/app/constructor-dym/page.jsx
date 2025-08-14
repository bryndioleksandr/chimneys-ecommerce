import Link from "next/link";
import styles from "./Constructor.module.css";

export default function ConstructorPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Обери тип димоходу</h1>

            <div className={styles.cards}>
                <Link href="/constructor-dym/one" className={styles.card}>
                    <img
                        src="/one_sided.jpg"
                        alt="Одностінний димохід"
                        className={styles.image}
                    />
                    <h2 className={styles.cardTitle}>Одностінний димохід</h2>
                </Link>

                <Link href="/constructor-dym/two" className={styles.card}>
                    <img
                        src="/two_sided.jpg"
                        alt="Двостінний димохід"
                        className={styles.image}
                    />
                    <h2 className={styles.cardTitle}>Двостінний димохід</h2>
                </Link>
            </div>
        </div>
    );
}
