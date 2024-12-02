export const register = async (data) => {
    const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: data.username, // Используем username вместо email
            password: data.password,
        }),
    });
    console.log(response)
    if (!response.ok) {
        throw new Error("Failed to register");
    }

    return await response.text();
};



export const login = async (data) => {
    const response = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: data.username,
            password: data.password,
        }),
    });

    if (!response.ok) {
        throw new Error("Invalid credentials");
    }

    const result = await response.json();
    localStorage.setItem("token", result.token); // Сохраняем токен
    localStorage.setItem("username", data.username); // Сохраняем имя пользователя
    return result;
};


