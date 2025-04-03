export const getUser = async () => {
    try {
        const response = await fetch("http://localhost:5501/auth/user", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            console.log("Не вдалося отримати користувача");
            throw new Error("Не вдалося отримати користувача");
        }

        return await response.json();
    } catch (error) {
        console.log("Помилка отримання користувача:", error);
        console.error("Помилка отримання користувача:", error);
        return null;
    }
};

