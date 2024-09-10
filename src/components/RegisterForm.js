import { useState } from "react"
import { registerUser } from "../services/authService"
import { useNavigate } from "react-router-dom";

export default function RegisterForm(){
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const data = await registerUser(login, password, navigate);
        console.log("login form response:");
        console.log(JSON.stringify(data));
    }
    return(
        
        <div>
            <h2>Registration form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>register:</label>
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