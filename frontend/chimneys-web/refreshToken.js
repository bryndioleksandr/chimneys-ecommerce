import { backUrl, getUser } from "./config/config";

export const refreshToken = async () => {
    return new Promise( (res, rej) => {
        fetch(`${backUrl}/user/refreshToken`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                const user = getUser();
                if (data.msg === 'Token updated successful') {
                    console.log(data);
                    res();
                }
                if (data.message === 'Invalid access token') {
                    if (user) {
                        localStorage.clear();
                        location.reload();
                    }
                }
                if (data.message === 'Authorization error') {
                    rej("Please, LogIN", data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                rej(error);
            });
    })
}

refreshToken();
setInterval(refreshToken, 3 * 60 * 1000);


