import { backUrl } from '../config/config';

export const registerUser = async (userData) => {
    const response = await fetch(`${backUrl}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Помилка реєстрації");
    }

    return data;
};
export const loginUser = async (email, password) => {
    const response = await fetch(`${backUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Щось пішло не так");
    }

    return data;
};

export const logoutUser = async () => {
    return fetch(`${backUrl}/user/logout`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            localStorage.clear();
        })
        .catch(err => console.error(err));
}
export const resendCode = async (email) => {
    const response = await fetch(`${backUrl}/user/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Щось пішло не так");
    }

    return data;
}
