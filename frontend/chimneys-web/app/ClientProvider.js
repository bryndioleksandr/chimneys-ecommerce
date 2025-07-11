'use client';

import {Provider} from "react-redux";
import store from "../redux/store";
import TokenRefresher from "@/utils/TokenRefresher";

export default function ClientProvider({children}) {
    return <Provider store={store}>
        <TokenRefresher />
        {children}
    </Provider>;
}
