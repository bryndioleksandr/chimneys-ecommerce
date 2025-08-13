import { backUrl } from '../config/config';

export const registerUser = async (userData) => {
    const response = await fetch(`${backUrl}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(userData),
    });
    return await response.json();
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
            console.log(data);
            localStorage.clear();
        })
        .catch(err => console.error(err));
}
