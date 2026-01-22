"use client";
import { useRouter, useSearchParams } from "next/navigation";
import "./Pagination.css";

const Pagination = ({ totalPages, currentPage }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const current = Number(currentPage) || 1;

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;

        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        router.push(`?${params.toString()}`);
    };

    const getPaginationItems = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;

        range.push(1);
        for (let i = current - delta; i <= current + delta; i++) {
            if (i < totalPages && i > 1) {
                range.push(i);
            }
        }
        range.push(totalPages);

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination-container">
            <button
                className="pagination-btn jump-btn"
                disabled={current === 1}
                onClick={() => handlePageChange(Math.max(1, current - 10))}
                title="Назад на 10 сторінок"
            >
                &laquo;
            </button>

            <button
                className="pagination-btn nav-btn"
                disabled={current === 1}
                onClick={() => handlePageChange(current - 1)}
                title="Попередня сторінка"
            >
                &#8249;
            </button>

            <div className="pagination-numbers">
                {getPaginationItems().map((item, index) => {
                    if (item === '...') {
                        return <span key={`dots-${index}`} className="pagination-dots">...</span>;
                    }
                    return (
                        <button
                            key={item}
                            className={`pagination-btn number-btn ${item === current ? "active" : ""}`}
                            onClick={() => handlePageChange(item)}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            <button
                className="pagination-btn nav-btn"
                disabled={current === totalPages}
                onClick={() => handlePageChange(current + 1)}
                title="Наступна сторінка"
            >
                &#8250;
            </button>

            <button
                className="pagination-btn jump-btn"
                disabled={current === totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, current + 10))}
                title="Вперед на 10 сторінок"
            >
                &raquo;
            </button>
        </div>
    );
};

export default Pagination;
