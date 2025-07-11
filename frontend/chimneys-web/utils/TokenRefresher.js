"use client";

import { useEffect } from "react";
import { refreshToken } from "../refreshToken";

export default function TokenRefresher() {
    useEffect(() => {
        console.log("Token refresher started");
        refreshToken();
        const interval = setInterval(refreshToken, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return null;
}
