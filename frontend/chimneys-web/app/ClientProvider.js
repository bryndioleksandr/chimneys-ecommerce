'use client';

import {Provider} from "react-redux";
import store from "../redux/store";
import TokenRefresher from "@/utils/TokenRefresher";
import { useDispatch } from "@/redux/store";
import {getUser} from "@/config/config";
import {dispUser} from "@/redux/slices/user";
import {useEffect} from "react";
import {loadCartFromStorage} from "@/redux/slices/cart";

const AuthInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            dispatch(loadCartFromStorage(parsedCart));
        }
        const user = getUser();
        if (user) {
            console.log("Відновлюємо юзера при рефреші:", user);
            dispatch(dispUser(user));
        }
    }, [dispatch]);

    return null;
};

export default function ClientProvider({children}) {
    return <Provider store={store}>
        <TokenRefresher />
        <AuthInitializer />
        {children}
    </Provider>;
}
