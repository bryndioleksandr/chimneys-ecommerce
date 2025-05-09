"use client"

import "./HeaderTop.css";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function HeaderTop() {
    const router = useRouter();
    return (
        <div className="headerTop">
            <div className="headerLeft">
                <ul className="headerTopList">
                    <li onClick={() => router.push('/about')}>
                        Про нас
                    </li>
                    <li onClick={() => router.push('/pay-delivery')}>
                        Оплата і доставка
                    </li>
                    <li onClick={() => router.push('/exchange-return')}>
                        Обмін та повернення
                    </li>
                    <li onClick={() => router.push('/contacts')}>
                        Контактна інформація
                    </li>
                    <li>
                        Угода користувача
                    </li>
                    <li>
                        Сертифікати
                    </li>
                </ul>
            </div>
        </div>
    );
}
