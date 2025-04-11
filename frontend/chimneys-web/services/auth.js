export const registerUser = async (userData) => {
    const response = await fetch("http://localhost:5501/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(userData),
    });
    return await response.json();
};

export const loginUser = async (email, password) => {
    const response = await fetch("http://localhost:5501/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ email, password }),
    });
    return await response.json();
};

export const logoutUser = async () => {
    return fetch(`http://localhost:5501/user/logout`, {
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
