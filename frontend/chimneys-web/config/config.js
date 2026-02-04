// export const backUrl = 'https://chimneys-ecommerce.onrender.com';
export const backUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5501";

export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

