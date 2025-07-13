export const backUrl = "http://localhost:5501";

export const refreshToken = async () => {
    console.log("🔄 Refresh token started...");

    return new Promise((resolve, reject) => {
        fetch(`${backUrl}/user/refreshToken`, {
            method: 'POST',
            credentials: 'include',
        })
            .then(async response => {
                if (response.status === 401) {
                    console.log("ℹ️ No refresh token, probably not logged in.");
                    resolve();
                    return;
                }

                const data = await response.json();
                console.log("🔁 Refresh token response:", data);

                if (data.msg === 'Token updated successful') {
                    resolve();
                } else if (data.message === 'Invalid access token') {
                    localStorage.clear();
                    location.reload();
                } else if (data.message === 'Authorization error') {
                    reject("Authorization error");
                } else {
                    reject("Unknown refresh response");
                }
            })
            .catch(err => {
                console.error("⛔ Refresh token error:", err);
                reject(err);
            });
    });
};

