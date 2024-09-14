import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";

export default function LoginForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await loginUser(login, password, navigate);
        console.log("login form response:");
        console.log(JSON.stringify(data));
    };

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.title}>Login form</h2>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>login:</label>
                    <input
                        type='text'
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>password:</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>go!</button>
                </div>
            </form>
        </div>
    );
}
