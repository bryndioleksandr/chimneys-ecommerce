"use client"

import React from 'react';
import Link from "next/link";
import './Breadcrumbs.css';
import { usePathname } from "next/navigation";

const Breadcrumbs = ({ items }) => {

    const pathname = usePathname();

    console.log("Current path is: ", pathname);

    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="breadcrumb" className="breadcrumbs-nav">
            <ol className="breadcrumbs-list">
                <li className="breadcrumb-item">
                    <Link href="/">Головна</Link>
                    <span className="breadcrumb-separator">›</span>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                            {isLast ? (
                                <span className="current-page">{item.label}</span>
                            ) : (
                                <>
                                    <Link href={item.href || '#'}>
                                        {item.label}
                                    </Link>
                                    <span className="breadcrumb-separator">›</span>
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
