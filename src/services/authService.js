const API_URL = 'http://localhost:8080/api/v1/auth'

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/authenticate`, {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();
    if (response.ok){
        return data;
    }else{
        throw new Error(data.message || 'Failed to authenticate')
    }
}



export const loginUser = async (email, password) => {
    try {
        const data = await login(email, password);
        
        // Сохраняем JWT токен в localStorage
        localStorage.setItem('token', data.token);
        
        console.log('Login successful!');
    } catch (error) {
        console.error('Error during login:', error.message);
    }
};


export const register = async (email, password) => {
    const response = await fetch(`${API_URL}/register`, {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    return response.json();
}

export const registerUser = async (email, password) => {
    try {
        const data = await register(email, password);
        
        // Сохраняем JWT токен в localStorage
        localStorage.setItem('token', data.token);
        
        console.log('Login successful!');
    } catch (error) {
        console.error('Error during register:', error.message);
    }
};
