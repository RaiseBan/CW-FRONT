import { useState } from "react"
import { loginUser } from "../services/authService"
import { useNavigate } from "react-router-dom";

export default function LoginForm(){
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const data = await loginUser(login, password, navigate);
        console.log("login form response:");
        console.log(JSON.stringify(data));
    }
    return(
        
        <div>
            <h2>Login form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>login:</label>
                    <input type='text' 
                    value={login} 
                    onChange={(e) => setLogin(e.target.value)}
                    required>
                    </input>
                </div>

                <div>
                    <label>password:</label>
                    <input type='text' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required>
                    </input>
                </div>
                <div>
                    <button type="submit">go!</button>
                </div>
            </form>
        </div>
    )
}