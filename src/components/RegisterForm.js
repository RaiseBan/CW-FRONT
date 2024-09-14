import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";

export default function RegisterForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Поле для повторного ввода пароля
    const [error, setError] = useState(null); // Ошибка, если пароли не совпадают
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const data = await registerUser(login, password, navigate);
        console.log("register form response:", JSON.stringify(data));
    };

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.title}>Registration form</h2>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Login:</label>
                    <input
                        type='text'
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password:</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Confirm Password:</label>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                {error && <p className={styles.errorText}>{error}</p>} {/* Ошибка, если пароли не совпадают */}

                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>Register</button>
                </div>
            </form>
        </div>
    );
}
