import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { useState } from "react";

export default function AuthPage(){
    const [haveAccount, setHaveAccount] = useState(null)
    return(
        <>
        <p>Салам, у тебя есть аккаунт?</p>
        <button onClick={() => setHaveAccount(true)} >Да!</button>
        <button onClick={() => setHaveAccount(false)}>Нет</button>
        {haveAccount && <LoginForm/>}
        {!haveAccount && <RegisterForm/>}
        </>
    )
}