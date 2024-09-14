import logo from "../../vite.svg"
import Button from "../Button/Button"
export default function Header(){
    function handleClick(message){
        alert(message)
    }
    return(
        <header>
            <img src={logo} alt="here is the logo"></img>
            <Button onClick={() => handleClick("go to registration/login")}>register/login</Button>
            {/* TODO: сделать так, чтобы тут было также имя 
            пользователя, когда он зашел в систему */}
        </header>
    )
}