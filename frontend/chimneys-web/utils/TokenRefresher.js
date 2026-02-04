"use client";

import { useEffect } from "react";
import { refreshToken } from "../refreshToken";
import { useSelector } from 'react-redux';

export default function TokenRefresher() {
    const user = useSelector((state) => state.user.user);
    useEffect(() => {
        if (!user) return;
        refreshToken();
        const interval = setInterval(refreshToken, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    return null;
}
