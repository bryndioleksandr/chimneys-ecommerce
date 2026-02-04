'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AdminGuard({ children }) {
    const router = useRouter();

    const { user, isLoading } = useSelector((state) => state.user);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        if (!user || user.role !== 'admin') {
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [user, isLoading, router]);

    if (isLoading || !isAuthorized) {
        return <div className="loading-screen">Перевірка прав доступу...</div>;
    }

    return <>{children}</>;
}
