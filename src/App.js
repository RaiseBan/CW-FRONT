import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Header from "./components/Header/Header";
import CalendarPage from "./components/Calendar/CalendarPage";
import FavoritesPage from "./components/Favorites/FavoritesPage";
import ShoppingListPage from "./components/ShoppingList/ShoppingListPage";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MealPage from "./components/MealPage/MealPage"; // Новый компонент для отображения блюда
import UserDish from "./components/UserDish/UserDish"; // Новый компонент для пользовательских блюд

const App = () => (
    <Router>
        <Header/>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/calendar" element={<CalendarPage/>}/>
            <Route path="/shopping-list" element={<ShoppingListPage/>}/>
            <Route path="/favorites" element={<FavoritesPage/>}/>

            {/* Открытые маршруты */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>

            {/* Маршрут для отображения блюда */}
            <Route path="/meal/:name" element={<MealPage/>}/>

            {/* Новый маршрут для отображения пользовательских блюд */}
            <Route path="/user-dish/:id" element={<UserDish/>}/>

            <Route path="*" element={<Navigate to="/calendar"/>}/>
        </Routes>
    </Router>
);

export default App;
