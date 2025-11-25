"use client";

import { useEffect } from "react";
import { refreshToken } from "../refreshToken";

export default function TokenRefresher() {
    useEffect(() => {
        refreshToken();
        const interval = setInterval(refreshToken, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return null;
}
