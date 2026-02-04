import { backUrl } from './config/config';
import {logout} from "@/redux/slices/user";
import store from "@/redux/store";

export const refreshToken = async () => {
    try {
        const response = await fetch(`${backUrl}/user/refreshToken`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const currentUser = store.getState().user.user;


            if (currentUser && response.status !== 401) {

                console.log("end the session");
                store.dispatch(logout());
                localStorage.removeItem("user");
            }
            return;
        }

        const data = await response.json();
        if (data.msg === 'Token updated successful') {
            console.log("token is updated");
        }
    } catch (err) {
        console.error("network error:", err);
    }
};
