import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { useState } from "react";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
    const [haveAccount, setHaveAccount] = useState(true); // По умолчанию отображаем форму логина

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.title}>{haveAccount ? "Sign In" : "Register"}</h2>

            {haveAccount ? (
                <LoginForm />
            ) : (
                <RegisterForm />
            )}

            <p className={styles.switchText}>
                {haveAccount ? (
                    <span onClick={() => setHaveAccount(false)}>No account?</span>
                ) : (
                    <span onClick={() => setHaveAccount(true)}>Already have an account?</span>
                )}
            </p>
        </div>
    );
}
