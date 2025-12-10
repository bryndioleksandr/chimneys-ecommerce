// export const backUrl = 'https://chimneys-ecommerce.onrender.com';
export const backUrl = 'http://localhost:5501';

export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

